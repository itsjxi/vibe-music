import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiHeadphones, FiRadio, FiZap } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';
import { loginDemo } from '../features/auth/authSlice';
import { redirectToSpotifyAuth, isSpotifyConfigured } from '../services/spotifyAuth';
import { DEMO_TRACKS } from '../data/demoData';
import './Landing.css';

export default function Landing() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/home');
  }, [isAuthenticated, navigate]);

  const enter = () => dispatch(loginDemo());
  const connectSpotify = () => redirectToSpotifyAuth();
  const spotifyEnabled = isSpotifyConfigured();

  const features = [
    { icon: FiHeadphones, label: 'Spatial Audio',  desc: 'Immersive 360° soundscapes' },
    { icon: FiRadio,      label: 'Live Stations',   desc: 'Curated genre radio streams' },
    { icon: FiZap,        label: 'Smart Discovery', desc: 'AI-matched mood playlists'   },
  ];

  return (
    <div className="landing">
      {/* Nav */}
      <motion.nav className="landing-nav glass-panel"
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="landing-brand">
          <div className="landing-brand-dot" />
          <span className="landing-brand-name">Kinetic</span>
        </div>
        <button className="btn btn-primary" onClick={spotifyEnabled ? connectSpotify : enter}>
          {spotifyEnabled ? 'Log in' : 'Open App'}
        </button>
      </motion.nav>

      {/* Hero */}
      <motion.section className="landing-hero"
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>

        <div className="landing-hero-text">
          <p className="landing-overline label-sm">High-Fidelity Music Experience</p>
          <h1 className="landing-title">Feel Music<br /><span className="landing-accent">Differently</span></h1>
          <p className="landing-desc">
            Precision audio. Editorial curation. A player designed with the care of a fine instrument.
          </p>
          <div className="landing-actions">
            {spotifyEnabled && (
              <button className="btn btn-primary landing-cta" onClick={connectSpotify}>
                <FaSpotify size={18} /> Continue with Spotify
              </button>
            )}
            <button className={`btn ${spotifyEnabled ? 'btn-secondary' : 'btn-primary landing-cta'}`} onClick={enter}>
              <FiPlay size={18} /> Try the demo
            </button>
          </div>
        </div>

        {/* Album art collage */}
        <div className="landing-collage">
          {DEMO_TRACKS.slice(0, 4).map((t, i) => (
            <motion.div key={t.id} className={`collage-item ci-${i}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.55 }}>
              <img src={t.album.images[0].url} alt={t.name} />
            </motion.div>
          ))}
          {/* Vinyl decoration */}
          <div className="collage-vinyl">
            <div className="vinyl-outer" />
            <div className="vinyl-inner" />
            <div className="vinyl-label" />
          </div>
        </div>
      </motion.section>

      {/* Feature chips */}
      <motion.section className="landing-features"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
        {features.map((f, i) => (
          <motion.div key={f.label} className="feature-chip glass-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 + i * 0.09 }}
            whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(59,70,101,0.16)' }}>
            <div className="feature-chip-icon"><f.icon size={20} /></div>
            <div>
              <p className="feature-chip-label title-md">{f.label}</p>
              <p className="feature-chip-desc label-sm" style={{ color: 'var(--outline)' }}>{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
