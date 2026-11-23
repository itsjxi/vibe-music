import { useEffect, useState } from 'react';
import useLibrary from './useLibrary';
import spotifyService from '../services/spotifyApi';
import { mapPlaylist } from '../services/spotifyMappers';

/**
 * Returns a playlist with its tracks. Demo playlists already contain their tracks;
 * Spotify playlists are fetched on demand (list endpoints only return a track count).
 */
export function usePlaylist(id) {
  const { playlists, source } = useLibrary();
  const fromLibrary = playlists.find((p) => p.id === id);
  const [remote, setRemote] = useState({ id: null, playlist: null, error: null });

  useEffect(() => {
    if (source !== 'spotify' || !id) return undefined;
    let cancelled = false;
    spotifyService.getPlaylist(id)
      .then(({ data }) => {
        if (!cancelled) setRemote({ id, playlist: mapPlaylist(data, data.tracks?.items), error: null });
      })
      .catch((error) => { if (!cancelled) setRemote({ id, playlist: null, error }); });
    return () => { cancelled = true; };
  }, [id, source]);

  if (source !== 'spotify') {
    return { playlist: fromLibrary ?? playlists[0] ?? null, loading: false, error: null };
  }
  const loaded = remote.id === id;
  return {
    playlist: (loaded && remote.playlist) || fromLibrary || null,
    loading: !loaded,
    error: loaded ? remote.error : null,
  };
}

export default usePlaylist;
