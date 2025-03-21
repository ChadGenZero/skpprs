
import React from 'react';
import { AppProvider, useAppContext } from '@/context/AppContext';
import ProgressBar from '@/components/ProgressBar';
import HabitSelector from '@/components/HabitSelector';
import SavingsCalculator from '@/components/SavingsCalculator';
import GrowthProjector from '@/components/GrowthProjector';
import HabitSkipper from '@/components/HabitSkipper';
import AutoInvest from '@/components/AutoInvest';

// Pirate $ Logo - Dollar sign with a pirate hat
const PirateLogo = () => (
  <div className="text-royal-blue relative">
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dollar sign */}
      <path 
        d="M14 7C10 7 8 9 8 11C8 13 10 15 14 15C18 15 20 17 20 21C20 23 18 25 14 25" 
        stroke="#1EAEDB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      />
      <path 
        d="M14 4V7M14 25V28" 
        stroke="#1EAEDB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      />
      
      {/* Pirate hat on top */}
      <path 
        d="M7 4H21L19 1H9L7 4Z" 
        fill="#1EAEDB" 
      />
      <circle 
        cx="14" cy="2" r="1" 
        fill="#ffffff" 
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
          <PirateLogo />
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
