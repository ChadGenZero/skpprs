
import React from 'react';
import { AppProvider, useAppContext } from '@/context/AppContext';
import ProgressBar from '@/components/ProgressBar';
import HabitSelector from '@/components/HabitSelector';
import SavingsCalculator from '@/components/SavingsCalculator';
import GrowthProjector from '@/components/GrowthProjector';
import HabitSkipper from '@/components/HabitSkipper';
import AutoInvest from '@/components/AutoInvest';
import { Sailboat } from 'lucide-react';

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
          <Sailboat size={28} className="text-bitcoin" />
          <h1 className="text-2xl font-bold">SS Skipper</h1>
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
