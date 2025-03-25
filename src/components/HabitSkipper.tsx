
import React, { useState } from 'react';
import { useAppContext, type DayOfWeek, type SkipLog, type Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, Check, Calendar, Info, CheckCircle, AlertCircle, BadgeCheck, Gift } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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

const WeeklyTracker: React.FC<{
  habit: Habit;
  skippedDays: SkipLog[];
  progress: { completed: number; total: number };
  bonusSkipPotential: number;
  onLogSkip: (day: DayOfWeek) => void;
}> = ({ habit, skippedDays, progress, bonusSkipPotential, onLogSkip }) => {
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
  const progressPercentage = (progress.completed / progress.total) * 100;
  
  // Calculate progress text
  const progressText = `${progress.completed}/${progress.total} skips`;
  
  // Calculate savings from skips
  const savedAmount = skippedDays.reduce((sum, skip) => sum + skip.amountSaved, 0);
  
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
        className="h-2 mb-3"
      />
      
      <div className="flex items-center mb-3 justify-between">
        <span className="text-sm font-medium text-green-600">
          Saved: {formatCurrency(savedAmount)}
        </span>
        
        {progress.completed >= progress.total && bonusSkipPotential > 0 && (
          <div className="flex items-center">
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
              <Gift size={12} /> Bonus skips available!
            </span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between gap-1 mb-2">
        {days.map(({ day, label }) => {
          const skippedLog = skippedDays.find(skip => skip.day === day);
          const isSkipped = !!skippedLog;
          const isToday = day === currentDay;
          const isForfeited = skippedLog?.isForfeited;
          const isPartial = skippedLog?.isPartial;
          
          return (
            <button
              key={day}
              onClick={() => {
                if (!isSkipped && !habit.isForfeited) {
                  onLogSkip(day);
                }
              }}
              disabled={isSkipped || habit.isForfeited}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-md text-xs font-medium transition-all",
                isSkipped && isForfeited 
                  ? "bg-red-100 text-red-500 cursor-not-allowed" 
                  : isSkipped 
                    ? "bg-green-500 text-white cursor-not-allowed" 
                    : habit.isForfeited
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                isToday && !isSkipped && !habit.isForfeited && "ring-2 ring-bitcoin ring-offset-1"
              )}
            >
              {isSkipped ? (
                isForfeited ? (
                  <AlertCircle size={14} />
                ) : isPartial ? (
                  <div className="text-xs">{skippedLog.partialAmount && skippedLog.partialAmount * 100}%</div>
                ) : (
                  <Check size={14} />
                )
              ) : (
                label
              )}
            </button>
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
      ) : (
        <div className="text-xs px-3 py-2 bg-green-50 text-green-600 rounded-md flex items-center mb-2">
          <BadgeCheck size={14} className="mr-1" />
          <span>Weekly skip goal achieved! Great job!</span>
        </div>
      )}
    </div>
  );
};

const FractionalSkipDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit;
  day: DayOfWeek;
  onSubmit: (amount: number, isPartial: boolean, partialAmount?: 0.25 | 0.5 | 0.75) => void;
}> = ({ open, onOpenChange, habit, day, onSubmit }) => {
  const [spentAmount, setSpentAmount] = useState('');
  const [skipType, setSkipType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState<'0.25' | '0.5' | '0.75'>('0.5');
  
  const typicalSpend = habit.expense;
  const dayNames = {
    'mon': 'Monday',
    'tue': 'Tuesday',
    'wed': 'Wednesday',
    'thu': 'Thursday',
    'fri': 'Friday',
    'sat': 'Saturday',
    'sun': 'Sunday'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let amountSaved = 0;
    let isPartial = skipType === 'partial';
    let partialAmountValue: 0.25 | 0.5 | 0.75 | undefined = undefined;
    
    if (skipType === 'full') {
      // Full skip (spent nothing)
      amountSaved = typicalSpend;
    } else {
      // Partial skip
      partialAmountValue = parseFloat(partialAmount) as 0.25 | 0.5 | 0.75;
      amountSaved = typicalSpend * partialAmountValue;
    }
    
    onSubmit(amountSaved, isPartial, partialAmountValue);
    onOpenChange(false);
    setSpentAmount('');
    setSkipType('full');
    setPartialAmount('0.5');
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Log Skip for {dayNames[day]}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="flex flex-col gap-2">
          <Label>Skip Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={skipType === 'full' ? 'default' : 'outline'}
              onClick={() => setSkipType('full')}
              className={cn(
                skipType === 'full' && "bg-green-500 hover:bg-green-600 text-white"
              )}
            >
              <CheckCircle size={16} className="mr-2" />
              Full Skip
            </Button>
            <Button
              type="button"
              variant={skipType === 'partial' ? 'default' : 'outline'}
              onClick={() => setSkipType('partial')}
              className={cn(
                skipType === 'partial' && "bg-blue-500 hover:bg-blue-600 text-white"
              )}
            >
              <div className="mr-2">½</div>
              Partial Skip
            </Button>
          </div>
        </div>
        
        {skipType === 'partial' && (
          <div className="space-y-2">
            <Label>How much did you save?</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={partialAmount === '0.25' ? 'default' : 'outline'}
                onClick={() => setPartialAmount('0.25')}
                className={cn(
                  partialAmount === '0.25' && "bg-blue-500 hover:bg-blue-600 text-white"
                )}
              >
                25%
              </Button>
              <Button
                type="button"
                variant={partialAmount === '0.5' ? 'default' : 'outline'}
                onClick={() => setPartialAmount('0.5')}
                className={cn(
                  partialAmount === '0.5' && "bg-blue-500 hover:bg-blue-600 text-white"
                )}
              >
                50%
              </Button>
              <Button
                type="button"
                variant={partialAmount === '0.75' ? 'default' : 'outline'}
                onClick={() => setPartialAmount('0.75')}
                className={cn(
                  partialAmount === '0.75' && "bg-blue-500 hover:bg-blue-600 text-white"
                )}
              >
                75%
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              You'll save {formatCurrency(typicalSpend * parseFloat(partialAmount))}
            </p>
          </div>
        )}
        
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between text-sm">
            <span>Typical spend:</span>
            <span className="font-medium">{formatCurrency(habit.expense)}</span>
          </div>
          
          <div className="flex justify-between text-sm mt-1">
            <span>You'll save:</span>
            <span className="font-medium text-green-600">
              {skipType === 'full' 
                ? formatCurrency(habit.expense) 
                : formatCurrency(habit.expense * parseFloat(partialAmount))}
            </span>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" className="w-full bg-bitcoin hover:bg-bitcoin/90">
            Log Skip
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
  bonusSkipPotential: number;
  onLogSkip: (day: DayOfWeek, amount: number, isPartial: boolean, partialAmount?: 0.25 | 0.5 | 0.75) => void;
  onForfeit: () => void;
}> = ({ 
  habit, 
  skippedDays, 
  progress,
  bonusSkipPotential,
  onLogSkip,
  onForfeit
}) => {
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('mon');
  const { getRemainingSkips } = useAppContext();

  const remainingSkips = getRemainingSkips(habit);
  const weeklyPotential = habit.weeklyTotalPotential;
  const currentSavings = skippedDays.reduce((sum, skip) => sum + skip.amountSaved, 0);

  const handleLogSkipDay = (day: DayOfWeek) => {
    setSelectedDay(day);
    setSkipDialogOpen(true);
  };

  const handleForfeit = () => {
    if (confirm('Are you sure you want to forfeit this habit for the week? You will lose all progress and potential savings.')) {
      onForfeit();
      toast.error('Habit forfeited for this week', {
        description: 'This habit can no longer be tracked until next week',
      });
    }
  };

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
        <WeeklyTracker 
          habit={habit} 
          skippedDays={skippedDays}
          progress={progress}
          bonusSkipPotential={bonusSkipPotential}
          onLogSkip={handleLogSkipDay}
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
        
        {bonusSkipPotential > 0 && progress.completed >= progress.total && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-amber-500" />
              <div className="font-medium text-amber-700">Bonus Skip Potential</div>
            </div>
            <div className="text-sm text-amber-600 mt-1">
              You can save an additional {formatCurrency(bonusSkipPotential)} this week!
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        {!habit.isForfeited && (
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
              onClick={() => handleLogSkipDay(getDayStringFromDate(new Date()))}
              disabled={habit.isForfeited}
            >
              Log Skip
            </Button>
          </>
        )}
      </CardFooter>
      
      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <FractionalSkipDialog
          open={skipDialogOpen}
          onOpenChange={setSkipDialogOpen}
          habit={habit}
          day={selectedDay}
          onSubmit={(amount, isPartial, partialAmount) => 
            onLogSkip(selectedDay, amount, isPartial, partialAmount)
          }
        />
      </Dialog>
    </Card>
  );
};

// Helper function to get day string from date
const getDayStringFromDate = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[date.getDay()];
};

const HabitSkipper: React.FC = () => {
  const { 
    selectedHabits, 
    skipHabitOnDay,
    forfeitHabit,
    totalSavings, 
    weeklySkipSavings,
    setStep,
    getCurrentWeekSkips,
    getSkipGoalProgress,
    getBonusSkipPotential,
    superSkip
  } = useAppContext();
  
  const handleLogSkip = (
    habitId: string, 
    day: DayOfWeek, 
    amount: number, 
    isPartial: boolean, 
    partialAmount?: 0.25 | 0.5 | 0.75
  ) => {
    skipHabitOnDay(habitId, day, amount, isPartial, partialAmount);
    
    if (isPartial) {
      toast.success('Partial skip logged!', {
        description: `You saved ${formatCurrency(amount)} by reducing this expense.`,
      });
    } else {
      toast.success('Habit skipped!', {
        description: `Great job! You saved ${formatCurrency(amount)}.`,
      });
    }
  };

  const handleForfeitHabit = (habitId: string) => {
    forfeitHabit(habitId);
  };

  const handleSuperSkip = () => {
    superSkip();
    toast.success('Super Skip activated!', {
      description: 'All eligible habits have been skipped for today.',
    });
  };

  // Check if any habits are eligible for super skip (not forfeited and not already skipped today)
  const today = getDayStringFromDate(new Date());
  const eligibleForSuperSkip = selectedHabits.some(habit => {
    const skippedToday = getCurrentWeekSkips(habit.id).some(skip => skip.day === today);
    return !habit.isForfeited && !skippedToday;
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
            Track your skipped habits and watch your savings grow. Record full or partial skips each day.
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
              !eligibleForSuperSkip && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSuperSkip}
            disabled={!eligibleForSuperSkip}
          >
            <Gift size={18} className="mr-2" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-normal">One-tap</span>
              <span className="font-semibold">Super Skip</span>
            </div>
          </Button>
        </div>
        
        <div className="grid gap-4 mb-8">
          {selectedHabits.map((habit) => (
            <SkipCard 
              key={habit.id}
              habit={habit}
              skippedDays={getCurrentWeekSkips(habit.id)}
              progress={getSkipGoalProgress(habit)}
              bonusSkipPotential={getBonusSkipPotential(habit)}
              onLogSkip={(day, amount, isPartial, partialAmount) => 
                handleLogSkip(habit.id, day, amount, isPartial, partialAmount)
              }
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
