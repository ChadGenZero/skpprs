
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

// Array of steps with their titles
const steps = [
  { step: 1, title: 'Pick Habits' },
  { step: 2, title: 'See Savings' },
  { step: 3, title: 'Grow Savings' },
  { step: 4, title: 'Log Skips' },
  { step: 5, title: 'Auto-Invest' }
];

// Path positions for a more natural S-curve
const stepPositions = [
  { x: 75, y: 50 },   // First stage
  { x: 25, y: 200 },  // Second stage
  { x: 75, y: 350 },  // Third stage
  { x: 25, y: 500 },  // Fourth stage
  { x: 75, y: 650 }   // Final stage
];

const ProgressBar: React.FC = () => {
  const { step, setStep } = useAppContext();

  return (
    <div className="py-6 px-4 md:px-0 progress-container">
      <div className="relative mx-auto h-[650px] w-[150px]">
        {/* SVG S-curve Path */}
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 150 650" xmlns="http://www.w3.org/2000/svg">
          {/* Background dashed path */}
          <path 
            d="M 75 50 C 25 125, 125 275, 75 350 C 25 425, 125 575, 75 650" 
            stroke="#ccc" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="8,8" 
            className="progress-path"
          />
          {/* Active path segment that follows progress */}
          <path 
            d="M 75 50 C 25 125, 125 275, 75 350 C 25 425, 125 575, 75 650" 
            stroke="#1EAEDB" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="8,8"
            strokeDashoffset="0"
            className={`progress-path-active step-${step}`}
          />
        </svg>

        {/* Lifebuoy markers positioned along the path */}
        {steps.map((s, index) => (
          <div 
            key={s.step}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${stepPositions[index].x}px`, 
              top: `${stepPositions[index].y}px`,
            }}
          >
            <button
              onClick={() => s.step <= Math.max(step, 2) && setStep(s.step)}
              className={cn(
                "progress-dot group flex items-center justify-center",
                s.step === step && "active",
                s.step < step && "completed",
                s.step <= Math.max(step, 2) ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              )}
              disabled={s.step > Math.max(step, 2)}
              aria-label={`Go to step ${s.step}: ${s.title}`}
            >
              {s.step < step ? (
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="text-white font-medium">{s.step}</span>
              )}
              
              {/* Life buoy ring effect */}
              <div className="absolute inset-0 ring-effect"></div>
            </button>
            
            {/* Step Title */}
            <div className={cn(
              "text-sm font-medium transition-all mt-2 whitespace-nowrap",
              s.step === step ? "text-royal-blue font-semibold scale-105" : "text-gray-500",
              s.step < step && "text-gray-400"
            )}>
              {s.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
