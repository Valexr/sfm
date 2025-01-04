import { writable } from "svelte/store";

export const channels = createChannels();

function createChannels() {
    const { subscribe, set, update } = writable<ChannelType[]>([]);

    async function load() {
        const res = await fetch("https://somafm.com/channels.json");
        const { channels } = await res.json();
        console.log(channels);
        const allChannels = await Promise.all(
            channels.map(async (c: ChannelType) => {
                // const streams = await Promise.all(c.playlists.map(async (p: any) => {
                //     await getStream(p)
                // }));
                // return Object.assign(c, { streams });
                for await (const playlist of c.playlists) {
                    playlist.src = await getStream(playlist.url);
                }
                return c
            }),
        );
        set(allChannels)
        return allChannels
    }

    return {
        subscribe, set, update,
        load
    }
}

async function getStream(url: string) {
    const res = await fetch(url);
    const txt = await res.text();
    const [stream] = txt.match(/http.+/) || [];
    return stream || ''
}

export const channel = createChannel();

function createChannel() {
    const { subscribe, set, update } = writable<ChannelType>();

    return {
        subscribe, set, update
    }
}