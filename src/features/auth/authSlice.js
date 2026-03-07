import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SecureStorage from '../../utils/secureStorage';
import { 
  redirectToSpotifyAuth, 
  parseCodeFromUrl,
  exchangeCodeForToken,
  getSpotifyUserProfile,
  getValidAccessToken 
} from '../../services/spotifyAuth';

// Async thunks
export const loginWithSpotify = createAsyncThunk(
  'auth/loginWithSpotify',
  async (_, { rejectWithValue }) => {
    try {
      redirectToSpotifyAuth();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleSpotifyCallback = createAsyncThunk(
  'auth/handleSpotifyCallback',
  async (_, { rejectWithValue }) => {
    try {
      const code = parseCodeFromUrl();
      
      if (!code) {
        throw new Error('No authorization code found in callback');
      }
      
      const tokenData = await exchangeCodeForToken(code);
      const userProfile = await getSpotifyUserProfile(tokenData.access_token);
      
      const user = {
        id: userProfile.id,
        email: userProfile.email,
        displayName: userProfile.display_name,
        images: userProfile.images,
        country: userProfile.country,
        followers: userProfile.followers?.total || 0,
        product: userProfile.product,
        accessToken: tokenData.access_token,
      };
      
      SecureStorage.setItem('user_data', JSON.stringify(user), 24 * 60 * 60 * 1000); // 24 hours
      SecureStorage.setItem('access_token', tokenData.access_token, tokenData.expires_in * 1000);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = SecureStorage.getItem('user_data');
      if (!storedUser) return null;
      
      const token = getValidAccessToken();
      if (!token) {
        SecureStorage.removeItem('user_data');
        SecureStorage.removeItem('access_token');
        SecureStorage.removeItem('token_expires');
        return null;
      }
      
      return JSON.parse(storedUser);
    } catch (error) {
      SecureStorage.removeItem('user_data');
      SecureStorage.removeItem('access_token');
      SecureStorage.removeItem('token_expires');
      return null;
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    SecureStorage.removeItem('user_data');
    SecureStorage.removeItem('access_token');
    SecureStorage.removeItem('token_expires');
    SecureStorage.removeItem('auth_state');
    SecureStorage.removeItem('code_verifier');
  }
);

const getInitialUser = () => {
  try {
    const user = SecureStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  isLoading: false,
  error: null,
  isAuthenticated: !!getInitialUser(),
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithSpotify.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithSpotify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Spotify login failed';
      })
      .addCase(handleSpotifyCallback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleSpotifyCallback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(handleSpotifyCallback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Authentication failed';
        state.isAuthenticated = false;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.isInitialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;