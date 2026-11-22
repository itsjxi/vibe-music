import { createSlice } from '@reduxjs/toolkit';

// Simple demo auth — no external API required
const DEMO_USER = {
  id: 'demo-user',
  displayName: 'Aura Listener',
  email: 'listener@aura.fm',
  images: [],
};

const loadUser = () => {
  try {
    const stored = localStorage.getItem('aura_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const savedUser = loadUser();

const initialState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
  isInitialized: true,   // no async init needed
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginDemo: (state, action) => {
      const user = { ...DEMO_USER, ...(action.payload || {}) };
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('aura_user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('aura_user');
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('aura_user', JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginDemo, logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;

// Keep old thunk names as aliases so existing imports don't break
export const logoutUser = logout;
export const checkAuthStatus = () => () => {};   // no-op thunk
