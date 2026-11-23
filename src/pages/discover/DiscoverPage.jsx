import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCompass, FiPlay, FiZap, FiTrendingUp } from 'react-icons/fi';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import useLibrary from '../../hooks/useLibrary';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './DiscoverPage.css';

export default function DiscoverPage() {
  const { tracks: libTracks, playlists: libPlaylists, artists: libArtists, loading: libLoading } = useLibrary();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const play = (track, queue) => {
    if (!track) return;
    dispatch(setCurrentTrack(track));
    dispatch(setQueue({ tracks: queue, startIndex: queue.findIndex(t => t.id === track.id) }));
    toast.success(`Playing: ${track.name}`);
  };

  const genres = ['Electronic', 'Ambient', 'Chillwave', 'Synthwave', 'Techno', 'Lo-Fi', 'Indie'];
  const genreColors = ['#7c3aed','#3b82f6','#06b6d4','#f59e0b','#ef4444','#10b981','#f43f5e'];

  if (libLoading) return <LoadingSpinner />;

  return (
    <div className="disc-root">
      {/* Hero */}
      <motion.div className="disc-hero glass-panel"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <div className="disc-hero-text">
          <div className="disc-hero-badge label-sm"><FiCompass size={12} /> Discover</div>
          <h1 className="disc-hero-title">Find Your Next<br /><span className="disc-accent">Favourite Track</span></h1>
          <p className="disc-hero-desc body-md">Explore genres, trending artists, and curated playlists.</p>
        </div>
        <div className="disc-hero-art">
          <div className="disc-hero-vinyl">
            {libTracks[0] && <img src={libTracks[0].album.images[0].url} alt="" />}
            <div className="disc-vinyl-hole" />
          </div>
        </div>
      </motion.div>

      {/* Genres */}
      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title title-md">Browse by Genre</h2>
        </div>
        <div className="disc-genres">
          {genres.map((g, i) => (
            <motion.div key={g} className="disc-genre-chip"
              style={{ background: genreColors[i] }}
              initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.04, y: -3 }}
              onClick={() => navigate(`/search?q=${encodeURIComponent(g)}`)}>
              <span>{g}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending tracks */}
      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title title-md"><FiTrendingUp size={16} /> Trending Now</h2>
          <button className="btn btn-ghost btn-sm disc-see-all" onClick={() => navigate('/search')}>See All</button>
        </div>
        <div className="disc-trending-grid">
          {libTracks.slice(0, 8).map((track, i) => (
            <motion.div key={track.id} className="disc-track-card glass-panel"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y:-4, boxShadow:'var(--shadow-md)' }}
              onClick={() => play(track, libTracks)}>
              <div className="disc-track-rank label-sm">{String(i+1).padStart(2,'0')}</div>
              <div className="disc-track-art">
                <img src={track.album.images[0].url} alt={track.name} />
                <div className="disc-track-play"><FiPlay size={14} /></div>
              </div>
              <div className="disc-track-meta">
                <p className="disc-track-name">{track.name}</p>
                <p className="disc-track-artist label-sm">{track.artists[0]?.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Artists */}
      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title title-md"><FiZap size={16} /> Featured Artists</h2>
        </div>
        <div className="disc-artists">
          {libArtists.map((a, i) => (
            <motion.div key={a.id} className="disc-artist-card glass-panel"
              initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}>
              <div className="disc-artist-img">
                <img src={a.images[0].url} alt={a.name} />
              </div>
              <p className="disc-artist-name">{a.name}</p>
              <p className="disc-artist-genre label-sm">{a.genres[0] ?? ""}</p>
              <p className="disc-artist-followers label-sm">{(a.followers.total/1000).toFixed(0)}K fans</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Playlists */}
      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title title-md">Curated Playlists</h2>
          <button className="btn btn-ghost btn-sm disc-see-all" onClick={() => navigate('/library')}>See All</button>
        </div>
        <div className="disc-playlists">
          {libPlaylists.map((pl, i) => (
            <motion.div key={pl.id} className="disc-pl-card glass-panel"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y:-4, boxShadow:'var(--shadow-md)' }}
              onClick={() => navigate(`/playlist/${pl.id}`)}>
              <div className="disc-pl-img-wrap">
                <img src={pl.images[0].url} alt={pl.name} />
                <div className="disc-pl-overlay"><FiPlay size={20} /></div>
              </div>
              <p className="disc-pl-name">{pl.name}</p>
              <p className="disc-pl-desc label-sm">{pl.description}</p>
              <p className="disc-pl-count label-sm">{pl.tracks.total} tracks</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
