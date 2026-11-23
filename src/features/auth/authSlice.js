import { createSlice } from '@reduxjs/toolkit';
import { clearSpotifySession } from '../../services/spotifyAuth';

// Two ways in: a real Spotify account (OAuth 2.0 PKCE) or a demo profile with bundled data.
const DEMO_USER = {
  id: 'demo-user',
  displayName: 'Demo Listener',
  email: 'demo@kinetic.music',
  images: [],
};

const STORAGE_KEY = 'aura_user';

const loadSession = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return null;
    // Older saved sessions only stored the user object
    return stored.user ? stored : { user: stored, mode: 'demo' };
  } catch {
    return null;
  }
};

const saveSession = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, mode: state.mode }));
  } catch { /* storage unavailable */ }
};

const session = loadSession();

const initialState = {
  user: session?.user ?? null,
  mode: session?.mode ?? null,          // 'demo' | 'spotify' | null
  isAuthenticated: Boolean(session?.user),
  isInitialized: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginDemo: (state, action) => {
      state.user = { ...DEMO_USER, ...(action.payload || {}) };
      state.mode = 'demo';
      state.isAuthenticated = true;
      state.error = null;
      saveSession(state);
    },
    loginSpotify: (state, action) => {
      state.user = action.payload;
      state.mode = 'spotify';
      state.isAuthenticated = true;
      state.error = null;
      saveSession(state);
    },
    logout: (state) => {
      state.user = null;
      state.mode = null;
      state.isAuthenticated = false;
      state.error = null;
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
      clearSpotifySession();
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveSession(state);
      }
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginDemo, loginSpotify, logout, updateUser, setAuthError, clearError,
} = authSlice.actions;
export default authSlice.reducer;
