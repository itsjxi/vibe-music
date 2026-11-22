import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPlay, FiHeart, FiClock, FiArrowLeft } from 'react-icons/fi';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import { DEMO_PLAYLISTS } from '../../data/demoData';
import toast from 'react-hot-toast';
import './PlaylistPage.css';

const fmt = ms => {
  if (!ms) return '--:--';
  return `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;
};

export default function PlaylistPage() {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const playlist = DEMO_PLAYLISTS.find(p => p.id === id) || DEMO_PLAYLISTS[0];
  const tracks   = playlist.tracks.items.map(i => i.track).filter(Boolean);

  const play = (track, idx) => {
    dispatch(setCurrentTrack(track));
    dispatch(setQueue({ tracks, startIndex: idx }));
    toast.success(`Playing: ${track.name}`);
  };

  return (
    <div className="pp-root">

      {/* Back button */}
      <button className="btn btn-ghost pp-back" onClick={() => navigate(-1)}>
        <FiArrowLeft size={18} />
      </button>

      {/* Header */}
      <motion.div className="pp-header" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="pp-cover-wrap">
          <img src={playlist.images[0].url} alt={playlist.name} className="pp-cover" />
          <div className="pp-cover-glow"
            style={{ background: `radial-gradient(circle, ${playlist.color || '#7c3aed'}55 0%, transparent 70%)` }} />
        </div>

        <div className="pp-info">
          <span className="pp-type">Playlist</span>
          <h1 className="pp-title">{playlist.name}</h1>
          {playlist.description && <p className="pp-desc">{playlist.description}</p>}
          <span className="pp-meta">{tracks.length} songs</span>
          <div className="pp-actions">
            <button className="btn btn-primary pp-play-all" onClick={() => tracks.length && play(tracks[0], 0)}>
              <FiPlay size={15} /> Play All
            </button>
            <button className="btn btn-secondary" style={{ borderRadius: '50%', width: 42, height: 42, padding: 0 }}>
              <FiHeart size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Track table */}
      <motion.div className="pp-tracks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>

        {/* Table header */}
        <div className="pp-tracks-header pp-track-grid">
          <span className="pp-th-num">#</span>
          <span className="pp-th-art" />
          <span className="pp-th-title">Title</span>
          <span className="pp-th-album">Album</span>
          <span className="pp-th-dur"><FiClock size={12} /></span>
        </div>

        {/* Table rows */}
        {tracks.map((track, i) => (
          <motion.div
            key={track.id}
            className="pp-track-row pp-track-grid"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => play(track, i)}
          >
            <span className="pp-idx">{i + 1}</span>

            <div className="pp-track-art">
              <img src={track.album.images[0].url} alt={track.name} />
              <div className="pp-track-play"><FiPlay size={12} /></div>
            </div>

            <div className="pp-track-meta">
              <p className="pp-track-name">{track.name}</p>
              <p className="pp-track-artist">{track.artists.map(a => a.name).join(', ')}</p>
            </div>

            <span className="pp-track-album">{track.album.name}</span>
            <span className="pp-track-dur">{fmt(track.duration_ms)}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
