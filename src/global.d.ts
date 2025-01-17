declare module '*.svg' {
    const content: any;
    export default content;
}

interface ChannelType {
    id: "7soul",
    title: "Seven Inch Soul",
    description: "Vintage soul tracks from the original 45 RPM vinyl.",
    img: string,
    bg: string
    playlists: Array<Playlist>,
    song: SongType,
}

interface Playlist {
    url: string,
    src: string
    title: string
}

interface SongType {
    album: string;
    albumArt: string;
    artist: string;
    title: string;
    date: string
    url: string;
    time: string
}

