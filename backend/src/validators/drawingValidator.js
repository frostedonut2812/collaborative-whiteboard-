function validateDrawingData(data) {
  return data && 
         typeof data.x === 'number' && 
         typeof data.y === 'number' && 
         typeof data.prevX === 'number' && 
         typeof data.prevY === 'number' &&
         data.x >= 0 && data.x <= 5000 &&
         data.y >= 0 && data.y <= 5000;
}

module.exports = { validateDrawingData };
