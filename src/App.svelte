<script lang="ts" module>
    import Gh from "$lib/components/Gh.svelte";
    import Channel from "$lib/components/Channel.svelte";
    import Player from "$lib/components/Player.svelte";

    import { channels, played, hash } from "$lib/channels";

    import type { Name, Repository } from "$types";
</script>

<script lang="ts">
    let { name, repository }: { name: Name; repository: Repository } = $props();

    let audio = $state<HTMLAudioElement>({} as HTMLAudioElement);
    let paused = $state(false);
    let loaded = $state(false);
    let quality = $state(1);

    let interval = 0;

    const term = $derived(
        `${$played?.song?.artist || ""} / ${$played?.song?.title || ""}`,
    );
    const cover = $derived($played?.song?.albumArt || $played?.bg);

    function play(channel: ChannelType) {
        if (channel.id === $played?.id) {
            paused ? audio?.play() : audio?.pause();
        } else {
            played.set(channel);
            played.song();
        }

        console.log("played", $played);
    }

    function onclick(e: { currentTarget: { id: string } }) {
        const { id } = e.currentTarget;
        const playedINDEX = $channels.findIndex((c) => c.id === $played?.id);
        const INDEX = playedINDEX + Number(id);
        const { length } = $channels;
        const channelINDEX = ((INDEX % length) + length) % length; // (i % n + n) % n - circular array index
        const channel = $channels[channelINDEX];

        play(channel);
    }

    function onpause() {
        clearInterval(interval);
    }

    function onplay() {
        clearInterval(interval);
        interval = setInterval(played.song, 10000);
    }

    $effect(() => console.log($hash));
</script>

<svelte:head>
    <title>{name} / {$played?.id} / {term}</title>
    <link rel="icon" type="image/png" href={cover} />
</svelte:head>

<header>
    <Gh {repository} />
    <h2>{$played?.id || name}</h2>
    <p>{$played?.song?.artist || ""}</p>
</header>

<main>
    {#await channels.load($hash)}
        loading...
    {:then}
        {#each $channels as channel (channel.id)}
            <Channel {channel} {paused} {loaded} {play} />
        {/each}
    {/await}
</main>

<footer>
    {#if $played}
        <Player
            bind:audio
            bind:paused
            bind:loaded
            bind:quality
            {onclick}
            {onpause}
            {onplay}
        />
    {/if}
</footer>

<style>
    @import "app.css";

    header {
        position: sticky;
        z-index: 1;
        gap: 1rem;
        top: 0;
    }

    main {
        --cell-size: 100px;
        gap: 1rem;
        margin: 1rem;
        display: grid;
        grid-auto-flow: row dense;
        grid-template-columns: repeat(auto-fit, minmax(var(--cell-size), 1fr));

        @media (min-width: 600px) {
            --cell-size: 145px;
        }
    }

    footer {
        top: auto;
        inset: 1rem;
        margin: auto;
        position: sticky;
    }
</style>
