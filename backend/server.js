const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

function validateRoomId(roomId) {
  return typeof roomId === 'string' && 
         roomId.length >= 1 && 
         roomId.length <= 50 && 
         /^[a-zA-Z0-9_-]+$/.test(roomId);
}

function validateDrawingData(data) {
  return data && 
         typeof data.x === 'number' && 
         typeof data.y === 'number' && 
         typeof data.prevX === 'number' && 
         typeof data.prevY === 'number' &&
         data.x >= 0 && data.x <= 5000 &&
         data.y >= 0 && data.y <= 5000;
}

function validateCursorData(data) {
  return data && 
         typeof data.x === 'number' && 
         typeof data.y === 'number' &&
         data.x >= 0 && data.x <= 5000 &&
         data.y >= 0 && data.y <= 5000;
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'https://your-app.herokuapp.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let roomData = new Map();
let connectedUsers = new Map();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

function getRoomData(roomId) {
  if (!roomData.has(roomId)) {
    roomData.set(roomId, {
      drawingData: [],
      users: new Map(),
    });
  }
  return roomData.get(roomId);
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    if (!validateRoomId(roomId)) {
      socket.emit('error', 'Invalid room ID');
      return;
    }
    
    if (connectedUsers.has(socket.id)) {
      const prevRoom = connectedUsers.get(socket.id).room;
      if (prevRoom) {
        socket.leave(prevRoom);
        const prevRoomData = getRoomData(prevRoom);
        prevRoomData.users.delete(socket.id);
        io.to(prevRoom).emit('user-count', prevRoomData.users.size);
      }
    }

    socket.join(roomId);
    const currentRoomData = getRoomData(roomId);

    const userColor = getRandomColor();
    const userName = getRandomUserName();
    const userInitials = getInitials(userName);

    const userData = {
      id: socket.id,
      name: userName,
      initials: userInitials,
      color: userColor,
      room: roomId,
      joinedAt: new Date().toISOString(),
    };

    connectedUsers.set(socket.id, userData);
    currentRoomData.users.set(socket.id, userData);

    console.log(`User ${socket.id} joined room: ${roomId}`);

    socket.emit('load-drawing', currentRoomData.drawingData);
    io.to(roomId).emit('user-count', currentRoomData.users.size);
    const userList = Array.from(currentRoomData.users.values());
    io.to(roomId).emit('users-update', userList);
    socket.emit('room-joined', { roomId, userData });
  });

  socket.on('drawing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user || !user.room) return;

    const currentRoomData = getRoomData(user.room);

    // Add drawing data to room storage
    currentRoomData.drawingData.push(data);

    socket.to(user.room).emit('drawing', data);
  });

  socket.on('clear-canvas', () => {
    const user = connectedUsers.get(socket.id);
    if (!user || !user.room) return;

    const currentRoomData = getRoomData(user.room);
    currentRoomData.drawingData = [];

    io.to(user.room).emit('clear-canvas');
  });

  socket.on('cursor-move', (data) => {
    if (!validateCursorData(data)) {
      socket.emit('error', 'Invalid cursor data');
      return;
    }
    
    const user = connectedUsers.get(socket.id);
    if (!user || !user.room) return;

    socket.to(user.room).emit('cursor-move', {
      ...data,
      userId: socket.id,
      color: user.color,
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    const user = connectedUsers.get(socket.id);
    if (user && user.room) {
      const currentRoomData = getRoomData(user.room);
      currentRoomData.users.delete(socket.id);

      io.to(user.room).emit('user-count', currentRoomData.users.size);
      const userList = Array.from(currentRoomData.users.values());
      io.to(user.room).emit('users-update', userList);
      io.to(user.room).emit('cursor-leave', socket.id);
    }

    connectedUsers.delete(socket.id);
  });
});

function getRandomColor() {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomUserName() {
  const adjectives = [
    'Creative',
    'Artistic',
    'Brilliant',
    'Clever',
    'Dynamic',
    'Energetic',
    'Friendly',
    'Gentle',
    'Happy',
    'Innovative',
    'Joyful',
    'Kind',
    'Lively',
    'Magical',
    'Noble',
    'Optimistic',
    'Peaceful',
    'Quick',
    'Radiant',
    'Smart',
    'Talented',
    'Unique',
    'Vibrant',
    'Wise',
    'Zesty',
  ];
  const nouns = [
    'Artist',
    'Designer',
    'Creator',
    'Painter',
    'Sketcher',
    'Doodler',
    'Illustrator',
    'Maker',
    'Builder',
    'Crafter',
    'Dreamer',
    'Thinker',
    'Innovator',
    'Explorer',
    'Pioneer',
    'Visionary',
    'Genius',
    'Master',
    'Expert',
    'Pro',
    'Star',
    'Hero',
    'Champion',
    'Leader',
    'Wizard',
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}

function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
