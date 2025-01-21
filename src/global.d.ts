declare module '*.svg' {
    const content: any;
    export default content;
}

type Name = string
type Repository = {
    type: string
    url: string
}

interface ChannelType {
    id: string,
    title: string,
    description: string,
    img: string,
    bg: string
    playlists: Array<PlaylistType>,
    song: SongType,
}

interface PlaylisType {
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

