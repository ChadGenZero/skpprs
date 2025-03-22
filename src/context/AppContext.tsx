import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type SavingsModel = 'fractional-skip' | 'full-skip';

export interface SkipLog {
  habitId: string;
  date: string; // ISO date string
  day: DayOfWeek;
  amountSaved?: number; // For both fractional-skip and full-skip models
}

export interface Habit {
  id: string;
  name: string;
  expense: number;
  frequency: number;
  period: Frequency;
  skipped: number;
  skippedDays: SkipLog[];
  savingsModel: SavingsModel;
  typicalWeeklySpend?: number; // For both fractional-skip and full-skip models
  weeklySavingsGoal?: number; // For both fractional-skip and full-skip models
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
  skipHabitOnDay: (habitId: string, day: DayOfWeek, amountSaved?: number) => void;
  unskipHabitOnDay: (habitId: string, day: DayOfWeek) => void;
  resetSkips: () => void;
  totalSavings: number;
  annualSavings: number;
  weeklySkipSavings: number;
  getCurrentWeekSkips: (habitId: string) => SkipLog[];
  getStartOfWeek: () => Date;
  calculateHabitSavings: (habit: Habit) => number;
}

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Buying Coffee Daily',
    expense: 5.00,
    frequency: 1,
    period: 'daily',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'full-skip',
    typicalWeeklySpend: 35.00,
    weeklySavingsGoal: 25.00
  },
  {
    id: '2',
    name: 'Frequent Takeout & Food Delivery',
    expense: 15.00,
    frequency: 3,
    period: 'weekly',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'fractional-skip',
    typicalWeeklySpend: 45.00,
    weeklySavingsGoal: 20.00
  },
  {
    id: '3',
    name: 'Impulse Shopping (Retail Therapy)',
    expense: 50.00,
    frequency: 1,
    period: 'weekly',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'full-skip',
    typicalWeeklySpend: 50.00,
    weeklySavingsGoal: 30.00
  },
  {
    id: '4',
    name: 'Convenience Store & Gas Station Snacks',
    expense: 5.00,
    frequency: 3,
    period: 'weekly',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'fractional-skip',
    typicalWeeklySpend: 15.00,
    weeklySavingsGoal: 10.00
  },
  {
    id: '5',
    name: 'Multiple Streaming Services',
    expense: 15.00,
    frequency: 3,
    period: 'monthly',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'full-skip',
    typicalWeeklySpend: 45.00,
    weeklySavingsGoal: 15.00
  },
  {
    id: '6',
    name: 'In-App Purchases & Microtransactions',
    expense: 20.00,
    frequency: 1,
    period: 'monthly',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'fractional-skip',
    typicalWeeklySpend: 20.00,
    weeklySavingsGoal: 10.00
  },
  {
    id: '7',
    name: 'Gaming & Gambling',
    expense: 50.00,
    frequency: 1,
    period: 'weekly',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'full-skip',
    typicalWeeklySpend: 50.00,
    weeklySavingsGoal: 25.00
  },
  {
    id: '8',
    name: 'Bars & Nightlife',
    expense: 75.00,
    frequency: 2,
    period: 'monthly',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'fractional-skip',
    typicalWeeklySpend: 75.00,
    weeklySavingsGoal: 30.00
  },
  {
    id: '9',
    name: 'Frequent Clothing & Shoe Shopping',
    expense: 100.00,
    frequency: 1,
    period: 'monthly',
    skipped: 0,
    skippedDays: [],
    savingsModel: 'full-skip',
    typicalWeeklySpend: 100.00,
    weeklySavingsGoal: 50.00
  }
];

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

const getStartOfWeek = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(now.setDate(diff));
};

const getDayStringFromDate = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[date.getDay()];
};

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
  unskipHabitOnDay: () => {},
  resetSkips: () => {},
  totalSavings: 0,
  annualSavings: 0,
  weeklySkipSavings: 0,
  getCurrentWeekSkips: () => [],
  getStartOfWeek: () => new Date(),
  calculateHabitSavings: () => 0,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);

  const selectedHabits = habits.filter(habit => selectedHabitIds.includes(habit.id));
  
  const calculateHabitSavings = (habit: Habit): number => {
    const startOfWeek = getStartOfWeek();
    const weekSkips = habit.skippedDays.filter(skip => {
      const skipDate = new Date(skip.date);
      return skipDate >= startOfWeek;
    });
    
    // Both fractional-skip and full-skip now use the same logic
    if (habit.savingsModel === 'fractional-skip' || habit.savingsModel === 'full-skip') {
      return weekSkips.reduce((total, skip) => total + (skip.amountSaved || 0), 0);
    }
    
    return 0;
  };
  
  const totalSavings = selectedHabits.reduce((total, habit) => {
    if (habit.savingsModel === 'fractional-skip') {
      return total + habit.skippedDays.reduce((sum, skip) => sum + (skip.amountSaved || 0), 0);
    } else if (habit.savingsModel === 'full-skip') {
      return total + habit.skippedDays.reduce((sum, skip) => sum + (skip.amountSaved || 0), 0);
    } else if (habit.savingsModel === 'fractional') {
      return total + (habit.skipped * habit.expense);
    } else {
      // all-or-nothing
      const completedWeeks = Math.floor(habit.skipped / 7);
      return total + (completedWeeks * habit.expense * habit.frequency);
    }
  }, 0);
  
  const annualSavings = selectedHabits.reduce((total, habit) => {
    return total + calculateAnnualCost(habit);
  }, 0);

  const weeklySkipSavings = selectedHabits.reduce((total, habit) => {
    return total + calculateHabitSavings(habit);
  }, 0);

  const getCurrentWeekSkips = (habitId: string): SkipLog[] => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];
    
    const startOfWeek = getStartOfWeek();
    return habit.skippedDays
      .filter(skip => {
        const skipDate = new Date(skip.date);
        return skipDate >= startOfWeek;
      });
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'skipped' | 'skippedDays'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `custom-${Date.now()}`,
      skipped: 0,
      skippedDays: []
    };
    setHabits([...habits, newHabit]);
    setSelectedHabitIds([...selectedHabitIds, newHabit.id]);
  };

  const updateHabit = (habitId: string, updatedHabit: Partial<Omit<Habit, 'id'>>) => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, ...updatedHabit } : habit
    ));
  };

  const toggleHabit = (habitId: string) => {
    if (selectedHabitIds.includes(habitId)) {
      setSelectedHabitIds(selectedHabitIds.filter(id => id !== habitId));
    } else {
      setSelectedHabitIds([...selectedHabitIds, habitId]);
    }
  };

  const skipHabit = (habitId: string) => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, skipped: habit.skipped + 1 } : habit
    ));
  };

  const skipHabitOnDay = (habitId: string, day: DayOfWeek, amountSaved?: number) => {
    const now = new Date();
    const skipLog: SkipLog = {
      habitId,
      date: now.toISOString(),
      day,
      amountSaved
    };

    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
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

  const unskipHabitOnDay = (habitId: string, day: DayOfWeek) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const skipToRemove = habit.skippedDays.find(skip => skip.day === day);
        
        if (skipToRemove) {
          return {
            ...habit,
            skipped: Math.max(0, habit.skipped - 1),
            skippedDays: habit.skippedDays.filter(skip => 
              !(skip.day === day && skip.date === skipToRemove.date)
            )
          };
        }
      }
      return habit;
    }));
  };

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
      unskipHabitOnDay,
      resetSkips,
      totalSavings,
      annualSavings,
      weeklySkipSavings,
      getCurrentWeekSkips,
      getStartOfWeek,
      calculateHabitSavings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
