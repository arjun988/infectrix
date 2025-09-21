import { useCallback } from 'react';
import { GRID_WIDTH, GRID_HEIGHT, CELL_TYPES } from '../constants/gameConstants';

export const useAntivirusAI = (gameState, virusPos, antiviruses, setAntiviruses, setGrid, setInfectedCount, setHealingWaves) => {
  // Smart antivirus AI with healing abilities
  const moveAntiviruses = useCallback(() => {
    if (gameState !== 'playing') return;
    
    setAntiviruses(prev => prev.map(antivirus => {
      const dx = virusPos.x - antivirus.x;
      const dy = virusPos.y - antivirus.y;
      const distance = Math.abs(dx) + Math.abs(dy);
      
      let newX = antivirus.x;
      let newY = antivirus.y;
      
      // Intelligent pathfinding - prioritize axis with larger difference
      if (Math.random() < 0.8) { // 80% smart movement, 20% unpredictable
        if (Math.abs(dx) > Math.abs(dy)) {
          newX = antivirus.x + (dx > 0 ? 1 : -1);
        } else if (dy !== 0) {
          newY = antivirus.y + (dy > 0 ? 1 : -1);
        }
      } else {
        // Random movement to be less predictable
        const moves = [
          { x: antivirus.x + 1, y: antivirus.y },
          { x: antivirus.x - 1, y: antivirus.y },
          { x: antivirus.x, y: antivirus.y + 1 },
          { x: antivirus.x, y: antivirus.y - 1 }
        ];
        const validMoves = moves.filter(move => 
          move.x >= 0 && move.x < GRID_WIDTH && move.y >= 0 && move.y < GRID_HEIGHT
        );
        if (validMoves.length > 0) {
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          newX = randomMove.x;
          newY = randomMove.y;
        }
      }
      
      // Boundary checks
      newX = Math.max(0, Math.min(GRID_WIDTH - 1, newX));
      newY = Math.max(0, Math.min(GRID_HEIGHT - 1, newY));
      
      const updatedAntivirus = { ...antivirus, x: newX, y: newY };
      
      // Healing ability - heal nearby infected cells
      const now = Date.now();
      if (now - antivirus.lastHealTime > 2000) { // Heal every 2 seconds
        updatedAntivirus.lastHealTime = now;
        
        // Heal in 3x3 area around antivirus
        setGrid(grid => {
          const newGrid = [...grid];
          let healed = false;
          
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const healX = newX + dx;
              const healY = newY + dy;
              
              if (healX >= 0 && healX < GRID_WIDTH && healY >= 0 && healY < GRID_HEIGHT) {
                if (newGrid[healY][healX] === CELL_TYPES.INFECTED) {
                  newGrid[healY][healX] = CELL_TYPES.NORMAL;
                  healed = true;
                  setInfectedCount(prev => Math.max(0, prev - 1));
                }
              }
            }
          }
          
          if (healed) {
            setHealingWaves(prev => [...prev, {
              x: newX,
              y: newY,
              timestamp: now,
              radius: 0
            }]);
          }
          
          return newGrid;
        });
      }
      
      return updatedAntivirus;
    }));
  }, [gameState, virusPos, setAntiviruses, setGrid, setInfectedCount, setHealingWaves]);

  return {
    moveAntiviruses
  };
};
