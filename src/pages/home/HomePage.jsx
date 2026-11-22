import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiHeart, FiStar } from 'react-icons/fi';
import { setCurrentTrack, setQueue, togglePlay } from '../../features/player/playerSlice';
import {
  DEMO_TRACKS, DEMO_PLAYLISTS, DEMO_ARTISTS,
  DEMO_RECENTLY_PLAYED, DEMO_TOP_TRACKS,
} from '../../data/demoData';
import toast from 'react-hot-toast';
import './HomePage.css';

const fmt = (ms) => {
  if (!ms) return '--:--';
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2,'0')}`;
};

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { currentTrack, isPlaying } = useSelector((s) => s.player);
  const [likedTracks, setLikedTracks] = useState(new Set(DEMO_TRACKS.filter(t=>t.liked).map(t=>t.id)));

  const play = (track, queue = DEMO_TRACKS) => {
    dispatch(setCurrentTrack(track));
    dispatch(setQueue({ tracks: queue, startIndex: queue.findIndex(t => t.id === track.id) }));
    toast.success(`Playing: ${track.name}`);
  };

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedTracks(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const isCurrentlyPlaying = (track) => currentTrack?.id === track.id && isPlaying;

  return (
    <div className="hp-root">
      {/* ── Two-column layout ── */}
      <div className="hp-cols">

        {/* ══ LEFT COLUMN ══ */}
        <div className="hp-left">

          {/* Recommendations */}
          <section className="hp-section">
            <div className="hp-section-header">
              <h2 className="hp-section-title title-md">Recommendation for You</h2>
              <button className="btn btn-ghost btn-sm hp-see-all">See All</button>
            </div>

            <div className="hp-reco-scroll">
              {DEMO_TOP_TRACKS.slice(0, 6).map((track, i) => (
                <motion.div key={track.id} className="reco-card glass-panel"
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y:-4, boxShadow:'var(--shadow-lg)' }}
                  onClick={() => play(track, DEMO_TOP_TRACKS)}>
                  <div className="reco-art-wrap">
                    <img src={track.album.images[0].url} alt={track.name} className="reco-art" />
                    <div className="reco-play-ring">
                      {isCurrentlyPlaying(track)
                        ? <FiPause size={18} />
                        : <FiPlay  size={18} />}
                    </div>
                  </div>
                  <p className="reco-name">{track.name}</p>
                  <p className="reco-artist label-sm">{track.artists[0].name}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Top Artists */}
          <section className="hp-section">
            <div className="hp-section-header">
              <h2 className="hp-section-title title-md">Top Artist</h2>
              <button className="btn btn-ghost btn-sm hp-see-all" onClick={() => navigate('/search')}>See All</button>
            </div>
            <div className="hp-artist-row">
              {DEMO_ARTISTS.slice(0, 4).map((a, i) => (
                <motion.div key={a.id} className="artist-chip"
                  initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate('/search')}>
                  <div className="artist-avatar">
                    <img src={a.images[0].url} alt={a.name} />
                  </div>
                  <p className="artist-name label-sm">{a.name}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recent Playlist */}
          <section className="hp-section">
            <div className="hp-section-header">
              <h2 className="hp-section-title title-md">Recent Playlist</h2>
              <button className="btn btn-ghost btn-sm hp-see-all" onClick={() => navigate('/library')}>See All</button>
            </div>

            <div className="hp-playlist-list">
              {DEMO_RECENTLY_PLAYED.slice(0, 4).map((track, i) => {
                const active = isCurrentlyPlaying(track);
                return (
                  <motion.div key={track.id}
                    className={`pl-row ${active ? 'active' : ''}`}
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => play(track, DEMO_RECENTLY_PLAYED)}>
                    <div className="pl-row-art">
                      <img src={track.album.images[0].url} alt={track.name} />
                    </div>
                    <div className="pl-row-meta">
                      <p className="pl-row-name">{track.name}</p>
                      <p className="pl-row-artist label-sm">{track.artists[0].name}</p>
                    </div>
                    <button
                      className={`pl-row-play-btn ${active ? 'playing' : ''}`}
                      onClick={e => { e.stopPropagation(); active ? dispatch(togglePlay()) : play(track, DEMO_RECENTLY_PLAYED); }}>
                      {active ? <FiPause size={14} /> : <FiPlay size={14} />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className="hp-right">

          {/* Top Albums */}
          <section className="hp-section">
            <div className="hp-section-header">
              <h2 className="hp-section-title title-md">Top Album</h2>
              <button className="btn btn-ghost btn-sm hp-see-all" onClick={() => navigate('/library')}>See All</button>
            </div>

            <div className="hp-album-list">
              {DEMO_PLAYLISTS.slice(0, 3).map((pl, i) => (
                <motion.div key={pl.id} className="album-row glass-panel"
                  initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.09 }}
                  whileHover={{ scale:1.01, boxShadow:'var(--shadow-md)' }}
                  onClick={() => navigate(`/playlist/${pl.id}`)}>
                  <img src={pl.images[0].url} alt={pl.name} className="album-row-img" />
                  <div className="album-row-meta">
                    <p className="album-row-name">{pl.name}</p>
                    <p className="album-row-artist label-sm" style={{ color:'var(--outline)' }}>
                      {pl.tracks.items[0]?.track?.artists[0]?.name || 'Various Artists'}
                    </p>
                    <div className="album-row-actions">
                      <span className="album-rating label-sm">
                        <FiStar size={11} style={{ color:'#f59e0b', marginRight:3 }} />4.9
                      </span>
                      <button className="btn btn-secondary btn-xs album-play-btn"
                        onClick={e => { e.stopPropagation(); play(pl.tracks.items[0]?.track, pl.tracks.items.map(i=>i.track)); }}>
                        <FiPlay size={10} /> Play Album
                      </button>
                      <button
                        className={`btn btn-icon-sm album-like-btn ${likedTracks.has(pl.id) ? 'liked' : ''}`}
                        onClick={e => toggleLike(pl.id, e)}>
                        <FiHeart size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
