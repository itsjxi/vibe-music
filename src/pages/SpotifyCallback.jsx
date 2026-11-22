// Redirect fallback — no longer used for OAuth
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(s => s.auth);

  useEffect(() => {
    navigate(isAuthenticated ? '/home' : '/', { replace: true });
  }, [isAuthenticated, navigate]);

  return null;
}
