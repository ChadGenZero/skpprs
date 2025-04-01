
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

const SignUp: React.FC = () => {
  const { totalSavings, weeklySkipSavings, setStep } = useAppContext();
  const [showFullForm, setShowFullForm] = useState(false);
  
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
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-3">
            Step 5
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achieve Your Goals</h1>
          <p className="text-gray-600">
            Create an account to track your progress and achieve your savings goals!
          </p>
        </div>
        
        <Card className="relative overflow-hidden mb-8 border-0 shadow-lg">
          <CardContent className="pt-6 relative z-10">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border bg-white hover:bg-gray-200 text-gray-700"
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
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={() => handleOAuthSignUp('Apple')}
              >
                <span className="mr-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" className="inline" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
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
              
              {!showFullForm ? (
                <Button 
                  type="button" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setShowFullForm(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  SIGN UP WITH EMAIL
                </Button>
              ) : (
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
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      SIGN UP
                    </Button>
                  </form>
                </Form>
              )}
              
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
