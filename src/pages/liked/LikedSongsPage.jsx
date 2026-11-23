import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPlay, FiHeart, FiClock } from 'react-icons/fi';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import useLibrary from '../../hooks/useLibrary';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import './LikedSongsPage.css';

const fmt = ms => {
  if (!ms) return '--:--';
  return `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;
};

export default function LikedSongsPage() {
  const { likedSongs: libLiked, loading: libLoading } = useLibrary();
  const dispatch = useDispatch();
  const tracks   = libLiked;

  const play = (track, idx) => {
    if (!track) return;
    dispatch(setCurrentTrack(track));
    dispatch(setQueue({ tracks, startIndex: idx }));
    toast.success(`Playing: ${track.name}`);
  };

  if (libLoading) return <LoadingSpinner />;

  return (
    <div className="ls-root">

      {/* Header */}
      <motion.div className="ls-header" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="ls-cover">
          <FiHeart size={44} />
        </div>
        <div className="ls-info">
          <span className="ls-type">Playlist</span>
          <h1 className="ls-title">Liked Songs</h1>
          <span className="ls-meta">{tracks.length} songs</span>
          <button
            className="btn btn-primary ls-play-all"
            onClick={() => tracks.length && play(tracks[0], 0)}
          >
            <FiPlay size={15} /> Play All
          </button>
        </div>
      </motion.div>

      {/* Track table */}
      <motion.div className="ls-tracks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>

        {/* Table header */}
        <div className="ls-tracks-header ls-track-grid">
          <span className="ls-th-num">#</span>
          <span className="ls-th-art" />
          <span className="ls-th-title">Title</span>
          <span className="ls-th-album">Album</span>
          <span className="ls-th-dur"><FiClock size={12} /></span>
        </div>

        {/* Rows */}
        {tracks.map((track, i) => (
          <motion.div
            key={track.id}
            className="ls-track-row ls-track-grid"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => play(track, i)}
          >
            <span className="ls-idx">{i + 1}</span>

            <div className="ls-track-art">
              <img src={track.album.images[0].url} alt={track.name} />
              <div className="ls-track-play"><FiPlay size={12} /></div>
            </div>

            <div className="ls-track-meta">
              <p className="ls-track-name">{track.name}</p>
              <p className="ls-track-artist">{track.artists.map(a => a.name).join(', ')}</p>
            </div>

            <span className="ls-track-album">{track.album.name}</span>
            <span className="ls-track-dur">{fmt(track.duration_ms)}</span>
          </motion.div>
        ))}

        {tracks.length === 0 && (
          <div className="ls-empty">
            <FiHeart size={48} />
            <h3>No liked songs yet</h3>
            <p>Songs you like will appear here</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
