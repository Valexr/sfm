<script lang="ts" module>
    import { played } from "$lib/channels";
    import type { EventHandler, MouseEventHandler } from "svelte/elements";
</script>

<script lang="ts">
    let {
        audio = $bindable<HTMLAudioElement>(),
        paused = $bindable(false),
        loaded = $bindable(false),
        quality = $bindable(3),
        onclick,
        onpause,
        onplay,
    }: {
        audio: HTMLAudioElement;
        quality: number;
        paused: boolean;
        loaded: boolean;
        onclick: MouseEventHandler<HTMLButtonElement> | null | undefined;
        onpause: EventHandler<Event, HTMLAudioElement> | null | undefined;
        onplay: EventHandler<Event, HTMLAudioElement> | null | undefined;
    } = $props();

    const term = $derived(
        `${$played?.song?.artist || ""} / ${$played?.song?.title || ""}`,
    );
</script>

<audio
    hidden
    autoplay
    bind:paused
    bind:this={audio}
    preload="metadata"
    crossorigin="anonymous"
    src={$played.playlists[quality].src}
    onloadstart={() => (loaded = false)}
    onloadeddata={() => (loaded = true)}
    {onpause}
    {onplay}
>
</audio>
<p>{term}</p>
<select bind:value={quality}>
    {#each $played.playlists as { title }, i}
        <option value={i}>{title}</option>
    {/each}
</select>
<button id="-1" {onclick}>←</button>
<button onclick={() => (paused ? audio?.play() : audio?.pause())}>
    {paused ? "Play" : "Pause"}
</button>
<button id="1" {onclick}>→</button>

<style>
    audio {
        width: 100%;
    }
    select {
        font-size: inherit;
    }
</style>
