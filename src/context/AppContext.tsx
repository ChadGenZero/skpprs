import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface SkipLog {
  habitId: string;
  date: string; // ISO date string
  amountSaved: number;
  isForfeited?: boolean;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string; // User-selected emoji
  expense: number; // Cost per occurrence
  frequency: number; // Number of occurrences
  period: Frequency;
  skipped: number;
  skippedDays: SkipLog[];
  skipGoal: number; // Weekly skip goal
  weeklyTotalPotential: number; // Calculated total possible weekly spend
  isForfeited?: boolean; // Whether the weekly/monthly habit has been forfeited
}

export interface AppContextType {
  step: number;
  setStep: (step: number) => void;
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  selectedHabits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'skipped' | 'skippedDays' | 'weeklyTotalPotential'>) => void;
  updateHabit: (habitId: string, updatedHabit: Partial<Omit<Habit, 'id'>>) => void;
  toggleHabit: (habitId: string) => void;
  skipHabit: (habitId: string, amount?: number) => void;
  forfeitHabit: (habitId: string, undo?: boolean) => void;
  unskipLog: (habitId: string, skipLogIndex: number) => void;
  resetSkips: () => void;
  superSkip: () => void; // One-tap skip all eligible habits
  totalSavings: number;
  annualSavings: number;
  weeklySkipSavings: number;
  getCurrentWeekSkips: (habitId: string) => SkipLog[];
  getTodaySkips: (habitId: string) => SkipLog[];
  getStartOfWeek: () => Date;
  calculateHabitSavings: (habit: Habit) => number;
  getRemainingSkips: (habit: Habit) => number;
  getBonusSkipPotential: (habit: Habit) => number;
  getMaxBonusSkips: (habit: Habit) => number;
  getSkipGoalProgress: (habit: Habit) => { completed: number; total: number };
  canSkipToday: (habit: Habit) => boolean;
  isToday: (date: string) => boolean;
}

const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Coffee',
    emoji: '☕',
    expense: 5.00,
    frequency: 7,
    period: 'daily',
    skipped: 0,
    skippedDays: [],
    skipGoal: 5,
    weeklyTotalPotential: 35.00
  },
  {
    id: '2',
    name: 'Fast Food',
    emoji: '🍔',
    expense: 15.00,
    frequency: 3,
    period: 'weekly',
    skipped: 0,
    skippedDays: [],
    skipGoal: 2,
    weeklyTotalPotential: 45.00
  },
  {
    id: '3',
    name: 'Shopping',
    emoji: '🛍️',
    expense: 50.00,
    frequency: 1,
    period: 'weekly',
    skipped: 0,
    skippedDays: [],
    skipGoal: 1,
    weeklyTotalPotential: 50.00
  },
  {
    id: '4',
    name: 'Snacks',
    emoji: '🍫',
    expense: 5.00,
    frequency: 5,
    period: 'weekly',
    skipped: 0,
    skippedDays: [],
    skipGoal: 3,
    weeklyTotalPotential: 25.00
  },
  {
    id: '5',
    name: 'Streaming',
    emoji: '📺',
    expense: 15.00,
    frequency: 1,
    period: 'monthly',
    skipped: 0,
    skippedDays: [],
    skipGoal: 1,
    weeklyTotalPotential: 3.75
  }
];

const calculateWeeklyEquivalent = (amount: number, frequency: number, period: Frequency): number => {
  switch (period) {
    case 'daily':
      return amount * frequency * 7;
    case 'weekly':
      return amount * frequency;
    case 'fortnightly':
      return (amount * frequency) / 2;
    case 'monthly':
      return (amount * frequency) / 4;
    case 'quarterly':
      return (amount * frequency) / 12;
    case 'yearly':
      return (amount * frequency) / 52;
    default:
      return 0;
  }
};

const calculateAnnualCost = (habit: Habit): number => {
  switch (habit.period) {
    case 'daily':
      return habit.expense * habit.frequency * 365;
    case 'weekly':
      return habit.expense * habit.frequency * 52;
    case 'fortnightly':
      return habit.expense * habit.frequency * 26;
    case 'monthly':
      return habit.expense * habit.frequency * 12;
    case 'quarterly':
      return habit.expense * habit.frequency * 4;
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

const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
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
  forfeitHabit: () => {},
  unskipLog: () => {},
  resetSkips: () => {},
  superSkip: () => {},
  totalSavings: 0,
  annualSavings: 0,
  weeklySkipSavings: 0,
  getCurrentWeekSkips: () => [],
  getTodaySkips: () => [],
  getStartOfWeek: () => new Date(),
  calculateHabitSavings: () => 0,
  getRemainingSkips: () => 0,
  getBonusSkipPotential: () => 0,
  getMaxBonusSkips: () => 0,
  getSkipGoalProgress: () => ({ completed: 0, total: 0 }),
  canSkipToday: () => false,
  isToday: () => false,
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
    
    return weekSkips.reduce((total, skip) => total + skip.amountSaved, 0);
  };
  
  const totalSavings = selectedHabits.reduce((total, habit) => {
    return total + habit.skippedDays.reduce((sum, skip) => sum + skip.amountSaved, 0);
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
  
  const getTodaySkips = (habitId: string): SkipLog[] => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];
    
    return habit.skippedDays.filter(skip => isToday(skip.date));
  };

  const getRemainingSkips = (habit: Habit): number => {
    const currentWeekSkips = getCurrentWeekSkips(habit.id);
    const completedSkips = currentWeekSkips.filter(skip => !skip.isForfeited).length;
    return Math.max(0, habit.skipGoal - completedSkips);
  };

  const getBonusSkipPotential = (habit: Habit): number => {
    const weeklyPotential = habit.weeklyTotalPotential;
    const skipGoalValue = habit.skipGoal * habit.expense;
    return Math.max(0, weeklyPotential - skipGoalValue);
  };
  
  const getMaxBonusSkips = (habit: Habit): number => {
    const bonusPotential = getBonusSkipPotential(habit);
    return Math.floor(bonusPotential / habit.expense);
  };

  const getSkipGoalProgress = (habit: Habit): { completed: number; total: number } => {
    const currentWeekSkips = getCurrentWeekSkips(habit.id);
    const completedSkips = currentWeekSkips.filter(skip => !skip.isForfeited).length;
    return {
      completed: completedSkips,
      total: habit.skipGoal
    };
  };
  
  const canSkipToday = (habit: Habit): boolean => {
    if (habit.isForfeited) return false;
    
    // Check if habit has a period longer than weekly
    const isLongerThanWeeklyPeriod = ['fortnightly', 'monthly', 'quarterly', 'yearly'].includes(habit.period);
    if (isLongerThanWeeklyPeriod) return false;
    
    const currentWeekSkips = getCurrentWeekSkips(habit.id);
    const completedSkips = currentWeekSkips.filter(skip => !skip.isForfeited).length;
    const todaySkips = getTodaySkips(habit.id);
    
    // Calculate maximum possible skips (base goal + bonus skips)
    const maxPossibleSkips = habit.skipGoal + getMaxBonusSkips(habit);
    
    // Can skip if haven't reached maximum possible skips and haven't skipped today
    return completedSkips < maxPossibleSkips && todaySkips.length === 0;
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'skipped' | 'skippedDays' | 'weeklyTotalPotential'>) => {
    const weeklyTotal = calculateWeeklyEquivalent(habit.expense, habit.frequency, habit.period);
    
    const newHabit: Habit = {
      ...habit,
      id: `custom-${Date.now()}`,
      skipped: 0,
      skippedDays: [],
      weeklyTotalPotential: weeklyTotal
    };
    
    setHabits([...habits, newHabit]);
    setSelectedHabitIds([...selectedHabitIds, newHabit.id]);
  };

  const updateHabit = (habitId: string, updatedHabit: Partial<Omit<Habit, 'id'>>) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const updated = { ...habit, ...updatedHabit };
        
        // Recalculate weekly potential if relevant fields changed
        if (
          updatedHabit.expense !== undefined || 
          updatedHabit.frequency !== undefined || 
          updatedHabit.period !== undefined
        ) {
          updated.weeklyTotalPotential = calculateWeeklyEquivalent(
            updated.expense,
            updated.frequency,
            updated.period
          );
        }
        
        return updated;
      }
      return habit;
    }));
  };

  const toggleHabit = (habitId: string) => {
    if (selectedHabitIds.includes(habitId)) {
      setSelectedHabitIds(selectedHabitIds.filter(id => id !== habitId));
    } else {
      setSelectedHabitIds([...selectedHabitIds, habitId]);
    }
  };

  const skipHabit = (habitId: string, amount?: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        if (habit.isForfeited) return habit; // Skip if habit is forfeited
        
        // Get current week skips
        const currentSkips = getCurrentWeekSkips(habit.id).filter(skip => !skip.isForfeited).length;
        const maxSkips = habit.skipGoal + getMaxBonusSkips(habit);
        
        // Don't allow more skips than the maximum (goal + bonus)
        if (currentSkips >= maxSkips) return habit;
        
        const skipAmount = amount || habit.expense;
        
        return {
          ...habit,
          skipped: habit.skipped + 1,
          skippedDays: [
            ...habit.skippedDays,
            {
              habitId,
              date: new Date().toISOString(),
              amountSaved: skipAmount
            }
          ]
        };
      }
      return habit;
    }));
  };

  const forfeitHabit = (habitId: string, undo: boolean = false) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        if (undo) {
          // Undo forfeit (only if it was forfeited today)
          const todayForfeits = habit.skippedDays.some(skip => 
            isToday(skip.date) && skip.isForfeited
          );
          
          if (!todayForfeits) return habit; // If not forfeited today, don't allow undo
          
          return {
            ...habit,
            isForfeited: false,
            // Restore any skips that were forfeited today
            skippedDays: habit.skippedDays.map(skip => {
              if (isToday(skip.date) && skip.isForfeited) {
                return { ...skip, isForfeited: false };
              }
              return skip;
            })
          };
        } else {
          // Forfeit the habit
          return {
            ...habit,
            isForfeited: true,
            // Mark all existing skips this week as forfeited
            skippedDays: habit.skippedDays.map(skip => {
              const skipDate = new Date(skip.date);
              const startOfWeek = getStartOfWeek();
              
              if (skipDate >= startOfWeek) {
                return { ...skip, isForfeited: true };
              }
              return skip;
            })
          };
        }
      }
      return habit;
    }));
  };

  const unskipLog = (habitId: string, skipLogIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        // Get the skip log to check if it's from today
        const skipLog = habit.skippedDays[skipLogIndex];
        
        // Only allow unskipping if the skip was logged today
        if (skipLog && isToday(skipLog.date)) {
          const updatedSkippedDays = [...habit.skippedDays];
          updatedSkippedDays.splice(skipLogIndex, 1);
          
          return {
            ...habit,
            skipped: Math.max(0, habit.skipped - 1),
            skippedDays: updatedSkippedDays
          };
        }
      }
      return habit;
    }));
  };

  const resetSkips = () => {
    setHabits(habits.map(habit => ({ 
      ...habit, 
      skipped: 0, 
      skippedDays: [],
      isForfeited: false 
    })));
  };

  const superSkip = () => {
    // Skip all non-forfeited DAILY habits that haven't been skipped today
    selectedHabits.forEach(habit => {
      // Make sure to only super skip daily habits
      if (canSkipToday(habit) && habit.period === 'daily') {
        skipHabit(habit.id);
      }
    });
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
      forfeitHabit,
      unskipLog,
      resetSkips,
      superSkip,
      totalSavings,
      annualSavings,
      weeklySkipSavings,
      getCurrentWeekSkips,
      getTodaySkips,
      getStartOfWeek,
      calculateHabitSavings,
      getRemainingSkips,
      getBonusSkipPotential,
      getMaxBonusSkips,
      getSkipGoalProgress,
      canSkipToday,
      isToday
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
