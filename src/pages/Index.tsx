
import React from 'react';
import { AppProvider, useAppContext } from '@/context/AppContext';
import ProgressBar from '@/components/ProgressBar';
import HabitSelector from '@/components/HabitSelector';
import SavingsCalculator from '@/components/SavingsCalculator';
import GrowthProjector from '@/components/GrowthProjector';
import HabitSkipper from '@/components/HabitSkipper';
import AutoInvest from '@/components/AutoInvest';
import { Sailboat } from 'lucide-react';

// Nautical Logo - Two S letters combined as rope
const NauticalLogo = () => (
  <div className="text-royal-blue">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2C10.5817 2 7.33312 3.31785 4.99975 5.65122C2.66637 7.98459 1.34853 11.2332 1.34853 14.6515C1.34853 18.0698 2.66637 21.3184 4.99975 23.6517C7.33312 25.9851 10.5817 27.3029 14 27.3029C17.4183 27.3029 20.6669 25.9851 23.0002 23.6517C25.3336 21.3184 26.6515 18.0698 26.6515 14.6515" stroke="#1EAEDB" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M14 2C10.5817 2 7.33312 3.31785 4.99975 5.65122C2.66637 7.98459 1.34853 11.2332 1.34853 14.6515C1.34853 18.0698 2.66637 21.3184 4.99975 23.6517C7.33312 25.9851 10.5817 27.3029 14 27.3029" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M26.6515 7.32574C24.3181 4.99236 21.0695 3.67453 17.6512 3.67453C14.2329 3.67453 10.9843 4.99236 8.65091 7.32574C6.31754 9.65911 4.99969 12.9077 4.99969 16.326C4.99969 19.7443 6.31754 22.9929 8.65091 25.3262C10.9843 27.6596 14.2329 28.9775 17.6512 28.9775C21.0695 28.9775 24.3181 27.6596 26.6515 25.3262C28.9848 22.9929 30.3027 19.7443 30.3027 16.326C30.3027 12.9077 28.9848 9.65911 26.6515 7.32574Z" stroke="#1EAEDB" strokeWidth="2.5" strokeLinecap="round"/>
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
