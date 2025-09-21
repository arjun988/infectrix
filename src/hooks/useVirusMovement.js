import { useCallback, useRef } from 'react';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants/gameConstants';

export const useVirusMovement = (gameState, virusPos, setVirusPos, setVirusTrail) => {
  const keysPressed = useRef({});
  const lastMoveTime = useRef(0);

  // Enhanced virus movement with smooth trail
  const moveVirus = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const now = Date.now();
    if (now - lastMoveTime.current < 80) return;
    
    setVirusPos(prev => {
      let newX = prev.x;
      let newY = prev.y;
      let moved = false;

      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
        newX = Math.max(0, prev.x - 1);
        moved = true;
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
        newX = Math.min(GRID_WIDTH - 1, prev.x + 1);
        moved = true;
      }
      if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
        newY = Math.max(0, prev.y - 1);
        moved = true;
      }
      if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) {
        newY = Math.min(GRID_HEIGHT - 1, prev.y + 1);
        moved = true;
      }

      if (moved) {
        lastMoveTime.current = now;
        
        // Add to virus trail
        setVirusTrail(trail => [
          ...trail.slice(-8), // Keep only recent trail
          { x: prev.x, y: prev.y, timestamp: now }
        ]);
      }

      return { x: newX, y: newY };
    });
  }, [gameState, setVirusPos, setVirusTrail]);

  return {
    moveVirus,
    keysPressed,
    lastMoveTime
  };
};
