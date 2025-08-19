import React, { useState } from 'react';
import './RoomSelector.scss';

const RoomSelector = ({ onJoinRoom, currentRoom }) => {
  const [roomInput, setRoomInput] = useState('');

  const validateRoomId = (roomId) => {
    return roomId && 
           roomId.length >= 1 && 
           roomId.length <= 50 && 
           /^[a-zA-Z0-9_-]+$/.test(roomId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedRoom = roomInput.trim();
    
    if (!validateRoomId(trimmedRoom)) {
      alert('Room name must be 1-50 characters and contain only letters, numbers, hyphens, or underscores');
      return;
    }
    
    onJoinRoom(trimmedRoom);
    setRoomInput('');
  };

  const handleQuickJoin = (roomId) => {
    onJoinRoom(roomId);
  };

  return (
    <div className="room-selector">
      <div className="room-info">
        <span className="current-room">
          📍 Room: <strong>{currentRoom || 'Not connected'}</strong>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="room-form">
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Enter room name..."
          className="room-input"
        />
        <button type="submit" className="join-btn">
          Join Room
        </button>
      </form>

      <div className="quick-rooms">
        <span className="quick-label">Quick join:</span>
        <button
          onClick={() => handleQuickJoin('general')}
          className={`quick-room-btn ${currentRoom === 'general' ? 'active' : ''}`}
        >
          General
        </button>
        <button
          onClick={() => handleQuickJoin('design')}
          className={`quick-room-btn ${currentRoom === 'design' ? 'active' : ''}`}
        >
          Design
        </button>
        <button
          onClick={() => handleQuickJoin('meeting')}
          className={`quick-room-btn ${currentRoom === 'meeting' ? 'active' : ''}`}
        >
          Meeting
        </button>
        <button
          onClick={() => handleQuickJoin('brainstorm')}
          className={`quick-room-btn ${currentRoom === 'brainstorm' ? 'active' : ''}`}
        >
          Brainstorm
        </button>
      </div>
    </div>
  );
};

export default RoomSelector;
