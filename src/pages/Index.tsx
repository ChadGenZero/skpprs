
import React from 'react';
import { AppProvider, useAppContext } from '@/context/AppContext';
import ProgressBar from '@/components/ProgressBar';
import HabitSelector from '@/components/HabitSelector';
import SavingsCalculator from '@/components/SavingsCalculator';
import GrowthProjector from '@/components/GrowthProjector';
import HabitSkipper from '@/components/HabitSkipper';
import AutoInvest from '@/components/AutoInvest';

// Smooth block "S" logo
const NauticalLogo = () => (
  <div className="text-royal-blue">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Solid block S shape */}
      <path 
        d="M22 8C22 5.79086 20.2091 4 18 4H12C9.79086 4 8 5.79086 8 8V8C8 10.2091 9.79086 12 12 12H18C20.2091 12 22 13.7909 22 16V16C22 18.2091 20.2091 20 18 20H12C9.79086 20 8 21.7909 8 24V24C8 26.2091 9.79086 28 12 28H18C20.2091 28 22 26.2091 22 24" 
        stroke="#1EAEDB" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </div>
);

const MainContent: React.FC = () => {
  const { step } = useAppContext();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <HabitSelector />;
      case 2:
        return <SavingsCalculator />;
      case 3:
        return <GrowthProjector />;
      case 4:
        return <HabitSkipper />;
      case 5:
        return <AutoInvest />;
      default:
        return <HabitSelector />;
    }
  };

  return (
    <div className="app-container">
      <header className="flex justify-center md:justify-between items-center py-4 mb-4">
        <div className="flex items-center gap-2">
          <NauticalLogo />
          <h1 className="text-2xl font-bold text-royal-blue">Skipper Savings</h1>
        </div>
        <p className="hidden md:block text-sm text-gray-500">Stack Sats Skipper</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-44 lg:w-64">
          <ProgressBar />
        </aside>
        
        <main className="flex-1">
          {renderStep()}
        </main>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default Index;
