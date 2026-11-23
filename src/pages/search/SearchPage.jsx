import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiPlay, FiMusic, FiUser, FiDisc } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setCurrentTrack, setQueue } from '../../features/player/playerSlice';
import useLibrary from '../../hooks/useLibrary';
import useMusicSearch from '../../hooks/useMusicSearch';
import toast from 'react-hot-toast';
import './SearchPage.css';

export default function SearchPage() {
  const { tracks: libTracks } = useLibrary();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query,     setQuery]     = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all');

  const submitted = searchParams.get('q') || '';
  const { results, loading: searching } = useMusicSearch(submitted);

  useEffect(() => { setQuery(submitted); }, [submitted]);

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
  };

  const play = (track, queue = libTracks) => {
    if (!track) return;
    dispatch(setCurrentTrack(track));
    dispatch(setQueue({ tracks: queue, startIndex: queue.findIndex(t => t.id === track.id) }));
    toast.success(`Playing: ${track.name}`);
  };

  const fmt = ms => {
    if (!ms) return '--:--';
    return `${Math.floor(ms/60000)}:${String(Math.floor((ms%60000)/1000)).padStart(2,'0')}`;
  };

  const tabs = [
    { id: 'all',      label: 'All',      icon: FiSearch },
    { id: 'tracks',   label: 'Songs',    icon: FiMusic  },
    { id: 'artists',  label: 'Artists',  icon: FiUser   },
    { id: 'playlists',label: 'Playlists',icon: FiDisc   },
  ];

  return (
    <div className="sp-root">
      {/* Search bar */}
      <div className="sp-hero glass-panel">
        <form className="sp-form" onSubmit={handleSearch}>
          <div className="sp-input-wrap">
            <FiSearch size={18} className="sp-search-ico" />
            <input
              type="text" placeholder="Search music, artists, albums…"
              value={query} onChange={e => setQuery(e.target.value)}
              className="sp-input" autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {/* Results */}
      {searching && !results && <p className="search-status">Searching…</p>}
      {results ? (
        <>
          {/* Tabs */}
          <div className="sp-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`sp-tab ${activeTab===t.id?'active':''}`}
                onClick={() => setActiveTab(t.id)}>
                <t.icon size={14} />{t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {(activeTab === 'all' || activeTab === 'tracks') && results.tracks.items.length > 0 && (
            <section className="sp-section">
              <h3 className="sp-section-title title-md">Songs</h3>
              <div className="sp-track-list">
                {results.tracks.items.map((track, i) => (
                  <motion.div key={track.id} className="sp-track-row"
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i*0.04 }}
                    onClick={() => play(track, results.tracks.items)}>
                    <span className="sp-idx label-sm">{i+1}</span>
                    <div className="sp-track-art">
                      <img src={track.album.images[0].url} alt={track.name} />
                      <div className="sp-track-play"><FiPlay size={12} /></div>
                    </div>
                    <div className="sp-track-meta">
                      <p className="sp-track-name">{track.name}</p>
                      <p className="sp-track-artist label-sm">{track.artists.map(a=>a.name).join(', ')}</p>
                    </div>
                    <span className="sp-track-album label-sm">{track.album.name}</span>
                    <span className="sp-track-dur label-sm">{fmt(track.duration_ms)}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'artists') && results.artists.items.length > 0 && (
            <section className="sp-section">
              <h3 className="sp-section-title title-md">Artists</h3>
              <div className="sp-grid">
                {results.artists.items.map((a, i) => (
                  <motion.div key={a.id} className="sp-grid-card glass-panel"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay: i*0.05 }}
                    whileHover={{ y:-4 }}>
                    <div className="sp-grid-art round">
                      <img src={a.images[0].url} alt={a.name} />
                    </div>
                    <p className="sp-grid-name">{a.name}</p>
                    <p className="sp-grid-sub label-sm">{a.followers.total.toLocaleString()} fans</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'playlists') && results.playlists.items.length > 0 && (
            <section className="sp-section">
              <h3 className="sp-section-title title-md">Playlists</h3>
              <div className="sp-grid">
                {results.playlists.items.map((pl, i) => (
                  <motion.div key={pl.id} className="sp-grid-card glass-panel"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay: i*0.05 }}
                    whileHover={{ y:-4 }}
                    onClick={() => navigate(`/playlist/${pl.id}`)}>
                    <div className="sp-grid-art">
                      <img src={pl.images[0].url} alt={pl.name} />
                      <div className="sp-grid-play"><FiPlay size={16} /></div>
                    </div>
                    <p className="sp-grid-name">{pl.name}</p>
                    <p className="sp-grid-sub label-sm">{pl.tracks.total} tracks</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {results.tracks.items.length === 0 && results.artists.items.length === 0 && (
            <div className="sp-empty">
              <FiSearch size={48} />
              <h3>No results for “{query}”</h3>
              <p>Try different keywords</p>
            </div>
          )}
        </>
      ) : (
        <div className="sp-empty">
          <FiSearch size={56} />
          <h3>Search for music</h3>
          <p>Find songs, artists, albums and playlists</p>
        </div>
      )}
    </div>
  );
}
