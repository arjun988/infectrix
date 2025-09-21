import React, { useState, useEffect } from 'react';
import './StoryScreen.css';

const StoryScreen = ({ storyText }) => {
  const [glitchText, setGlitchText] = useState('');
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    if (storyText) {
      setShowGlitch(true);
      let index = 0;
      const glitchInterval = setInterval(() => {
        if (index < storyText.length) {
          setGlitchText(storyText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(glitchInterval);
          setTimeout(() => setShowGlitch(false), 500);
        }
      }, 50);
      
      return () => clearInterval(glitchInterval);
    }
  }, [storyText]);

  return (
    <div className="story-screen">
      <div className="glitch-bg"></div>
      <div className="scanlines"></div>
      <div className="story-container">
        <div className={`story-text ${showGlitch ? 'glitch' : ''}`}>
          {glitchText}
        </div>
        <div className="story-cursor">_</div>
      </div>
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration top-right"></div>
      <div className="corner-decoration bottom-left"></div>
      <div className="corner-decoration bottom-right"></div>
    </div>
  );
};

export default StoryScreen;
