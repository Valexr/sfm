<script lang="ts" module>
    import Gh from "$lib/components/Gh.svelte";
    import Channel from "$lib/components/Channel.svelte";
    import { setMediaSession } from "$lib/mediaSession";
    import { channels } from "$lib/channels";

    import type { Name, Repository } from "$types";
    import type { MouseEventHandler } from "svelte/elements";
</script>

<script lang="ts">
    let { name, repository }: { name: Name; repository: Repository } = $props();

    let audio = $state<HTMLAudioElement>();
    let played = $state<ChannelType>();
    let paused = $state(true);
    let loaded = $state(false);
    let interval = $state(0);
    let quality = $state(3);

    const term = $derived(
        [played?.song.artist, played?.song.title].join(" / "),
    );
    const cover = $derived(played?.song?.albumArt || played?.xlimage);

    async function setStream(stream: ChannelType) {
        console.log("channel", stream);
        clearInterval(interval);
        if (played?.id === stream.id) {
            if (paused) {
                audio?.play();
                interval = setInterval(setPlayed, 1000, stream);
            } else {
                audio?.pause();
            }
        } else {
            await setPlayed(stream);
            interval = setInterval(setPlayed, 10000, stream);
        }
    }

    async function setPlayed(stream: ChannelType) {
        const [curentSong] = await getSongs(stream.id);
        stream.song = await setSong(curentSong);
        stream.song.albumArt ??= stream.xlimage;
        setMediaSession(stream.song);
        played = stream;
    }

    async function getSongs(streamID: string): Promise<Array<SongType>> {
        const res = await fetch(` https://somafm.com/songs/${streamID}.json`);
        const { songs } = await res.json();
        console.log("songs", songs);
        return songs;
    }

    async function setSong(song: SongType) {
        try {
            const ituned = await fetch(itunesURL(song.artist, song.title));
            const { results } = await ituned.json();
            if (results.length) {
                const [{ trackTimeMillis, trackViewUrl, artworkUrl100 }] =
                    results;

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
        } catch (e) {
            console.error(e);
            // throw e;
        }
        return song;

        function itunesURL(artist: string, title: string) {
            const term = [artist, title].join(" - ");
            return `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song`;
        }
    }

    function skipChannel(e: { currentTarget: { id: any } }) {
        const { id } = e.currentTarget;
        const playedINDEX = $channels.findIndex((c) => c.id === played?.id);
        const INDEX = playedINDEX + Number(id);
        const { length } = $channels;
        const channelINDEX = ((INDEX % length) + length) % length; // (i % n + n) % n - circular array index
        const channel = $channels[channelINDEX];

        setStream(channel);
    }
</script>

<svelte:head>
    <title>{name} / {played?.id} / {term}</title>
    <link rel="icon" type="image/png" href={cover} />
</svelte:head>

<header>
    <Gh {repository} />
    <h2>{played?.id || name}</h2>
    <p>{term}</p>
</header>

<main>
    {#await channels.load()}
        loading...
    {:then}
        {#each $channels as channel (channel.id)}
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
            onloadstart={() => (loaded = false)}
            onloadeddata={() => (loaded = true)}
            src={played.playlists[quality].src}
        >
        </audio>
        <select bind:value={quality}>
            {#each played.playlists as playlist, i}
                <option value={i}>{playlist.title}</option>
            {/each}
        </select>
        <button id="-1" onclick={skipChannel}>←</button>
        <button onclick={() => (paused ? audio?.play() : audio?.pause())}>
            {paused ? "Play" : "Pause"}
        </button>
        <button id="1" onclick={skipChannel}>→</button>
    </footer>
{/if}

<style>
    @import "app.css";

    header {
        position: sticky;
        z-index: 1;
        gap: 1rem;
        top: 0;
    }

    main {
        gap: 1rem;
        margin: 1rem;
        display: grid;
        grid-auto-flow: row dense;
        grid-template-columns: repeat(auto-fit, minmax(99px, 1fr));
    }

    footer {
        top: auto;
        inset: 1rem;
        margin: auto;
        position: sticky;

        audio {
            width: 100%;
        }
    }

    select {
        font-size: 1rem;
    }
</style>
