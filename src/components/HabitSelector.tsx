
import React, { useState } from 'react';
import { useAppContext, type Habit, type Frequency, type SavingsModel } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { PlusIcon, ArrowRightIcon, Coffee, ShoppingBag, DollarSign, Pencil, Info } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

const SavingsModelTooltip: React.FC<{ model: SavingsModel }> = ({ model }) => {
  let content = '';
  
  switch(model) {
    case 'fractional':
      content = "This goal allows you to save a fraction of your target amount each day you skip the habit. Example: Skip your $5 coffee each day to save $20 this week. If you skip 6 days, you save $17.16.";
      break;
    case 'all-or-nothing':
      content = "This goal requires you to skip all days of the week to meet your target. Example: Skip all 7 days of online shopping to save $70. If you miss a day, your savings reset to $0 for the week.";
      break;
    case 'full-skip':
      content = "Full Skip allows you to completely eliminate a small daily habit (e.g., coffee, snacks). Perfect for habits you can fully avoid to reach your savings goal faster.";
      break;
    case 'fractional-skip':
      content = "Fractional Skip is for larger ticket items (e.g., fast food, subscriptions) where you may not be able to fully eliminate the habit but can reduce the spending each time to build up over several weeks.";
      break;
    default:
      content = "Choose a savings model that best fits your habit.";
  }
  
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
    return `${habit.frequency} time${habit.frequency > 1 ? 's' : ''} per ${habit.period === 'daily' ? 'day' : habit.period.slice(0, -2)}`;
  };

  const getHabitIcon = (habitName: string) => {
    if (habitName.toLowerCase().includes('coffee')) return <Coffee size={20} />;
    if (habitName.toLowerCase().includes('shopping')) return <ShoppingBag size={20} />;
    return <DollarSign size={20} />;
  };

  const getSavingsModelLabel = (model: SavingsModel) => {
    switch(model) {
      case 'fractional': return 'Fractional';
      case 'all-or-nothing': return 'All-or-Nothing';
      case 'full-skip': return 'Full Skip';
      case 'fractional-skip': return 'Fractional Skip';
      default: return model;
    }
  };

  const getSavingsModelColor = (model: SavingsModel) => {
    switch(model) {
      case 'fractional': return "bg-blue-100 text-blue-700";
      case 'all-or-nothing': return "bg-purple-100 text-purple-700";
      case 'full-skip': return "bg-green-100 text-green-700";
      case 'fractional-skip': return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
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
          "flex items-center justify-center w-8 h-8 rounded-full", 
          isSelected ? "bg-bitcoin text-white" : "bg-gray-100 text-gray-500"
        )}>
          {getHabitIcon(habit.name)}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{habit.name}</h3>
          <div className="mt-1 text-sm text-gray-500">
            ${habit.expense.toFixed(2)} • {getFrequencyText(habit)}
          </div>
          <div className="mt-1 text-xs flex items-center">
            <span className={cn(
              "px-2 py-0.5 rounded-full",
              getSavingsModelColor(habit.savingsModel)
            )}>
              {getSavingsModelLabel(habit.savingsModel)}
            </span>
            <SavingsModelTooltip model={habit.savingsModel} />
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
          <Pencil size={14} />
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
  const [expense, setExpense] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [period, setPeriod] = useState<Frequency>('daily');
  const [savingsModel, setSavingsModel] = useState<SavingsModel>('full-skip');
  const [typicalWeeklySpend, setTypicalWeeklySpend] = useState('');
  const [weeklySavingsGoal, setWeeklySavingsGoal] = useState('');

  React.useEffect(() => {
    if (isEditing && habit && open) {
      setName(habit.name);
      setExpense(habit.expense.toString());
      setFrequency(habit.frequency.toString());
      setPeriod(habit.period);
      setSavingsModel(habit.savingsModel);
      setTypicalWeeklySpend(habit.typicalWeeklySpend?.toString() || '');
      setWeeklySavingsGoal(habit.weeklySavingsGoal?.toString() || '');
    } else if (!isEditing && open) {
      setName('');
      setExpense('');
      setFrequency('1');
      setPeriod('daily');
      setSavingsModel('full-skip');
      setTypicalWeeklySpend('');
      setWeeklySavingsGoal('');
    }
  }, [habit, isEditing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const habitData: Partial<Habit> = {
      name,
      expense: parseFloat(expense),
      frequency: parseInt(frequency),
      period,
      savingsModel
    };
    
    if (savingsModel === 'fractional-skip') {
      if (!typicalWeeklySpend || !weeklySavingsGoal) {
        toast.error('Please provide weekly spend and savings goal for Fractional Skip');
        return;
      }
      habitData.typicalWeeklySpend = parseFloat(typicalWeeklySpend);
      habitData.weeklySavingsGoal = parseFloat(weeklySavingsGoal);
    }
    
    if (isEditing && habit) {
      updateHabit(habit.id, habitData);
      toast.success('Habit updated successfully!');
    } else {
      addHabit(habitData as Omit<Habit, 'id' | 'skipped' | 'skippedDays'>);
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
          <Label htmlFor="expense">Cost per occurrence ($)</Label>
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
          <Label className="flex items-center">
            Skip Method
          </Label>
          <RadioGroup value={savingsModel} onValueChange={(value) => setSavingsModel(value as SavingsModel)} className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full-skip" id="full-skip" />
              <Label htmlFor="full-skip" className="font-normal flex items-center cursor-pointer">
                Full Skip
                <SavingsModelTooltip model="full-skip" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fractional-skip" id="fractional-skip" />
              <Label htmlFor="fractional-skip" className="font-normal flex items-center cursor-pointer">
                Fractional Skip
                <SavingsModelTooltip model="fractional-skip" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fractional" id="fractional" />
              <Label htmlFor="fractional" className="font-normal flex items-center cursor-pointer">
                Fractional Savings (Legacy)
                <SavingsModelTooltip model="fractional" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all-or-nothing" id="all-or-nothing" />
              <Label htmlFor="all-or-nothing" className="font-normal flex items-center cursor-pointer">
                All-or-Nothing (Legacy)
                <SavingsModelTooltip model="all-or-nothing" />
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {savingsModel === 'fractional-skip' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="typicalWeeklySpend">Typical Weekly Spend ($)</Label>
              <Input 
                id="typicalWeeklySpend" 
                type="number" 
                min="0.01" 
                step="0.01" 
                value={typicalWeeklySpend} 
                onChange={(e) => setTypicalWeeklySpend(e.target.value)} 
                placeholder="0.00" 
                required 
                className="text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklySavingsGoal">Weekly Savings Goal ($)</Label>
              <Input 
                id="weeklySavingsGoal" 
                type="number" 
                min="0.01" 
                step="0.01" 
                value={weeklySavingsGoal} 
                onChange={(e) => setWeeklySavingsGoal(e.target.value)} 
                placeholder="0.00" 
                required 
                className="text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </>
        )}
        
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pick your habits to skip</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Select the habits you want to skip and start saving. Each skipped habit adds up to your Bitcoin savings.
            <br />
            <span className="text-sm italic mt-1 block">You can customize any habit by clicking the edit icon.</span>
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
