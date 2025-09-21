import { useEffect, useRef } from 'react';

export const useGameLoop = (gameState, gameSpeed, moveVirus, handleInfection, moveAntiviruses, checkGameConditions) => {
  const gameLoopRef = useRef();

  // Main game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        moveVirus();
        handleInfection();
        moveAntiviruses();
        checkGameConditions();
      }, gameSpeed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, moveVirus, handleInfection, moveAntiviruses, checkGameConditions, gameSpeed]);

  return {
    gameLoopRef
  };
};
