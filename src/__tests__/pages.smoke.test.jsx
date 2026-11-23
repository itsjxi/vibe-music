// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import playerReducer from '../features/player/playerSlice';
import uiReducer from '../features/ui/uiSlice';
import libraryReducer from '../features/library/librarySlice';
import HomePage from '../pages/home/HomePage';
import LibraryPage from '../pages/library/LibraryPage';
import LikedSongsPage from '../pages/liked/LikedSongsPage';
import DiscoverPage from '../pages/discover/DiscoverPage';
import ProfilePage from '../pages/profile/ProfilePage';
import PlaylistPage from '../pages/playlist/PlaylistPage';

vi.mock('../services/spotifyApi', () => ({
  default: { getPlaylist: () => new Promise(() => {}) }, // stay "loading"
}));

// framer-motion needs these in jsdom
window.matchMedia ??= () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
window.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} };

const spotifyLibrary = {
  status: 'ready',
  error: null,
  data: {
    tracks: [], playlists: [], artists: [], recentlyPlayed: [], topTracks: [], likedSongs: [],
  },
};

function renderAt(path, element, { mode }) {
  const store = configureStore({
    reducer: { auth: authReducer, player: playerReducer, ui: uiReducer, library: libraryReducer },
    preloadedState: {
      auth: { user: { id: 'u', displayName: 'Jugal' }, mode, isAuthenticated: true, isInitialized: true, isLoading: false, error: null },
      ...(mode === 'spotify' ? { library: spotifyLibrary } : {}),
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes><Route path="/playlist/:id" element={element} /><Route path="*" element={element} /></Routes>
      </MemoryRouter>
    </Provider>,
  );
}

afterEach(cleanup);

const pages = [
  ['home', '/home', <HomePage key="h" />],
  ['library', '/library', <LibraryPage key="l" />],
  ['liked', '/liked', <LikedSongsPage key="k" />],
  ['discover', '/discover', <DiscoverPage key="d" />],
  ['profile', '/profile', <ProfilePage key="p" />],
  ['playlist', '/playlist/p1', <PlaylistPage key="pl" />],
];

describe.each(['demo', 'spotify'])('%s mode', (mode) => {
  it.each(pages)('renders the %s page without crashing', (_name, path, element) => {
    const { container } = renderAt(path, element, { mode });
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

it('shows which data source is in use on the home page', () => {
  renderAt('/home', <HomePage />, { mode: 'spotify' });
  expect(screen.getByText('Your Spotify library')).toBeTruthy();
  expect(screen.getByText(/Welcome back, Jugal/)).toBeTruthy();
});
