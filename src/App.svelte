<script lang="ts" module>
    import Gh from "$lib/components/Gh.svelte";
    import type { Name, Repository } from "$types";
</script>

<script lang="ts">
    let { name, repository }: { name: Name; repository: Repository } = $props();

    let channel = $state("");
    let audio = $state();

    async function getSoma() {
        const res = await fetch("https://somafm.com/channels.json");
        const { channels } = await res.json();
        console.log(channels);
        return await Promise.all(
            channels.map(async (c) => {
                const src = await getStream(c.playlists[1].url);
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

    async function setStream(stream) {
        const [curentSong] = await getSongs(stream.id);
        stream.meta = await setMeta(curentSong);
        setMediaSession(curentSong);
        channel = stream;
    }

    async function getSongs(streamID: string) {
        const res = await fetch(` https://somafm.com/songs/${streamID}.json`);
        const { songs } = await res.json();
        return songs;
    }

    async function setMeta(song: {
        album: string;
        albumArt: string;
        artist: string;
        title: string;
    }) {
        const ituned = await fetch(URL(song.artist, song.title));
        const { results } = await ituned.json();
        if (results.length) {
            const [{ trackTimeMillis, trackViewUrl, artworkUrl100 }] = results;

            song.url = trackViewUrl;
            song.time = new Date(trackTimeMillis * 1000)
                .toISOString()
                .slice(11, -5);
            song.albumArt = artworkUrl100.replace("100x100bb", "500x500bb");
        }
        console.log(song);
        return song;

        function URL(artist: string, title: string) {
            const term = [artist, title].join(" - ");
            return `https://itunes.apple.com/search?term=${decodeURIComponent(term)}`;
        }
    }

    function setMediaSession(song) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: song.album,
            artwork: [
                {
                    src: song.albumArt.replace("500x500bb", "96x96bb"),
                    sizes: "96x96",
                    type: "image/png",
                },
                {
                    src: song.albumArt.replace("500x500bb", "128x128bb"),
                    sizes: "128x128",
                    type: "image/png",
                },
                {
                    src: song.albumArt.replace("500x500bb", "192x192bb"),
                    sizes: "192x192",
                    type: "image/png",
                },
                {
                    src: song.albumArt.replace("500x500bb", "256x256bb"),
                    sizes: "256x256",
                    type: "image/png",
                },
                {
                    src: song.albumArt.replace("500x500bb", "384x384bb"),
                    sizes: "384x384",
                    type: "image/png",
                },
                {
                    src: song.albumArt.replace("500x500bb", "512x512bb"),
                    sizes: "512x512",
                    type: "image/png",
                },
            ],
        });
    }
</script>

<svelte:head>
    <title>{name} {channel.id} {channel.lastPlaying}</title>
    <link
        rel="icon"
        type="image/png"
        href={channel?.meta?.albumArt || channel.xlimage}
    />
</svelte:head>

<header>
    <!-- <button>Some</button> -->
    <h1>
        <Gh {repository} />
        {channel.id || name}
    </h1>
    <p>{channel.lastPlaying || ""}</p>
    <!-- <button>Else</button> -->
</header>

<main>
    {#await getSoma()}
        loading...
    {:then channels}
        {#each channels as channel (channel.id)}
            <button
                id={channel.id}
                style="--img: url({channel?.meta?.albumArt || channel.xlimage})"
                onclick={() => setStream(channel)}
            >
                <!-- {title} -->
            </button>
        {/each}
    {/await}
</main>

{#if channel}
    <footer>
        <audio autoplay bind:this={audio} controls src={channel.src}></audio>
    </footer>
{/if}

<style>
    @import "app.css";

    main {
        gap: 1em;
        margin: 1em;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(5em, 1fr));

        button {
            background: var(--img) center;
            background-size: cover;
            aspect-ratio: 1/1;
            border: 0;
            cursor: pointer;

            &:hover {
                outline: 2px solid var(--hover);
                opacity: 0.8;
            }
        }
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
