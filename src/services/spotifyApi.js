import axios from 'axios';
import { getValidAccessToken, refreshAccessToken } from './spotifyAuth';

const spotifyApi = axios.create({ baseURL: 'https://api.spotify.com/v1' });

// Attach a valid token, refreshing it first if it has expired
spotifyApi.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken();
  if (!token) throw new axios.Cancel('Not signed in to Spotify');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, refresh once and retry the original request
spotifyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      const token = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${token}`;
      return spotifyApi(original);
    }
    throw error;
  },
);

export const spotifyService = {
  getCurrentUser: () => spotifyApi.get('/me'),
  getUserPlaylists: (limit = 20) => spotifyApi.get('/me/playlists', { params: { limit } }),
  getPlaylist: (id) => spotifyApi.get(`/playlists/${id}`),
  search: (q, type = 'track,artist,album,playlist', limit = 20) =>
    spotifyApi.get('/search', { params: { q, type, limit } }),
  getSavedTracks: (limit = 50) => spotifyApi.get('/me/tracks', { params: { limit } }),
  getRecentlyPlayed: (limit = 20) => spotifyApi.get('/me/player/recently-played', { params: { limit } }),
  getTopTracks: (timeRange = 'medium_term', limit = 20) =>
    spotifyApi.get('/me/top/tracks', { params: { time_range: timeRange, limit } }),
  getTopArtists: (timeRange = 'medium_term', limit = 20) =>
    spotifyApi.get('/me/top/artists', { params: { time_range: timeRange, limit } }),
};

export default spotifyService;
