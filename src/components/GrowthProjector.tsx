
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon, Bitcoin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { cn } from '@/lib/utils';

// Simulated Bitcoin price data (historical and projected)
const generateProjectionData = (monthlySavings: number) => {
  // Assume the current Bitcoin price is $60,000
  const btcPrice = 60000;
  const data = [];
  let cumulativeSats = 0;
  let cumulativeUSD = 0;
  
  // Generate data for 5 years
  for (let i = 0; i <= 60; i++) {
    // Monthly DCA amount in BTC (sats)
    const monthlyBtcAmount = monthlySavings / btcPrice;
    cumulativeSats += monthlyBtcAmount;
    cumulativeUSD += monthlySavings;
    
    // Simple projection model with 15% annual increase
    const projectedValue = cumulativeSats * btcPrice * Math.pow(1.15, i/12);
    
    data.push({
      month: i,
      savingsUSD: cumulativeUSD.toFixed(2),
      projectedValue: projectedValue.toFixed(2),
    });
  }
  
  return data;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const GrowthProjector: React.FC = () => {
  const { annualSavings, setStep } = useAppContext();
  const monthlySavings = annualSavings / 12;
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('5y');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const data = generateProjectionData(monthlySavings);
    
    // Animate the chart data loading
    const timer = setTimeout(() => {
      setChartData(data);
      setIsChartReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [monthlySavings]);
  
  // Calculate final projected value
  const finalProjectedValue = chartData.length > 0 
    ? parseFloat(chartData[chartData.length - 1].projectedValue) 
    : 0;
  
  // Calculate total savings amount (DCA)
  const totalSavingsAmount = chartData.length > 0 
    ? parseFloat(chartData[chartData.length - 1].savingsUSD) 
    : 0;
  
  // Calculate potential profit
  const potentialProfit = finalProjectedValue - totalSavingsAmount;
  
  // Calculate data for the selected timeframe
  const timeframeData = () => {
    switch (selectedTimeframe) {
      case '1y':
        return chartData.slice(0, 13);
      case '3y':
        return chartData.slice(0, 37);
      case '5y':
      default:
        return chartData;
    }
  };

  return (
    <div className="animate-scale-in">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-medium mb-3">
            Step 3
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grow Your Savings</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            See what your savings could look like if invested in Bitcoin over time. 
          </p>
        </div>
        
        <div className="glass-card mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Projected Growth</h2>
              <div className="flex gap-2">
                {['1y', '3y', '5y'].map((period) => (
                  <button
                    key={period}
                    className={cn(
                      "text-sm px-3 py-1 rounded-md transition-all",
                      selectedTimeframe === period 
                        ? "bg-bitcoin text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    onClick={() => setSelectedTimeframe(period)}
                  >
                    {period.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64 w-full">
              {isChartReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeframeData()} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => `${value}m`}
                    >
                      <Label value="Months" offset={-15} position="insideBottom" />
                    </XAxis>
                    <YAxis 
                      tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${parseFloat(value as string).toLocaleString()}`, 'Value']}
                      labelFormatter={(value) => `Month ${value}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="savingsUSD" 
                      name="Savings" 
                      stroke="#94a3b8" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projectedValue" 
                      name="Projected BTC Value" 
                      stroke="#f7931a" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TrendingUpIcon size={32} className="text-gray-300 animate-pulse" />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 pt-0">
            <Card className="p-4 bg-gray-50 border">
              <h3 className="text-sm text-gray-500 mb-1">Total Invested</h3>
              <div className="text-xl font-bold">{formatCurrency(totalSavingsAmount)}</div>
            </Card>
            
            <Card className="p-4 bg-gray-50 border">
              <h3 className="text-sm text-gray-500 mb-1">Projected Value</h3>
              <div className="text-xl font-bold">{formatCurrency(finalProjectedValue)}</div>
            </Card>
            
            <Card className="p-4 bg-gray-50 border">
              <h3 className="text-sm text-gray-500 mb-1">Potential Profit</h3>
              <div className={`text-xl font-bold ${potentialProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(potentialProfit)}
              </div>
            </Card>
          </div>
        </div>
        
        <div className="glass-card mb-8 p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-8 rounded-full bg-bitcoin flex items-center justify-center">
              <Bitcoin size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold">Monthly Bitcoin DCA</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Invest {formatCurrency(monthlySavings)} monthly using Dollar-Cost Averaging (DCA) to potentially grow your wealth over time, regardless of short-term market fluctuations.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly investment</span>
              <span className="font-medium">{formatCurrency(monthlySavings)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            className="px-4 py-2"
            onClick={() => setStep(2)}
          >
            <ArrowLeftIcon className="mr-2" size={16} />
            <span>Back</span>
          </Button>
          
          <Button 
            className="bg-bitcoin hover:bg-bitcoin/90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            onClick={() => setStep(4)}
          >
            <span>Start Tracking Skips</span>
            <ArrowRightIcon className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrowthProjector;
