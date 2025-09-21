import React from 'react';
import './GameInfo.css';

const GameInfo = () => {
  return (
    <div className="game-info">
      <div className="objective">
        <strong>🦠 OBJECTIVE:</strong> Infect 60% of the system while avoiding antivirus agents
      </div>
      <div className="controls">
        <strong>🎮 CONTROLS:</strong> WASD or Arrow Keys to move • Touch cells to infect
      </div>
      <div className="legend">
        <span>🦠 You</span>
        <span>🛡️ Antivirus</span>
        <span className="legend-infected">█</span> Infected
        <span className="legend-normal">█</span> Normal
        <span className="legend-immune">█</span> Immune
        <span className="legend-super">█</span> Super-spreader
      </div>
    </div>
  );
};

export default GameInfo;
