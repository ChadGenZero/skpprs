
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
      <div className="flex flex-col gap-1 items-center max-w-md mx-auto">
        {steps.map((s, index) => (
          <React.Fragment key={s.step}>
            {/* Step Dot */}
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
              {s.step < step && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Step Title */}
            <div className={cn(
              "text-sm font-medium transition-all mb-1",
              s.step === step ? "text-bitcoin font-semibold scale-105" : "text-gray-500",
              s.step < step && "text-gray-400"
            )}>
              {s.title}
            </div>

            {/* Connection Line (except after the last item) */}
            {index < steps.length - 1 && (
              <div className={cn(
                "progress-line h-12",
                s.step < step && "active"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
