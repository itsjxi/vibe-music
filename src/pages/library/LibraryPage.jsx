import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMusic, FiHeart, FiGrid, FiList, FiClock, FiPlay } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import { DEMO_PLAYLISTS, DEMO_RECENTLY_PLAYED, DEMO_LIKED_SONGS } from '../../data/demoData';
import toast from 'react-hot-toast';
import './LibraryPage.css';

export default function LibraryPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const [view,    setView]    = useState('grid');
  const [filter,  setFilter]  = useState('all');

  const FILTERS = ['all', 'playlists', 'recent'];

  const libraryItems = [
    {
      id: 'liked-songs',
      type: 'liked',
      name: 'Liked Songs',
      sub: `${DEMO_LIKED_SONGS.length} songs`,
      img: null,
      action: () => navigate('/liked'),
    },
    ...DEMO_PLAYLISTS.map(pl => ({
      id: pl.id,
      type: 'playlist',
      name: pl.name,
      sub: `${pl.tracks.total} tracks`,
      img: pl.images[0].url,
      action: () => navigate(`/playlist/${pl.id}`),
    })),
  ];

  const recentItems = DEMO_RECENTLY_PLAYED.map(t => ({
    id: t.id,
    type: 'recent',
    name: t.name,
    sub: t.artists[0].name,
    img: t.album.images[0].url,
    action: () => {
      dispatch(setCurrentTrack(t));
      dispatch(setQueue({ tracks: DEMO_RECENTLY_PLAYED, startIndex: DEMO_RECENTLY_PLAYED.findIndex(x => x.id === t.id) }));
      toast.success(`Playing: ${t.name}`);
    },
  }));

  const items = filter === 'recent' ? recentItems
    : filter === 'playlists' ? libraryItems.filter(i => i.type !== 'recent')
    : libraryItems;

  return (
    <div className="lib-root">
      {/* Page header */}
      <motion.div className="lib-header" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
        <h1 className="lib-title">Your Library</h1>

        <div className="lib-toolbar">
          {/* Filter pills */}
          <div className="lib-filters">
            {FILTERS.map(f => (
              <button key={f} className={`lib-filter-btn ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="lib-view-toggle">
            <button className={`lib-view-btn ${view==='grid'?'active':''}`} onClick={() => setView('grid')} title="Grid view">
              <FiGrid size={16} />
            </button>
            <button className={`lib-view-btn ${view==='list'?'active':''}`} onClick={() => setView('list')} title="List view">
              <FiList size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Items */}
      <motion.div
        className={`lib-grid ${view}`}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
        {items.map((item, i) => (
          <motion.div key={item.id}
            className={`lib-item ${view}`}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={view === 'grid' ? { y:-4, boxShadow: 'var(--shadow-md)' } : {}}
            onClick={item.action}>

            {/* Image */}
            <div className={`lib-item-img ${view}`}>
              {item.type === 'liked' ? (
                <div className="lib-liked-bg"><FiHeart size={view==='grid'?36:22} /></div>
              ) : item.img ? (
                <img src={item.img} alt={item.name} />
              ) : (
                <div className="lib-placeholder-bg"><FiMusic size={22} /></div>
              )}
              {/* Play overlay on hover */}
              <div className="lib-item-play-overlay">
                <div className="lib-item-play-btn"><FiPlay size={view==='grid'?18:14} /></div>
              </div>
            </div>

            <div className="lib-item-meta">
              <p className="lib-item-name">{item.name}</p>
              <p className="lib-item-sub label-sm">{item.sub}</p>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div className="lib-empty">
            <FiMusic size={52} />
            <p>Nothing here yet</p>
          </div>
        )}
      </motion.div>

      {/* Recently played strip (only on 'all' filter) */}
      {filter === 'all' && (
        <motion.section className="lib-recent-section"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
          <div className="lib-section-header">
            <h2 className="lib-section-title title-md">
              <FiClock size={16} /> Recently Played
            </h2>
          </div>
          <div className="lib-recent-list">
            {DEMO_RECENTLY_PLAYED.slice(0, 6).map((t, i) => (
              <motion.div key={t.id} className="lib-recent-row"
                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  dispatch(setCurrentTrack(t));
                  dispatch(setQueue({ tracks: DEMO_RECENTLY_PLAYED, startIndex: i }));
                  toast.success(`Playing: ${t.name}`);
                }}>
                <div className="lib-recent-art">
                  <img src={t.album.images[0].url} alt={t.name} />
                  <div className="lib-recent-play"><FiPlay size={12} /></div>
                </div>
                <div className="lib-recent-meta">
                  <p className="lib-recent-name">{t.name}</p>
                  <p className="lib-recent-artist label-sm">{t.artists[0].name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
