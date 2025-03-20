
import React from 'react';
import { AppProvider, useAppContext } from '@/context/AppContext';
import ProgressBar from '@/components/ProgressBar';
import HabitSelector from '@/components/HabitSelector';
import SavingsCalculator from '@/components/SavingsCalculator';
import GrowthProjector from '@/components/GrowthProjector';
import HabitSkipper from '@/components/HabitSkipper';
import AutoInvest from '@/components/AutoInvest';

// Nautical Logo - S letter stylized as rope forming a dollar sign
const NauticalLogo = () => (
  <div className="text-royal-blue">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main S shape with rope styling */}
      <path 
        d="M14 5C11.5 5 9.5 6 8.5 7.5C7.5 9 7.5 11 9 12.5C10.5 14 13 14.5 15.5 15C18 15.5 20 16.5 20 18.5C20 20.5 18 22 15 22C12 22 10 20.5 10 18" 
        stroke="#1EAEDB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Vertical line to create $ sign */}
      <path 
        d="M14 2V5M14 22V25" 
        stroke="#1EAEDB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Secondary rope detail */}
      <path 
        d="M18 4C20.5 4 22.5 5 23.5 6.5C24.5 8 24.5 10 23 11.5C21.5 13 19 13.5 16.5 14C14 14.5 12 15.5 12 17.5C12 19.5 14 21 17 21C20 21 22 19.5 22 17" 
        stroke="#1EAEDB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
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
