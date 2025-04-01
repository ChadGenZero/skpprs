
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { startOfWeek, endOfWeek, format } from 'date-fns';

interface UserStats {
  email: string;
  total_skips: number;
  total_savings: number;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  // Current week date range
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // End on Sunday
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/app');
        return;
      }
      
      // Check if user is admin (hello.chadcooper@gmail.com)
      if (session.user.email !== 'hello.chadcooper@gmail.com') {
        toast.error('Unauthorized', {
          description: 'You do not have permission to access this page.'
        });
        navigate('/app');
        return;
      }
      
      setAuthorized(true);
      fetchUsers();
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get user stats for the current week
      const { data, error } = await supabase
        .rpc('get_user_stats_for_week', {
          week_start: weekStart.toISOString(),
          week_end: weekEnd.toISOString()
        });
        
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch users', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (email: string, skips: number, savings: number) => {
    try {
      const { error } = await supabase.functions.invoke('send-weekly-report', {
        body: {
          email,
          skips,
          savings
        }
      });
      
      if (error) throw error;
      
      toast.success('Email sent successfully', {
        description: `A weekly report has been sent to ${email}`
      });
    } catch (error: any) {
      toast.error('Failed to send email', {
        description: error.message
      });
    }
  };

  if (!authorized) {
    return <div className="flex justify-center items-center h-screen">Checking authorization...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <p className="text-gray-500">
            Weekly user stats ({format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')})
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading user data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Weekly Skips</TableHead>
                  <TableHead>Weekly Savings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">No users found for this week</TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.total_skips}</TableCell>
                      <TableCell>${user.total_savings.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => sendEmail(user.email, user.total_skips, user.total_savings)}
                        >
                          Send Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
