<script lang="ts" module>
    import equaliser from "$svg/equaliser.svg";
    import loader from "$svg/loader.svg";
</script>

<script lang="ts">
    let {
        channel,
        played,
        paused,
        loaded,
        onclick,
    }: {
        channel: ChannelType;
        played?: ChannelType;
        paused: boolean;
        loaded: boolean;
        onclick: () => void;
    } = $props();

    const cover = $derived(
        (played?.id === channel.id && played?.meta?.albumArt) ||
            channel?.xlimage,
    );
    const state = $derived((!loaded && loader) || (!paused && equaliser));
</script>

<button id={channel.id} class:played={played?.id === channel.id} {onclick}>
    {#if played?.id === channel.id}{@html state}{/if}
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

        &:hover {
            outline: 2px solid var(--hover);
            opacity: 1;
        }

        &.played {
            outline: 2px solid var(--dark);
            opacity: 1;
        }
    }
</style>
