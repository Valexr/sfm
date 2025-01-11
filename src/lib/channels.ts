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
        }
    }
}

function createPlayed() {
    const { subscribe, set, update } = writable<ChannelType>()

    return {
        subscribe, set, update,
        async song(channel: ChannelType) {
            const song = await getSong(channel);
            update(played => Object.assign(played, { song }))
        },
    }

    async function getSong(channel: ChannelType) {
        const [curentSong] = await getSongs(channel.id);
        const song = await setMeta(curentSong);
        song.albumArt ??= channel.image;

        setMediaSession(song);

        return song;

        async function getSongs(channelID: string): Promise<Array<SongType>> {
            const res = await fetch(` https://somafm.com/songs/${channelID}.json`);
            const { songs } = await res.json();
            console.log("songs", songs);
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
                console.log("song", song);
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