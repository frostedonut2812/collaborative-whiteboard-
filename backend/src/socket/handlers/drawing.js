const roomService = require('../../services/roomService');
const userService = require('../../services/userService');
const { validateDrawingData } = require('../../validators/drawingValidator');

const handleDrawing = (socket) => {
  return (data) => {
    if (!validateDrawingData(data)) {
      return socket.emit('error', 'Invalid drawing data');
    }
    const user = userService.getUser(socket.id);
    if (!user || !user.room) return;

    const room = roomService.getRoomData(user.room);
    room.drawingData.push(data);

    socket.to(user.room).emit('drawing', data);
  };
};

const handleClearCanvas = (io, socket) => {
  return () => {
    const user = userService.getUser(socket.id);
    if (!user || !user.room) return;

    roomService.clearRoom(user.room);
    io.to(user.room).emit('clear-canvas');
  };
};

module.exports = { handleDrawing, handleClearCanvas };
