const userService = require('../../services/userService');
const { validateCursorData } = require('../../validators/cursorValidator');

const handleCursorMove = (socket) => {
  return (data) => {
    if (!validateCursorData(data)) {
      return socket.emit('error', 'Invalid cursor data');
    }
    const user = userService.getUser(socket.id);
    if (!user || !user.room) return;

    socket.to(user.room).emit('cursor-move', {
      ...data,
      userId: socket.id,
    });
  };
};

module.exports = { handleCursorMove };
