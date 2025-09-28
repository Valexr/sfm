import { played } from './channels';

const sizes = ['96x96', '128x128', '192x192', '256x256', '384x384', '512x512'];

export function setMediaSession(song: SongType) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: sizes.map((size) => ({
        src: song.albumArt?.replace('500x500bb', size + 'bb') || '',
        sizes: size,
        type: 'image/png'
      }))
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => played.skip(-1));
    navigator.mediaSession.setActionHandler('nexttrack', () => played.skip(1));
  }
}
