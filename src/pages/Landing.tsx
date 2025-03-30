
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
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <PositionedEmojis />
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Save Through Small Changes</h1>
        <p className="text-xl mb-8">
          Track spending habits and see how small daily changes can lead to big savings over time.
        </p>
        <a 
          href="/app" 
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Start Saving Now
        </a>
      </div>
    </div>
  );
};

export default Landing;
