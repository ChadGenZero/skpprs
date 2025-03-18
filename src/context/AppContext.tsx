
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Habit {
  id: string;
  name: string;
  expense: number;
  frequency: number;
  period: Frequency;
  skipped: number;
}

export interface AppContextType {
  step: number;
  setStep: (step: number) => void;
  habits: Habit[];
  selectedHabits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'skipped'>) => void;
  toggleHabit: (habitId: string) => void;
  skipHabit: (habitId: string) => void;
  resetSkips: () => void;
  totalSavings: number;
  annualSavings: number;
}

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Buying Coffee Daily',
    expense: 5.00,
    frequency: 1,
    period: 'daily',
    skipped: 0
  },
  {
    id: '2',
    name: 'Frequent Takeout & Food Delivery',
    expense: 15.00,
    frequency: 3,
    period: 'weekly',
    skipped: 0
  },
  {
    id: '3',
    name: 'Impulse Shopping (Retail Therapy)',
    expense: 50.00,
    frequency: 1,
    period: 'weekly',
    skipped: 0
  },
  {
    id: '4',
    name: 'Convenience Store & Gas Station Snacks',
    expense: 5.00,
    frequency: 3,
    period: 'weekly',
    skipped: 0
  },
  {
    id: '5',
    name: 'Multiple Streaming Services',
    expense: 15.00,
    frequency: 3,
    period: 'monthly',
    skipped: 0
  },
  {
    id: '6',
    name: 'In-App Purchases & Microtransactions',
    expense: 20.00,
    frequency: 1,
    period: 'monthly',
    skipped: 0
  },
  {
    id: '7',
    name: 'Gaming & Gambling',
    expense: 50.00,
    frequency: 1,
    period: 'weekly',
    skipped: 0
  },
  {
    id: '8',
    name: 'Bars & Nightlife',
    expense: 75.00,
    frequency: 2,
    period: 'monthly',
    skipped: 0
  },
  {
    id: '9',
    name: 'Frequent Clothing & Shoe Shopping',
    expense: 100.00,
    frequency: 1,
    period: 'monthly',
    skipped: 0
  }
];

// Helper function to calculate annual cost of a habit
const calculateAnnualCost = (habit: Habit): number => {
  switch (habit.period) {
    case 'daily':
      return habit.expense * habit.frequency * 365;
    case 'weekly':
      return habit.expense * habit.frequency * 52;
    case 'monthly':
      return habit.expense * habit.frequency * 12;
    case 'yearly':
      return habit.expense * habit.frequency;
    default:
      return 0;
  }
};

// Create context with default values
const AppContext = createContext<AppContextType>({
  step: 1,
  setStep: () => {},
  habits: [],
  selectedHabits: [],
  addHabit: () => {},
  toggleHabit: () => {},
  skipHabit: () => {},
  resetSkips: () => {},
  totalSavings: 0,
  annualSavings: 0
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);

  // Get selected habits
  const selectedHabits = habits.filter(habit => selectedHabitIds.includes(habit.id));
  
  // Calculate total savings from skips
  const totalSavings = selectedHabits.reduce((total, habit) => {
    return total + (habit.skipped * habit.expense);
  }, 0);
  
  // Calculate annual savings
  const annualSavings = selectedHabits.reduce((total, habit) => {
    return total + calculateAnnualCost(habit);
  }, 0);

  // Add a new habit
  const addHabit = (habit: Omit<Habit, 'id' | 'skipped'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `custom-${Date.now()}`,
      skipped: 0
    };
    setHabits([...habits, newHabit]);
    // Auto-select newly added habits
    setSelectedHabitIds([...selectedHabitIds, newHabit.id]);
  };

  // Toggle a habit selection
  const toggleHabit = (habitId: string) => {
    if (selectedHabitIds.includes(habitId)) {
      setSelectedHabitIds(selectedHabitIds.filter(id => id !== habitId));
    } else {
      setSelectedHabitIds([...selectedHabitIds, habitId]);
    }
  };

  // Skip a habit (increment skip count)
  const skipHabit = (habitId: string) => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, skipped: habit.skipped + 1 } : habit
    ));
  };

  // Reset all skip counts
  const resetSkips = () => {
    setHabits(habits.map(habit => ({ ...habit, skipped: 0 })));
  };

  return (
    <AppContext.Provider value={{
      step,
      setStep,
      habits,
      selectedHabits,
      addHabit,
      toggleHabit,
      skipHabit,
      resetSkips,
      totalSavings,
      annualSavings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
