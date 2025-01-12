<script lang="ts" module>
    import { played } from "$lib/channels";
    import equaliser from "$svg/equaliser.svg";
    import loader from "$svg/loader.svg";
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
        (selected && $played?.song?.albumArt) || channel?.image,
    );
    const stateICO = $derived((!loaded && loader) || (!paused && equaliser));
</script>

<button
    id={channel.id}
    class:selected
    title={channel.description}
    onclick={() => play(channel)}
    style="--bg: url({channel.bg})"
>
    <span>{channel.title}</span>
    {#if selected}{@html stateICO}{/if}
    <img loading="lazy" class="cover" src={cover} alt={channel.title} />
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
        background: var(--bg) center/cover no-repeat;

        &::before {
            inset: 0;
            content: attr(id);
            overflow: hidden;
            position: absolute;
            place-content: center;
            border-radius: inherit;
            background-color: var(--light);
            opacity: 0;
        }

        span {
            place-content: center;
            visibility: hidden;
            position: absolute;
            inset: 1rem;
            z-index: 1;
        }

        :global(svg) {
            position: relative;
            z-index: 1;
        }

        img {
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
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

            span {
                top: auto;
            }
        }
    }
</style>
