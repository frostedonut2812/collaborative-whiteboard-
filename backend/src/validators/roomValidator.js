function validateRoomId(roomId) {
  return typeof roomId === 'string' && 
         roomId.length >= 1 && 
         roomId.length <= 50 && 
         /^[a-zA-Z0-9_-]+$/.test(roomId);
}

module.exports = { validateRoomId };
