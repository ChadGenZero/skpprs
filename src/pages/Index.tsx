import React from 'react';
import { AppProvider, useAppContext } from '@/context/AppContext';
import ProgressBar from '@/components/ProgressBar';
import HabitSelector from '@/components/HabitSelector';
import SavingsCalculator from '@/components/SavingsCalculator';
import GrowthProjector from '@/components/GrowthProjector';
import HabitSkipper from '@/components/HabitSkipper';
import AutoInvest from '@/components/AutoInvest';

// Nautical Logo - Simple S letter stylized as rope
const NauticalLogo = () => (
  <div className="text-royal-blue">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Simple S shape with rope styling */}
      <path 
        d="M14 5C10 5 8 7 8 9C8 11 10 13 14 13C18 13 20 15 20 19C20 21 18 23 14 23" 
        stroke="#1EAEDB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Vertical line to create $ sign */}
      <path 
        d="M14 2V5M14 23V26" 
        stroke="#1EAEDB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
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
