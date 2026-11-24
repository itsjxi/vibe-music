import { Suspense, lazy, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import KineticPlayer from './components/player/KineticPlayer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { fetchSpotifyLibrary } from './features/library/librarySlice';
import { logout } from './features/auth/authSlice';
import { getValidAccessToken } from './services/spotifyAuth';
import './styles/globals.css';
import './App.css';

// Lazy load pages
const Landing    = lazy(() => import('./pages/Landing'));
const SpotifyCallback = lazy(() => import('./pages/SpotifyCallback'));
const HomePage   = lazy(() => import('./pages/home/HomePage'));
const SearchPage = lazy(() => import('./pages/search/SearchPage'));
const PlaylistPage   = lazy(() => import('./pages/playlist/PlaylistPage'));
const LikedSongsPage = lazy(() => import('./pages/liked/LikedSongsPage'));
const LibraryPage    = lazy(() => import('./pages/library/LibraryPage'));
const ProfilePage    = lazy(() => import('./pages/profile/ProfilePage'));
const DiscoverPage   = lazy(() => import('./pages/discover/DiscoverPage'));

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, mode } = useSelector((state) => state.auth);
  const libraryStatus = useSelector((state) => state.library.status);

  // Returning Spotify user: make sure the session is still valid, then load their library
  useEffect(() => {
    if (mode !== 'spotify' || libraryStatus !== 'idle') return;
    getValidAccessToken().then((token) => {
      if (token) dispatch(fetchSpotifyLibrary());
      else dispatch(logout());
    });
  }, [mode, libraryStatus, dispatch]);

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Header />}

        <div className="app-layout">
          {isAuthenticated && <Sidebar />}

          <main className={`main-content ${isAuthenticated ? 'with-sidebar with-player' : ''}`}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/"         element={<Landing />} />
                <Route path="/callback" element={<SpotifyCallback />} />
                <Route path="/home"     element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/search"   element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                <Route path="/playlist/:id" element={<ProtectedRoute><PlaylistPage /></ProtectedRoute>} />
                <Route path="/liked"    element={<ProtectedRoute><LikedSongsPage /></ProtectedRoute>} />
                <Route path="/library"  element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
                <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </main>
        </div>

        {isAuthenticated && <KineticPlayer />}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(22, 22, 48, 0.95)',
              color: '#f0f0ff',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.2)',
              fontFamily: 'Space Grotesk, sans-serif',
            },
            success: { iconTheme: { primary: '#8b5cf6', secondary: '#fff' } },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
