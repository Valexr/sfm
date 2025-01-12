declare module '*.svg' {
    const content: any;
    export default content;
}

interface ChannelType {
    id: "7soul",
    title: "Seven Inch Soul",
    description: "Vintage soul tracks from the original 45 RPM vinyl.",
    dj: "Dion Watts Garcia",
    djmail: "dion@somafm.com",
    genre: "oldies",
    img: string,
    bg: string
    twitter: "",
    updated: "1396144686",
    playlists: Array<Playlist>,
    preroll: [],
    listeners: "60",
    lastPlaying: "Yvonne Fair And The James Brown Band - Tell Me Why",
    src: string,
    song: SongType,
}

interface Playlist {
    url: string,
    src: string
    format: "mp3" | "aac" | "aacp",
    quality: "highest" | "high" | "low",
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

