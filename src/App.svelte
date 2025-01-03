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
        const res = await fetch(url);
        const txt = await res.text();
        const [stream] = txt.match(/http.+/);
        // console.log(stream)
        return stream;
    }

    function setStream(stream) {
        channel = stream;
    }
</script>

<svelte:head>
    <title>{name}</title>
</svelte:head>

<header>
    <button>Some</button>
    <h1>
        <Gh {repository} />
        {name}
    </h1>
    <p>{channel.lastPlaying}</p>
    <button>Else</button>
</header>

<main>
    {#await getSoma()}
        loading..
    {:then channels}
        {#each channels as channel}
            <button
                style="--img: url({channel.image})"
                onclick={() => setStream(channel)}
            >
                <!-- {title} -->
            </button>
        {/each}
    {/await}
</main>

<footer>
    <audio autoplay bind:this={audio} controls src={channel.src}></audio>
</footer>

<style>
    @import "app.css";

    main {
        gap: 1em;
        margin: 1em;
        display: flex;
        flex-flow: row wrap;

        button {
            background: var(--img) center;
            background-size: cover;
            height: 100px;
            aspect-ratio: 1/1;
            border: 0;
            cursor: pointer;
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
