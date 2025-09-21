import { useCallback } from 'react';

export const useMobileControls = (keysPressed) => {
  const handleJoystickMove = useCallback((direction) => {
    // Clear all previous keys
    Object.keys(keysPressed.current).forEach(key => {
      keysPressed.current[key] = false;
    });

    // Set the appropriate key based on direction
    switch (direction) {
      case 'up':
        keysPressed.current['ArrowUp'] = true;
        keysPressed.current['w'] = true;
        break;
      case 'down':
        keysPressed.current['ArrowDown'] = true;
        keysPressed.current['s'] = true;
        break;
      case 'left':
        keysPressed.current['ArrowLeft'] = true;
        keysPressed.current['a'] = true;
        break;
      case 'right':
        keysPressed.current['ArrowRight'] = true;
        keysPressed.current['d'] = true;
        break;
      default:
        break;
    }
  }, [keysPressed]);

  const handleJoystickStop = useCallback(() => {
    // Clear all keys when joystick is released
    Object.keys(keysPressed.current).forEach(key => {
      keysPressed.current[key] = false;
    });
  }, [keysPressed]);

  return {
    handleJoystickMove,
    handleJoystickStop
  };
};
