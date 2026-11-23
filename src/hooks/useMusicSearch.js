import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { searchDemoData } from '../data/demoData';
import spotifyService from '../services/spotifyApi';
import { mapSearchResults } from '../services/spotifyMappers';

/** Searches demo data locally, or the Spotify catalogue when signed in with Spotify. */
export function useMusicSearch(query) {
  const mode = useSelector((s) => s.auth.mode);
  const [state, setState] = useState({ results: null, loading: false, error: null });

  useEffect(() => {
    const q = query.trim();
    if (!q) { setState({ results: null, loading: false, error: null }); return undefined; }
    if (mode !== 'spotify') { setState({ results: searchDemoData(q), loading: false, error: null }); return undefined; }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    spotifyService.search(q)
      .then(({ data }) => { if (!cancelled) setState({ results: mapSearchResults(data), loading: false, error: null }); })
      .catch((error) => { if (!cancelled) setState({ results: null, loading: false, error }); });
    return () => { cancelled = true; };
  }, [query, mode]);

  return state;
}

export default useMusicSearch;
