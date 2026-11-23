import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiEdit2, FiCheck, FiMusic, FiHeart, FiLogOut } from 'react-icons/fi';
import { updateUser, logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import useLibrary from '../../hooks/useLibrary';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { playlists: libPlaylists, recentlyPlayed: libRecent, likedSongs: libLiked, loading: libLoading } = useLibrary();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector(s => s.auth);

  const [editing, setEditing]   = useState(false);
  const [name,    setName]      = useState(user?.displayName || '');
  const [email,   setEmail]     = useState(user?.email || '');

  const save = () => {
    dispatch(updateUser({ displayName: name.trim() || 'Listener', email: email.trim() }));
    toast.success('Profile updated');
    setEditing(false);
  };

  const stats = [
    { icon: FiMusic,  label: 'Playlists',     value: libPlaylists.length },
    { icon: FiHeart,  label: 'Liked Songs',   value: libLiked.length },
    { icon: FiMusic,  label: 'Recent Plays',  value: libRecent.length },
  ];

  if (libLoading) return <LoadingSpinner />;

  return (
    <div className="prof-root">
      {/* Profile card */}
      <motion.div className="prof-card glass-panel"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>

        {/* Avatar */}
        <div className="prof-avatar-wrap">
          <div className="prof-avatar">
            {user?.images?.[0]?.url
              ? <img src={user.images[0].url} alt="" />
              : <FiUser size={44} />}
          </div>
          <div className="prof-avatar-ring" />
        </div>

        {/* Info / edit */}
        {editing ? (
          <div className="prof-edit-form">
            <input
              className="input prof-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Display name"
            />
            <input
              className="input prof-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
            <div className="prof-edit-actions">
              <button className="btn btn-primary" onClick={save}>
                <FiCheck size={15} /> Save
              </button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="prof-info">
            <h1 className="prof-name">{user?.displayName || 'Listener'}</h1>
            <p className="prof-email label-sm"><FiMail size={12} /> {user?.email || 'No email set'}</p>
            <button className="btn btn-secondary prof-edit-btn" onClick={() => setEditing(true)}>
              <FiEdit2 size={14} /> Edit Profile
            </button>
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <motion.div className="prof-stats"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} className="prof-stat-card glass-panel"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: 0.15 + i * 0.07 }}>
            <div className="prof-stat-icon"><s.icon size={20} /></div>
            <p className="prof-stat-value mono-display">{s.value}</p>
            <p className="prof-stat-label label-sm">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent tracks */}
      <motion.section className="prof-section"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
        <h2 className="prof-section-title title-md">Recently Played</h2>
        <div className="prof-recent-list">
          {libRecent.slice(0, 5).map((t, i) => (
            <div key={t.id} className="prof-recent-row">
              <span className="prof-recent-idx label-sm">{i+1}</span>
              <img src={t.album.images[0].url} alt={t.name} className="prof-recent-art" />
              <div className="prof-recent-meta">
                <p className="prof-recent-name">{t.name}</p>
                <p className="prof-recent-artist label-sm">{t.artists[0]?.name}</p>
              </div>
              <span className="prof-recent-genre label-sm">{t.genre}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Sign out */}
      <motion.div className="prof-signout" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}>
        <button className="btn btn-secondary prof-logout-btn"
          onClick={() => { dispatch(logout()); navigate('/'); }}>
          <FiLogOut size={15} /> Sign Out
        </button>
      </motion.div>
    </div>
  );
}
