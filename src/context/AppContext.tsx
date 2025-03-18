
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface SkipLog {
  habitId: string;
  date: string; // ISO date string
  day: DayOfWeek;
}

export interface Habit {
  id: string;
  name: string;
  expense: number;
  frequency: number;
  period: Frequency;
  skipped: number;
  skippedDays: SkipLog[];
}

export interface AppContextType {
  step: number;
  setStep: (step: number) => void;
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  selectedHabits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'skipped' | 'skippedDays'>) => void;
  updateHabit: (habitId: string, updatedHabit: Partial<Omit<Habit, 'id'>>) => void;
  toggleHabit: (habitId: string) => void;
  skipHabit: (habitId: string) => void;
  skipHabitOnDay: (habitId: string, day: DayOfWeek) => void;
  resetSkips: () => void;
  totalSavings: number;
  annualSavings: number;
  weeklySkipSavings: number;
  getCurrentWeekSkips: (habitId: string) => DayOfWeek[];
  getStartOfWeek: () => Date;
}

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Buying Coffee Daily',
    expense: 5.00,
    frequency: 1,
    period: 'daily',
    skipped: 0,
    skippedDays: []
  },
  {
    id: '2',
    name: 'Frequent Takeout & Food Delivery',
    expense: 15.00,
    frequency: 3,
    period: 'weekly',
    skipped: 0,
    skippedDays: []
  },
  {
    id: '3',
    name: 'Impulse Shopping (Retail Therapy)',
    expense: 50.00,
    frequency: 1,
    period: 'weekly',
    skipped: 0,
    skippedDays: []
  },
  {
    id: '4',
    name: 'Convenience Store & Gas Station Snacks',
    expense: 5.00,
    frequency: 3,
    period: 'weekly',
    skipped: 0,
    skippedDays: []
  },
  {
    id: '5',
    name: 'Multiple Streaming Services',
    expense: 15.00,
    frequency: 3,
    period: 'monthly',
    skipped: 0,
    skippedDays: []
  },
  {
    id: '6',
    name: 'In-App Purchases & Microtransactions',
    expense: 20.00,
    frequency: 1,
    period: 'monthly',
    skipped: 0,
    skippedDays: []
  },
  {
    id: '7',
    name: 'Gaming & Gambling',
    expense: 50.00,
    frequency: 1,
    period: 'weekly',
    skipped: 0,
    skippedDays: []
  },
  {
    id: '8',
    name: 'Bars & Nightlife',
    expense: 75.00,
    frequency: 2,
    period: 'monthly',
    skipped: 0,
    skippedDays: []
  },
  {
    id: '9',
    name: 'Frequent Clothing & Shoe Shopping',
    expense: 100.00,
    frequency: 1,
    period: 'monthly',
    skipped: 0,
    skippedDays: []
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

// Helper to get start of current week (Monday)
const getStartOfWeek = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(now.setDate(diff));
};

// Helper to convert JS day number to day string
const getDayStringFromDate = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[date.getDay()];
};

// Create context with default values
const AppContext = createContext<AppContextType>({
  step: 1,
  setStep: () => {},
  habits: [],
  setHabits: () => {},
  selectedHabits: [],
  addHabit: () => {},
  updateHabit: () => {},
  toggleHabit: () => {},
  skipHabit: () => {},
  skipHabitOnDay: () => {},
  resetSkips: () => {},
  totalSavings: 0,
  annualSavings: 0,
  weeklySkipSavings: 0,
  getCurrentWeekSkips: () => [],
  getStartOfWeek: () => new Date(),
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

  // Calculate weekly savings based on skips in the current week
  const weeklySkipSavings = selectedHabits.reduce((total, habit) => {
    const startOfWeek = getStartOfWeek();
    const weekSkips = habit.skippedDays.filter(skip => {
      const skipDate = new Date(skip.date);
      return skipDate >= startOfWeek;
    });
    return total + (weekSkips.length * habit.expense);
  }, 0);

  // Get current week skips for a specific habit
  const getCurrentWeekSkips = (habitId: string): DayOfWeek[] => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];
    
    const startOfWeek = getStartOfWeek();
    return habit.skippedDays
      .filter(skip => {
        const skipDate = new Date(skip.date);
        return skipDate >= startOfWeek;
      })
      .map(skip => skip.day);
  };

  // Add a new habit
  const addHabit = (habit: Omit<Habit, 'id' | 'skipped' | 'skippedDays'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `custom-${Date.now()}`,
      skipped: 0,
      skippedDays: []
    };
    setHabits([...habits, newHabit]);
    // Auto-select newly added habits
    setSelectedHabitIds([...selectedHabitIds, newHabit.id]);
  };

  // Update existing habit
  const updateHabit = (habitId: string, updatedHabit: Partial<Omit<Habit, 'id'>>) => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, ...updatedHabit } : habit
    ));
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

  // Skip a habit on a specific day of the week
  const skipHabitOnDay = (habitId: string, day: DayOfWeek) => {
    const now = new Date();
    const skipLog: SkipLog = {
      habitId,
      date: now.toISOString(),
      day
    };

    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        // Check if already skipped today to avoid duplicates
        const today = now.toDateString();
        const alreadySkippedToday = habit.skippedDays.some(
          skip => new Date(skip.date).toDateString() === today && skip.day === day
        );

        if (!alreadySkippedToday) {
          return {
            ...habit,
            skipped: habit.skipped + 1,
            skippedDays: [...habit.skippedDays, skipLog]
          };
        }
      }
      return habit;
    }));
  };

  // Reset all skip counts
  const resetSkips = () => {
    setHabits(habits.map(habit => ({ ...habit, skipped: 0, skippedDays: [] })));
  };

  return (
    <AppContext.Provider value={{
      step,
      setStep,
      habits,
      setHabits,
      selectedHabits,
      addHabit,
      updateHabit,
      toggleHabit,
      skipHabit,
      skipHabitOnDay,
      resetSkips,
      totalSavings,
      annualSavings,
      weeklySkipSavings,
      getCurrentWeekSkips,
      getStartOfWeek
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
