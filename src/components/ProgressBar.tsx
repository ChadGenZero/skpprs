
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

// Array of steps with their titles
const steps = [
  { step: 1, title: 'Pick Habits' },
  { step: 2, title: 'See Savings' },
  { step: 3, title: 'Grow Savings' },
  { step: 4, title: 'Log Skips' },
  { step: 5, title: 'Auto-Invest' }
];

const ProgressBar: React.FC = () => {
  const { step, setStep, selectedHabits } = useAppContext();

  // Function to handle step click, ensuring proper navigation rules
  const handleStepClick = (clickedStep: number) => {
    // Only allow clicking previous steps if we've already been there
    if (clickedStep < step) {
      setStep(clickedStep);
    }
  };

  return (
    <div className="py-6 px-4 md:px-0 progress-container">
      <div className="relative mx-auto h-[650px] w-[80px]">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-gray-200 rounded-full">
          {/* Active progress line - animated with CSS */}
          <div 
            className="absolute top-0 left-0 w-full rounded-full bg-royal-blue transition-all duration-1000 ease-out" 
            style={{ 
              height: `${Math.max(0, Math.min(100, (step - 1) * 25))}%`
            }}
          ></div>
        </div>

        {/* Step markers */}
        {steps.map((s, index) => {
          const verticalPosition = index * (100 / (steps.length - 1));
          const isStepCompleted = s.step < step;
          const isStepCurrent = s.step === step;
          const canNavigate = s.step < step; // Only allow navigation to previous steps
          
          return (
            <div 
              key={s.step}
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
              style={{ 
                top: `${verticalPosition}%`
              }}
            >
              <button
                onClick={() => handleStepClick(s.step)}
                className={cn(
                  "progress-dot flex items-center justify-center",
                  isStepCurrent && "active",
                  isStepCompleted && "completed",
                  canNavigate ? "cursor-pointer" : "cursor-default"
                )}
                disabled={!canNavigate && !isStepCurrent}
                aria-label={`Go to step ${s.step}: ${s.title}`}
              >
                {isStepCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className="font-medium text-white">{s.step}</span>
                )}
                
                {/* Life buoy ring effect */}
                <div className="absolute inset-0 ring-effect"></div>
              </button>
              
              {/* Step Title - positioned horizontally to the right */}
              <div className={cn(
                "text-sm font-medium ml-4 whitespace-nowrap",
                isStepCurrent ? "text-royal-blue font-semibold" : "text-gray-500",
                isStepCompleted && "text-gray-400"
              )}>
                {s.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
