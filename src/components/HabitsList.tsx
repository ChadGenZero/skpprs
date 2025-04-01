
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Habit {
  habit_id: string;
  habit_name: string;
  cost_per_skip: number;
  created_at: string;
}

const HabitsList: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [skipping, setSkipping] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!userData.user) {
        return;
      }
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setHabits(data || []);
      if (data && data.length > 0 && !selectedHabit) {
        setSelectedHabit(data[0].habit_id);
      }
    } catch (error: any) {
      toast.error('Failed to fetch habits', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!selectedHabit) {
      toast.error('Please select a habit to skip');
      return;
    }
    
    try {
      setSkipping(true);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!userData.user) {
        toast.error('You must be logged in to skip habits');
        return;
      }
      
      const { error } = await supabase.from('skips').insert({
        user_id: userData.user.id,
        habit_id: selectedHabit
      });
      
      if (error) {
        throw error;
      }
      
      // Find the habit that was skipped
      const skippedHabit = habits.find(h => h.habit_id === selectedHabit);
      
      toast.success('Habit skipped successfully!', {
        description: `You saved $${skippedHabit?.cost_per_skip.toFixed(2) || '0.00'} by skipping this habit.`
      });
    } catch (error: any) {
      toast.error('Failed to skip habit', {
        description: error.message
      });
    } finally {
      setSkipping(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skip a Habit</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-4">Loading habits...</p>
        ) : habits.length === 0 ? (
          <p className="text-center py-4">No habits found. Create one above!</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="habit-select" className="text-sm font-medium">
                Select a Habit to Skip
              </label>
              <Select 
                value={selectedHabit} 
                onValueChange={setSelectedHabit}
                disabled={skipping}
              >
                <SelectTrigger id="habit-select">
                  <SelectValue placeholder="Select a habit" />
                </SelectTrigger>
                <SelectContent>
                  {habits.map((habit) => (
                    <SelectItem key={habit.habit_id} value={habit.habit_id}>
                      {habit.habit_name} (${habit.cost_per_skip.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full bg-bitcoin hover:bg-bitcoin/90"
              onClick={handleSkip}
              disabled={skipping || !selectedHabit}
            >
              {skipping ? 'Logging Skip...' : 'Skip This Habit'}
            </Button>
            
            <p className="text-xs text-center text-gray-500 pt-2">
              When you skip a habit, the cost is calculated towards your savings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitsList;
