<script lang="ts" module>
    import Gh from "$lib/components/Gh.svelte";
    import Channel from "$lib/components/Channel.svelte";
    import type { Name, Repository } from "$types";
    import { setMediaSession } from "$lib/mediaSession";
</script>

<script lang="ts">
    let { name, repository }: { name: Name; repository: Repository } = $props();

    let channel = $state<ChannelType>();
    let audio = $state<HTMLAudioElement>();
    let played = $state("");
    let paused = $state(true);
    let loaded = $state(true);

    let interval = $state(0);
    let quality = $state("");

    async function getSoma() {
        const res = await fetch("https://somafm.com/channels.json");
        const { channels } = await res.json();
        console.log(channels);
        return await Promise.all(
            channels.map(async (c: ChannelType) => {
                const src = await getStream(c.playlists[0].url);
                return Object.assign(c, { src });
            }),
        );
    }

    async function getStream(url: string) {
        try {
            const res = await fetch(url);
            const txt = await res.text();
            const [stream] = txt.match(/http.+/) || [];
            return stream;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async function setStream(stream: ChannelType) {
        audio?.pause();
        if (played === stream.id) {
            console.log(audio);
            if (paused) {
                audio?.play();
            } else audio?.pause();
        } else {
            played = stream.id;
            await setChannel(stream);
            audio?.play();
        }
        console.log(stream);
        clearInterval(interval);
        if (!paused) {
            interval = setInterval(setChannel, 10000, stream);
        }
    }

    async function setChannel(stream: ChannelType) {
        const [curentSong] = await getSongs(stream.id);
        stream.meta = await setMeta(curentSong);
        setMediaSession(curentSong);
        channel = stream;
    }

    async function getSongs(streamID: string): Promise<Array<SongType>> {
        const res = await fetch(` https://somafm.com/songs/${streamID}.json`);
        const { songs } = await res.json();
        return songs;
    }

    async function setMeta(song: SongType) {
        const ituned = await fetch(URL(song.artist, song.title));
        const { results } = await ituned.json();
        if (results.length) {
            const [{ trackTimeMillis, trackViewUrl, artworkUrl100 }] = results;

            song.url = trackViewUrl;
            song.time = new Date(trackTimeMillis * 1000)
                .toISOString()
                .slice(11, -5);
            song.albumArt = artworkUrl100.replace(
                "100x100bb.jpg",
                "500x500bb.png",
            );
        }
        console.log(song);
        return song;

        function URL(artist: string, title: string) {
            const term = [artist, title].join(" - ");
            return `https://itunes.apple.com/search?term=${decodeURIComponent(term)}&entity=song`;
        }
    }

    async function setQuality(e: { currentTarget: { value: any } }) {
        const { value } = e.currentTarget;
        if (channel) {
            channel.src = await getStream(value);
        }
    }
</script>

<svelte:head>
    <title>{name} {channel?.id} {channel?.lastPlaying}</title>
    <link
        rel="icon"
        type="image/png"
        href={channel?.meta?.albumArt || channel?.xlimage}
    />
</svelte:head>

<header>
    <h1>
        <Gh {repository} />
        {channel?.id || name}
    </h1>
</header>

<main>
    {#await getSoma()}
        loading...
    {:then channels}
        {#each channels as channel (channel.id)}
            <Channel
                {channel}
                {played}
                {paused}
                {loaded}
                onclick={() => setStream(channel)}
            />
        {/each}
    {/await}
</main>

{#if channel}
    <footer>
        {#if channel}
            <audio
                autoplay
                bind:this={audio}
                bind:paused
                onloadstart={() => (loaded = true)}
                onloadeddata={() => (loaded = false)}
                src={channel.src}
            >
                <!-- <source src={channel.src} type="audio/mpeg" /> -->
            </audio>
            <button onclick={() => (paused ? audio?.play() : audio?.pause())}>
                {paused ? "Play" : "Pause"}
            </button>
            <select onchange={setQuality}>
                {#each channel.playlists as playlist}
                    <option value={playlist.url}>
                        {playlist.url.match(/\d+/) || 256} Kbps
                    </option>
                {/each}
            </select>
            <p>{channel?.lastPlaying || ""}</p>
        {/if}
    </footer>
{/if}

<style>
    @import "app.css";

    main {
        gap: 1em;
        margin: 1em;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(6em, 1fr));
    }

    footer {
        inset: 1em;
        top: auto;
        margin: 1em;
        position: sticky;

        audio {
            width: 100%;
        }
    }
</style>
