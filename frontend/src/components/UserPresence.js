import React from 'react';
import './UserPresence.scss';

const UserPresence = ({ users, currentUserId }) => {
  const userList = users || [];

  console.log('UserPresence component rendered with:', {
    users,
    currentUserId,
    userListLength: userList.length,
  });

  return (
    <div className="user-presence">
      <div className="user-presence-header">
        <h3>Active Users ({userList.length})</h3>
      </div>

      <div className="user-list">
        {userList.length === 0 ? (
          <div className="no-users-message">
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
            <p>
              <strong>USER PRESENCE PANEL</strong>
            </p>
            <p style={{ color: '#667eea', fontWeight: 'bold' }}>
              This panel is working!
            </p>
            <p>Join a room above to see users here.</p>
          </div>
        ) : (
          userList.map((user) => (
            <div
              key={user.id}
              className={`user-item ${user.id === currentUserId ? 'current-user' : ''}`}
            >
              <div
                className="user-avatar"
                style={{ backgroundColor: user.color }}
              >
                <span className="user-initials">{user.initials}</span>
                <div className="user-status-indicator"></div>
              </div>

              <div className="user-info">
                <div className="user-name">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="you-label">(You)</span>
                  )}
                </div>
                <div className="user-status">Online</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPresence;
