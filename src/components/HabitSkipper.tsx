
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon, Check, Coffee, ShoppingBag, DollarSign } from 'lucide-react';
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

const SkipCard: React.FC<{ 
  habit: any; 
  onSkip: () => void; 
  recentlySkipped: boolean;
}> = ({ habit, onSkip, recentlySkipped }) => {
  // Function to determine which icon to show based on habit name
  const getHabitIcon = (habitName: string) => {
    if (habitName.toLowerCase().includes('coffee')) return <Coffee size={24} />;
    if (habitName.toLowerCase().includes('shopping')) return <ShoppingBag size={24} />;
    return <DollarSign size={24} />;
  };

  return (
    <div className={cn(
      "relative overflow-hidden p-5 rounded-xl border bg-white/90 shadow-sm transition-all duration-300",
      recentlySkipped ? "border-green-500 animate-pulse" : "border-gray-200"
    )}>
      {recentlySkipped && (
        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
          <Check size={14} />
        </div>
      )}
      
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
        
        <Button 
          variant="outline" 
          className="border-bitcoin text-bitcoin hover:bg-bitcoin/10"
          onClick={onSkip}
        >
          Skip Now
        </Button>
      </div>
    </div>
  );
};

const HabitSkipper: React.FC = () => {
  const { selectedHabits, skipHabit, totalSavings, setStep } = useAppContext();
  const [recentlySkipped, setRecentlySkipped] = useState<string[]>([]);
  
  const handleSkip = (habitId: string) => {
    skipHabit(habitId);
    setRecentlySkipped((prev) => [...prev, habitId]);
    
    // Show a success toast
    toast.success('Habit skipped!', {
      description: 'Great job! Your savings have been updated.',
    });
    
    // Remove the highlight after a short delay
    setTimeout(() => {
      setRecentlySkipped((prev) => prev.filter(id => id !== habitId));
    }, 2000);
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
            Track your skipped habits and watch your savings grow. Each time you avoid a bad habit, click "Skip Now".
          </p>
        </div>
        
        <div className="glass-card p-6 mb-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Savings</h2>
          <div className="text-4xl font-bold text-bitcoin animate-pulse-subtle">
            {formatCurrency(totalSavings)}
          </div>
          <p className="text-gray-500 mt-2">
            Keep skipping to increase your savings!
          </p>
        </div>
        
        <div className="grid gap-4 mb-8">
          {selectedHabits.map((habit) => (
            <SkipCard 
              key={habit.id}
              habit={habit}
              onSkip={() => handleSkip(habit.id)}
              recentlySkipped={recentlySkipped.includes(habit.id)}
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
