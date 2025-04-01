
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
    // Always allow clicking on step 1
    if (clickedStep === 1) {
      setStep(1);
      return;
    }
    
    // For step 2 and beyond, only allow if user has selected habits or already reached a later step
    if (clickedStep === 2 && (selectedHabits.length > 0 || step > 2)) {
      setStep(2);
      return;
    }
    
    // For other steps, only allow navigation to steps we've already reached
    if (clickedStep <= Math.max(step, 2)) {
      setStep(clickedStep);
    }
  };

  return (
    <div className="py-6 px-4 md:px-0 progress-container">
      <div className="relative mx-auto h-[650px] w-full max-w-[300px]">
        {/* Vertical line */}
        <div className="absolute left-10 top-0 h-full w-[3px] -translate-x-1/2 bg-gray-200 rounded-full">
          {/* Active progress line - animated with CSS */}
          <div 
            className={`absolute top-0 left-0 w-full rounded-full bg-royal-blue transition-all duration-1000 ease-out`} 
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
          const canNavigate = s.step === 1 || 
                             (s.step === 2 && selectedHabits.length > 0) || 
                             (s.step <= Math.max(step, 2));
          
          return (
            <div 
              key={s.step}
              className="absolute flex items-center"
              style={{ 
                top: `${verticalPosition}%`,
                left: "10px",
                transform: "translateX(-50%)"
              }}
            >
              <button
                onClick={() => handleStepClick(s.step)}
                className={cn(
                  "progress-dot group flex items-center justify-center",
                  isStepCurrent && "active",
                  isStepCompleted && "completed",
                  canNavigate ? "cursor-pointer" : "cursor-not-allowed"
                )}
                disabled={!canNavigate}
                aria-label={`Go to step ${s.step}: ${s.title}`}
              >
                {isStepCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={cn(
                    "font-medium",
                    isStepCurrent ? "text-white" : "text-white"
                  )}>{s.step}</span>
                )}
                
                {/* Life buoy ring effect */}
                <div className="absolute inset-0 ring-effect"></div>
              </button>
              
              {/* Step Title - now positioned to the right of the bubble */}
              <div className={cn(
                "text-sm font-medium ml-6 whitespace-nowrap transition-all",
                isStepCurrent ? "text-royal-blue font-semibold scale-105" : "text-gray-500",
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
