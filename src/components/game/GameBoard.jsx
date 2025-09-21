import React from 'react';
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE } from '../../constants/gameConstants';
import Cell from './Cell';
import './GameBoard.css';

const GameBoard = ({ 
  grid, 
  virusPos, 
  antiviruses, 
  virusTrail, 
  infectionTrail, 
  healingWaves 
}) => {
  return (
    <div className="game-board">
      {grid.map((row, y) => 
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            cell={cell}
            x={x}
            y={y}
            virusPos={virusPos}
            antiviruses={antiviruses}
            virusTrail={virusTrail}
            infectionTrail={infectionTrail}
            healingWaves={healingWaves}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;
