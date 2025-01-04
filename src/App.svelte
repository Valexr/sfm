<script lang="ts" module>
    import Gh from "$lib/components/Gh.svelte";
    import Channel from "$lib/components/Channel.svelte";
    import { setMediaSession } from "$lib/mediaSession";
    import { channels } from "$lib/channels";

    import type { Name, Repository } from "$types";
</script>

<script lang="ts">
    let { name, repository }: { name: Name; repository: Repository } = $props();

    let audio = $state<HTMLAudioElement>();
    let played = $state<ChannelType>();
    let paused = $state(true);
    let loaded = $state(true);

    let interval = $state(0);
    let quality = $state("");

    async function getSoma() {
        const res = await fetch("https://somafm.com/channels.json");
        const { channels } = await res.json();
        console.log("channels", channels);
        return channels;
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
        clearInterval(interval);
        if (played?.id === stream.id) {
            if (paused) {
                audio?.play();
                interval = setInterval(setChannel, 1000, stream);
            } else {
                audio?.pause();
            }
        } else {
            await setChannel(stream);
            audio?.play();
            interval = setInterval(setChannel, 10000, stream);
        }
        console.log("channel", stream);
    }

    async function setChannel(stream: ChannelType) {
        stream.src ??= (await getStream(stream.playlists[0].url)) || "";
        const [curentSong] = await getSongs(stream.id);
        stream.meta = await setMeta(curentSong);
        setMediaSession(curentSong);
        played = stream;
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
        console.log("song", song);
        return song;

        function URL(artist: string, title: string) {
            const term = [artist, title].join(" - ");
            return `https://itunes.apple.com/search?term=${decodeURIComponent(term)}&entity=song`;
        }
    }

    async function setQuality(e: { currentTarget: { value: any } }) {
        const { value } = e.currentTarget;
        if (played) {
            played.src = (await getStream(value)) || "";
        }
    }

    // channels.load().then(console.log);
</script>

<svelte:head>
    <title>{name} {played?.id} {played?.lastPlaying}</title>
    <link
        rel="icon"
        type="image/png"
        href={played?.meta?.albumArt || played?.xlimage}
    />
</svelte:head>

<header>
    <h1>
        <Gh {repository} />
        {played?.id || name}
    </h1>
    <p>{played?.lastPlaying || ""}</p>
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

{#if played}
    <footer>
        <audio
            autoplay
            bind:this={audio}
            bind:paused
            onloadstart={() => (loaded = true)}
            onloadeddata={() => (loaded = false)}
            src={played.src}
        >
            <!-- <source src={channel.src} type="audio/mpeg" /> -->
        </audio>
        <button onclick={() => (paused ? audio?.play() : audio?.pause())}>
            {paused ? "Play" : "Pause"}
        </button>
        <!-- <select onchange={setQuality}>
                {#each channel.playlists as playlist}
                    <option value={playlist.url}>
                        {playlist.url.match(/\d+/) || 256} Kbps
                    </option>
                {/each}
            </select> -->
        <!-- <p>{channel?.lastPlaying || ""}</p> -->
    </footer>
{/if}

<style>
    @import "app.css";

    header {
        position: sticky;
        z-index: 1;
        top: 0;
    }

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
