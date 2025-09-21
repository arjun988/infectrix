import React, { useEffect } from 'react';
import { GAME_STATES } from '../constants/gameConstants';
import { useGameState } from '../hooks/useGameState';
import { useVirusMovement } from '../hooks/useVirusMovement';
import { useAntivirusAI } from '../hooks/useAntivirusAI';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useGameLogic } from '../hooks/useGameLogic';
import { useMobileControls } from '../hooks/useMobileControls';

// UI Components
import StoryScreen from './ui/StoryScreen';
import GameOverScreen from './ui/GameOverScreen';
import VictoryScreen from './ui/VictoryScreen';
import GameHUD from './ui/GameHUD';
import GameBoard from './game/GameBoard';
import GameInfo from './ui/GameInfo';
import MobileJoystick from './ui/MobileJoystick';

// Styles
import '../styles/GameContainer.css';

const InfectrixGame = () => {
  // Game state management
  const {
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
    storyText,
    showStory,
    infectionTrail,
    setInfectionTrail,
    healingWaves,
    setHealingWaves,
    virusTrail,
    setVirusTrail,
    showIntroStory,
    startGame
  } = useGameState();

  // Virus movement
  const { moveVirus, keysPressed } = useVirusMovement(
    gameState,
    virusPos,
    setVirusPos,
    setVirusTrail
  );

  // Antivirus AI
  const { moveAntiviruses } = useAntivirusAI(
    gameState,
    virusPos,
    antiviruses,
    setAntiviruses,
    setGrid,
    setInfectedCount,
    setHealingWaves
  );

  // Game logic
  const { handleInfection, checkGameConditions } = useGameLogic(
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
  );

  // Game loop
  useGameLoop(
    gameState,
    80, // gameSpeed
    moveVirus,
    handleInfection,
    moveAntiviruses,
    checkGameConditions
  );

  // Keyboard controls
  useKeyboardControls(keysPressed);

  // Mobile controls
  const { handleJoystickMove, handleJoystickStop } = useMobileControls(keysPressed);

  // Initialize game
  useEffect(() => {
    showIntroStory();
  }, [showIntroStory]);

  // UI States
  if (showStory) {
    return <StoryScreen storyText={storyText} />;
  }

  if (gameState === GAME_STATES.GAME_OVER) {
    return (
      <GameOverScreen
        score={score}
        infectedCount={infectedCount}
        onRestart={startGame}
      />
    );
  }

  if (gameState === GAME_STATES.VICTORY) {
    return (
      <VictoryScreen
        score={score}
        infectedCount={infectedCount}
        onRestart={startGame}
      />
    );
  }

  // Main game screen
  return (
    <div className="game-container">
      <GameHUD
        score={score}
        infectedCount={infectedCount}
        lives={lives}
        antiviruses={antiviruses}
        level={level}
      />
      
      <GameBoard
        grid={grid}
        virusPos={virusPos}
        antiviruses={antiviruses}
        virusTrail={virusTrail}
        infectionTrail={infectionTrail}
        healingWaves={healingWaves}
      />
      
      <GameInfo />
      
      {/* Mobile Joystick - only visible on mobile */}
      <MobileJoystick 
        onMove={handleJoystickMove}
        onStop={handleJoystickStop}
      />
    </div>
  );
};

export default InfectrixGame;
