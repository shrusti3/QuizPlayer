import React, { useEffect, useState } from 'react';

export default function StarfieldBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to center, normalized from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // We can render 3 layers of stars for parallax depth
  return (
    <div className="starfield-container">
      {/* Background Gradient */}
      <div className="space-gradient"></div>

      {/* Star layers with different parallax multipliers */}
      <div 
        className="stars layer-1" 
        style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}
      />
      <div 
        className="stars layer-2" 
        style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
      />
      <div 
        className="stars layer-3" 
        style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
      />
      
      {/* Perspective Grid overlay */}
      <div className="perspective-grid"></div>
    </div>
  );
}
