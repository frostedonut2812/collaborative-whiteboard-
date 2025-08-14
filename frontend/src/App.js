import React from 'react';
import Whiteboard from './components/Whiteboard';
import Header from './components/Header';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Whiteboard />
      </main>
    </div>
  );
}

export default App;
