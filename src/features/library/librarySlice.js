import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import spotifyService from '../../services/spotifyApi';
import {
  mapArtist, mapPlaylist, mapTracks, unwrapTracks,
} from '../../services/spotifyMappers';

// Load everything the app shows in one go. Individual endpoints are allowed to fail
// (e.g. recently-played needs listening history), so one empty section doesn't break the app.
export const fetchSpotifyLibrary = createAsyncThunk('library/fetchSpotify', async () => {
  const [playlists, saved, recent, topTracks, topArtists] = await Promise.allSettled([
    spotifyService.getUserPlaylists(30),
    spotifyService.getSavedTracks(50),
    spotifyService.getRecentlyPlayed(20),
    spotifyService.getTopTracks('medium_term', 20),
    spotifyService.getTopArtists('medium_term', 12),
  ]);
  const items = (r) => (r.status === 'fulfilled' ? r.value.data.items ?? [] : []);

  const liked = unwrapTracks(items(saved)).map((t) => ({ ...t, liked: true }));
  const recentlyPlayed = unwrapTracks(items(recent));
  const top = mapTracks(items(topTracks));

  return {
    playlists: items(playlists).filter(Boolean).map((p) => mapPlaylist(p)),
    likedSongs: liked,
    recentlyPlayed,
    topTracks: top,
    artists: items(topArtists).map(mapArtist),
    // De-duplicated pool used for "all tracks" views and as the default play queue
    tracks: [...new Map([...top, ...recentlyPlayed, ...liked].map((t) => [t.id, t])).values()],
  };
});

const initialState = { status: 'idle', data: null, error: null };

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    resetLibrary: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpotifyLibrary.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchSpotifyLibrary.fulfilled, (state, { payload }) => { state.status = 'ready'; state.data = payload; })
      .addCase(fetchSpotifyLibrary.rejected, (state, { error }) => { state.status = 'error'; state.error = error.message; });
  },
});

export const { resetLibrary } = librarySlice.actions;
export default librarySlice.reducer;
