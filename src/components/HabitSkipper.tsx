
import React, { useState } from 'react';
import { useAppContext, type DayOfWeek } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon, Check, Coffee, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
  habitId: string;
  skippedDays: DayOfWeek[];
  onSkipDay: (day: DayOfWeek) => void;
}> = ({ habitId, skippedDays, onSkipDay }) => {
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
  const currentDay: DayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][currentDayIndex];
  
  // Calculate progress percentage
  const progressPercentage = (skippedDays.length / 7) * 100;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">Weekly progress</span>
        <span className="text-xs text-gray-500">{skippedDays.length}/7 days</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-3" />
      
      <div className="flex justify-between gap-1">
        {days.map(({ day, label }) => {
          const isSkipped = skippedDays.includes(day);
          const isToday = day === currentDay;
          
          return (
            <button
              key={day}
              onClick={() => onSkipDay(day)}
              disabled={isSkipped}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-all",
                isSkipped 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                isToday && !isSkipped && "ring-2 ring-bitcoin ring-offset-1"
              )}
            >
              {isSkipped ? <Check size={14} /> : label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SkipCard: React.FC<{ 
  habit: any;
  skippedDays: DayOfWeek[];
  onSkipDay: (day: DayOfWeek) => void;
}> = ({ habit, skippedDays, onSkipDay }) => {
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
          <h3 className="font-medium text-gray-900">{habit.name}</h3>
          <p className="text-sm text-gray-500">
            Save {formatCurrency(habit.expense)} each time
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Skipped {habit.skipped} times</p>
          <p className="font-medium text-bitcoin">{formatCurrency(habit.skipped * habit.expense)} saved</p>
        </div>
      </div>
      
      <WeeklyTracker 
        habitId={habit.id} 
        skippedDays={skippedDays}
        onSkipDay={onSkipDay}
      />
    </div>
  );
};

const HabitSkipper: React.FC = () => {
  const { 
    selectedHabits, 
    skipHabitOnDay, 
    totalSavings, 
    weeklySkipSavings,
    setStep,
    getCurrentWeekSkips 
  } = useAppContext();
  
  const handleSkipDay = (habitId: string, day: DayOfWeek) => {
    skipHabitOnDay(habitId, day);
    
    // Show a success toast
    toast.success('Habit skipped!', {
      description: 'Great job! Your savings have been updated.',
    });
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
            Track your skipped habits and watch your savings grow. Mark each day you successfully skip a habit.
          </p>
        </div>
        
        <div className="glass-card p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Savings</h2>
          <div className="text-4xl font-bold text-bitcoin animate-pulse-subtle">
            {formatCurrency(totalSavings)}
          </div>
          <p className="text-gray-500 mt-2">
            Keep skipping to increase your savings!
          </p>
        </div>
        
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-bitcoin/10 text-bitcoin flex items-center justify-center">
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
              onSkipDay={(day) => handleSkipDay(habit.id, day)}
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
            className="bg-bitcoin hover:bg-bitcoin/90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
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
