
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HabitForm from './HabitForm';
import HabitsList from './HabitsList';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate('/app');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/app');
        return;
      }
      
      setUser(session.user);
    } catch (error: any) {
      toast.error('Authentication error', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/app');
    } catch (error: any) {
      toast.error('Failed to sign out', {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Habit Dashboard</h1>
          <p className="text-gray-500">Track, skip, and save money!</p>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          {user && user.email === 'hello.chadcooper@gmail.com' && (
            <button 
              onClick={() => navigate('/admin')}
              className="px-4 py-2 text-sm bg-royal-blue text-white rounded hover:bg-royal-blue/90 transition"
            >
              Admin Dashboard
            </button>
          )}
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <HabitForm />
        </div>
        <div>
          <HabitsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
