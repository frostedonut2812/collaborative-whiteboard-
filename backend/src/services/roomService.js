let roomData = new Map();

function getRoomData(roomId) {
  if (!roomData.has(roomId)) {
    roomData.set(roomId, {
      drawingData: [],
      users: new Map(),
    });
  }
  return roomData.get(roomId);
}

function clearRoom(roomId) {
  const room = getRoomData(roomId);
  room.drawingData = [];
}

module.exports = {
  getRoomData,
  clearRoom,
};
