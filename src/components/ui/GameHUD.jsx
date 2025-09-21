import React from 'react';
import './GameHUD.css';

const GameHUD = ({ score, infectedCount, lives, antiviruses, level }) => {
  return (
    <div className="hud">
      <div className="hud-left">
        <div className="hud-item">Score: {score.toLocaleString()}</div>
        <div className="hud-item">Infected: {infectedCount}</div>
      </div>
      <div className="hud-center">
        <div className="hud-item lives">Lives: {'❤️'.repeat(lives)}</div>
      </div>
      <div className="hud-right">
        <div className="hud-item">Antiviruses: {antiviruses.length}</div>
        <div className="hud-item">Level: {level}</div>
      </div>
    </div>
  );
};

export default GameHUD;
