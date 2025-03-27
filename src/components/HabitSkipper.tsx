
import React from 'react';
import { useAppContext, type Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, LifeBuoy } from 'lucide-react';
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
  progress: { completed: number; total: number };
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onClick, progress }) => {
  const isSkipped = progress.completed > 0;
  
  return (
    <div 
      className={cn(
        "relative flex flex-col justify-between rounded-3xl p-6 h-64 transition-all duration-300 cursor-pointer",
        isSkipped ? "bg-blue-gradient text-white" : "bg-orange-gradient text-black",
        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="text-5xl mb-2">{habit.emoji}</div>
        <h3 className="text-2xl font-bold text-center">{habit.name}</h3>
        <div className="text-2xl font-semibold mt-2">
          {progress.completed}/{progress.total} Skips
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        {isSkipped ? (
          <div className="relative">
            <div className="animate-rotate">
              <LifeBuoy size={80} className="text-red-500" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              {formatCurrency(habit.expense)}
            </div>
          </div>
        ) : (
          <div className="text-xl font-semibold">
            Skip & Save {formatCurrency(habit.expense)}
          </div>
        )}
      </div>
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
    isToday
  } = useAppContext();
  
  const handleSkipHabit = (habitId: string) => {
    const habit = selectedHabits.find(h => h.id === habitId);
    
    if (habit) {
      // Check if the habit can be skipped today
      const progress = getSkipGoalProgress(habit);
      const canSkip = habit.period === 'daily' || 
                     (habit.period === 'weekly' && 
                      !habit.skippedDays.some(skip => isToday(skip.date) && !skip.isSpent));
      
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

  const handleSuperSkip = () => {
    superSkip();
    toast.success('Super Skip activated!', {
      description: 'All eligible daily habits have been skipped for today.',
    });
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {selectedHabits.map((habit) => (
            <HabitCard 
              key={habit.id}
              habit={habit}
              onClick={() => handleSkipHabit(habit.id)}
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
