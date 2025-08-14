import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import RoomSelector from './RoomSelector';
import './Whiteboard.scss';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [socket, setSocket] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(2);
  const [cursors, setCursors] = useState(new Map());
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:5001');
    setSocket(newSocket);

    // Initialize canvas
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 200;
    
    const context = canvas.getContext('2d');
    context.scale(1, 1);
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
    context.lineWidth = currentSize;
    contextRef.current = context;

    // Socket event listeners
    newSocket.on('load-drawing', (drawingData) => {
      // Clear canvas first
      clearCanvas();
      // Draw all existing data
      drawingData.forEach(data => {
        drawOnCanvas(data);
      });
    });

    newSocket.on('drawing', (data) => {
      drawOnCanvas(data);
    });

    newSocket.on('clear-canvas', () => {
      clearCanvas();
    });

    newSocket.on('user-count', (count) => {
      setUserCount(count);
    });

    newSocket.on('room-joined', (roomId) => {
      setCurrentRoom(roomId);
      console.log(`Joined room: ${roomId}`);
    });

    newSocket.on('cursor-move', (data) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.set(data.userId, data);
        return newCursors;
      });
    });

    newSocket.on('cursor-leave', (userId) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(userId);
        return newCursors;
      });
    });

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth - 100;
      canvas.height = window.innerHeight - 200;
      context.scale(1, 1);
      context.lineCap = 'round';
      context.strokeStyle = currentColor;
      context.lineWidth = currentSize;
    };

    window.addEventListener('resize', handleResize);

    // Auto-join general room on connection
    newSocket.on('connect', () => {
      newSocket.emit('join-room', 'general');
    });

    return () => {
      newSocket.close();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleJoinRoom = (roomId) => {
    if (socket) {
      socket.emit('join-room', roomId);
    }
  };

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = currentColor;
      contextRef.current.lineWidth = currentSize;
      contextRef.current.globalCompositeOperation = 
        currentTool === 'eraser' ? 'destination-out' : 'source-over';
    }
  }, [currentColor, currentSize, currentTool]);

  const drawOnCanvas = (data) => {
    const context = contextRef.current;
    const prevCompositeOperation = context.globalCompositeOperation;
    const prevStrokeStyle = context.strokeStyle;
    const prevLineWidth = context.lineWidth;

    context.globalCompositeOperation = data.tool === 'eraser' ? 'destination-out' : 'source-over';
    context.strokeStyle = data.color;
    context.lineWidth = data.size;

    context.beginPath();
    context.moveTo(data.x0, data.y0);
    context.lineTo(data.x1, data.y1);
    context.stroke();

    context.globalCompositeOperation = prevCompositeOperation;
    context.strokeStyle = prevStrokeStyle;
    context.lineWidth = prevLineWidth;
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    
    // Initialize position for drawing
    contextRef.current.lastX = offsetX;
    contextRef.current.lastY = offsetY;
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    contextRef.current.closePath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    
    // Get the previous position for line drawing
    const prevX = contextRef.current.lastX || offsetX;
    const prevY = contextRef.current.lastY || offsetY;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Emit drawing data to other users
    if (socket) {
      socket.emit('drawing', {
        x0: prevX,
        y0: prevY,
        x1: offsetX,
        y1: offsetY,
        color: currentColor,
        size: currentSize,
        tool: currentTool
      });
    }

    // Store current position for next draw
    contextRef.current.lastX = offsetX;
    contextRef.current.lastY = offsetY;
  };

  const handleMouseMove = (e) => {
    if (socket) {
      const rect = canvasRef.current.getBoundingClientRect();
      socket.emit('cursor-move', {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleClearCanvas = () => {
    if (socket) {
      socket.emit('clear-canvas');
    }
    clearCanvas();
  };

  return (
    <div className="whiteboard-container">
      <RoomSelector 
        onJoinRoom={handleJoinRoom}
        currentRoom={currentRoom}
      />
      <div className="toolbar">
        <div className="toolbar-section">
          <div className="user-count">
            Users online: {userCount}
          </div>
        </div>
        
        <div className="toolbar-section">
          <div className="tool-group">
            <button 
              className={currentTool === 'pen' ? 'active' : ''}
              onClick={() => setCurrentTool('pen')}
            >
              <span className="tool-icon">✏️</span>
              Pen
            </button>
            <button 
              className={currentTool === 'eraser' ? 'active' : ''}
              onClick={() => setCurrentTool('eraser')}
            >
              <span className="tool-icon">🧽</span>
              Eraser
            </button>
          </div>

          <div className="color-section">
            <label className="color-label">Color</label>
            <div className="color-picker-wrapper">
              <input 
                type="color" 
                value={currentColor} 
                onChange={(e) => setCurrentColor(e.target.value)}
                disabled={currentTool === 'eraser'}
              />
            </div>
          </div>

          <div className="size-section">
            <label className="size-label">Size</label>
            <input 
              className="size-slider"
              type="range" 
              min="1" 
              max="20" 
              value={currentSize}
              onChange={(e) => setCurrentSize(parseInt(e.target.value))}
            />
            <span className="size-display">{currentSize}px</span>
          </div>
        </div>

        <div className="toolbar-section">
          <button className="clear-btn" onClick={handleClearCanvas}>
            <span className="clear-icon">🗑️</span>
            Clear All
          </button>
        </div>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={(e) => {
            draw(e);
            handleMouseMove(e);
          }}
          onMouseLeave={finishDrawing}
        />
        
        {/* Render other users' cursors */}
        {Array.from(cursors.entries()).map(([userId, cursor]) => (
          <div
            key={userId}
            className="user-cursor"
            style={{
              left: cursor.x,
              top: cursor.y,
              borderColor: cursor.color
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Whiteboard;
