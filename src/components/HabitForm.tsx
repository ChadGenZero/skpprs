
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const HabitForm: React.FC = () => {
  const [habitName, setHabitName] = useState('');
  const [costPerSkip, setCostPerSkip] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habitName.trim() || !costPerSkip.trim()) {
      toast.error('Please fill out all fields');
      return;
    }

    if (isNaN(parseFloat(costPerSkip)) || parseFloat(costPerSkip) <= 0) {
      toast.error('Cost per skip must be a positive number');
      return;
    }

    try {
      setLoading(true);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!userData.user) {
        toast.error('You must be logged in to create a habit');
        return;
      }
      
      const { error } = await supabase.from('habits').insert({
        user_id: userData.user.id,
        habit_name: habitName.trim(),
        cost_per_skip: parseFloat(costPerSkip)
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Habit created successfully!');
      setHabitName('');
      setCostPerSkip('');
    } catch (error: any) {
      toast.error('Failed to create habit', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Create New Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habitName">Habit Name</Label>
            <Input
              id="habitName"
              placeholder="e.g., Skip coffee, Skip taxi ride"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="costPerSkip">Cost Per Skip ($)</Label>
            <Input
              id="costPerSkip"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="5.00"
              value={costPerSkip}
              onChange={(e) => setCostPerSkip(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Habit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HabitForm;
