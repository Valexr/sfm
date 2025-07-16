<script lang="ts" module>
    import { played, station } from "$lib/channels";
    import type { EventHandler } from "svelte/elements";
</script>

<script lang="ts">
    let {
        paused = $bindable(false),
        loaded = $bindable(false),
        quality = $bindable(0),
        onpause,
        onplay,
    }: {
        quality: number;
        paused: boolean;
        loaded: boolean;
        onpause: EventHandler<Event, HTMLAudioElement> | null | undefined;
        onplay: EventHandler<Event, HTMLAudioElement> | null | undefined;
    } = $props();

    let streamID = $state(1);

    const term = $derived(
        `${$played?.song?.artist || ""} / ${$played?.song?.title || ""}`,
    );

    const src = $derived(
        $station === "soma"
            ? `https://ice${streamID}.somafm.com/${$played.id}-${$played?.playlists[quality].title}`
            : $played?.playlists[quality].src,
    );

    // function onclick(e: { currentTarget: HTMLButtonElement }) {
    //     const id = Number(e.currentTarget.id);
    //     if (id) played.skip(id);
    //     else paused = !paused;
    // }

    function onloadstart() {
        loaded = false;
        // paused = true;
    }
    function onloadeddata() {
        loaded = true;
    }
    function oncanplay() {
        paused = false;
    }

    function onerror(e: Event) {
        if ($station === "soma") {
            const errorID = streamID;
            while (errorID === streamID) {
                console.error(e);
                streamID = Math.floor(Math.random() * 5) + 1;
            }
        }
    }
</script>

<audio
    hidden
    autoplay
    bind:paused
    preload="auto"
    {onloadstart}
    {onloadeddata}
    {oncanplay}
    {onerror}
    {onpause}
    {onplay}
    {src}
>
</audio>
<section>
    <p>{term}</p>
    <select bind:value={quality}>
        {#each $played.playlists as { title }, i}
            <option value={i}>{title}</option>
        {/each}
    </select>
    <!-- <button id="-1" {onclick}>←</button>
    <button id="0" {onclick}>{paused ? "Play" : "Pause"}</button>
    <button id="1" {onclick}>→</button> -->
</section>
