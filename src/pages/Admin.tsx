
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserStats {
  email: string;
  total_skips: number;
  total_savings: number;
}

// Define the type for the RPC function parameters
interface UserStatsParams {
  week_start: string;
  week_end: string;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
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
      
      // Get user stats for the current week - explicitly type the parameters
      const params: UserStatsParams = {
        week_start: weekStart.toISOString(),
        week_end: weekEnd.toISOString()
      };
      
      const { data, error } = await supabase
        .rpc('get_user_stats_for_week', params);
        
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

  const sendAllEmails = async () => {
    if (users.length === 0) {
      toast.error('No users to send emails to');
      return;
    }

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          await supabase.functions.invoke('send-weekly-report', {
            body: {
              email: user.email,
              skips: user.total_skips,
              savings: user.total_savings
            }
          });
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      if (errorCount === 0) {
        toast.success(`Successfully sent emails to all ${successCount} users`);
      } else {
        toast.success(`Sent emails to ${successCount} users with ${errorCount} errors`);
      }
    } catch (error: any) {
      toast.error('Failed to send bulk emails', {
        description: error.message
      });
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

  if (!authorized) {
    return <div className="flex justify-center items-center h-screen">Checking authorization...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">
            Weekly user stats ({format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')})
          </p>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm bg-royal-blue text-white rounded hover:bg-royal-blue/90 transition"
          >
            User Dashboard
          </button>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      <Card className="w-full mb-8">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <CardTitle className="text-2xl">User Reports</CardTitle>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            <Button 
              onClick={sendAllEmails}
              disabled={loading || users.length === 0}
              className="bg-royal-blue hover:bg-royal-blue/90"
            >
              Send All Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading user data...</div>
          ) : (
            <div className="overflow-x-auto">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
