<script lang="ts" module>
    import Equaliser from "$lib/components/Equaliser.svelte";
    import Loader from "$lib/components/Loader.svelte";
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
</script>

<button
    id={channel.id}
    class:played={played?.id === channel.id}
    style="--img: url({(played?.id === channel.id && played?.meta?.albumArt) ||
        channel?.xlimage})"
    {onclick}
>
    <!-- {channel.title} -->
    {#if played?.id === channel.id}
        {#if loaded}
            <Loader />
        {:else if !paused}
            <Equaliser />
        {/if}
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
