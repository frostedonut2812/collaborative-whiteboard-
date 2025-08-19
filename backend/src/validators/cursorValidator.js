function validateCursorData(data) {
  return data && 
         typeof data.x === 'number' && 
         typeof data.y === 'number' &&
         data.x >= 0 && data.x <= 5000 &&
         data.y >= 0 && data.y <= 5000;
}

module.exports = { validateCursorData };
