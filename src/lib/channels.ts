import { writable } from "svelte/store";
import { cacheable } from "./cacheable";


export const channels = createChannels();

function createChannels() {
    const { subscribe, set, update, get } = cacheable<ChannelType[]>('somafmChannels', []);

    async function load() {
        console.log('channels', get());
        if (!get().length) {
            const res = await fetch("https://somafm.com/channels.json");
            const { channels } = await res.json();
            const allChannels = await Promise.all(
                channels.map(async (c: ChannelType) => {
                    for await (const playlist of c.playlists) {
                        playlist.src = await getStream(playlist.url);
                        playlist.title = playlist.src.match(/-(\d.*)/)?.[1] || '256-mp3'
                    }
                    return c
                }),
            );
            set(allChannels)
            return allChannels
        }

        async function getStream(url: string) {
            const res = await fetch(url);
            const txt = await res.text();
            const [stream] = txt.match(/http.+/) || [];
            return stream || ''
        }
    }

    return {
        subscribe, set, update, get, load
    }
}

export const channel = createChannel();

function createChannel() {
    const { subscribe, set, update } = writable<ChannelType>();

    return {
        subscribe, set, update
    }
}