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

    // let streamID = $state(3);

    const term = $derived(
        `${$played?.song?.artist || ""} / ${$played?.song?.title || ""}`,
    );
    const stream = $derived($played?.playlists[quality].src);

    function onclick(e: { currentTarget: HTMLButtonElement }) {
        const id = Number(e.currentTarget.id);
        if (id) played.skip(id);
        else paused = !paused;
    }

    function onloadstart() {
        loaded = false;
        paused = true;
    }
    function onloadeddata() {
        loaded = true;
    }
    function oncanplay() {
        paused = !paused;
    }

    // function onerror(e: Event) {
    //     const [_, id] = stream.match(/ice(\d)/);
    //     const random = () => Math.floor(Math.random() * 5) + 1;

    //     streamID = random();
    //     // const i = +id + 1;
    //     // const indx = ((i % n) + n) % n;
    //     if (Number(id) === streamID) {
    //         streamID = random();
    //     }
    // }
</script>

<audio
    hidden
    controls
    bind:paused
    preload="auto"
    crossorigin="anonymous"
    src={stream}
    {onloadstart}
    {onloadeddata}
    {oncanplay}
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
