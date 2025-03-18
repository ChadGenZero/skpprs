
import React, { useState } from 'react';
import { useAppContext, type Habit, type Frequency } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { PlusIcon, ArrowRightIcon, Coffee, ShoppingBag, DollarSign, Pencil } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

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
  // Function to get readable frequency text
  const getFrequencyText = (habit: Habit) => {
    return `${habit.frequency} time${habit.frequency > 1 ? 's' : ''} per ${habit.period.slice(0, -2)}`;
  };

  // Function to determine which icon to show based on habit name
  const getHabitIcon = (habitName: string) => {
    if (habitName.toLowerCase().includes('coffee')) return <Coffee size={20} />;
    if (habitName.toLowerCase().includes('shopping')) return <ShoppingBag size={20} />;
    return <DollarSign size={20} />;
  };

  return (
    <div
      className={cn(
        "habit-card p-4 rounded-xl border shadow-sm transition-all duration-300 relative",
        isSelected ? "bg-white border-bitcoin shadow-md" : "bg-white/60 hover:bg-white"
      )}
    >
      <div className="flex items-start gap-3" onClick={onToggle}>
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
        </div>
        <div className={cn(
          "w-5 h-5 rounded-full border transition-all flex items-center justify-center",
          isSelected ? "border-bitcoin bg-bitcoin" : "border-gray-300"
        )}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-bitcoin rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Edit habit"
      >
        <Pencil size={14} />
      </button>
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
  const [name, setName] = useState(habit?.name || '');
  const [expense, setExpense] = useState(habit?.expense ? habit.expense.toString() : '');
  const [frequency, setFrequency] = useState(habit?.frequency ? habit.frequency.toString() : '1');
  const [period, setPeriod] = useState<Frequency>(habit?.period || 'daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && expense && frequency) {
      const habitData = {
        name,
        expense: parseFloat(expense),
        frequency: parseInt(frequency),
        period
      };
      
      if (isEditing && habit) {
        updateHabit(habit.id, habitData);
        toast.success('Habit updated successfully!');
      } else {
        addHabit(habitData);
        toast.success('Habit added successfully!');
      }
      
      // Reset form
      setName('');
      setExpense('');
      setFrequency('1');
      setPeriod('daily');
      onOpenChange(false);
    }
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
            className={isEditing ? "text-gray-500 placeholder:text-gray-300" : ""}
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
            className={isEditing ? "text-gray-500 placeholder:text-gray-300" : ""}
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
              required 
              className={isEditing ? "text-gray-500 placeholder:text-gray-300" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select value={period} onValueChange={(value) => setPeriod(value as Frequency)}>
              <SelectTrigger id="period" className={isEditing ? "text-gray-500" : ""}>
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
