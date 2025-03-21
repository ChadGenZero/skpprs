
import React, { useState } from 'react';
import { useAppContext, type DayOfWeek } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon, Check, Coffee, ShoppingBag, DollarSign, Calendar, Info, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
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

const WeeklyTracker: React.FC<{
  habit: any;
  skippedDays: DayOfWeek[];
  onToggleDay: (day: DayOfWeek) => void;
}> = ({ habit, skippedDays, onToggleDay }) => {
  const days: { day: DayOfWeek; label: string }[] = [
    { day: 'mon', label: 'M' },
    { day: 'tue', label: 'T' },
    { day: 'wed', label: 'W' },
    { day: 'thu', label: 'T' },
    { day: 'fri', label: 'F' },
    { day: 'sat', label: 'S' },
    { day: 'sun', label: 'S' }
  ];
  
  // Get current day of week
  const now = new Date();
  const currentDayIndex = now.getDay(); // 0 is Sunday, 6 is Saturday
  const currentDayMap: Record<number, DayOfWeek> = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat'
  };
  const currentDay: DayOfWeek = currentDayMap[currentDayIndex];
  
  // Calculate progress percentage
  const progressPercentage = (skippedDays.length / 7) * 100;

  const { calculateHabitSavings } = useAppContext();
  const habitSavings = calculateHabitSavings(habit);
  
  // For all-or-nothing model - need 7/7 days to get savings
  const isAllOrNothing = habit.savingsModel === 'all-or-nothing';
  const missedAnyDay = skippedDays.length < 7 && isAllOrNothing;
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600">Weekly progress</span>
          {isAllOrNothing && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-400 hover:text-royal-blue cursor-help ml-1" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>All-or-Nothing goal: You must skip all 7 days to save the full amount.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="text-xs text-gray-500">{skippedDays.length}/7 days</span>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className={cn(
          "h-2 mb-3",
          isAllOrNothing && skippedDays.length < 7 ? "bg-gray-200" : undefined
        )} 
      />
      
      <div className="flex justify-between gap-1">
        {days.map(({ day, label }) => {
          const isSkipped = skippedDays.includes(day);
          const isToday = day === currentDay;
          
          return (
            <button
              key={day}
              onClick={() => onToggleDay(day)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-all",
                isSkipped 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                isToday && !isSkipped && "ring-2 ring-bitcoin ring-offset-1"
              )}
            >
              {isSkipped ? <Check size={14} /> : label}
            </button>
          );
        })}
      </div>
      
      {isAllOrNothing && (
        <div className={cn(
          "text-sm mt-2 flex items-center",
          missedAnyDay ? "text-orange-500" : "text-green-600"
        )}>
          {missedAnyDay ? (
            <>
              <AlertTriangle size={14} className="mr-1" />
              <span>Must complete all 7 days to save {formatCurrency(habit.expense * habit.frequency)}</span>
            </>
          ) : (
            <>
              <Check size={14} className="mr-1" />
              <span>Saved {formatCurrency(habit.expense * habit.frequency)} this week!</span>
            </>
          )}
        </div>
      )}

      <div className="text-sm mt-2 font-medium">
        <span>Current savings: </span>
        <span className={cn(
          isAllOrNothing && missedAnyDay ? "text-orange-500" : "text-green-600"
        )}>
          {formatCurrency(habitSavings)}
        </span>
      </div>
    </div>
  );
};

const SkipCard: React.FC<{ 
  habit: any;
  skippedDays: DayOfWeek[];
  onToggleDay: (day: DayOfWeek) => void;
}> = ({ habit, skippedDays, onToggleDay }) => {
  // Function to determine which icon to show based on habit name
  const getHabitIcon = (habitName: string) => {
    if (habitName.toLowerCase().includes('coffee')) return <Coffee size={24} />;
    if (habitName.toLowerCase().includes('shopping')) return <ShoppingBag size={24} />;
    return <DollarSign size={24} />;
  };

  return (
    <div className="relative overflow-hidden p-5 rounded-xl border bg-white/90 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          {getHabitIcon(habit.name)}
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900">{habit.name}</h3>
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs",
              habit.savingsModel === 'fractional' 
                ? "bg-blue-100 text-blue-700" 
                : "bg-purple-100 text-purple-700"
            )}>
              {habit.savingsModel === 'fractional' ? 'Fractional' : 'All-or-Nothing'}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Save {formatCurrency(habit.expense)} each time
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Skipped {habit.skipped} times</p>
          <p className="font-medium text-royal-blue">{formatCurrency(habit.skipped * habit.expense)} total saved</p>
        </div>
      </div>
      
      <WeeklyTracker 
        habit={habit} 
        skippedDays={skippedDays}
        onToggleDay={onToggleDay}
      />
    </div>
  );
};

const HabitSkipper: React.FC = () => {
  const { 
    selectedHabits, 
    skipHabitOnDay,
    unskipHabitOnDay,
    totalSavings, 
    weeklySkipSavings,
    setStep,
    getCurrentWeekSkips 
  } = useAppContext();
  
  const handleToggleDay = (habitId: string, day: DayOfWeek) => {
    const skippedDays = getCurrentWeekSkips(habitId);
    const isAlreadySkipped = skippedDays.includes(day);
    
    if (isAlreadySkipped) {
      // Untick (remove) the skipped day
      unskipHabitOnDay(habitId, day);
      toast.success('Skipped day removed', {
        description: 'Your habit tracking has been updated.',
      });
    } else {
      // Add the skipped day
      skipHabitOnDay(habitId, day);
      toast.success('Habit skipped!', {
        description: 'Great job! Your savings have been updated.',
      });
    }
  };

  return (
    <div className="animate-scale-in">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-medium mb-3">
            Step 4
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skip & Save</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Track your skipped habits and watch your savings grow. Mark or unmark days you skip a habit.
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
        
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-royal-blue/10 text-royal-blue flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">This Week's Savings</h2>
              <p className="text-sm text-gray-500">Based on your skipped habits</p>
            </div>
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(weeklySkipSavings)}
          </div>
        </div>
        
        <div className="grid gap-4 mb-8">
          {selectedHabits.map((habit) => (
            <SkipCard 
              key={habit.id}
              habit={habit}
              skippedDays={getCurrentWeekSkips(habit.id)}
              onToggleDay={(day) => handleToggleDay(habit.id, day)}
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
