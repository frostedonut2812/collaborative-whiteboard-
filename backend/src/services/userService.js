let connectedUsers = new Map();

function addUser(socketId, roomId) {
  const userData = {
    id: socketId,
    room: roomId,
    joinedAt: new Date().toISOString(),
  };
  connectedUsers.set(socketId, userData);
  return userData;
}

function getUser(socketId) {
  return connectedUsers.get(socketId);
}

function removeUser(socketId) {
  connectedUsers.delete(socketId);
}

function getUsersInRoom(roomId, roomData) {
    return Array.from(roomData.get(roomId).users.values());
}

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
};
