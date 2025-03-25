
import React, { useState } from 'react';
import { useAppContext, type SkipLog, type Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, Check, Calendar, Info, AlertCircle, BadgeCheck, Gift, Clock, XCircle } from 'lucide-react';
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
  const { isToday } = useAppContext();
  
  // Calculate total possible skips (base goal + bonus)
  const totalPossibleSkips = progress.total + maxBonusSkips;
  
  // Create an array representing all possible skip boxes
  const skipBoxes = Array(totalPossibleSkips).fill(null);
  
  // Calculate progress percentage
  const progressPercentage = (progress.completed / progress.total) * 100;
  
  // Calculate progress text
  const progressText = `${progress.completed}/${progress.total} skips`;
  
  // Calculate savings from skips
  const savedAmount = skips.reduce((sum, skip) => sum + skip.amountSaved, 0);

  // Determine if habit is weekly or needs weekly tracking
  const isWeeklyOrLargerPeriod = habit.period !== 'daily';

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

      {isWeeklyOrLargerPeriod && (
        <div className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-xs mb-3 flex items-center">
          <Info size={14} className="mr-1" />
          <span>Weekly habits can only be completed at the end of the week</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        {skipBoxes.map((_, index) => {
          const isCompleted = index < skips.length;
          const isBaseGoal = index < progress.total;
          const isBonusSkip = index >= progress.total;
          const currentSkip = isCompleted ? skips[index] : null;
          const isEditable = isCompleted && isToday(currentSkip!.date);
          
          return (
            <div
              key={index}
              className={cn(
                "relative w-10 h-10 flex items-center justify-center rounded-md text-xs font-medium transition-all",
                isCompleted 
                  ? isBaseGoal 
                    ? "bg-green-500 text-white" 
                    : "bg-amber-500 text-white"
                  : isBaseGoal
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                    : progress.completed >= progress.total
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed",
                habit.isForfeited && "opacity-50 cursor-not-allowed",
                isWeeklyOrLargerPeriod && !isCompleted && "cursor-not-allowed opacity-60"
              )}
              onClick={() => {
                if (!isCompleted && !habit.isForfeited) {
                  // Can only click bonus skips if base goal is completed
                  if (isBonusSkip && progress.completed < progress.total) return;
                  
                  // Weekly habits can only be skipped at end of week
                  if (isWeeklyOrLargerPeriod) {
                    toast.info("Weekly habits can only be completed at the end of the week");
                    return;
                  }
                  
                  onSkip();
                }
              }}
            >
              {isCompleted ? (
                <Check size={16} />
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
    </div>
  );
};

const ConfirmSkipDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit;
  isBonus: boolean;
  onConfirm: () => void;
}> = ({ open, onOpenChange, habit, isBonus, onConfirm }) => {
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {isBonus ? "Log Bonus Skip" : "Log Skip"}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleConfirm} className="space-y-4 py-2">
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
        
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-bitcoin hover:bg-bitcoin/90">
            Confirm Skip
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

const SkipCard: React.FC<{ 
  habit: Habit;
  skippedDays: SkipLog[];
  progress: { completed: number; total: number };
  maxBonusSkips: number;
  onLogSkip: () => void;
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
  const { canSkipToday, isToday } = useAppContext();

  const weeklyPotential = habit.weeklyTotalPotential;
  const currentSavings = skippedDays.reduce((sum, skip) => sum + skip.amountSaved, 0);
  const isBonus = progress.completed >= progress.total;

  const handleSkip = () => {
    if (canSkipToday(habit)) {
      setSkipDialogOpen(true);
    }
  };

  const handleForfeit = () => {
    if (confirm('Are you sure you want to forfeit this habit for the week? You will lose all progress and potential savings.')) {
      onForfeit();
      toast.error('Habit forfeited for this week', {
        description: 'This habit can no longer be tracked until next week',
      });
    }
  };

  // Check if habit can be un-forfeited (if it was forfeited today)
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
      
      <CardFooter className="flex justify-between pt-2">
        {habit.isForfeited ? (
          canUnforfeit && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 mx-auto"
              onClick={() => onForfeit()} // Re-using the forfeit function to un-forfeit
            >
              Undo Forfeit
            </Button>
          )
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleForfeit}
            >
              Forfeit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={handleSkip}
              disabled={!canSkipToday(habit)}
            >
              Log Skip
            </Button>
          </>
        )}
      </CardFooter>
      
      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <ConfirmSkipDialog
          open={skipDialogOpen}
          onOpenChange={setSkipDialogOpen}
          habit={habit}
          isBonus={isBonus}
          onConfirm={onLogSkip}
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
    totalSavings, 
    weeklySkipSavings,
    setStep,
    getCurrentWeekSkips,
    getSkipGoalProgress,
    getMaxBonusSkips,
    superSkip,
    isToday
  } = useAppContext();
  
  const handleLogSkip = (habitId: string) => {
    skipHabit(habitId);
    
    const habit = selectedHabits.find(h => h.id === habitId);
    if (habit) {
      toast.success('Habit skipped!', {
        description: `Great job! You saved ${formatCurrency(habit.expense)}. Check back tomorrow to skip again.`,
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
      // If already forfeited, this is an "undo forfeit" action
      forfeitHabit(habitId, true); // Add a second parameter to indicate "undo"
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

  // Check if any daily habits are eligible for super skip
  const canSuperSkip = selectedHabits.some(habit => {
    return !habit.isForfeited && 
           habit.period === 'daily' && 
           getCurrentWeekSkips(habit.id).filter(skip => isToday(skip.date)).length === 0;
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
            <span className="font-medium">Note:</span> Skips can only be edited on the same day they're logged
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
              onLogSkip={() => handleLogSkip(habit.id)}
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
