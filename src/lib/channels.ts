import { writable, derived } from "svelte/store";
import { cacheable } from "./utils/cacheable";
import { setMediaSession } from "./mediaSession";


export const channels = createChannels();

function createChannels() {
    const { subscribe, set, update, get } = cacheable<ChannelType[]>('somafmChannels', [], true);

    async function load() {
        console.log('channels', get());
        if (!get().length) {
            const res = await fetch("https://somafm.com/channels.json");
            const { channels } = await res.json();
            const allChannels = await Promise.all(
                channels.map(async (c: ChannelType) => {
                    for await (const playlist of c.playlists) {
                        playlist.src = await getStream(playlist.url);
                        playlist.title = playlist.src.match(/-(\d.*)/)?.[1] || ''
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

    function search(query: Record<keyof ChannelType, any>) {
        return get().filter((channel) => match(channel, query));

        function match(channel: Record<string, any>, query: Record<string, any>) {
            return Object.entries(query).every(([key, val]) => channel[key] === val)
        }
    }


    return {
        subscribe, set, update, get, load, search,
        genres: () => {
            const genres = new Set();
            get().forEach((c) => genres.add(c.genre));
            return Array.from(genres);
        }
    }
}


export const played = createPlayed()

function createPlayed() {
    const { subscribe, set, update } = writable<ChannelType>()
    return {
        subscribe, set: async (channel: ChannelType) => set(await getPlayed(channel)),
    }
}

async function getPlayed(channel: ChannelType) {
    const [curentSong] = await getSongs(channel.id);
    channel.song = await setSong(curentSong);
    channel.song.albumArt ??= channel.xlimage;
    setMediaSession(channel.song);
    return channel;
}

async function getSongs(channelID: string): Promise<Array<SongType>> {
    const res = await fetch(` https://somafm.com/songs/${channelID}.json`);
    const { songs } = await res.json();
    console.log("songs", songs);
    return songs;
}

async function setSong(song: SongType) {
    try {
        const ituned = await fetch(itunesURL(song.artist, song.title));
        const { results } = await ituned.json();
        if (results.length) {
            const [{ trackTimeMillis, trackViewUrl, artworkUrl100 }] =
                results;

            song.url = trackViewUrl;
            song.time = new Date(trackTimeMillis * 1000)
                .toISOString()
                .slice(11, -5);
            song.albumArt = artworkUrl100.replace(
                "100x100bb.jpg",
                "500x500bb.png",
            );
        }
        console.log("song", song);
    } catch (e) {
        console.error(e);
        // throw e;
    }
    return song;

    function itunesURL(artist: string, title: string) {
        const term = [artist, title].join(" - ");
        return `https://itunes.apple.com/search?term=${encodeURIComponent(term)}`;
    }
}