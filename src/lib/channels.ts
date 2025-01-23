import { get, writable, readable } from "svelte/store";
import { cacheable } from "./utils/cacheable";
import { setMediaSession } from "./mediaSession";
import { getJSON, imgColor, match } from "./utils";


export const channels = createChannels();
export const played = createPlayed()

export const station = readable('', (set) => {
    onhashchange = () => set(location.hash.slice(1))
    set(location.hash.slice(1))
})

function createChannels() {
    const { subscribe, set, update, get } = cacheable<ChannelType[]>('somafmChannels', [], true);

    return {
        subscribe, set, update, get,
        async load(hash = 'soma') {
            const URL = `assets/data/${hash || 'soma'}.json`
            const channels = await getJSON<ChannelType[]>(URL);
            set(channels)
        },
        search(query: Record<keyof ChannelType, any>) {
            return get().filter((channel) => match(channel, query));
        }
    }
}

function createPlayed() {
    const { subscribe, set, update } = writable<ChannelType>()

    return {
        subscribe, set, update,
        async song() {
            try {
                const song = await getSong(get(played));
                update(played => Object.assign(played, { song }))
            } catch (e) {
                console.error(e);
            }
        },
        skip(direction: number) {
            const playedINDEX = channels.get().findIndex((c) => c.id === get(played).id);
            const INDEX = playedINDEX + direction;
            const { length } = channels.get();
            const channelINDEX = ((INDEX % length) + length) % length; // (i % n + n) % n - circular array index
            const channel = channels.get()[channelINDEX];
            this.set(channel);
            this.song()
        },
    }

    async function getSong(channel: ChannelType) {
        const [curentSong] = await getSongs(channel.id);
        const song = await setMeta(curentSong);
        // imgColor(song.albumArt || channel.bg)
        setMediaSession(song);

        return song;

        async function getSongs(channelID: string): Promise<Array<SongType>> {
            const res = await fetch(` https://somafm.com/songs/${channelID}.json`);
            const { songs } = await res.json();
            return songs;
        }

        async function setMeta(song: SongType) {
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
            } catch (e) {
                console.error(e);
                // throw e;
            }
            return song;

            function itunesURL(artist: string, title: string) {
                const term = `${artist} - ${title}`;
                return `https://itunes.apple.com/search?term=${encodeURIComponent(term)}`;
            }
        }
    }
}