import React from 'react';

export default function RainEffect() {
  // Generate 50 separate rain drops dynamically scattered across the screen
  const drops = Array.from({ length: 50 }).map((_, i) => ({
    left: `${Math.random() * 100}vw`,
    animationDelay: `${Math.random() * 1}s`,
    animationDuration: `${0.5 + Math.random() * 0.5}s`,
  }));

  return (
    <div className="rain-container">
      <div className="thunder-flash" />
      <div className="dark-cloud-wrap">
        <svg viewBox="0 0 100 100" className="dark-cloud">
          <path fill="#4b5563" d="M30 65 A 15 15 0 0 1 30 35 A 25 25 0 0 1 70 30 A 20 20 0 0 1 70 70 Z" />
        </svg>
      </div>
      
      {drops.map((style, i) => (
        <div 
          key={i} 
          className="rain-drop" 
          style={{
            left: style.left,
            animationDelay: style.animationDelay,
            animationDuration: style.animationDuration
          }}
        />
      ))}
    </div>
  );
}
