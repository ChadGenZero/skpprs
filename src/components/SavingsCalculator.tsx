
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon, CalendarIcon, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const AnimatedCounter: React.FC<{ value: number, duration?: number }> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const step = value / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{formatCurrency(displayValue)}</span>;
};

const SavingsCalculator: React.FC = () => {
  const { selectedHabits, annualSavings, setStep } = useAppContext();
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Calculate savings across different time periods
  const dailySavings = annualSavings / 365;
  const weeklySavings = annualSavings / 52;
  const monthlySavings = annualSavings / 12;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-scale-in">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-medium mb-3">
            Step 2
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Potential Savings</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Here's what you could save by skipping these habits and investing in Bitcoin instead.
          </p>
        </div>
        
        <div className="glass-card mb-8 overflow-hidden">
          <div className="bg-gradient-to-br from-bitcoin/90 to-bitcoin p-6 text-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Annual Savings</h2>
              <CalendarIcon size={20} />
            </div>
            <div className="text-4xl font-bold">
              <AnimatedCounter value={annualSavings} duration={1500} />
            </div>
          </div>
          
          <div className="p-6 grid gap-6 md:grid-cols-3">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                <DollarSign size={14} /> Daily
              </span>
              <span className="text-xl font-medium">
                <AnimatedCounter value={dailySavings} duration={1200} />
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                <DollarSign size={14} /> Weekly
              </span>
              <span className="text-xl font-medium">
                <AnimatedCounter value={weeklySavings} duration={1300} />
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                <DollarSign size={14} /> Monthly
              </span>
              <span className="text-xl font-medium">
                <AnimatedCounter value={monthlySavings} duration={1400} />
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Habits you're skipping:</h3>
          <div className="grid gap-3">
            {selectedHabits.map((habit) => (
              <div 
                key={habit.id} 
                className={cn(
                  "p-4 rounded-lg border bg-white/70",
                  "transform transition-all duration-500 animate-fade-in"
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{habit.name}</span>
                  <span className="font-semibold text-bitcoin">
                    {formatCurrency(habit.expense)} × {habit.frequency} / {habit.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            className="px-4 py-2"
            onClick={() => setStep(1)}
          >
            <ArrowLeftIcon className="mr-2" size={16} />
            <span>Back</span>
          </Button>
          
          <Button 
            className={cn(
              "bg-bitcoin hover:bg-bitcoin/90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all",
              !animationComplete && "opacity-50 pointer-events-none"
            )}
            onClick={() => setStep(3)}
            disabled={!animationComplete}
          >
            <span>See Growth Potential</span>
            <TrendingUpIcon className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
