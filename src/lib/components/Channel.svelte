<script lang="ts" module>
    import Equaliser from "$lib/components/Equaliser.svelte";
</script>

<script lang="ts">
    let {
        channel,
        played,
        paused,
        onclick,
    }: {
        channel: ChannelType;
        played: string;
        paused: boolean;
        onclick: () => void;
    } = $props();
</script>

<button
    id={channel.id}
    class:played={played === channel.id}
    style="--img: url({channel?.meta?.albumArt || channel?.xlimage})"
    {onclick}
>
    <!-- {channel.title} -->
    {#if played === channel.id && !paused}
        <Equaliser />
    {/if}
</button>

<style>
    button {
        background: var(--img) center;
        background-size: cover;
        aspect-ratio: 1/1;
        border: 0;
        cursor: pointer;
        opacity: 0.3;

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
