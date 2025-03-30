
import React, { useState, useEffect, useRef } from 'react';

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

const InteractiveBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [rippleCount, setRippleCount] = useState(0);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (backgroundRef.current) {
      const rect = backgroundRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        x,
        y,
        id: rippleCount,
      };
      
      setRipples((prev) => [...prev, newRipple]);
      setRippleCount((prev) => prev + 1);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, 2000);
    }
  };

  // Calculate gradient position based on mouse movement
  const gradientStyle = {
    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                 rgba(99, 179, 237, 0.4) 0%, 
                 rgba(59, 130, 246, 0.2) 40%, 
                 rgba(37, 99, 235, 0.1) 60%, 
                 rgba(30, 58, 138, 0.05) 100%)`,
  };

  return (
    <div 
      ref={backgroundRef}
      className="interactive-background"
      onClick={handleClick}
      style={gradientStyle}
    >
      <div className="ocean-surface" />
      
      {/* Render ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
          }}
        />
      ))}
    </div>
  );
};

export default InteractiveBackground;
