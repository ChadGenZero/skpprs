
import React from 'react';

const PositionedEmojis = () => (
  <div 
    className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
    style={{ 
      maxWidth: '100%', 
      height: '100%' 
    }}
  >
    {/* Captain emoji at top left of text box */}
    <span 
      className="animate-bounce-subtle absolute" 
      style={{ 
        top: '20vh', 
        left: '10vw', 
        fontSize: '4vmin' 
      }}
    >
      👨‍✈️
    </span>

    {/* Sailboat at bottom right of text box */}
    <span 
      className="animate-bounce-subtle absolute" 
      style={{ 
        bottom: '20vh', 
        right: '10vw', 
        fontSize: '4vmin' 
      }}
    >
      ⛵
    </span>

    {/* Whale at top right of "Skip & Save Sample" box */}
    <span 
      className="animate-bounce-subtle absolute" 
      style={{ 
        top: '25vh', 
        right: '10vw', 
        fontSize: '4vmin' 
      }}
    >
      🐋
    </span>

    {/* Anchor at bottom third of desktop view */}
    <span 
      className="animate-bounce-subtle absolute" 
      style={{ 
        bottom: '10vh', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        fontSize: '4vmin' 
      }}
    >
      ⚓
    </span>

    {/* Map emoji in its current desktop position */}
    <span 
      className="animate-bounce-subtle absolute" 
      style={{ 
        top: '30vh', 
        left: '20vw', 
        fontSize: '4vmin' 
      }}
    >
      🗺️
    </span>

    {/* Female captain at bottom left of "Skip & Save Sample" box */}
    <span 
      className="animate-bounce-subtle absolute" 
      style={{ 
        bottom: '25vh', 
        left: '10vw', 
        fontSize: '4vmin' 
      }}
    >
      👩‍✈️
    </span>

    {/* Gem at bottom of "Hidden spending" text box */}
    <span 
      className="animate-bounce-subtle absolute" 
      style={{ 
        bottom: '20vh', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        fontSize: '4vmin' 
      }}
    >
      💎
    </span>

    {/* Money bag next to "Start Tracking Your Savings" text */}
    <span 
      className="animate-bounce-subtle absolute" 
      style={{ 
        bottom: '10vh', 
        right: '15vw', 
        fontSize: '4vmin' 
      }}
    >
      💰
    </span>
  </div>
);

const Landing = () => {
  return (
    <div className="relative min-h-screen">
      <PositionedEmojis />
      {/* Add the rest of the Landing page content here */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Your Financial Journey
        </h1>
        {/* Add more content as needed */}
      </div>
    </div>
  );
};

export default Landing;
