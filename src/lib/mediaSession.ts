export function setMediaSession(song: SongType) {
    const sizes = [
        "96x96",
        "128x128",
        "192x192",
        "256x256",
        "384x384",
        "512x512",
    ];
    navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: sizes.map((size) => ({
            src: song.albumArt?.replace("500x500bb", size + "bb") || "",
            sizes: size,
            type: "image/png",
        })),
    });
    const mediaSessionActions = [
        "play",
        "pause",
        "stop",
        "previoustrack",
        "nexttrack",
        "seekbackward",
        "seekforward",
        "seekto",
        "skipad",
    ];
    // mediaSessionActions.forEach((action: MediaSessionAction) => {
    //     navigator.mediaSession.setActionHandler(action, () => {
    //         /* Code excerpted. */
    //     });
    // });
}