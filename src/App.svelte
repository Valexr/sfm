<script lang="ts" module>
    import Gh from "$lib/components/Gh.svelte";
    import Channel from "$lib/components/Channel.svelte";
    import Player from "$lib/components/Player.svelte";

    import { channels, played } from "$lib/channels";

    import type { Name, Repository } from "$types";
</script>

<script lang="ts">
    let { name, repository }: { name: Name; repository: Repository } = $props();

    let audio = $state<HTMLAudioElement>();
    let paused = $state(false);
    let loaded = $state(false);
    let interval = $state(0);
    let quality = $state(0);
    let data = $state("soma");

    const term = $derived(
        `${$played?.song?.artist || ""} / ${$played?.song?.title || ""}`,
    );
    const cover = $derived($played?.song?.albumArt || $played?.image);

    async function play(channel: ChannelType, ms = 10000) {
        console.log("channel", channel);

        if (interval) clearInterval(interval);
        if ($played?.id !== channel.id) {
            played.set(channel);
            try {
                await played.song(channel);
                interval = setInterval(played.song, ms, channel);
            } catch (error) {
                console.error(error);
            }
        } else if (paused) {
            audio?.play();
            try {
                interval = setInterval(played.song, ms, channel);
            } catch (error) {
                console.error(error);
            }
        } else {
            audio?.pause();
        }
    }

    async function skipChannel(e: { currentTarget: { id: string } }) {
        const { id } = e.currentTarget;
        const playedINDEX = $channels.findIndex((c) => c.id === $played?.id);
        const INDEX = playedINDEX + Number(id);
        const { length } = $channels;
        const channelINDEX = ((INDEX % length) + length) % length; // (i % n + n) % n - circular array index
        const channel = $channels[channelINDEX];

        await play(channel);
    }
</script>

<svelte:head>
    <title>{name} / {$played?.id} / {term}</title>
    <link rel="icon" type="image/png" href={cover} />
</svelte:head>

<header>
    <Gh {repository} />
    <!-- <select bind:value={data}>
        {#each ["soma", "record"] as value, i}
            <option>{value}</option>
        {/each}
    </select> -->
    <h2>{$played?.id || name}</h2>
    <p>{$played?.song?.artist || ""}</p>
</header>

<main>
    {#await channels.load(data)}
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
            onclick={skipChannel}
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

        select {
            font-size: inherit;
        }
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
