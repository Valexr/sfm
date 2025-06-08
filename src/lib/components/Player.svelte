<script lang="ts" module>
    import { played } from "$lib/channels";
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
        `https://ice${streamID}.somafm.com/${$played.id}-${$played?.playlists[quality].title}`,
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
    // function oncanplay() {
    //     // paused = false;
    // }

    function onerror(e: Event) {
        console.error(src);
        const [_, id] = src.match(/ice(\d)/)!;
        const random = () => Math.floor(Math.random() * 5) + 1;
        streamID = random();
        while (Number(id) === streamID) {
            console.error(src);
            streamID = random();
        }
        console.log(src);
    }
</script>

<audio
    hidden
    autoplay
    bind:paused
    preload="auto"
    {onloadstart}
    {onloadeddata}
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
