
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

const ProgressBar: React.FC = () => {
  const { step, setStep } = useAppContext();

  return (
    <div className="py-6 px-4 md:px-0">
      <div className="flex flex-col gap-1 items-center max-w-md mx-auto progress-s-path">
        {steps.map((s, index) => {
          // Determine position along the S-curve
          const isEven = index % 2 === 0;
          const shouldOffsetRight = index % 4 === 1 || index % 4 === 2;
          
          return (
            <React.Fragment key={s.step}>
              {/* Step Dot with S-path positioning */}
              <div className={cn(
                "flex items-center w-full",
                shouldOffsetRight ? "justify-end" : "justify-start",
                index === 0 && "justify-center" // First dot centered
              )}>
                <div className="flex flex-col items-center">
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
                    "text-sm font-medium transition-all mt-1 whitespace-nowrap",
                    s.step === step ? "text-royal-blue font-semibold scale-105" : "text-gray-500",
                    s.step < step && "text-gray-400"
                  )}>
                    {s.title}
                  </div>
                </div>
              </div>

              {/* Dashed Connection Line (except after the last item) */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "progress-line",
                  s.step < step && "active"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
