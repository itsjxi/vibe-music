import SecureStorage from '../utils/secureStorage';

// Music App OAuth Configuration (Authorization Code Flow with PKCE)
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const getRedirectUri = () => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // Use the site's own origin so a renamed or preview deploy still gets a matching redirect URI.
  const prodUrl = import.meta.env.VITE_PROD_URL || window.location.origin;
  return isDevelopment 
    ? 'http://127.0.0.1:5173/callback'
    : `${prodUrl}/callback`;
};
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-top-read',
  'user-read-recently-played'
].join(' ');

// Cryptographically secure random string (used for the PKCE verifier and OAuth state)
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = window.crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => possible[v % possible.length]).join('');
};

// Generate code verifier for PKCE
const generateCodeVerifier = () => {
  return generateRandomString(128);
};

// Generate code challenge from verifier
const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Redirect to music service authorization (Authorization Code Flow with PKCE)
export const redirectToSpotifyAuth = async () => {
  const state = generateRandomString(16);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const redirectUri = getRedirectUri();
  
  SecureStorage.setItem('auth_state', state, 10 * 60 * 1000); // 10 min expiry
  SecureStorage.setItem('code_verifier', codeVerifier, 10 * 60 * 1000);
  
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: redirectUri,
    state: state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    show_dialog: 'true'
  };
  
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  window.location.href = `https://accounts.spotify.com/authorize?${queryString}`;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  const codeVerifier = SecureStorage.getItem('code_verifier');
  const redirectUri = getRedirectUri();
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Token exchange failed');
    throw new Error(errorData.error_description || 'Failed to exchange code for token');
  }
  
  const data = await response.json();
  
  const ONE_HOUR = 60 * 60 * 1000;
  SecureStorage.setItem('access_token', data.access_token, data.expires_in * 1000);
  SecureStorage.setItem('refresh_token', data.refresh_token, 60 * 24 * ONE_HOUR); // 60 days
  SecureStorage.setItem('token_expires', Date.now() + (data.expires_in * 1000));
  SecureStorage.removeItem('auth_state');
  SecureStorage.removeItem('code_verifier');
  
  return data;
};

// Parse authorization code from URL
export const parseCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');
  
  if (error) {
    throw new Error(error);
  }
  
  const storedState = SecureStorage.getItem('auth_state');
  if (state !== storedState) {
    throw new Error('State mismatch error');
  }
  
  return code;
};

// Get user profile from Spotify
export const getSpotifyUserProfile = async (accessToken) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }
  
  return response.json();
};

// Is a Spotify client ID configured for this build?
export const isSpotifyConfigured = () => Boolean(CLIENT_ID);

// Check if the access token is still valid
export const isTokenValid = () => {
  const token = SecureStorage.getItem('access_token');
  const expires = SecureStorage.getItem('token_expires');
  if (!token || !expires) return false;
  // Treat tokens expiring in the next 60s as expired so requests never race the expiry
  return Date.now() < parseInt(expires, 10) - 60_000;
};

// Refresh the access token with the stored refresh token (PKCE flow: no client secret).
// Concurrent callers share one in-flight request.
let refreshPromise = null;
export const refreshAccessToken = () => {
  if (refreshPromise) return refreshPromise;
  const refreshToken = SecureStorage.getItem('refresh_token');
  if (!refreshToken) return Promise.reject(new Error('No refresh token'));

  refreshPromise = fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error('Token refresh failed');
      const data = await response.json();
      SecureStorage.setItem('access_token', data.access_token, data.expires_in * 1000);
      SecureStorage.setItem('token_expires', Date.now() + data.expires_in * 1000);
      // Spotify may rotate the refresh token
      if (data.refresh_token) {
        SecureStorage.setItem('refresh_token', data.refresh_token, 60 * 24 * 60 * 60 * 1000);
      }
      return data.access_token;
    })
    .finally(() => { refreshPromise = null; });

  return refreshPromise;
};

// Return a valid access token, refreshing it if needed. Resolves to null when signed out.
export const getValidAccessToken = async () => {
  if (isTokenValid()) return SecureStorage.getItem('access_token');
  try {
    return await refreshAccessToken();
  } catch {
    clearSpotifySession();
    return null;
  }
};

export const clearSpotifySession = () => {
  ['access_token', 'refresh_token', 'token_expires', 'auth_state', 'code_verifier']
    .forEach((key) => SecureStorage.removeItem(key));
};

// Exported for tests
export const __test__ = { generateCodeChallenge, generateRandomString };
