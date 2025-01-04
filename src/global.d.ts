declare module '*.svg' {
    const content: any;
    export default content;
}

interface ChannelType {
    id: "7soul",
    img: string,
    title: "Seven Inch Soul",
    description: "Vintage soul tracks from the original 45 RPM vinyl.",
    dj: "Dion Watts Garcia",
    djmail: "dion@somafm.com",
    genre: "oldies",
    image: "https://api.somafm.com/img/7soul120.png",
    largeimage: "https://api.somafm.com/logos/256/7soul256.png",
    xlimage: "https://api.somafm.com/logos/512/7soul512.png",
    twitter: "",
    updated: "1396144686",
    playlists: [
        {
            url: "https://api.somafm.com/7soul.pls",
            format: "mp3",
            quality: "highest"
        },
        {
            url: "https://api.somafm.com/7soul130.pls",
            format: "aac",
            quality: "highest"
        },
        {
            url: "https://api.somafm.com/7soul64.pls",
            format: "aacp",
            quality: "high"
        },
        {
            url: "https://api.somafm.com/7soul32.pls",
            format: "aacp",
            quality: "low"
        }
    ],
    preroll: [],
    listeners: "60",
    lastPlaying: "Yvonne Fair And The James Brown Band - Tell Me Why",
    src: "https://ice4.somafm.com/7soul-128-mp3",
    meta: {
        album: string,
        albumArt: string,
        artist: string,
        title: string,
        url: string
    }
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