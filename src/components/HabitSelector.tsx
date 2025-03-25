
import React, { useState } from 'react';
import { useAppContext, type Habit, type Frequency } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { PlusIcon, ArrowRightIcon, Info } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

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

const calculateWeeklyTotal = (expense: number, frequency: number, period: Frequency): number => {
  switch (period) {
    case 'daily':
      return expense * frequency * 7;
    case 'weekly':
      return expense * frequency;
    case 'fortnightly':
      return (expense * frequency) / 2;
    case 'monthly':
      return (expense * frequency) / 4;
    case 'quarterly':
      return (expense * frequency) / 12;
    case 'yearly':
      return (expense * frequency) / 52;
    default:
      return 0;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const HabitCard: React.FC<{ 
  habit: Habit; 
  isSelected: boolean; 
  onToggle: () => void;
  onEdit: () => void;
}> = ({ 
  habit, 
  isSelected, 
  onToggle,
  onEdit
}) => {
  const getFrequencyText = (habit: Habit) => {
    let periodText = '';
    switch(habit.period) {
      case 'daily':
        periodText = habit.frequency > 1 ? `${habit.frequency} times daily` : 'daily';
        break;
      case 'weekly':
        periodText = habit.frequency > 1 ? `${habit.frequency} times per week` : 'weekly';
        break;
      case 'fortnightly':
        periodText = habit.frequency > 1 ? `${habit.frequency} times per fortnight` : 'fortnightly';
        break;
      case 'monthly':
        periodText = habit.frequency > 1 ? `${habit.frequency} times per month` : 'monthly';
        break;
      case 'quarterly':
        periodText = habit.frequency > 1 ? `${habit.frequency} times per quarter` : 'quarterly';
        break;
      case 'yearly':
        periodText = habit.frequency > 1 ? `${habit.frequency} times per year` : 'yearly';
        break;
    }
    return periodText;
  };

  return (
    <div
      className={cn(
        "habit-card p-4 rounded-xl border shadow-sm transition-all duration-300 relative cursor-pointer",
        isSelected ? "bg-white border-bitcoin shadow-md" : "bg-white/60 hover:bg-white"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full text-xl", 
          isSelected ? "bg-bitcoin text-white" : "bg-gray-100 text-gray-700"
        )}>
          {habit.emoji}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{habit.name}</h3>
          <div className="mt-1 text-sm text-gray-500">
            {formatCurrency(habit.expense)} • {getFrequencyText(habit)}
          </div>
          <div className="mt-1 text-xs flex items-center">
            <div className="flex items-center">
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                Skip Goal: {habit.skipGoal}/week
              </span>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Weekly potential: {formatCurrency(habit.weeklyTotalPotential)}
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent the card click from triggering
            onEdit();
          }}
          className="p-1 text-gray-400 hover:text-bitcoin rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Edit habit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </button>
        
        <div 
          onClick={(e) => {
            e.stopPropagation(); // This prevents double toggling when clicking directly on the circle
            onToggle();
          }}
          className={cn(
            "w-5 h-5 rounded-full border transition-all flex items-center justify-center cursor-pointer",
            isSelected ? "border-bitcoin bg-bitcoin" : "border-gray-300"
          )}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

const HabitDialog: React.FC<{ 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  habit?: Habit;
  isEditing?: boolean;
}> = ({ 
  open, 
  onOpenChange,
  habit,
  isEditing = false
}) => {
  const { addHabit, updateHabit } = useAppContext();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [expense, setExpense] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [period, setPeriod] = useState<Frequency>('daily');
  const [skipGoal, setSkipGoal] = useState('');
  const [weeklyTotal, setWeeklyTotal] = useState(0);

  React.useEffect(() => {
    if (isEditing && habit && open) {
      setName(habit.name);
      setEmoji(habit.emoji);
      setExpense(habit.expense.toString());
      setFrequency(habit.frequency.toString());
      setPeriod(habit.period);
      setSkipGoal(habit.skipGoal.toString());
      setWeeklyTotal(habit.weeklyTotalPotential);
    } else if (!isEditing && open) {
      setName('');
      setEmoji('');
      setExpense('');
      setFrequency('1');
      setPeriod('daily');
      setSkipGoal('');
      setWeeklyTotal(0);
    }
  }, [habit, isEditing, open]);

  // Calculate weekly total whenever inputs change
  React.useEffect(() => {
    if (expense && frequency) {
      const expenseNum = parseFloat(expense);
      const frequencyNum = parseInt(frequency);
      if (!isNaN(expenseNum) && !isNaN(frequencyNum)) {
        const total = calculateWeeklyTotal(expenseNum, frequencyNum, period);
        setWeeklyTotal(total);
      }
    }
  }, [expense, frequency, period]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !emoji || !expense || !frequency || !skipGoal) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const skipGoalNum = parseInt(skipGoal);
    if (skipGoalNum <= 0) {
      toast.error('Skip goal must be greater than zero');
      return;
    }

    // Make sure skip goal is reasonable given the frequency
    const expenseNum = parseFloat(expense);
    const frequencyNum = parseInt(frequency);
    let weeklyFreq = frequencyNum;
    
    if (period === 'daily') weeklyFreq = frequencyNum * 7;
    else if (period === 'fortnightly') weeklyFreq = frequencyNum / 2;
    else if (period === 'monthly') weeklyFreq = frequencyNum / 4;
    else if (period === 'quarterly') weeklyFreq = frequencyNum / 12;
    else if (period === 'yearly') weeklyFreq = frequencyNum / 52;
    
    if (skipGoalNum > Math.ceil(weeklyFreq)) {
      toast.error(`Skip goal cannot exceed ${Math.ceil(weeklyFreq)} for this frequency`);
      return;
    }
    
    const habitData: Omit<Habit, 'id' | 'skipped' | 'skippedDays' | 'weeklyTotalPotential'> = {
      name,
      emoji,
      expense: expenseNum,
      frequency: frequencyNum,
      period,
      skipGoal: skipGoalNum
    };
    
    if (isEditing && habit) {
      updateHabit(habit.id, habitData);
      toast.success('Habit updated successfully!');
    } else {
      addHabit(habitData);
      toast.success('Habit added successfully!');
    }
    
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Habit' : 'Add Custom Habit'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Habit Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g., Premium Coffee" 
            required 
            className="text-gray-900 placeholder:text-gray-400"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emoji" className="flex items-center">
            Custom Emoji 
            <InfoTooltip content="Paste an emoji from your keyboard or copy from Emojipedia" />
          </Label>
          <Input 
            id="emoji" 
            value={emoji} 
            onChange={(e) => setEmoji(e.target.value)} 
            placeholder="e.g., ☕" 
            required 
            className="text-gray-900 placeholder:text-gray-400 text-2xl"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expense">Cost per Occurrence ($)</Label>
          <Input 
            id="expense" 
            type="number" 
            min="0.01" 
            step="0.01" 
            value={expense} 
            onChange={(e) => setExpense(e.target.value)} 
            placeholder="0.00" 
            required 
            className="text-gray-900 placeholder:text-gray-400"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Input 
              id="frequency" 
              type="number" 
              min="1" 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)} 
              placeholder="1" 
              required 
              className="text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select value={period} onValueChange={(value) => setPeriod(value as Frequency)}>
              <SelectTrigger id="period" className="text-gray-900">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skipGoal" className="flex items-center">
            Weekly Skip Goal
            <InfoTooltip content="How many times you aim to skip this habit per week" />
          </Label>
          <Input 
            id="skipGoal" 
            type="number" 
            min="1" 
            step="1" 
            value={skipGoal} 
            onChange={(e) => setSkipGoal(e.target.value)} 
            placeholder="5" 
            required 
            className="text-gray-900 placeholder:text-gray-400"
          />
        </div>
        
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600 font-medium">Weekly Spending Potential:</div>
          <div className="text-lg font-semibold text-royal-blue">
            {formatCurrency(weeklyTotal)}
          </div>
          {skipGoal && expense && !isNaN(parseInt(skipGoal)) && !isNaN(parseFloat(expense)) && (
            <div className="text-sm text-gray-500 mt-1">
              Weekly Savings: {formatCurrency(parseInt(skipGoal) * parseFloat(expense))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="submit" className="w-full bg-bitcoin hover:bg-bitcoin/90">
            {isEditing ? 'Update Habit' : 'Add Habit'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

const HabitSelector: React.FC = () => {
  const { habits, selectedHabits, toggleHabit, setStep } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingHabit(undefined);
  };
  
  const handleContinue = () => {
    if (selectedHabits.length > 0) {
      setStep(2);
    } else {
      toast.error('Please select at least one habit to track');
    }
  };

  const handleAddHabit = () => {
    setEditingHabit(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="animate-scale-in">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-medium mb-3">
            Step 1
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Your Habits</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Select the spending habits you want to skip and save on. Each habit requires a skip goal that helps you build your savings.
          </p>
        </div>
        
        <div className="grid gap-3 mb-8">
          {habits.map((habit) => (
            <HabitCard 
              key={habit.id}
              habit={habit} 
              isSelected={selectedHabits.some(h => h.id === habit.id)}
              onToggle={() => toggleHabit(habit.id)}
              onEdit={() => handleEditHabit(habit)}
            />
          ))}
          
          <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
            <Button 
              onClick={handleAddHabit}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-bitcoin hover:text-bitcoin transition-all"
            >
              <PlusIcon size={16} />
              <span>Add Custom Habit</span>
            </Button>
            
            <HabitDialog 
              open={dialogOpen} 
              onOpenChange={handleCloseDialog} 
              habit={editingHabit} 
              isEditing={!!editingHabit} 
            />
          </Dialog>
        </div>
        
        <div className="flex justify-center">
          <Button 
            className="bg-bitcoin hover:bg-bitcoin/90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            onClick={handleContinue}
            disabled={selectedHabits.length === 0}
          >
            <span>See Your Savings</span>
            <ArrowRightIcon className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HabitSelector;
