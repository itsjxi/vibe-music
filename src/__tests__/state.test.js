// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../services/spotifyApi', () => {
  const ok = (items) => Promise.resolve({ data: { items } });
  const t = (id) => ({ id, name: id, artists: [{ name: 'A' }], album: { images: [] } });
  return {
    default: {
      getUserPlaylists: () => ok([{ id: 'p1', name: 'Mine', images: [], tracks: { total: 3 } }]),
      getSavedTracks: () => ok([{ track: t('liked') }]),
      getRecentlyPlayed: () => Promise.reject(new Error('no history')),
      getTopTracks: () => ok([t('top'), t('liked')]),
      getTopArtists: () => ok([{ id: 'ar', name: 'Artist' }]),
    },
  };
});

const { default: authReducer, loginDemo, loginSpotify, logout } = await import('../features/auth/authSlice');
const { default: libraryReducer, fetchSpotifyLibrary } = await import('../features/library/librarySlice');

const makeStore = () => configureStore({ reducer: { auth: authReducer, library: libraryReducer } });

beforeEach(() => localStorage.clear());

describe('auth slice', () => {
  it('remembers which mode the user signed in with', () => {
    const store = makeStore();
    store.dispatch(loginSpotify({ id: 'u1', displayName: 'Jugal' }));
    expect(store.getState().auth).toMatchObject({ mode: 'spotify', isAuthenticated: true });
    expect(JSON.parse(localStorage.getItem('aura_user')).mode).toBe('spotify');
  });

  it('clears the session and Spotify tokens on logout', () => {
    const store = makeStore();
    store.dispatch(loginDemo());
    localStorage.setItem('vibes_access_token', '{"value":"t"}');
    store.dispatch(logout());
    expect(store.getState().auth).toMatchObject({ mode: null, isAuthenticated: false });
    expect(localStorage.getItem('aura_user')).toBeNull();
    expect(localStorage.getItem('vibes_access_token')).toBeNull();
  });
});

describe('library slice', () => {
  it('loads the library even when one endpoint fails, and de-duplicates tracks', async () => {
    const store = makeStore();
    await store.dispatch(fetchSpotifyLibrary());
    const { status, data } = store.getState().library;
    expect(status).toBe('ready');
    expect(data.playlists[0]).toMatchObject({ id: 'p1', tracks: { total: 3 } });
    expect(data.recentlyPlayed).toEqual([]);
    expect(data.likedSongs[0]).toMatchObject({ id: 'liked', liked: true });
    expect(data.tracks.map((t) => t.id).sort()).toEqual(['liked', 'top']);
  });
});
