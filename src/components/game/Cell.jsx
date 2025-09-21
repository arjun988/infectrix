import React from 'react';
import { CELL_TYPES } from '../../constants/gameConstants';
import './Cell.css';

const Cell = ({ 
  cell, 
  x, 
  y, 
  virusPos, 
  antiviruses, 
  virusTrail, 
  infectionTrail, 
  healingWaves 
}) => {
  const isVirus = x === virusPos.x && y === virusPos.y;
  const isAntivirus = antiviruses.some(av => av.x === x && av.y === y);
  const isInVirusTrail = virusTrail.some(pos => pos.x === x && pos.y === y);
  const infectionEffect = infectionTrail.find(effect => effect.x === x && effect.y === y);
  const healingWave = healingWaves.find(wave => {
    const distance = Math.sqrt((x - wave.x) ** 2 + (y - wave.y) ** 2);
    const waveRadius = ((Date.now() - wave.timestamp) / 1500) * 3;
    return distance <= waveRadius && distance >= waveRadius - 0.5;
  });
  
  let className = 'cell';
  let content = '';
  let style = {};
  
  if (isVirus) {
    className += ' virus';
    content = '🦠';
    style.zIndex = 100;
  } else if (isAntivirus) {
    className += ' antivirus';
    content = '🛡️';
    style.zIndex = 90;
  } else {
    switch (cell) {
      case CELL_TYPES.INFECTED:
        className += ' infected';
        break;
      case CELL_TYPES.NORMAL:
        className += ' normal';
        break;
      case CELL_TYPES.IMMUNE:
        className += ' immune';
        break;
      case CELL_TYPES.SUPERSPREADER:
        className += ' superspreader';
        break;
      case CELL_TYPES.EMPTY:
        className += ' empty';
        break;
    }
  }
  
  if (isInVirusTrail && !isVirus) {
    className += ' virus-trail';
  }
  
  if (infectionEffect) {
    className += infectionEffect.type === 'explosion' ? ' explosion-effect' : ' infection-effect';
  }
  
  if (healingWave) {
    className += ' healing-wave';
  }
  
  return (
    <div key={`${x}-${y}`} className={className} style={style}>
      {content}
    </div>
  );
};

export default Cell;
