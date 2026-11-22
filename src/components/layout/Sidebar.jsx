import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  FiGrid, FiSearch, FiBookmark, FiHeart,
  FiCompass, FiUser, FiLogOut,
} from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import './Sidebar.css';

const NAV = [
  { icon: FiGrid,     label: 'Home',     path: '/home'     },
  { icon: FiSearch,   label: 'Search',   path: '/search'   },
  { icon: FiCompass,  label: 'Discover', path: '/discover' },
  { icon: FiHeart,    label: 'Liked',    path: '/liked'    },
  { icon: FiBookmark, label: 'Library',  path: '/library'  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isActive = (p) => location.pathname === p;

  return (
    <aside className="sb-root">
      {/* Logo mark */}
      <button className="sb-brand" onClick={() => navigate('/home')} aria-label="Home">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke="white" strokeWidth="1.8"/>
          <circle cx="11" cy="11" r="3.5" fill="white"/>
        </svg>
      </button>

      {/* Main nav */}
      <nav className="sb-nav">
        {NAV.map((item) => (
          <button
            key={item.path}
            className={`sb-btn ${isActive(item.path) ? 'sb-active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            title={item.label}
          >
            {isActive(item.path) && <span className="sb-active-bar" />}
            <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 1.8} />
            <span className="sb-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Profile + logout */}
      <div className="sb-bottom">
        <button
          className={`sb-btn ${isActive('/profile') ? 'sb-active' : ''}`}
          onClick={() => navigate('/profile')}
          aria-label="Profile"
          title="Profile"
        >
          {isActive('/profile') && <span className="sb-active-bar" />}
          <FiUser size={20} strokeWidth={isActive('/profile') ? 2.5 : 1.8} />
          <span className="sb-label">Profile</span>
        </button>

        <button
          className="sb-btn sb-logout"
          onClick={() => { dispatch(logout()); navigate('/'); }}
          aria-label="Sign out"
          title="Sign out"
        >
          <FiLogOut size={20} strokeWidth={1.8} />
          <span className="sb-label">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
