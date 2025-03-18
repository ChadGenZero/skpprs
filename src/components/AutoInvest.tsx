
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Bitcoin, ArrowUpCircle, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const AutoInvest: React.FC = () => {
  const { selectedHabits, totalSavings, annualSavings, weeklySkipSavings, setStep } = useAppContext();
  const [investFrequency, setInvestFrequency] = useState('weekly');
  const [autoInvestEnabled, setAutoInvestEnabled] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Calculate DCA amounts based on actual skip behavior
  const weeklyDCA = weeklySkipSavings.toFixed(2);
  const monthlyDCA = (weeklySkipSavings * 4).toFixed(2); // Approximate monthly based on weekly

  const handleSetupInvesting = () => {
    // In a real app, this would connect to a Bitcoin exchange API
    // For now, we just show a success dialog
    toast.success('Auto-invest setup initiated!');
    setShowSuccessDialog(true);
  };

  return (
    <div className="animate-scale-in">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-medium mb-3">
            Step 5
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auto-Invest in Bitcoin</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Set up automatic Bitcoin purchases with your savings using Dollar-Cost Averaging.
          </p>
        </div>
        
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-bitcoin flex items-center justify-center">
              <Bitcoin size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold">Bitcoin DCA Settings</h2>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 mb-6">
            <AlertTriangle className="text-yellow-500 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-yellow-700 mb-1">
                This is a demonstration of the auto-invest feature. In a real app, this would connect to a Bitcoin exchange.
              </p>
              <p className="text-xs text-yellow-600">
                Your DCA amount is calculated based on your actual skipping behavior this week.
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <Label className="text-base mb-3 block">How often would you like to invest?</Label>
            <RadioGroup value={investFrequency} onValueChange={setInvestFrequency} className="space-y-3">
              <div className={cn(
                "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                investFrequency === 'weekly' ? "border-bitcoin bg-bitcoin/5" : "hover:bg-gray-50"
              )}>
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="flex-1 flex justify-between cursor-pointer">
                  <span>Weekly</span>
                  <span className="font-medium">{formatCurrency(parseFloat(weeklyDCA))}</span>
                </Label>
              </div>
              <div className={cn(
                "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                investFrequency === 'monthly' ? "border-bitcoin bg-bitcoin/5" : "hover:bg-gray-50"
              )}>
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="flex-1 flex justify-between cursor-pointer">
                  <span>Monthly</span>
                  <span className="font-medium">{formatCurrency(parseFloat(monthlyDCA))}</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="font-medium">Auto-Invest</h3>
              <p className="text-sm text-gray-500">
                Automatically invest your savings on a regular schedule
              </p>
            </div>
            <Switch 
              checked={autoInvestEnabled} 
              onCheckedChange={setAutoInvestEnabled}
            />
          </div>
        </div>
        
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Tracking habits</span>
              <span className="font-medium">{selectedHabits.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Current savings</span>
              <span className="font-medium">{formatCurrency(totalSavings)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Annual savings potential</span>
              <span className="font-medium">{formatCurrency(annualSavings)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">This week's skipped savings</span>
              <span className="font-medium">{formatCurrency(weeklySkipSavings)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">DCA frequency</span>
              <span className="font-medium capitalize">{investFrequency}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            className="px-4 py-2"
            onClick={() => setStep(4)}
          >
            <ArrowLeftIcon className="mr-2" size={16} />
            <span>Back</span>
          </Button>
          
          <Button 
            className={cn(
              "bg-bitcoin hover:bg-bitcoin/90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all",
              (!autoInvestEnabled) && "opacity-50"
            )}
            onClick={handleSetupInvesting}
            disabled={!autoInvestEnabled}
          >
            Setup Auto-Investing
          </Button>
        </div>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Auto-Invest Setup Complete!</DialogTitle>
          </DialogHeader>
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <ArrowUpCircle className="text-green-600" size={32} />
            </div>
            <p className="mb-2">
              Your DCA setup is now active. You'll be investing 
              <strong> {formatCurrency(investFrequency === 'weekly' ? parseFloat(weeklyDCA) : parseFloat(monthlyDCA))} </strong>
              {investFrequency} into Bitcoin.
            </p>
            <p className="text-sm text-gray-500">
              Continue tracking your habit skips and watch your Bitcoin stack grow!
            </p>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-bitcoin hover:bg-bitcoin/90"
              onClick={() => setShowSuccessDialog(false)}
            >
              Continue Stacking Sats
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutoInvest;
