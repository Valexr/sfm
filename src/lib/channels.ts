import { writable } from "svelte/store";
import { cacheable } from "./utils/cacheable";
import { setMediaSession } from "./mediaSession";
import { match } from "./utils";


export const channels = createChannels();
export const played = createPlayed()

function createChannels() {
    const { subscribe, set, update, get } = cacheable<ChannelType[]>('somafmChannels', [], true);

    return {
        subscribe, set, update, get,
        async load() {
            console.log('channels', get());

            if (!get().length) {
                const res = await fetch("assets/channels.json");
                const channels = await res.json();
                console.log(channels)
                set(channels)
            }
        },
        search(query: Record<keyof ChannelType, any>) {
            return get().filter((channel) => match(channel, query));
        },
        genres() {
            const genres = new Set();
            get().forEach((c) => genres.add(c.genre));
            return Array.from(genres);
        }
    }
}

function createPlayed() {
    const { subscribe, set, update } = writable<ChannelType>()

    return {
        subscribe, set: async (channel: ChannelType) => set(await getPlayed(channel)),
    }

    async function getPlayed(channel: ChannelType) {
        const [curentSong] = await getSongs(channel.id);
        channel.song = await setSong(curentSong);
        channel.song.albumArt ??= channel.image;
        setMediaSession(channel.song);

        return channel;

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
    }
}