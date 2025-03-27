
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
        "relative flex flex-col justify-between rounded-3xl p-6 h-full min-h-[260px] transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg text-white",
        isSkipped ? "bg-gradient-to-br from-royal-blue to-royal-blue-dark" : "bg-orange-gradient"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="text-5xl mb-2">{habit.emoji}</div>
        <h3 className="text-xl md:text-2xl font-bold text-center break-words">{habit.name}</h3>
        <div className="text-xl md:text-2xl font-semibold mt-2">
          {progress.completed}/{progress.total} Skips
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        {isSkipped ? (
          <div className="lifebuoy-container">
            <div className="lifebuoy-outer">
              <div className="lifebuoy-inner">
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
          className="absolute top-3 right-3 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
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
