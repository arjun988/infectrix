import React from 'react';
import './VictoryScreen.css';

const VictoryScreen = ({ score, infectedCount, onRestart }) => {
  return (
    <div className="victory-screen">
      <h1>🦠 SYSTEM COMPROMISED 🦠</h1>
      <p>Infectrix has successfully breached the network</p>
      <div className="stats">
        <div>Final Score: {score.toLocaleString()}</div>
        <div>Total Infected: {infectedCount}</div>
      </div>
      <button onClick={onRestart} className="restart-btn">
        NEW SYSTEM
      </button>
    </div>
  );
};

export default VictoryScreen;
