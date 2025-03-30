
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

// Updated habit items to match the ones from HabitSelector
const habitItems = [
  { 
    name: "Coffee", 
    icon: <span className="text-orange-500 text-xl">☕</span>, 
    cost: "$5.00", 
    frequency: "Daily", 
    savings: "$1,825 / year" 
  },
  { 
    name: "Fast Food", 
    icon: <span className="text-red-500 text-xl">🍕</span>, 
    cost: "$20.00", 
    frequency: "3x week", 
    savings: "$3,120 / year" 
  },
  { 
    name: "Smoking/Vaping", 
    icon: <span className="text-gray-500 text-xl">🚬</span>, 
    cost: "$20.00", 
    frequency: "2x week", 
    savings: "$2,080 / year" 
  },
  { 
    name: "Energy Drinks/Sodas", 
    icon: <span className="text-yellow-500 text-xl">⚡</span>, 
    cost: "$3.50", 
    frequency: "5x week", 
    savings: "$910 / year" 
  },
  { 
    name: "Impulse Shopping", 
    icon: <span className="text-blue-500 text-xl">🛍️</span>, 
    cost: "$50.00", 
    frequency: "2x week", 
    savings: "$5,200 / year" 
  }
];

const PositionedEmojis = () => (
  <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
    <span className="emoji-bounce absolute text-6xl top-[8%] left-[15%]">👨‍✈️</span>
    <span className="emoji-bounce absolute text-6xl top-[42%] left-[85%]">🐋</span>
    <span className="emoji-bounce absolute text-6xl top-[30%] left-[20%]">⛵</span>
    <span className="emoji-bounce absolute text-6xl top-[65%] left-[55%]">⚓</span>
    <span className="emoji-bounce absolute text-6xl top-[15%] left-[75%]">🧭</span>
    <span className="emoji-bounce absolute text-6xl top-[75%] left-[10%]">🗺️</span>
    <span className="emoji-bounce absolute text-6xl top-[85%] left-[35%]">👩‍✈️</span>
  </div>
);

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Wave ripple background effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0">
          <svg width="100%" height="100%" viewBox="0 0 100 20">
            <defs>
              <pattern id="ocean-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                <path d="M0,10 Q25,15 50,10 Q75,5 100,10 Q125,15 150,10" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.15" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#ocean-pattern)" />
            <rect x="0" y="20" width="100%" height="100%" fill="url(#ocean-pattern)" />
            <rect x="0" y="40" width="100%" height="100%" fill="url(#ocean-pattern)" />
            <rect x="0" y="60" width="100%" height="100%" fill="url(#ocean-pattern)" />
            <rect x="0" y="80" width="100%" height="100%" fill="url(#ocean-pattern)" />
            <rect x="0" y="100" width="100%" height="100%" fill="url(#ocean-pattern)" />
          </svg>
        </div>
      </div>
      
      <PositionedEmojis />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
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
              <div className="glass-card p-8 mb-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
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
              <Card className="backdrop-blur-sm bg-white/90">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Skip & Save Sample</CardTitle>
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
          <p>© 2025 Skiipper. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
