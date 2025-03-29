
import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Pizza, ShoppingBag, FastForward, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const habitItems = [
  { 
    name: "Daily Coffee", 
    icon: <Coffee className="text-orange-500" />, 
    cost: "$4.50", 
    frequency: "Daily", 
    savings: "$1,642 / year" 
  },
  { 
    name: "Fast Food", 
    icon: <Pizza className="text-red-500" />, 
    cost: "$12.00", 
    frequency: "3x week", 
    savings: "$1,872 / year" 
  },
  { 
    name: "Impulse Shopping", 
    icon: <ShoppingBag className="text-blue-500" />, 
    cost: "$25.00", 
    frequency: "2x week", 
    savings: "$2,600 / year" 
  },
  { 
    name: "Streaming Services", 
    icon: <FastForward className="text-purple-500" />, 
    cost: "$45.00", 
    frequency: "Monthly", 
    savings: "$540 / year" 
  },
  { 
    name: "Dining Out", 
    icon: <Star className="text-yellow-500" />, 
    cost: "$75.00", 
    frequency: "Weekly", 
    savings: "$3,900 / year" 
  }
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-center md:justify-between items-center py-4 mb-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-royal-blue rounded-md text-white">
              <span className="text-2xl font-bold tracking-tighter">S</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-royal-blue">Skiipper</h1>
              <p className="text-xs text-gray-500 ml-1">Set Sail</p>
            </div>
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/app">
              <Button variant="default" className="bg-royal-blue hover:bg-royal-blue/90">
                Get Started
              </Button>
            </Link>
          </div>
        </header>
        
        <main>
          <section className="mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Skip, Save, & Stack Sats!</h2>
              <div className="glass-card p-8 mb-10">
                <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                  <span className="font-semibold">Hidden spending is costing you more than you think.</span> A survey found that the average person spends <span className="font-bold text-royal-blue">$18,000 a year</span> on non-essential items—lattes, impulse buys, streaming services, and more. These small purchases add up fast. See how much you could save by making small sacrifices for big rewards!
                </p>
                <div className="md:hidden mt-8">
                  <Link to="/app">
                    <Button variant="default" className="w-full bg-royal-blue hover:bg-royal-blue/90">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Habits - Skip & Save Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Habit</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Potential Savings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {habitItems.map((item, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="p-4">{item.icon}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.cost}</TableCell>
                            <TableCell>{item.frequency}</TableCell>
                            <TableCell className="font-bold text-green-600">{item.savings}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-10 text-center">
                    <div className="mb-6 text-gray-700">Ready to see how much you can save?</div>
                    <Link to="/app">
                      <Button size="lg" className="bg-royal-blue hover:bg-royal-blue/90">
                        Start Tracking Your Savings
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>© 2023 Skiipper. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
