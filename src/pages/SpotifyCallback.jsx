import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  parseCodeFromUrl, exchangeCodeForToken, getSpotifyUserProfile, clearSpotifySession,
} from '../services/spotifyAuth';
import { mapUser } from '../services/spotifyMappers';
import { loginSpotify } from '../features/auth/authSlice';
import { fetchSpotifyLibrary } from '../features/library/librarySlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Handles the redirect back from Spotify: validates state, exchanges the code
// (PKCE verifier) for tokens, loads the profile and the user's library.
export default function SpotifyCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handled = useRef(false); // StrictMode runs effects twice; the code is single-use

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    (async () => {
      try {
        const code = parseCodeFromUrl();
        if (!code) throw new Error('No authorization code returned');
        const { access_token: token } = await exchangeCodeForToken(code);
        const profile = await getSpotifyUserProfile(token);
        dispatch(loginSpotify(mapUser(profile)));
        dispatch(fetchSpotifyLibrary());
        navigate('/home', { replace: true });
      } catch (err) {
        clearSpotifySession();
        toast.error(
          err.message === 'access_denied'
            ? 'Spotify sign-in was cancelled'
            : 'Could not sign in with Spotify. Try demo mode instead.',
        );
        navigate('/', { replace: true });
      }
    })();
  }, [dispatch, navigate]);

  return <LoadingSpinner />;
}
