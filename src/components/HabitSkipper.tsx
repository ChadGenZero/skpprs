import React, { useState } from 'react';
import { useAppContext, type SkipLog, type Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, Check, Calendar, Info, AlertCircle, BadgeCheck, Gift, Clock, XCircle, Lock, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={16} className="text-gray-400 hover:text-royal-blue cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const SkipBoxes: React.FC<{
  habit: Habit;
  progress: { completed: number; total: number };
  maxBonusSkips: number;
  onSkip: () => void;
  onUnskip: (index: number) => void;
  skips: SkipLog[];
}> = ({ habit, progress, maxBonusSkips, onSkip, onUnskip, skips }) => {
  const { isToday, getDaysTillNextSkip } = useAppContext();
  
  const totalPossibleSkips = progress.total + maxBonusSkips;
  const skipBoxes = Array(totalPossibleSkips).fill(null);
  const progressPercentage = (progress.completed / progress.total) * 100;
  const progressText = `${progress.completed}/${progress.total} skips`;
  const savedAmount = skips.filter(skip => !skip.isSpent).reduce((sum, skip) => sum + skip.amountSaved, 0);

  const isLongerThanWeeklyPeriod = ['fortnightly', 'monthly', 'quarterly', 'yearly'].includes(habit.period);
  const daysTillNextSkip = getDaysTillNextSkip(habit);

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-700">
            Skip Progress
          </span>
          <InfoTooltip content="Your progress toward your weekly skip goal" />
        </div>
        <span className="text-xs font-medium text-gray-500">{progressText}</span>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className="h-2 mb-3 bg-orange-100"
        indicatorClassName="bg-orange-500"
      />
      
      <div className="flex items-center mb-3 justify-between">
        <span className="text-sm font-medium text-green-600">
          Saved: {formatCurrency(savedAmount)}
        </span>
        
        {progress.completed >= progress.total && maxBonusSkips > 0 && (
          <div className="flex items-center">
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
              <Gift size={12} /> Bonus skips available!
            </span>
          </div>
        )}
      </div>

      {isLongerThanWeeklyPeriod && (
        <div className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-xs mb-3 flex items-center">
          <Info size={14} className="mr-1" />
          <span>Habits with periods longer than a week can only be skipped at the end of the week</span>
        </div>
      )}
      
      {habit.period === 'fortnightly' && (
        <div className="px-3 py-2 bg-amber-50 text-amber-600 rounded-md text-xs mb-3">
          <span className="block mb-1">Skips are packaged as follows:</span>
          <div className="flex justify-center space-x-2">
            <span>Week 1 Skip {daysTillNextSkip <= 7 ? '🔓' : '🔒'}</span>
            <span>|</span>
            <span>Week 2 Skip {daysTillNextSkip <= 0 ? '🔓' : '🔒'}</span>
          </div>
        </div>
      )}
      
      {habit.period === 'monthly' && (
        <div className="px-3 py-2 bg-amber-50 text-amber-600 rounded-md text-xs mb-3">
          <span className="block mb-1">Skips are packaged as follows:</span>
          <div className="flex justify-center space-x-2 text-xs flex-wrap">
            <span>Week 1 Skip {daysTillNextSkip <= 21 ? '🔓' : '🔒'}</span>
            <span>|</span>
            <span>Week 2 Skip {daysTillNextSkip <= 14 ? '🔓' : '🔒'}</span>
            <span>|</span>
            <span>Week 3 Skip {daysTillNextSkip <= 7 ? '🔓' : '🔒'}</span>
            <span>|</span>
            <span>Week 4 Skip {daysTillNextSkip <= 0 ? '🔓' : '🔒'}</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        {skipBoxes.map((_, index) => {
          const isCompleted = index < skips.length;
          const isBaseGoal = index < progress.total;
          const isBonusSkip = index >= progress.total;
          const currentSkip = isCompleted ? skips[index] : null;
          const isEditable = isCompleted;
          const isSpent = currentSkip?.isSpent;
          
          let isLocked = false;
          let lockReason = "";
          
          if (isLongerThanWeeklyPeriod && !isCompleted) {
            isLocked = true;
            lockReason = `Next Skip Available in ${daysTillNextSkip} Day(s) – hold a steady course!`;
          }
          
          if (habit.period === 'weekly' && !isCompleted) {
            const todaySkips = skips.filter(s => isToday(s.date) && !s.isSpent);
            if (todaySkips.length >= 1) {
              isLocked = true;
              lockReason = "Only 1 skip per day allowed for weekly habits – check back tomorrow!";
            }
          }
          
          const dailySkipsCount = habit.period === 'daily' ? skips.filter(s => isToday(s.date) && !s.isSpent).length : 0;
          const dailySkipLimit = habit.period === 'daily' ? habit.frequency : 0;
          
          if (habit.period === 'daily' && !isCompleted && dailySkipsCount >= dailySkipLimit) {
            isLocked = true;
            lockReason = "Next Skip Available in 1 Day(s) – hold a steady course!";
          }
          
          return (
            <div
              key={index}
              className={cn(
                "relative w-10 h-10 flex items-center justify-center rounded-md text-xs font-medium transition-all",
                isSpent 
                  ? "bg-red-500 text-white"
                  : isCompleted 
                    ? isBaseGoal 
                      ? "bg-green-500 text-white" 
                      : "bg-amber-500 text-white"
                    : isLocked
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : isBaseGoal
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                        : progress.completed >= progress.total
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed",
                habit.isForfeited && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                if (isLocked) {
                  toast.info(lockReason);
                  return;
                }
                
                if (!isCompleted && !habit.isForfeited) {
                  if (isBonusSkip && progress.completed < progress.total) return;
                  
                  if (habit.period === 'daily' && dailySkipsCount >= dailySkipLimit) {
                    toast.info("You've used all your skips for today. Check back tomorrow!");
                    return;
                  }
                  
                  onSkip();
                }
              }}
            >
              {isSpent ? (
                <X size={16} />
              ) : isCompleted ? (
                <Check size={16} />
              ) : isLocked ? (
                <Lock size={16} />
              ) : (
                index + 1
              )}
              
              {isEditable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnskip(index);
                  }}
                  className="absolute -top-1 -right-1 bg-white rounded-full shadow-sm p-0.5"
                >
                  <XCircle size={14} className="text-red-500" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {habit.isForfeited ? (
        <div className="text-xs px-3 py-2 bg-red-50 text-red-500 rounded-md flex items-center mb-2">
          <AlertCircle size={14} className="mr-1" />
          <span>This habit has been forfeited for this week</span>
        </div>
      ) : progress.completed < progress.total ? (
        <div className="text-xs px-3 py-2 bg-blue-50 text-blue-500 rounded-md mb-2">
          <span>{progress.total - progress.completed} more skips needed to reach your goal</span>
        </div>
      ) : maxBonusSkips > 0 ? (
        <div className="text-xs px-3 py-2 bg-amber-50 text-amber-700 rounded-md flex items-center mb-2">
          <Gift size={14} className="mr-1" />
          <span>You can save up to {formatCurrency(habit.expense * maxBonusSkips)} more with bonus skips!</span>
        </div>
      ) : (
        <div className="text-xs px-3 py-2 bg-green-50 text-green-600 rounded-md flex items-center mb-2">
          <BadgeCheck size={14} className="mr-1" />
          <span>Weekly skip goal achieved! Great job!</span>
        </div>
      )}
      
      {habit.period === 'daily' && (
        <div className="px-3 py-2 bg-gray-50 rounded-md text-xs mb-2">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock size={14} />
            <span>Daily Skips: {skips.filter(s => isToday(s.date) && !s.isSpent).length}/{habit.frequency}</span>
          </div>
          {skips.filter(s => isToday(s.date) && !s.isSpent).length >= habit.frequency && (
            <div className="mt-1 text-amber-600">
              Next Skip Available in 1 Day(s) – hold a steady course!
            </div>
          )}
        </div>
      )}
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

const SkipCard: React.FC<{ 
  habit: Habit;
  skippedDays: SkipLog[];
  progress: { completed: number; total: number };
  maxBonusSkips: number;
  onLogSkip: (skip: boolean) => void;
  onUnskipLog: (index: number) => void;
  onForfeit: () => void;
}> = ({ 
  habit, 
  skippedDays, 
  progress,
  maxBonusSkips,
  onLogSkip,
  onUnskipLog,
  onForfeit
}) => {
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const { canSkipToday, isToday, markHabitAsSpent } = useAppContext();

  const weeklyPotential = habit.weeklyTotalPotential;
  const currentSavings = skippedDays.reduce((sum, skip) => sum + skip.amountSaved, 0);
  const isBonus = progress.completed >= progress.total;

  const isLongerThanWeeklyPeriod = ['fortnightly', 'monthly', 'quarterly', 'yearly'].includes(habit.period);

  const handleSkip = () => {
    if (habit.period === 'daily') {
      const todaySkips = getCurrentWeekSkips(habit.id).filter(skip => isToday(skip.date) && !skip.isSpent).length;
      if (todaySkips >= habit.frequency) {
        toast.info(`You've used all your skips for today. Check back tomorrow!`);
        return;
      }
    }
    
    if (isLongerThanWeeklyPeriod) {
      toast.info("Habits with periods longer than a week can only be skipped at the end of the week");
      return;
    }
    
    setSkipDialogOpen(true);
  };

  const canUnforfeit = habit.isForfeited && 
                        habit.skippedDays.some(skip => 
                          skip.isForfeited && isToday(skip.date));

  return (
    <Card className="overflow-hidden bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{habit.emoji}</div>
          <div>
            <CardTitle className="text-lg">{habit.name}</CardTitle>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{formatCurrency(habit.expense)} per occurrence</span>
              {habit.isForfeited && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                  Forfeited
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <SkipBoxes 
          habit={habit} 
          progress={progress}
          maxBonusSkips={maxBonusSkips}
          onSkip={handleSkip}
          onUnskip={onUnskipLog}
          skips={skippedDays}
        />
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500">Weekly Potential</div>
            <div className="font-medium">{formatCurrency(weeklyPotential)}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500">Current Savings</div>
            <div className="font-medium text-green-600">{formatCurrency(currentSavings)}</div>
          </div>
        </div>
      </CardContent>
      
      {habit.isForfeited && canUnforfeit && (
        <CardFooter className="pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 mx-auto"
            onClick={() => onForfeit()}
          >
            Undo Forfeit
          </Button>
        </CardFooter>
      )}
      
      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <ConfirmSkipDialog
          open={skipDialogOpen}
          onOpenChange={setSkipDialogOpen}
          habit={habit}
          isBonus={isBonus}
          onConfirm={(skip, spend) => {
            if (skip) {
              onLogSkip(true);
            } else if (spend) {
              markHabitAsSpent(habit.id);
            }
          }}
        />
      </Dialog>
    </Card>
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

  const handleForfeitHabit = (habitId: string) => {
    const habit = selectedHabits.find(h => h.id === habitId);
    if (habit?.isForfeited) {
      forfeitHabit(habitId, true);
      toast.success('Forfeit undone!', {
        description: 'Your habit has been restored and you can continue tracking it.',
      });
    } else {
      forfeitHabit(habitId);
      toast.error('Habit forfeited for this week', {
        description: 'This habit can no longer be tracked until next week',
      });
    }
  };

  const handleSuperSkip = () => {
    superSkip();
    toast.success('Super Skip activated!', {
      description: 'All eligible daily habits have been skipped for today.',
    });
  };

  const canSuperSkip = selectedHabits.some(habit => {
    if (habit.period === 'daily') {
      const todaySkips = getCurrentWeekSkips(habit.id).filter(skip => isToday(skip.date) && !skip.isSpent).length;
      return !habit.isForfeited && todaySkips < habit.frequency;
    }
    return false;
  });

  return (
    <div className="animate-scale-in">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-medium mb-3">
            Step 4
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skip & Save</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Track your skipped habits and watch your savings grow. Each box represents one skip opportunity.
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
          
          <Button 
            className={cn(
              "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-4 h-auto",
              !canSuperSkip && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSuperSkip}
            disabled={!canSuperSkip}
          >
            <Gift size={18} className="mr-2" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-normal">One-tap</span>
              <span className="font-semibold">Super Skip</span>
            </div>
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-md">
          <Clock size={16} />
          <div className="text-sm">
            <span className="font-medium">Note:</span> Habits can be edited anytime during the week
          </div>
        </div>
        
        <div className="grid gap-4 mb-8">
          {selectedHabits.map((habit) => (
            <SkipCard 
              key={habit.id}
              habit={habit}
              skippedDays={getCurrentWeekSkips(habit.id)}
              progress={getSkipGoalProgress(habit)}
              maxBonusSkips={getMaxBonusSkips(habit)}
              onLogSkip={(skip) => handleLogSkip(habit.id, skip)}
              onUnskipLog={(index) => handleUnskipLog(habit.id, index)}
              onForfeit={() => handleForfeitHabit(habit.id)}
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

