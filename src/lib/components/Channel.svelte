<script lang="ts" module>
    import { played } from "$lib/channels";
    import equaliser from "$svg/equaliser.svg";
    import loader from "$svg/loader.svg";
    import type { MouseEventHandler } from "svelte/elements";
</script>

<script lang="ts">
    let {
        channel,
        paused,
        loaded,
        play,
    }: {
        channel: ChannelType;
        paused: boolean;
        loaded: boolean;
        play: (channel: ChannelType) => void;
    } = $props();

    const selected = $derived($played?.id === channel.id);

    const cover = $derived(
        (selected && $played?.song?.albumArt) || channel?.xlimage,
    );
    const stateICO = $derived((!loaded && loader) || (!paused && equaliser));
</script>

<button
    id={channel.id}
    class:selected
    title={channel.description}
    onclick={() => play(channel)}
>
    {#if selected}{@html stateICO}{/if}
    <img class="cover" src={cover} alt={channel.title} />
</button>

<style>
    button {
        aspect-ratio: 1/1;
        border: 0;
        cursor: pointer;
        opacity: 0.3;
        padding: 0;
        position: relative;
        transition: opacity 250ms ease;

        &::before {
            inset: 0;
            content: attr(id);
            overflow: hidden;
            position: absolute;
            place-content: center;
            border-radius: inherit;
            background-color: var(--light);
        }

        :global(svg) {
            position: relative;
            z-index: 1;
        }

        img {
            object-fit: cover;
            width: 100%;
            position: absolute;
            inset: 0;
            border-radius: inherit;

            &.cover {
                z-index: 0;
            }
        }

        &:hover,
        &.selected {
            outline-width: 2px;
            outline-style: solid;
            outline-color: var(--hover);
            opacity: 1;
        }

        &.selected {
            outline-color: var(--dark);
            grid-row: auto / span 2;
            grid-column: auto / span 2;
            position: sticky;
            bottom: 100px;
            z-index: 1;
            top: 70px;
        }
    }
</style>
