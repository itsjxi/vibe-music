import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMail, FiBell, FiChevronDown, FiLogOut, FiUser, FiX } from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import './Header.css';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [query, setQuery]   = useState('');
  const [focused, setFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="kg-header glass-panel">
      {/* Search */}
      <form className="kg-search-form" onSubmit={handleSearch}>
        <div className={`kg-search-box ${focused ? 'focused' : ''}`}>
          <FiSearch size={16} className="kg-search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search music"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="kg-search-input"
          />
          <AnimatePresence>
            {query && (
              <motion.button type="button" className="kg-search-clear"
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
              >
                <FiX size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Right actions */}
      <div className="kg-header-actions">
        <button className="btn btn-ghost btn-icon" title="Messages">
          <FiMail size={18} />
        </button>
        <button className="btn btn-ghost btn-icon" title="Notifications">
          <FiBell size={18} />
          <span className="notif-dot" />
        </button>

        {/* User chip */}
        <div className="kg-user-chip" onClick={() => setShowMenu(!showMenu)}>
          <div className="kg-avatar">
            {user?.images?.[0]?.url
              ? <img src={user.images[0].url} alt="" />
              : <FiUser size={15} />}
          </div>
          <span className="kg-user-name">{user?.displayName || 'Listener'}</span>
          <FiChevronDown size={14} className={`kg-chevron ${showMenu ? 'open' : ''}`} />

          <AnimatePresence>
            {showMenu && (
              <motion.div className="kg-user-menu surface-card"
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                onClick={e => e.stopPropagation()}
              >
                <button className="kg-menu-item" onClick={() => { navigate('/profile'); setShowMenu(false); }}>
                  <FiUser size={15} /> Profile
                </button>
                <div className="kg-menu-divider" />
                <button className="kg-menu-item danger" onClick={() => { dispatch(logout()); navigate('/'); }}>
                  <FiLogOut size={15} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
