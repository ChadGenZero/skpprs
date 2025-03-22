import React, { useState } from 'react';
import { useAppContext, type DayOfWeek, type SkipLog } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon, Check, Coffee, ShoppingBag, DollarSign, Calendar, Info, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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
  skippedDays: SkipLog[];
  onToggleDay: (day: DayOfWeek) => void;
  onFractionalSkip: (day: DayOfWeek) => void;
}> = ({ habit, skippedDays, onToggleDay, onFractionalSkip }) => {
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
  
  // Calculate progress percentage - using let instead of const to allow reassignment
  let progressPercentage = (skippedDays.length / 7) * 100;
  
  // For both fractional-skip and full-skip, calculate progress towards weekly goal
  let progressText = `${skippedDays.length}/7 days`;
  let savingsProgressText = '';
  
  if ((habit.savingsModel === 'fractional-skip' || habit.savingsModel === 'full-skip') && habit.weeklySavingsGoal) {
    const totalSaved = skippedDays.reduce((sum, skip) => sum + (skip.amountSaved || 0), 0);
    const goalPercentage = (totalSaved / habit.weeklySavingsGoal) * 100;
    progressPercentage = Math.min(100, goalPercentage);
    progressText = `${formatCurrency(totalSaved)} of ${formatCurrency(habit.weeklySavingsGoal)}`;
    savingsProgressText = `${Math.round(goalPercentage)}% of weekly goal`;
  }

  const { calculateHabitSavings } = useAppContext();
  const habitSavings = calculateHabitSavings(habit);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600">
            {(habit.savingsModel === 'fractional-skip' || habit.savingsModel === 'full-skip') ? 'Weekly savings progress' : 'Weekly progress'}
          </span>
          {habit.savingsModel === 'fractional-skip' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-400 hover:text-royal-blue cursor-help ml-1" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Fractional Skip: Track partial savings when you reduce your spending on this habit.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {habit.savingsModel === 'full-skip' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-400 hover:text-royal-blue cursor-help ml-1" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Full Skip: You save the full amount each time you completely skip this habit.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="text-xs text-gray-500">{progressText}</span>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className="h-2 mb-3"
      />
      
      {savingsProgressText && (
        <div className="text-xs text-gray-500 mb-2 text-right">{savingsProgressText}</div>
      )}
      
      <div className="flex justify-between gap-1">
        {days.map(({ day, label }) => {
          const skippedLog = skippedDays.find(skip => skip.day === day);
          const isSkipped = !!skippedLog;
          const isToday = day === currentDay;
          
          return (
            <button
              key={day}
              onClick={() => {
                if (habit.savingsModel === 'fractional-skip' || habit.savingsModel === 'full-skip') {
                  onFractionalSkip(day);
                } else {
                  onToggleDay(day);
                }
              }}
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
      
      {(habit.savingsModel === 'fractional-skip' || habit.savingsModel === 'full-skip') && (
        <div className="text-sm mt-3 text-gray-600">
          <div className="flex flex-wrap gap-1 mt-1">
            {skippedDays.map((skip, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {skip.day.toUpperCase()}: {formatCurrency(skip.amountSaved || 0)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm mt-2 font-medium">
        <span>Current savings: </span>
        <span className="text-green-600">
          {formatCurrency(habitSavings)}
        </span>
      </div>
    </div>
  );
};

const FractionalSkipDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: any;
  day: DayOfWeek;
  onSubmit: (amount: number) => void;
}> = ({ open, onOpenChange, habit, day, onSubmit }) => {
  const [spentAmount, setSpentAmount] = useState('');
  const typicalSpend = habit.expense;
  const isFullSkip = habit.savingsModel === 'full-skip';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let amountSaved = 0;
    
    if (isFullSkip) {
      // For full skip, if they spent nothing, they saved the full amount
      // If they spent something, calculate the savings
      const spent = parseFloat(spentAmount);
      if (isNaN(spent)) {
        // Treat as complete skip (spent nothing)
        amountSaved = typicalSpend;
      } else {
        // Saved the difference between typical spend and actual spend
        amountSaved = Math.max(0, typicalSpend - spent);
      }
    } else {
      // For fractional skip, calculate how much was saved based on what they spent
      const spent = parseFloat(spentAmount);
      if (isNaN(spent) || spent < 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      amountSaved = Math.max(0, typicalSpend - spent);
    }
    
    onSubmit(amountSaved);
    onOpenChange(false);
    setSpentAmount('');
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Log {isFullSkip ? 'Full' : 'Partial'} Skip</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="spent-amount">How much did you spend?</Label>
          <p className="text-sm text-gray-500 mb-2">
            Enter how much you spent on {habit.name} today
            {isFullSkip ? ' (leave empty if you skipped completely)' : ''}
          </p>
          <Input
            id="spent-amount"
            type="number"
            min="0"
            step="0.01"
            value={spentAmount}
            onChange={(e) => setSpentAmount(e.target.value)}
            placeholder={`0.00`}
            className="text-gray-900 placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your typical spend: {formatCurrency(habit.expense)}
          </p>
        </div>
        
        <DialogFooter>
          <Button type="submit" className="w-full bg-bitcoin hover:bg-bitcoin/90">
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

const SkipCard: React.FC<{ 
  habit: any;
  skippedDays: SkipLog[];
  onToggleDay: (day: DayOfWeek) => void;
  onFractionalSkip: (day: DayOfWeek, amount: number) => void;
}> = ({ habit, skippedDays, onToggleDay, onFractionalSkip }) => {
  const [fractionalSkipDialogOpen, setFractionalSkipDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('mon');

  // Function to determine which icon to show based on habit name
  const getHabitIcon = (habitName: string) => {
    if (habitName.toLowerCase().includes('coffee')) return <Coffee size={24} />;
    if (habitName.toLowerCase().includes('shopping')) return <ShoppingBag size={24} />;
    return <DollarSign size={24} />;
  };

  const handleFractionalSkipDay = (day: DayOfWeek) => {
    setSelectedDay(day);
    setFractionalSkipDialogOpen(true);
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
              habit.savingsModel === 'fractional-skip'
                ? "bg-blue-100 text-blue-700" 
                : "bg-green-100 text-green-700"
            )}>
              {habit.savingsModel === 'fractional-skip' ? 'Fractional Skip' : 'Full Skip'}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {habit.savingsModel === 'fractional-skip' 
              ? `Goal: Save ${formatCurrency(habit.weeklySavingsGoal || 0)} weekly`
              : `Goal: Save ${formatCurrency(habit.weeklySavingsGoal || 0)} weekly`}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Skipped {habit.skipped} times</p>
          <p className="font-medium text-royal-blue">
            {habit.savingsModel === 'fractional-skip'
              ? `${formatCurrency(habit.skippedDays.reduce((sum, skip) => sum + (skip.amountSaved || 0), 0))} total saved`
              : `${formatCurrency(habit.skippedDays.reduce((sum, skip) => sum + (skip.amountSaved || 0), 0))} total saved`}
          </p>
        </div>
      </div>
      
      <WeeklyTracker 
        habit={habit} 
        skippedDays={skippedDays}
        onToggleDay={onToggleDay}
        onFractionalSkip={handleFractionalSkipDay}
      />

      <Dialog open={fractionalSkipDialogOpen} onOpenChange={setFractionalSkipDialogOpen}>
        <FractionalSkipDialog
          open={fractionalSkipDialogOpen}
          onOpenChange={setFractionalSkipDialogOpen}
          habit={habit}
          day={selectedDay}
          onSubmit={(amount) => onFractionalSkip(selectedDay, amount)}
        />
      </Dialog>
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
    const isAlreadySkipped = skippedDays.some(skip => skip.day === day);
    
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

  const handleFractionalSkip = (habitId: string, day: DayOfWeek, amount: number) => {
    skipHabitOnDay(habitId, day, amount);
    toast.success('Partial savings logged!', {
      description: `You saved ${formatCurrency(amount)} by reducing this expense.`,
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
            Track your skipped habits and watch your savings grow. Mark when you skip a habit or log partial savings.
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
              onFractionalSkip={(day, amount) => handleFractionalSkip(habit.id, day, amount)}
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
