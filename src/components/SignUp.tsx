
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeftIcon, Mail, User, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Create a schema for form validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

// Get inferred type from schema
type FormValues = z.infer<typeof formSchema>;

const PositionedEmojis = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
    <span 
      className="absolute animate-bounce-subtle text-4xl"
      style={{ 
        top: '10%',
        left: '5%',
      }}
    >
      👨‍✈️
    </span>
    <span 
      className="absolute animate-bounce-subtle text-4xl"
      style={{ 
        top: '15%',
        right: '5%',
      }}
    >
      ⛵
    </span>
    <span 
      className="absolute animate-bounce-subtle text-4xl"
      style={{ 
        top: '30%',
        left: '7%',
      }}
    >
      🗺️
    </span>
    <span 
      className="absolute animate-bounce-subtle text-4xl"
      style={{ 
        bottom: '15%',
        right: '8%',
      }}
    >
      ⚓
    </span>
    <span 
      className="absolute animate-bounce-subtle text-4xl"
      style={{ 
        bottom: '40%',
        left: '10%',
      }}
    >
      🐠
    </span>
  </div>
);

const SignUp: React.FC = () => {
  const { totalSavings, weeklySkipSavings, setStep } = useAppContext();
  const [authMethod, setAuthMethod] = useState<'email' | 'oauth'>('email');
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const handleSignUp = (values: FormValues) => {
    console.log('Signup values:', values);
    console.log('Total savings tracking:', totalSavings);
    console.log('Weekly skips tracking:', weeklySkipSavings);
    
    // In a real app, we would send this data to an API
    // For now, we'll just show a success message
    toast.success('Account created!', {
      description: `Welcome aboard, ${values.name}! Your savings journey awaits.`,
    });
  };

  const handleOAuthSignUp = (provider: string) => {
    console.log(`Signing up with ${provider}`);
    console.log('Total savings tracking:', totalSavings);
    console.log('Weekly skips tracking:', weeklySkipSavings);
    
    // In a real app, we would redirect to OAuth provider
    // For now, we'll just show a success message
    toast.success(`${provider} sign-up initiated`, {
      description: "This would redirect to the provider in a real app.",
    });
  };

  return (
    <div className="animate-scale-in relative">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-royal-blue/10 text-royal-blue text-sm font-medium mb-3">
            Step 5
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achieve Your Goals</h1>
          <p className="text-gray-600">
            Create an account to track your progress and achieve your savings goals!
          </p>
        </div>
        
        <Card className="relative overflow-hidden mb-8 border-0 shadow-lg">
          <PositionedEmojis />
          <CardHeader className="text-center space-y-1 relative z-10">
            <CardTitle className="text-2xl font-bold">Build habits you won't quit</CardTitle>
            <p className="text-sm text-gray-500">Grow your Habit Garden!</p>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border bg-white hover:bg-gray-50 text-gray-700"
                onClick={() => handleOAuthSignUp('Google')}
              >
                <span className="mr-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" className="inline">
                    <path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z" />
                  </svg>
                </span>
                SIGN UP WITH GOOGLE
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full bg-black hover:bg-gray-900 text-white"
                onClick={() => handleOAuthSignUp('Apple')}
              >
                <span className="mr-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" className="inline" fill="white">
                    <path d="M17.05,15.28C16.86,15.7 16.64,16.11 16.38,16.5C16.01,17.06 15.6,17.55 15.14,17.97C14.45,18.58 13.7,18.9 12.9,18.94C12.3,18.96 11.81,18.84 11.42,18.59C11.16,18.4 10.8,18.21 10.36,18.02C9.87,17.83 9.38,17.74 8.88,17.74C8.37,17.74 7.87,17.83 7.38,18.02C6.93,18.21 6.58,18.4 6.32,18.59C5.93,18.84 5.44,18.96 4.85,18.94C4.05,18.9 3.3,18.58 2.61,17.97C2.15,17.55 1.74,17.06 1.37,16.5C0.99,15.92 0.68,15.28 0.44,14.58C0.18,13.84 0.05,13.1 0.05,12.36C0.05,11.5 0.22,10.75 0.55,10.1C0.83,9.55 1.2,9.09 1.67,8.72C2.14,8.35 2.67,8.16 3.27,8.15C3.86,8.14 4.38,8.26 4.84,8.52C5.17,8.7 5.57,8.9 6.06,9.11C6.55,9.32 7.03,9.42 7.5,9.42C7.95,9.42 8.42,9.32 8.91,9.11C9.4,8.9 9.8,8.7 10.13,8.52C10.59,8.26 11.11,8.14 11.7,8.15C12.3,8.16 12.84,8.35 13.3,8.72C13.77,9.09 14.15,9.55 14.43,10.1C14.48,10.19 14.53,10.28 14.58,10.38C14.06,10.72 13.63,11.17 13.31,11.72C12.92,12.37 12.72,13.07 12.72,13.82C12.72,14.52 12.9,15.19 13.27,15.83C13.64,16.47 14.12,16.97 14.72,17.32C14.5,17.65 14.27,17.97 14.03,18.27C13.81,18.54 13.59,18.79 13.36,19.02C12.94,19.44 12.57,19.75 12.24,19.94C11.91,20.14 11.48,20.24 10.94,20.24C10.37,20.24 9.87,20.14 9.47,19.94C9.06,19.74 8.7,19.53 8.37,19.32C7.95,19.06 7.47,18.95 6.92,18.97C6.38,18.99 5.89,19.11 5.46,19.32C5.13,19.53 4.77,19.74 4.36,19.94C3.96,20.14 3.47,20.24 2.89,20.24C2.35,20.24 1.92,20.14 1.59,19.94C1.26,19.75 0.89,19.44 0.47,19.02C0.24,18.79 0.02,18.54 -0.2,18.27C-0.44,17.97 -0.67,17.65 -0.89,17.32C-0.29,16.97 0.19,16.47 0.56,15.83C0.93,15.19 1.11,14.52 1.11,13.82C1.11,13.07 0.91,12.37 0.52,11.72C0.2,11.17 -0.22,10.72 -0.75,10.38C-0.7,10.28 -0.65,10.19 -0.6,10.1C-0.32,9.55 0.06,9.09 0.53,8.72C0.99,8.35 1.53,8.16 2.13,8.15C2.72,8.14 3.24,8.26 3.7,8.52C4.03,8.7 4.43,8.9 4.92,9.11C5.41,9.32 5.89,9.42 6.36,9.42C6.81,9.42 7.28,9.32 7.77,9.11C8.26,8.9 8.66,8.7 8.99,8.52C9.45,8.26 9.97,8.14 10.56,8.15C11.16,8.16 11.7,8.35 12.16,8.72C12.63,9.09 13.01,9.55 13.29,10.1C13.64,10.75 13.81,11.5 13.81,12.36C13.81,13.1 13.68,13.84 13.42,14.58C13.18,15.28 12.87,15.92 12.49,16.5C12.23,16.11 12.01,15.7 11.82,15.28C11.63,14.86 11.54,14.37 11.54,13.82C11.54,13.22 11.68,12.73 11.96,12.35C12.23,11.97 12.55,11.65 12.9,11.39C13.18,11.19 13.42,10.97 13.62,10.73C13.8,10.5 13.89,10.24 13.89,9.97C13.89,9.61 13.75,9.32 13.47,9.08C13.2,8.85 12.8,8.72 12.28,8.72C11.92,8.72 11.6,8.77 11.32,8.86C11.04,8.95 10.8,9.07 10.61,9.21C10.28,9.44 10.01,9.72 9.81,10.05C9.61,10.38 9.51,10.75 9.51,11.15C9.51,11.76 9.64,12.29 9.9,12.74C10.16,13.2 10.49,13.58 10.91,13.88C10.87,14.04 10.79,14.25 10.69,14.48C10.58,14.72 10.46,14.92 10.33,15.08C10.1,15.38 9.88,15.61 9.66,15.78C9.44,15.95 9.18,16.03 8.87,16.03C8.53,16.03 8.26,15.91 8.04,15.68C7.82,15.45 7.71,15.16 7.71,14.81C7.71,14.58 7.76,14.35 7.85,14.11C7.94,13.88 8.03,13.6 8.12,13.29C8.21,12.98 8.28,12.68 8.34,12.38C8.4,12.09 8.43,11.84 8.43,11.61C8.43,11.09 8.28,10.69 7.97,10.4C7.66,10.12 7.23,9.97 6.67,9.97C6.06,9.97 5.57,10.14 5.19,10.47C4.81,10.8 4.62,11.3 4.62,11.96C4.62,12.45 4.69,12.95 4.82,13.45C4.95,13.95 5.09,14.38 5.23,14.73C5.44,15.28 5.54,15.77 5.54,16.19C5.54,16.7 5.4,17.13 5.11,17.48C4.82,17.83 4.37,18 3.74,18C3.25,18 2.85,17.9 2.55,17.69C2.25,17.48 2,17.21 1.82,16.88C1.63,16.55 1.48,16.16 1.38,15.73C1.28,15.3 1.22,14.9 1.22,14.54C1.22,13.97 1.3,13.38 1.47,12.79C1.64,12.19 1.88,11.66 2.19,11.19C2.78,10.28 3.47,9.57 4.27,9.08C5.06,8.59 5.89,8.34 6.76,8.34C7.71,8.34 8.51,8.55 9.18,8.97C9.84,9.39 10.33,9.98 10.63,10.73C10.82,10.4 11.07,10.12 11.37,9.89C11.68,9.66 12.01,9.47 12.36,9.33C12.72,9.2 13.07,9.1 13.42,9.04C13.77,8.98 14.1,8.95 14.42,8.95C14.97,8.95 15.46,9.02 15.88,9.15C16.31,9.29 16.63,9.48 16.85,9.73C17.07,9.98 17.21,10.29 17.29,10.65C17.36,11.01 17.4,11.46 17.4,11.97C17.4,12.48 17.36,12.92 17.29,13.31C17.23,13.7 17.12,14.07 16.97,14.43C16.83,14.8 16.68,15.05 16.52,15.19C16.36,15.33 16.14,15.4 15.87,15.4C15.62,15.4 15.45,15.33 15.38,15.19C15.3,15.05 15.27,14.91 15.27,14.77C15.27,14.63 15.25,14.49 15.22,14.37C15.19,14.24 15.15,14.1 15.1,13.95C15.03,13.65 14.96,13.42 14.89,13.25C14.82,13.09 14.75,12.94 14.68,12.82C14.63,12.71 14.59,12.64 14.56,12.58C14.53,12.53 14.52,12.46 14.52,12.38C14.52,12.28 14.53,12.2 14.55,12.13C14.57,12.07 14.6,12 14.64,11.93C14.73,11.72 14.85,11.51 15.01,11.31C15.16,11.11 15.3,10.92 15.43,10.74C15.56,10.57 15.67,10.41 15.77,10.27C15.86,10.12 15.91,10 15.91,9.89C15.91,9.75 15.88,9.65 15.82,9.59C15.76,9.53 15.65,9.5 15.5,9.5C15.28,9.5 15.13,9.6 15.04,9.79C14.95,9.98 14.91,10.24 14.91,10.57C14.91,10.92 14.86,11.21 14.76,11.44C14.67,11.67 14.52,11.89 14.33,12.09C14.06,12.38 13.79,12.63 13.51,12.86C13.24,13.09 13.05,13.41 12.94,13.84C12.83,14.26 12.78,14.67 12.78,15.07C12.78,15.43 12.88,15.81 13.08,16.2C13.27,16.6 13.5,16.92 13.77,17.18C14.37,16.71 14.85,16.11 15.2,15.39C15.55,14.67 15.73,13.88 15.73,13.03C15.73,12.51 15.67,12 15.56,11.53C15.45,11.05 15.3,10.6 15.11,10.18C14.93,9.76 14.71,9.36 14.45,8.99C14.2,8.63 13.94,8.29 13.66,7.99C13.12,7.42 12.53,6.96 11.88,6.59C11.24,6.23 10.52,6.05 9.72,6.05C9.26,6.05 8.8,6.11 8.35,6.23C7.9,6.35 7.53,6.48 7.24,6.63C6.9,6.8 6.53,6.89 6.13,6.9C5.74,6.91 5.37,6.82 5.03,6.63C4.74,6.48 4.37,6.35 3.92,6.23C3.47,6.11 3.01,6.05 2.55,6.05C1.75,6.05 1.03,6.23 0.39,6.59" />
                  </svg>
                </span>
                SIGN UP WITH APPLE
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Your name" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Your email" type="email" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Create a password" type="password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-royal-blue hover:bg-royal-blue/90"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    SIGN UP WITH EMAIL
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center text-xs text-gray-500">
                By signing up, you agree to our <a href="#" className="underline">Terms of Service</a> & <a href="#" className="underline">Privacy Policy</a>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-6 relative z-10">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account? 
                <Button variant="link" className="pl-1 text-royal-blue">
                  Log in
                </Button>
              </p>
            </div>
          </CardFooter>
        </Card>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            className="px-4 py-2"
            onClick={() => setStep(4)}
          >
            <ArrowLeftIcon className="mr-2" size={16} />
            <span>Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
