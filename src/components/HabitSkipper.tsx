import React, { useState } from 'react';
import { useAppContext, type SkipLog, type Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, Check, Calendar, Info, AlertCircle, BadgeCheck, Gift, Clock, XCircle, Lock, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const InfoTooltip: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info size={16} className="text-gray-400 hover:text-royal-blue cursor-help ml-1" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const HabitGridItem: React.FC<{
  habit: Habit;
  progress: { completed: number; total: number };
  onSkip: () => void;
  onUnskip: (index: number) => void;
  skips: SkipLog[];
}> = ({ habit, progress, onSkip, onUnskip, skips }) => {
  const { isToday } = useAppContext();
  const savedAmount = skips.filter(skip => !skip.isSpent).reduce((sum, skip) => sum + skip.amountSaved, 0);
  const todaySkips = skips.filter(s => isToday(s.date) && !s.isSpent);
  
  // Calculate number of checkboxes to display based on habit period and frequency
  const getCheckboxCount = () => {
    if (habit.period === 'daily') return habit.frequency;
    if (habit.period === 'weekly') return 1;
    if (habit.period === 'fortnightly') return 1;
    if (habit.period === 'monthly') return 1;
    return 1;
  };

  // Skip availability
  const checkboxes = Array(getCheckboxCount()).fill(null);
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl p-5 transition-all",
      habit.isForfeited 
        ? "bg-gray-100 opacity-60" 
        : "bg-gradient-to-br from-blue-400 to-blue-600"
    )}>
      <div className="absolute top-0 right-0 p-2">
        {habit.isForfeited && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Forfeited
          </span>
        )}
      </div>
      
      <div className="flex items-center mb-3">
        <div className="text-3xl mr-3">{habit.emoji}</div>
        <div>
          <h3 className="font-semibold text-white">{habit.name}</h3>
          <p className="text-sm text-blue-100">
            {formatCurrency(habit.expense)} per {habit.period}
          </p>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-blue-50 mb-1">
          <span>Skip goal: {progress.completed}/{progress.total}</span>
          <span>Saved: {formatCurrency(savedAmount)}</span>
        </div>
        <Progress 
          value={(progress.completed / progress.total) * 100} 
          className="h-1.5 bg-blue-300"
          indicatorClassName="bg-white"
        />
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-3">
        {/* Display day names */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-blue-100">
            {day}
          </div>
        ))}
      </div>
      
      <div className="relative grid grid-cols-7 gap-1 mb-3">
        {/* Skip tracking grid */}
        {Array(7).fill(null).map((_, dayIndex) => {
          const date = new Date();
          date.setDate(date.getDate() - date.getDay() + 1 + dayIndex); // Monday-based
          
          const dateStr = date.toISOString().split('T')[0];
          const daySkips = skips.filter(s => s.date.startsWith(dateStr) && !s.isSpent);
          const hasSkip = daySkips.length > 0;
          
          // Determine if this day's checkbox should be active
          const isActive = checkboxes.length > daySkips.length && 
                          (habit.period === 'daily' || 
                          (habit.period === 'weekly' && daySkips.length < 1));
          
          const isToday = new Date().getDay() === (dayIndex + 1) % 7;
          
          return (
            <div 
              key={dayIndex} 
              className={cn(
                "relative flex items-center justify-center h-10 rounded",
                isToday ? "bg-blue-300/20" : "bg-blue-700/20",
                habit.isForfeited && "opacity-50"
              )}
            >
              {hasSkip ? (
                // Life ring/lifebouy effect for saved amounts
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-white animate-spin-slow opacity-60"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-blue-700 font-semibold text-xs">
                    {formatCurrency(daySkips.reduce((sum, s) => sum + s.amountSaved, 0))}
                  </div>
                  <button
                    onClick={() => daySkips.forEach((_, i) => onUnskip(skips.findIndex(s => s.date.startsWith(dateStr))))}
                    className="absolute -top-1 -right-1 bg-white rounded-full shadow-sm p-0.5"
                  >
                    <XCircle size={12} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isActive && !habit.isForfeited ? (
                    <Checkbox 
                      id={`skip-${habit.id}-${dayIndex}`}
                      className="bg-white/80 data-[state=checked]:bg-green-500"
                      onCheckedChange={() => onSkip()}
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-sm border border-white/30 flex items-center justify-center">
                      {habit.isForfeited && <Lock size={10} className="text-white/50" />}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-xs text-blue-50">
        <span>Potential: {formatCurrency(habit.weeklyTotalPotential)}</span>
        <span className="font-medium">
          {progress.completed >= progress.total ? (
            <span className="flex items-center text-green-100">
              <BadgeCheck size={12} className="mr-1" /> Goal reached!
            </span>
          ) : (
            <span>{progress.total - progress.completed} more to goal</span>
          )}
        </span>
      </div>
    </div>
  );
};

const ConfirmSkipDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit;
  isBonus: boolean;
  onConfirm: (skip: boolean, spend: boolean) => void;
}> = ({ open, onOpenChange, habit, isBonus, onConfirm }) => {
  const handleSkip = () => {
    onConfirm(true, false);
    onOpenChange(false);
    toast.success('Habit skipped!', {
      description: `Great job! You saved ${formatCurrency(habit.expense)}. Check back tomorrow to skip again.`,
    });
  };
  
  const handleSpend = () => {
    onConfirm(false, true);
    onOpenChange(false);
    toast.info('Habit spent', {
      description: `You've decided to spend on this habit.`,
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {isBonus ? "Log Bonus Skip" : "Log Skip"}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-2">
        <div className="p-4 rounded-md bg-green-50 flex items-center gap-3">
          <div className="text-3xl">{habit.emoji}</div>
          <div>
            <div className="font-medium">{habit.name}</div>
            <div className="text-sm text-gray-600">
              Expense: {formatCurrency(habit.expense)} per occurrence
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between text-sm">
            <span>Amount you'll save:</span>
            <span className="font-medium text-green-600">{formatCurrency(habit.expense)}</span>
          </div>
        </div>
        
        {isBonus && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-md text-amber-700">
            <Gift size={16} />
            <div className="text-sm font-medium">This is a bonus skip - great job!</div>
          </div>
        )}
        
        <DialogFooter className="gap-2 flex">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white flex-1"
            onClick={handleSpend}
          >
            Spend
          </Button>
          <Button 
            type="button" 
            className="bg-green-500 hover:bg-green-600 text-white flex-1"
            onClick={handleSkip}
          >
            Skip
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

const SuperSkipDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eligibleHabits: Habit[];
  onConfirm: () => void;
}> = ({ open, onOpenChange, eligibleHabits, onConfirm }) => {
  const totalSavings = eligibleHabits.reduce((sum, habit) => sum + habit.expense, 0);
  
  return (
    <AlertDialogContent className="sm:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Super Skip All Eligible Habits
        </AlertDialogTitle>
        <AlertDialogDescription>
          You're about to skip {eligibleHabits.length} eligible habit{eligibleHabits.length !== 1 ? 's' : ''} for today and save {formatCurrency(totalSavings)}.
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <div className="max-h-48 overflow-y-auto my-4">
        {eligibleHabits.map((habit) => (
          <div key={habit.id} className="p-3 mb-2 rounded-md bg-green-50 flex items-center gap-3">
            <div className="text-xl">{habit.emoji}</div>
            <div>
              <div className="font-medium">{habit.name}</div>
              <div className="text-sm text-gray-600">
                Save: {formatCurrency(habit.expense)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <AlertDialogFooter>
        <AlertDialogCancel className="border border-gray-300">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction 
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={(e) => {
            e.preventDefault();
            onConfirm();
            onOpenChange(false);
          }}
        >
          Confirm Super Skip
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const HabitSkipper: React.FC = () => {
  const { 
    selectedHabits, 
    skipHabit,
    unskipLog,
    forfeitHabit,
    markHabitAsSpent,
    totalSavings, 
    weeklySkipSavings,
    setStep,
    getCurrentWeekSkips,
    getSkipGoalProgress,
    getMaxBonusSkips,
    superSkip,
    isToday
  } = useAppContext();
  
  const [superSkipDialogOpen, setSuperSkipDialogOpen] = useState(false);
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  const handleLogSkip = (habitId: string, shouldSkip: boolean) => {
    if (shouldSkip) {
      skipHabit(habitId);
      
      const habit = selectedHabits.find(h => h.id === habitId);
      if (habit) {
        toast.success('Habit skipped!', {
          description: `Great job! You saved ${formatCurrency(habit.expense)}. Check back tomorrow to skip again.`,
        });
      }
    } else {
      toast.info('Habit spent', {
        description: 'You chose to spend on this habit.',
      });
    }
  };

  const handleUnskipLog = (habitId: string, index: number) => {
    unskipLog(habitId, index);
    toast.info('Skip removed', {
      description: 'You can still log this skip again today if you change your mind.',
    });
  };

  const handleSkip = (habit: Habit) => {
    setSelectedHabit(habit);
    setSkipDialogOpen(true);
  };

  const handleSuperSkip = () => {
    setSuperSkipDialogOpen(true);
  };

  const confirmSuperSkip = () => {
    superSkip();
    
    toast.success('Super Skip activated!', {
      description: 'All eligible habits have been skipped for today.',
    });
  };

  const eligibleHabitsForSuperSkip = selectedHabits.filter(habit => {
    if (habit.period === 'daily') {
      const todaySkips = getCurrentWeekSkips(habit.id).filter(skip => isToday(skip.date) && !skip.isSpent).length;
      return !habit.isForfeited && todaySkips < habit.frequency;
    }
    if (habit.period === 'weekly') {
      const todaySkips = getCurrentWeekSkips(habit.id).filter(skip => isToday(skip.date) && !skip.isSpent).length;
      return !habit.isForfeited && todaySkips < 1;
    }
    return false;
  });

  const canSuperSkip = eligibleHabitsForSuperSkip.length > 0;

  return (
    <div className="animate-scale-in">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-medium mb-3">
            Step 4
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skip & Save</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Track your skipped habits and watch your savings grow. Each day represents a skip opportunity.
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
        
        <div className="flex items-center justify-between mb-5">
          <div className="glass-card p-4 flex-1 mr-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-royal-blue/10 text-royal-blue flex items-center justify-center">
                <Calendar size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold">This Week</div>
                <div className="text-xl font-bold">{formatCurrency(weeklySkipSavings)}</div>
              </div>
            </div>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className={cn(
                  "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-4 h-auto",
                  !canSuperSkip && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleSuperSkip}
                disabled={!canSuperSkip}
              >
                <Gift size={18} className="mr-2" />
                <span className="font-semibold">Super Skip</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="max-w-xs">Skip all eligible habits for today with one click!</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-md">
          <Clock size={16} />
          <div className="text-sm">
            <span className="font-medium">Tip:</span> Check in daily to maximize your savings potential
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {selectedHabits.map((habit) => (
            <HabitGridItem 
              key={habit.id}
              habit={habit}
              skips={getCurrentWeekSkips(habit.id)}
              progress={getSkipGoalProgress(habit)}
              onSkip={() => handleSkip(habit)}
              onUnskip={(index) => handleUnskipLog(habit.id, index)}
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
      
      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        {selectedHabit && (
          <ConfirmSkipDialog
            open={skipDialogOpen}
            onOpenChange={setSkipDialogOpen}
            habit={selectedHabit}
            isBonus={getSkipGoalProgress(selectedHabit).completed >= selectedHabit.skipGoal}
            onConfirm={(skip, spend) => {
              if (skip) {
                handleLogSkip(selectedHabit.id, true);
              } else if (spend) {
                markHabitAsSpent(selectedHabit.id);
              }
            }}
          />
        )}
      </Dialog>
      
      <AlertDialog open={superSkipDialogOpen} onOpenChange={setSuperSkipDialogOpen}>
        <SuperSkipDialog 
          open={superSkipDialogOpen}
          onOpenChange={setSuperSkipDialogOpen}
          eligibleHabits={eligibleHabitsForSuperSkip}
          onConfirm={confirmSuperSkip}
        />
      </AlertDialog>
    </div>
  );
};

export default HabitSkipper;
