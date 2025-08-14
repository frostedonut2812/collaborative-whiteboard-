import React, { useState } from 'react';
import './RoomSelector.scss';

const RoomSelector = ({ onJoinRoom, currentRoom }) => {
  const [roomInput, setRoomInput] = useState('');

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const roomId = roomInput.trim() || 'general';
    onJoinRoom(roomId);
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
      
      <form onSubmit={handleJoinRoom} className="room-form">
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
