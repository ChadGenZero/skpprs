
import React from 'react';
import { useAppContext, type Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, Undo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

interface HabitCardProps {
  habit: Habit;
  onClick: () => void;
  onUndo: () => void;
  progress: { completed: number; total: number };
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onClick, onUndo, progress }) => {
  const isSkipped = progress.completed > 0;
  
  return (
    <div 
      className={cn(
        "relative flex flex-col justify-between rounded-3xl p-6 h-full min-h-[260px] transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg overflow-hidden",
        isSkipped ? "text-white" : "text-gray-800"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Sand part */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 bg-gradient-to-b from-amber-200 via-amber-100 to-orange-200 transition-all duration-500 ease-in-out",
            isSkipped ? "h-0" : "h-1/2"
          )}
        >
          <div className="absolute inset-0">
            {/* Sand texture */}
            <div 
              className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '150px'
              }}
            ></div>
            
            {/* Sand particles */}
            <div className="absolute inset-0 bg-[radial-gradient(#d2a57c_1.5px,transparent_1.5px)] bg-[length:12px_12px]"></div>
          </div>
        </div>
        
        {/* Wavy divider between sand and water */}
        <div 
          className={cn(
            "absolute left-0 right-0 h-12 transition-all duration-500 ease-in-out z-10",
            isSkipped ? "-top-12" : "top-[calc(50%-12px)]"
          )}
        >
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" 
               className="absolute bottom-0 left-0 w-full h-12 text-[#33C3F0]">
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              fill="currentColor" fillOpacity=".8"
            ></path>
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              fill="currentColor" fillOpacity=".5"
            ></path>
          </svg>
        </div>
        
        {/* Water part */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-br from-[#33C3F0] to-[#0067A0] transition-all duration-500 ease-in-out",
            isSkipped ? "h-full" : "h-1/2"
          )}
        >
          <div className="absolute inset-0">
            {/* Water texture pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:8px_8px]"></div>
            </div>
            
            {/* Water shine/reflection */}
            <div 
              className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/20 to-transparent"
              style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 70%)' 
              }}
            ></div>
            
            {/* Small subtle waves */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <div 
                className="absolute top-1/4 left-0 right-0 h-1 bg-sky-100 rounded-full transform -rotate-1"
                style={{animation: 'ocean-wave 7s ease-in-out infinite alternate'}}
              ></div>
              <div 
                className="absolute top-2/4 left-0 right-0 h-1 bg-sky-100 rounded-full transform rotate-1"
                style={{animation: 'ocean-wave 5s ease-in-out infinite alternate-reverse'}}
              ></div>
              <div 
                className="absolute top-3/4 left-0 right-0 h-px bg-sky-100 rounded-full"
                style={{animation: 'ocean-wave 8s ease-in-out infinite alternate'}}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-5xl mb-2">{habit.emoji}</div>
        <h3 className="text-xl md:text-2xl font-bold text-center break-words">{habit.name}</h3>
        <div className="text-xl md:text-2xl font-semibold mt-2">
          {progress.completed}/{progress.total} Skips
        </div>
      </div>
      
      <div className="relative z-10 flex justify-center mt-4">
        {isSkipped ? (
          <div className="lifebuoy-container">
            <div className="lifebuoy-outer">
              <div className="lifebuoy-ring"></div>
              <div className="lifebuoy-center">
                {formatCurrency(habit.expense)}
              </div>
              <div className="lifebuoy-detail"></div>
              <div className="lifebuoy-shine"></div>
              <div className="lifebuoy-lines"></div>
            </div>
          </div>
        ) : (
          <div className="text-xl font-semibold">
            Skip & Save {formatCurrency(habit.expense)}
          </div>
        )}
      </div>
      
      {isSkipped && (
        <button 
          className="absolute top-3 right-3 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-20"
          onClick={(e) => {
            e.stopPropagation();
            onUndo();
          }}
        >
          <Undo size={18} />
        </button>
      )}
    </div>
  );
};

const HabitSkipper: React.FC = () => {
  const { 
    selectedHabits, 
    skipHabit,
    totalSavings, 
    weeklySkipSavings,
    setStep,
    getSkipGoalProgress,
    superSkip,
    isToday,
    canSkipToday,
    getCurrentWeekSkips,
    unskipLog
  } = useAppContext();
  
  const handleSkipHabit = (habitId: string) => {
    const habit = selectedHabits.find(h => h.id === habitId);
    
    if (habit) {
      const progress = getSkipGoalProgress(habit);
      const canSkip = canSkipToday(habit);
      
      if (canSkip && !habit.isForfeited) {
        skipHabit(habitId);
        toast.success('Habit skipped!', {
          description: `Great job! You saved ${formatCurrency(habit.expense)}.`,
        });
      } else if (habit.isForfeited) {
        toast.error('This habit has been forfeited for this week');
      } else {
        toast.info('You can\'t skip this habit again today');
      }
    }
  };

  const handleUndoSkip = (habitId: string) => {
    const habit = selectedHabits.find(h => h.id === habitId);
    
    if (habit) {
      const todaySkips = habit.skippedDays.filter(skip => isToday(skip.date));
      
      if (todaySkips.length > 0) {
        const skipIndex = habit.skippedDays.findIndex(
          skip => isToday(skip.date)
        );
        
        if (skipIndex !== -1) {
          unskipLog(habitId, skipIndex);
          toast.success('Skip undone!', {
            description: `You've undone your last skip of ${habit.name}.`,
          });
        }
      } else {
        toast.info('No skips today to undo');
      }
    }
  };

  const handleSuperSkip = () => {
    let skipCount = 0;
    
    selectedHabits.forEach(habit => {
      if (canSkipToday(habit) && !habit.isForfeited) {
        skipHabit(habit.id);
        skipCount++;
      }
    });
    
    if (skipCount > 0) {
      toast.success(`Super Skip activated!`, {
        description: `${skipCount} habits have been skipped.`,
      });
    } else {
      toast.info('No habits available to skip right now.');
    }
  };

  return (
    <div className="animate-scale-in">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-medium mb-3">
            Step 4
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skip & Save</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Track your skipped habits and watch your savings grow.
          </p>
        </div>
        
        <div className="glass-card p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Savings</h2>
          <div className="text-4xl font-bold text-royal-blue animate-pulse-subtle">
            {formatCurrency(totalSavings)}
          </div>
          <p className="text-gray-500 mt-2">
            Keep skipping to increase your savings!
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 rounded-lg px-4 py-2">
            <span className="font-semibold">This Week:</span>
            <span className="text-xl font-bold">{formatCurrency(weeklySkipSavings)}</span>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            onClick={handleSuperSkip}
          >
            Super Skip All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 auto-rows-fr">
          {selectedHabits.map((habit) => (
            <HabitCard 
              key={habit.id}
              habit={habit}
              onClick={() => handleSkipHabit(habit.id)}
              onUndo={() => handleUndoSkip(habit.id)}
              progress={getSkipGoalProgress(habit)}
            />
          ))}
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            className="px-4 py-2"
            onClick={() => setStep(3)}
          >
            <ArrowLeftIcon className="mr-2" size={16} />
            <span>Back</span>
          </Button>
          
          <Button 
            className="bg-royal-blue hover:bg-royal-blue/90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            onClick={() => setStep(5)}
          >
            <span>Setup Auto-Invest</span>
            <ArrowRightIcon className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HabitSkipper;
