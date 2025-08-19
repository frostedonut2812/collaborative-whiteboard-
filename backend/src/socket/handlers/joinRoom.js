const { validateRoomId } = require('../../validators/roomValidator');
const roomService = require('../../services/roomService');
const userService = require('../../services/userService');

const handleJoinRoom = (io, socket) => {
  return (roomId) => {
    if (!validateRoomId(roomId)) {
      return socket.emit('error', 'Invalid room ID');
    }

    const prevUser = userService.getUser(socket.id);
    if (prevUser && prevUser.room) {
      socket.leave(prevUser.room);
      const prevRoomData = roomService.getRoomData(prevUser.room);
      prevRoomData.users.delete(socket.id);
      io.to(prevUser.room).emit('user-count', prevRoomData.users.size);
    }

    socket.join(roomId);
    const currentRoomData = roomService.getRoomData(roomId);
    const userData = userService.addUser(socket.id, roomId);
    currentRoomData.users.set(socket.id, userData);

    console.log(`User ${socket.id} joined room: ${roomId}`);

    socket.emit('load-drawing', currentRoomData.drawingData);
    io.to(roomId).emit('user-count', currentRoomData.users.size);
    const userList = Array.from(currentRoomData.users.values());
    io.to(roomId).emit('users-update', userList);
    socket.emit('room-joined', { roomId, userData });
  };
};

const handleDisconnect = (io, socket) => {
  return () => {
    console.log(`User disconnected: ${socket.id}`);
    const user = userService.getUser(socket.id);
    if (user && user.room) {
      const roomData = roomService.getRoomData(user.room);
      roomData.users.delete(socket.id);

      io.to(user.room).emit('user-count', roomData.users.size);
      const userList = Array.from(roomData.users.values());
      io.to(user.room).emit('users-update', userList);
      io.to(user.room).emit('cursor-leave', socket.id);
    }
    userService.removeUser(socket.id);
  };
};

module.exports = { handleJoinRoom, handleDisconnect };
