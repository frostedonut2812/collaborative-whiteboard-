const { handleJoinRoom, handleDisconnect } = require('./handlers/joinRoom');
const { handleDrawing, handleClearCanvas } = require('./handlers/drawing');
const { handleCursorMove } = require('./handlers/cursor');

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', handleJoinRoom(io, socket));
    socket.on('drawing', handleDrawing(socket));
    socket.on('clear-canvas', handleClearCanvas(io, socket));
    socket.on('cursor-move', handleCursorMove(socket));
    socket.on('disconnect', handleDisconnect(io, socket));
  });
};

module.exports = { initializeSocket };
