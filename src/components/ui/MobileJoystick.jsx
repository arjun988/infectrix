import React, { useState, useRef, useEffect } from 'react';
import './MobileJoystick.css';

const MobileJoystick = ({ onMove, onStop }) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef(null);
  const knobRef = useRef(null);

  const handleStart = (e) => {
    e.preventDefault();
    setIsActive(true);
  };

  const handleMove = (e) => {
    if (!isActive) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = centerX * 0.8;
    
    let newX = x;
    let newY = y;
    
    if (distance > maxDistance) {
      newX = (x / distance) * maxDistance;
      newY = (y / distance) * maxDistance;
    }
    
    setPosition({ x: newX, y: newY });
    
    // Calculate direction
    const angle = Math.atan2(newY, newX);
    const degrees = (angle * 180) / Math.PI;
    
    // Determine direction based on angle
    let direction = null;
    if (degrees > -45 && degrees <= 45) direction = 'right';
    else if (degrees > 45 && degrees <= 135) direction = 'down';
    else if (degrees > 135 || degrees <= -135) direction = 'left';
    else if (degrees > -135 && degrees <= -45) direction = 'up';
    
    if (direction && onMove) {
      onMove(direction);
    }
  };

  const handleEnd = () => {
    setIsActive(false);
    setPosition({ x: 0, y: 0 });
    if (onStop) {
      onStop();
    }
  };

  useEffect(() => {
    const handleTouchMove = (e) => handleMove(e);
    const handleMouseMove = (e) => handleMove(e);
    const handleTouchEnd = () => handleEnd();
    const handleMouseUp = () => handleEnd();

    if (isActive) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive]);

  return (
    <div className="mobile-joystick-container">
      <div 
        ref={joystickRef}
        className="joystick-base"
        onTouchStart={handleStart}
        onMouseDown={handleStart}
      >
        <div 
          ref={knobRef}
          className="joystick-knob"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            opacity: isActive ? 1 : 0.7
          }}
        />
      </div>
    </div>
  );
};

export default MobileJoystick;
