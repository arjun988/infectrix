import { useCallback, useEffect } from 'react';
import { CELL_TYPES } from '../constants/gameConstants';

export const useGameLogic = (
  gameState,
  setGameState,
  virusPos,
  grid,
  setGrid,
  antiviruses,
  setAntiviruses,
  setScore,
  setInfectedCount,
  setLives,
  setVirusPos,
  setInfectionTrail,
  setHealingWaves,
  setVirusTrail
) => {
  // Infection spreading with visual effects
  const handleInfection = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const cell = newGrid[virusPos.y][virusPos.x];
      
      if (cell === CELL_TYPES.NORMAL || cell === CELL_TYPES.IMMUNE) {
        newGrid[virusPos.y][virusPos.x] = CELL_TYPES.INFECTED;
        setInfectedCount(prev => prev + 1);
        setScore(prev => prev + (cell === CELL_TYPES.IMMUNE ? 20 : 10));
        
        // Add infection effect
        setInfectionTrail(prev => [...prev, {
          x: virusPos.x,
          y: virusPos.y,
          timestamp: Date.now(),
          type: 'infection'
        }]);
      }
      
      if (cell === CELL_TYPES.SUPERSPREADER) {
        newGrid[virusPos.y][virusPos.x] = CELL_TYPES.INFECTED;
        setScore(prev => prev + 50);
        
        // Superspreader explosion
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const newX = virusPos.x + dx;
            const newY = virusPos.y + dy;
            const distance = Math.abs(dx) + Math.abs(dy);
            
            if (newX >= 0 && newX < 25 && newY >= 0 && newY < 18 && distance <= 2) {
              if (newGrid[newY][newX] === CELL_TYPES.NORMAL) {
                setTimeout(() => {
                  setGrid(grid => {
                    const updatedGrid = [...grid];
                    updatedGrid[newY][newX] = CELL_TYPES.INFECTED;
                    return updatedGrid;
                  });
                  setInfectedCount(prev => prev + 1);
                  setInfectionTrail(prev => [...prev, {
                    x: newX,
                    y: newY,
                    timestamp: Date.now(),
                    type: 'explosion'
                  }]);
                }, distance * 200);
              }
            }
          }
        }
      }
      
      return newGrid;
    });
  }, [virusPos, setGrid, setScore, setInfectedCount, setInfectionTrail]);

  // Check collisions and game conditions
  const checkGameConditions = useCallback(() => {
    if (gameState !== 'playing') return;
    
    // Check virus-antivirus collision
    const collision = antiviruses.some(av => av.x === virusPos.x && av.y === virusPos.y);
    if (collision) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameState('gameOver');
        } else {
          // Reset virus position when hit
          setVirusPos({ x: 12, y: 9 });
        }
        return newLives;
      });
    }
    
    // Check victory condition - infect 60% of available cells
    const totalNormalCells = grid.flat().filter(cell => 
      [CELL_TYPES.NORMAL, CELL_TYPES.IMMUNE, CELL_TYPES.SUPERSPREADER, CELL_TYPES.INFECTED].includes(cell)
    ).length;
    
    const infectedCount = grid.flat().filter(cell => cell === CELL_TYPES.INFECTED).length;
    if (infectedCount > 0 && infectedCount / totalNormalCells >= 0.6) {
      setGameState('victory');
    }
    
    // Spawn more antiviruses as infection spreads
    if (infectedCount > 0 && infectedCount % 30 === 0 && antiviruses.length < 5) {
      setAntiviruses(prev => [...prev, {
        x: Math.floor(Math.random() * 25),
        y: Math.floor(Math.random() * 18),
        id: Date.now(),
        lastHealTime: 0
      }]);
    }
  }, [gameState, antiviruses, virusPos, grid, setGameState, setLives, setVirusPos, setAntiviruses]);

  // Clean up visual effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setInfectionTrail(prev => prev.filter(effect => now - effect.timestamp < 2000));
      setHealingWaves(prev => prev.filter(wave => now - wave.timestamp < 1500));
      setVirusTrail(prev => prev.filter(pos => now - pos.timestamp < 1000));
    }, 1000); // Run cleanup every second instead of every render

    return () => clearInterval(interval);
  }, [setInfectionTrail, setHealingWaves, setVirusTrail]);

  return {
    handleInfection,
    checkGameConditions
  };
};
