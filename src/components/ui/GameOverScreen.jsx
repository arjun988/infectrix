import React from 'react';
import './GameOverScreen.css';

const GameOverScreen = ({ score, infectedCount, onRestart }) => {
  return (
    <div className="game-over-screen">
      <h1>🚨 CONTAINED 🚨</h1>
      <p>The antivirus system has neutralized the threat</p>
      <div className="stats">
        <div>Final Score: {score.toLocaleString()}</div>
        <div>Cells Infected: {infectedCount}</div>
      </div>
      <button onClick={onRestart} className="restart-btn">
        RETRY BREACH
      </button>
    </div>
  );
};

export default GameOverScreen;
