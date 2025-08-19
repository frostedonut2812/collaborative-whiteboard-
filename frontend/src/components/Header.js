import React from 'react';
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <div className="header__logo">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="url(#gradient)" />
              <path
                d="M8 12L24 12M8 16L24 16M8 20L24 20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="6" cy="12" r="1.5" fill="white" />
              <circle cx="6" cy="16" r="1.5" fill="white" />
              <circle cx="6" cy="20" r="1.5" fill="white" />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header__title">
            <h1>CollabBoard</h1>
            <span className="header__subtitle">
              Real-time Collaborative Whiteboard
            </span>
          </div>
        </div>

        <div className="header__actions">
          <div className="header__status">
            <div className="status-indicator"></div>
            <span>Live</span>
          </div>

          <div className="header__user-menu">
            <div className="user-avatar">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
