import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiShuffle, FiRepeat, FiVolume2, FiVolumeX,
  FiChevronDown, FiChevronUp, FiX,
} from 'react-icons/fi';
import {
  togglePlay, setPlaying, nextTrack, previousTrack,
  toggleShuffle, toggleRepeat, setVolume,
  setCurrentTime, setDuration,
} from '../../features/player/playerSlice';
import './KineticPlayer.css';

const fmt = s => {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export default function KineticPlayer() {
  const dispatch = useDispatch();
  const {
    currentTrack, isPlaying, volume, shuffle, repeat,
    currentTime, duration,
  } = useSelector(s => s.player);

  const audioRef  = useRef(null);
  const [mini,    setMini]    = useState(false);   // collapsed to mini bar
  const [closed,  setClosed]  = useState(false);   // fully dismissed

  const hasAudio = !!currentTrack?.preview_url;
  const progress = hasAudio && duration ? (currentTime / duration) * 100 : 0;

  // Re-open when a new track is selected
  useEffect(() => {
    if (currentTrack) setClosed(false);
  }, [currentTrack]);

  /* ── Audio lifecycle ── */
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !hasAudio) return;
    const onTime = () => dispatch(setCurrentTime(a.currentTime));
    const onMeta = () => { if (!isNaN(a.duration)) dispatch(setDuration(a.duration)); };
    const onCan  = () => { if (isPlaying) a.play().catch(() => dispatch(setPlaying(false))); };
    const onEnd  = () => dispatch(nextTrack());
    a.addEventListener('timeupdate',     onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('canplay',        onCan);
    a.addEventListener('ended',          onEnd);
    return () => {
      a.removeEventListener('timeupdate',     onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('canplay',        onCan);
      a.removeEventListener('ended',          onEnd);
    };
  }, [dispatch, isPlaying, currentTrack, hasAudio]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !hasAudio) return;
    a.load();
    dispatch(setCurrentTime(0));
    dispatch(setDuration(0));
  }, [currentTrack, hasAudio, dispatch]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !hasAudio) return;
    isPlaying
      ? a.play().catch(() => dispatch(setPlaying(false)))
      : a.pause();
  }, [isPlaying, currentTrack, hasAudio, dispatch]);

  useEffect(() => {
    const a = audioRef.current;
    if (a && hasAudio) a.volume = Math.max(0, Math.min(1, volume));
  }, [volume, hasAudio]);

  const seek = e => {
    const a = audioRef.current;
    if (!a || !a.duration || !hasAudio) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
    dispatch(setCurrentTime(a.currentTime));
  };

  // Nothing to show
  if (!currentTrack || closed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`kp-bar ${mini ? 'kp-mini' : 'kp-full'}`}
        key="player"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        {hasAudio && (
          <audio
            ref={audioRef}
            src={currentTrack.preview_url}
            preload="none"
            crossOrigin="anonymous"
          />
        )}

        {/* ── FULL PLAYER ── */}
        {!mini && (
          <>
            {/* Progress bar — sits at the very top edge */}
            <div className="kp-progress-track" onClick={seek}>
              <div
                className={`kp-progress-fill ${!hasAudio ? 'kp-no-audio' : ''}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="kp-inner">
              {/* Left — track info */}
              <div className="kp-track-info">
                <div className="kp-art-wrap">
                  <img
                    src={currentTrack.album?.images?.[1]?.url || currentTrack.album?.images?.[0]?.url || 'https://picsum.photos/seed/kp/56/56'}
                    alt={currentTrack.name}
                    className={`kp-art ${isPlaying && hasAudio ? 'kp-spinning' : ''}`}
                  />
                </div>
                <div className="kp-meta">
                  <p className="kp-name">{currentTrack.name}</p>
                  <p className="kp-artist">{currentTrack.artists?.map(a => a.name).join(', ')}</p>
                </div>
                {!hasAudio && <span className="kp-no-preview">No preview</span>}
              </div>

              {/* Centre — controls */}
              <div className="kp-controls">
                <button
                  className={`kp-ctrl-btn ${shuffle ? 'kp-active' : ''}`}
                  onClick={() => dispatch(toggleShuffle())}
                  title="Shuffle"
                >
                  <FiShuffle size={14} />
                </button>

                <button className="kp-ctrl-btn" onClick={() => dispatch(previousTrack())} title="Previous">
                  <FiSkipBack size={17} />
                </button>

                <button
                  className={`kp-play-btn ${!hasAudio ? 'kp-disabled' : ''}`}
                  onClick={() => hasAudio && dispatch(togglePlay())}
                  disabled={!hasAudio}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying && hasAudio ? <FiPause size={20} /> : <FiPlay size={20} />}
                </button>

                <button className="kp-ctrl-btn" onClick={() => dispatch(nextTrack())} title="Next">
                  <FiSkipForward size={17} />
                </button>

                <button
                  className={`kp-ctrl-btn ${repeat !== 'off' ? 'kp-active' : ''}`}
                  onClick={() => dispatch(toggleRepeat())}
                  title="Repeat"
                >
                  <FiRepeat size={14} />
                  {repeat === 'one' && <span className="kp-repeat-badge">1</span>}
                </button>
              </div>

              {/* Right — time + volume + actions */}
              <div className="kp-right">
                <div className="kp-time-row">
                  <span className="kp-time">{hasAudio ? fmt(currentTime) : '--:--'}</span>
                  <span className="kp-time-sep">/</span>
                  <span className="kp-time">{hasAudio ? fmt(duration) : '--:--'}</span>
                </div>

                <div className="kp-vol-row">
                  <button
                    className={`kp-ctrl-btn ${!hasAudio ? 'kp-disabled' : ''}`}
                    onClick={() => hasAudio && dispatch(setVolume(volume === 0 ? 0.6 : 0))}
                    disabled={!hasAudio}
                    title="Mute"
                  >
                    {volume === 0 || !hasAudio ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
                  </button>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={hasAudio ? volume : 0}
                    onChange={e => hasAudio && dispatch(setVolume(parseFloat(e.target.value)))}
                    className={`kp-vol-slider ${!hasAudio ? 'kp-disabled' : ''}`}
                    disabled={!hasAudio}
                    style={{ '--v': `${(hasAudio ? volume : 0) * 100}%` }}
                    title="Volume"
                  />
                </div>

                {/* Minimise + close */}
                <div className="kp-actions">
                  <button className="kp-action-btn" onClick={() => setMini(true)} title="Minimise">
                    <FiChevronDown size={15} />
                  </button>
                  <button className="kp-action-btn kp-close" onClick={() => setClosed(true)} title="Close player">
                    <FiX size={15} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── MINI BAR ── */}
        {mini && (
          <div className="kp-mini-inner">
            <div className="kp-mini-art-wrap">
              <img
                src={currentTrack.album?.images?.[2]?.url || currentTrack.album?.images?.[0]?.url || 'https://picsum.photos/seed/kp/40/40'}
                alt={currentTrack.name}
                className={`kp-mini-art ${isPlaying && hasAudio ? 'kp-spinning' : ''}`}
              />
            </div>

            <div className="kp-mini-meta">
              <p className="kp-mini-name">{currentTrack.name}</p>
              <p className="kp-mini-artist">{currentTrack.artists?.[0]?.name}</p>
            </div>

            <div className="kp-mini-controls">
              <button
                className={`kp-mini-btn ${!hasAudio ? 'kp-disabled' : ''}`}
                onClick={() => hasAudio && dispatch(togglePlay())}
                disabled={!hasAudio}
              >
                {isPlaying && hasAudio ? <FiPause size={16} /> : <FiPlay size={16} />}
              </button>
              <button className="kp-mini-btn" onClick={() => dispatch(nextTrack())}>
                <FiSkipForward size={15} />
              </button>
            </div>

            {/* Mini progress */}
            <div className="kp-mini-prog" onClick={seek}>
              <div className="kp-mini-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="kp-actions">
              <button className="kp-action-btn" onClick={() => setMini(false)} title="Expand player">
                <FiChevronUp size={15} />
              </button>
              <button className="kp-action-btn kp-close" onClick={() => setClosed(true)} title="Close player">
                <FiX size={15} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
