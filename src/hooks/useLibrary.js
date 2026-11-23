import { useSelector } from 'react-redux';
import {
  DEMO_TRACKS, DEMO_PLAYLISTS, DEMO_ARTISTS,
  DEMO_RECENTLY_PLAYED, DEMO_TOP_TRACKS, DEMO_LIKED_SONGS,
} from '../data/demoData';

const DEMO_LIBRARY = {
  tracks: DEMO_TRACKS,
  playlists: DEMO_PLAYLISTS,
  artists: DEMO_ARTISTS,
  recentlyPlayed: DEMO_RECENTLY_PLAYED,
  topTracks: DEMO_TOP_TRACKS,
  likedSongs: DEMO_LIKED_SONGS,
};

const EMPTY_LIBRARY = {
  tracks: [], playlists: [], artists: [], recentlyPlayed: [], topTracks: [], likedSongs: [],
};

/**
 * Single source of music data for every page.
 * Demo mode → bundled demo data. Spotify mode → the signed-in user's real library.
 */
export function useLibrary() {
  const mode = useSelector((s) => s.auth.mode);
  const { status, data, error } = useSelector((s) => s.library);

  if (mode !== 'spotify') {
    return { ...DEMO_LIBRARY, source: 'demo', loading: false, error: null };
  }
  return {
    ...EMPTY_LIBRARY,
    ...(data ?? {}),
    source: 'spotify',
    loading: status === 'idle' || status === 'loading',
    error,
  };
}

export default useLibrary;
