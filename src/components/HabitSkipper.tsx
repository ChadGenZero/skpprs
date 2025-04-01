
import React, { useState } from 'react';
import { useAppContext, Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import HabitCard from '@/components/HabitCard';

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
  
  // Track habits being processed to prevent simultaneous skip operations
  const [processingHabits, setProcessingHabits] = useState<Set<string>>(new Set());
  
  const handleSkipHabit = (habitId: string) => {
    // Prevent duplicate skip operations
    if (processingHabits.has(habitId)) return;
    
    const habit = selectedHabits.find(h => h.id === habitId);
    
    if (habit) {
      const progress = getSkipGoalProgress(habit);
      const canSkip = canSkipToday(habit);
      
      // Skip if possible
      if (canSkip && !habit.isForfeited) {
        setProcessingHabits(prev => new Set(prev).add(habitId));
        
        skipHabit(habitId);
        toast.success('Habit skipped!', {
          description: `Great job! You saved ${formatCurrency(habit.expense)}.`,
        });
        
        // Remove from processing after animation has time to complete
        setTimeout(() => {
          setProcessingHabits(prev => {
            const updated = new Set(prev);
            updated.delete(habitId);
            return updated;
          });
        }, 1000);
      } else if (habit.isForfeited) {
        toast.error('This habit has been forfeited for this week');
      } else {
        toast.info('You can\'t skip this habit again today');
      }
    }
  };

  const handleUndoSkip = (habitId: string) => {
    // Prevent duplicate undo operations
    if (processingHabits.has(habitId)) return;
    
    const habit = selectedHabits.find(h => h.id === habitId);
    
    if (habit) {
      const todaySkips = habit.skippedDays.filter(skip => isToday(skip.date));
      
      if (todaySkips.length > 0) {
        setProcessingHabits(prev => new Set(prev).add(habitId));
        
        const skipIndex = habit.skippedDays.findIndex(
          skip => isToday(skip.date)
        );
        
        if (skipIndex !== -1) {
          unskipLog(habitId, skipIndex);
          toast.success('Skip undone!', {
            description: `You've undone your last skip of ${habit.name}.`,
          });
          
          // Remove from processing after animation has time to complete
          setTimeout(() => {
            setProcessingHabits(prev => {
              const updated = new Set(prev);
              updated.delete(habitId);
              return updated;
            });
          }, 1000);
        }
      } else {
        toast.info('No skips today to undo');
      }
    }
  };

  const handleSuperSkip = () => {
    const skippableHabits = selectedHabits.filter(habit => 
      canSkipToday(habit) && !habit.isForfeited
    );
    
    if (skippableHabits.length === 0) {
      toast.info('No habits available to skip right now.');
      return;
    }
    
    // Mark all habits as processing
    const processingIds = new Set(skippableHabits.map(h => h.id));
    setProcessingHabits(processingIds);
    
    superSkip();
    
    toast.success(`Super Skip activated!`, {
      description: `${skippableHabits.length} habits have been skipped.`,
    });
    
    // Clear processing state after animation completes
    setTimeout(() => {
      setProcessingHabits(new Set());
    }, 1000);
  };

  // Function to determine if card should show skipped state
  const shouldShowSkipped = (habit: Habit) => {
    const todaySkips = habit.skippedDays.filter(skip => isToday(skip.date));
    return todaySkips.length > 0;
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
          <div className="flex items-center gap-2 bg-blue-50 text-royal-blue-light rounded-lg px-4 py-2">
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
            <span>Achieve Goals</span>
            <ArrowRightIcon className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HabitSkipper;
