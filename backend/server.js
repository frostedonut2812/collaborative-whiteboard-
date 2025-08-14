const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL || "https://your-app.herokuapp.com"]
      : ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Store drawing data per room
let roomData = new Map(); // roomId -> { drawingData: [], users: Map() }
let connectedUsers = new Map(); // socketId -> { id, color, room }

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Helper function to get or create room data
function getRoomData(roomId) {
  if (!roomData.has(roomId)) {
    roomData.set(roomId, {
      drawingData: [],
      users: new Map()
    });
  }
  return roomData.get(roomId);
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle joining a room
  socket.on('join-room', (roomId) => {
    // Leave any previous room
    if (connectedUsers.has(socket.id)) {
      const prevRoom = connectedUsers.get(socket.id).room;
      if (prevRoom) {
        socket.leave(prevRoom);
        const prevRoomData = getRoomData(prevRoom);
        prevRoomData.users.delete(socket.id);
        io.to(prevRoom).emit('user-count', prevRoomData.users.size);
      }
    }
    
    // Join new room
    socket.join(roomId);
    const currentRoomData = getRoomData(roomId);
    
    // Add user to connected users and room
    const userColor = getRandomColor();
    connectedUsers.set(socket.id, {
      id: socket.id,
      color: userColor,
      room: roomId
    });
    
    currentRoomData.users.set(socket.id, {
      id: socket.id,
      color: userColor
    });
    
    console.log(`User ${socket.id} joined room: ${roomId}`);
    
    // Send current drawing data to new user
    socket.emit('load-drawing', currentRoomData.drawingData);
    
    // Broadcast user count to room
    io.to(roomId).emit('user-count', currentRoomData.users.size);
    
    // Send room info
    socket.emit('room-joined', roomId);
  });
  
  // Handle drawing events
  socket.on('drawing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user || !user.room) return;
    
    const currentRoomData = getRoomData(user.room);
    
    // Add drawing data to room storage
    currentRoomData.drawingData.push(data);
    
    // Broadcast to other clients in the same room
    socket.to(user.room).emit('drawing', data);
  });
  
  // Handle clear canvas
  socket.on('clear-canvas', () => {
    const user = connectedUsers.get(socket.id);
    if (!user || !user.room) return;
    
    const currentRoomData = getRoomData(user.room);
    currentRoomData.drawingData = [];
    
    // Clear canvas for all users in the room
    io.to(user.room).emit('clear-canvas');
  });
  
  // Handle cursor movement
  socket.on('cursor-move', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user || !user.room) return;
    
    socket.to(user.room).emit('cursor-move', {
      ...data,
      userId: socket.id,
      color: user.color
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const user = connectedUsers.get(socket.id);
    if (user && user.room) {
      const currentRoomData = getRoomData(user.room);
      currentRoomData.users.delete(socket.id);
      
      // Update user count for the room
      io.to(user.room).emit('user-count', currentRoomData.users.size);
      io.to(user.room).emit('cursor-leave', socket.id);
    }
    
    connectedUsers.delete(socket.id);
  });
});

// Generate random color for users
function getRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  return colors[Math.floor(Math.random() * colors.length)];
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
