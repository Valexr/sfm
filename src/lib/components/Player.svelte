<script lang="ts" module>
    import { played } from "$lib/channels";
    import type { EventHandler } from "svelte/elements";
</script>

<script lang="ts">
    let {
        paused = $bindable(false),
        loaded = $bindable(false),
        quality = $bindable(3),
        onpause,
        onplay,
    }: {
        quality: number;
        paused: boolean;
        loaded: boolean;
        onpause: EventHandler<Event, HTMLAudioElement> | null | undefined;
        onplay: EventHandler<Event, HTMLAudioElement> | null | undefined;
    } = $props();

    const term = $derived(
        `${$played?.song?.artist || ""} / ${$played?.song?.title || ""}`,
    );

    function onclick(e: { currentTarget: HTMLButtonElement }) {
        const id = Number(e.currentTarget.id);
        if (id) played.skip(id);
        else paused = !paused;
    }

    function onloadstart() {
        loaded = false;
    }
    function onloadeddata() {
        loaded = true;
    }
</script>

<audio
    hidden
    autoplay
    bind:paused
    preload="metadata"
    crossorigin="anonymous"
    src={$played?.playlists[quality].src}
    {onloadstart}
    {onloadeddata}
    {onpause}
    {onplay}
>
</audio>
<section>
    <p>{term}</p>
    <select bind:value={quality}>
        {#each $played.playlists as { title }, i}
            <option value={i}>{title}</option>
        {/each}
    </select>
    <button id="-1" {onclick}>←</button>
    <button id="0" {onclick}>{paused ? "Play" : "Pause"}</button>
    <button id="1" {onclick}>→</button>
</section>
