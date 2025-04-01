
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
                    <path d="M17.6,13.8c0-3,2.5-4.5,2.6-4.6c-1.4-2.1-3.6-2.3-4.4-2.4c-1.9-0.2-3.6,1.1-4.6,1.1c-0.9,0-2.4-1.1-4-1.1c-2,0-3.9,1.2-5,3c-2.1,3.7-0.5,9.1,1.5,12.1c1,1.5,2.2,3.1,3.8,3c1.5-0.1,2.1-1,3.9-1c1.8,0,2.4,1,4,1c1.7,0,2.7-1.5,3.7-2.9c1.2-1.7,1.6-3.3,1.7-3.4C20.8,18.5,17.6,17,17.6,13.8z M14.5,4.2c0.8-1,1.4-2.4,1.2-3.8c-1.2,0-2.7,0.8-3.5,1.8c-0.8,0.9-1.5,2.3-1.3,3.7C12.1,6,13.7,5.2,14.5,4.2z" />
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
