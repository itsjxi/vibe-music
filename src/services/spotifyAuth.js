// Music App OAuth Configuration (Authorization Code Flow with PKCE)
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const getRedirectUri = () => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const prodUrl = import.meta.env.VITE_PROD_URL || 'https://vibesmusic.netlify.app';
  return isDevelopment 
    ? 'https://localhost:5173/callback'
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

// Generate random string for state parameter
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
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
  
  localStorage.setItem('auth_state', state);
  localStorage.setItem('code_verifier', codeVerifier);
  
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
  const codeVerifier = localStorage.getItem('code_verifier');
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
    throw new Error('Failed to exchange code for token');
  }
  
  const data = await response.json();
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('token_expires', Date.now() + (data.expires_in * 1000));
  localStorage.removeItem('auth_state');
  localStorage.removeItem('code_verifier');
  
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
  
  const storedState = localStorage.getItem('auth_state');
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

// Check if token is valid
export const isTokenValid = () => {
  const token = localStorage.getItem('access_token');
  const expires = localStorage.getItem('token_expires');
  
  if (!token || !expires) return false;
  
  return Date.now() < parseInt(expires);
};

// Get valid access token
export const getValidAccessToken = () => {
  if (isTokenValid()) {
    return localStorage.getItem('access_token');
  }
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_expires');
  return null;
};