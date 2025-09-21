import { useState, useCallback } from 'react';
import { GAME_STATES, GRID_WIDTH, GRID_HEIGHT, CELL_TYPES } from '../constants/gameConstants';

export const useGameState = () => {
  const [gameState, setGameState] = useState(GAME_STATES.INTRO);
  const [grid, setGrid] = useState([]);
  const [virusPos, setVirusPos] = useState({ x: 12, y: 9 });
  const [antiviruses, setAntiviruses] = useState([]);
  const [score, setScore] = useState(0);
  const [infectedCount, setInfectedCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameSpeed, setGameSpeed] = useState(120);
  
  // Story and effects
  const [storyText, setStoryText] = useState('');
  const [showStory, setShowStory] = useState(false);
  const [infectionTrail, setInfectionTrail] = useState([]);
  const [healingWaves, setHealingWaves] = useState([]);
  const [virusTrail, setVirusTrail] = useState([]);

  // Initialize grid with strategic cell placement
  const initializeGrid = useCallback(() => {
    const newGrid = Array(GRID_HEIGHT).fill(null).map(() => 
      Array(GRID_WIDTH).fill(null).map(() => {
        const rand = Math.random();
        if (rand < 0.15) return CELL_TYPES.EMPTY;
        if (rand < 0.70) return CELL_TYPES.NORMAL;
        if (rand < 0.90) return CELL_TYPES.IMMUNE;
        return CELL_TYPES.SUPERSPREADER;
      })
    );
    
    // Clear starting area around virus
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const x = 12 + dx;
        const y = 9 + dy;
        if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
          newGrid[y][x] = CELL_TYPES.NORMAL;
        }
      }
    }
    
    return newGrid;
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGrid(initializeGrid());
    setVirusPos({ x: 12, y: 9 });
    setAntiviruses([
      { x: 2, y: 2, id: 1, lastHealTime: 0 },
      { x: 22, y: 15, id: 2, lastHealTime: 0 }
    ]);
    setScore(0);
    setInfectedCount(0);
    setLives(3);
    setLevel(1);
    setVirusTrail([]);
    setInfectionTrail([]);
    setHealingWaves([]);
    setGameState(GAME_STATES.PLAYING);
  }, [initializeGrid]);

  // Story sequences
  const showIntroStory = useCallback(() => {
    const stories = [
      "SYSTEM INITIALIZATION...",
      "Loading security protocols...",
      "ERROR: Unauthorized access detected",
      "WARNING: Containment breach in progress",
      "Subject INFECTRIX has escaped laboratory",
      "Network compromised...",
      "SURVIVE. SPREAD. EVOLVE."
    ];
    
    let index = 0;
    const showNextStory = () => {
      if (index < stories.length) {
        setStoryText(stories[index]);
        setShowStory(true);
        index++;
        const delay = 2500;
        setTimeout(() => {
          setShowStory(false);
          setTimeout(showNextStory, 300);
        }, delay);
      } else {
        // Start game directly after glitch sequence
        setTimeout(() => {
          startGame();
        }, 1000);
      }
    };
    showNextStory();
  }, [startGame]);

  return {
    // State
    gameState,
    setGameState,
    grid,
    setGrid,
    virusPos,
    setVirusPos,
    antiviruses,
    setAntiviruses,
    score,
    setScore,
    infectedCount,
    setInfectedCount,
    lives,
    setLives,
    level,
    setLevel,
    gameSpeed,
    setGameSpeed,
    storyText,
    setStoryText,
    showStory,
    setShowStory,
    infectionTrail,
    setInfectionTrail,
    healingWaves,
    setHealingWaves,
    virusTrail,
    setVirusTrail,
    
    // Actions
    initializeGrid,
    showIntroStory,
    startGame
  };
};
