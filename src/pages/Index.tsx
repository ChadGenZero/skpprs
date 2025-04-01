
import React from 'react';
import { Link } from 'react-router-dom';
import { AppProvider, useAppContext } from '@/context/AppContext';
import ProgressBar from '@/components/ProgressBar';
import HabitSelector from '@/components/HabitSelector';
import SavingsCalculator from '@/components/SavingsCalculator';
import GrowthProjector from '@/components/GrowthProjector';
import HabitSkipper from '@/components/HabitSkipper';
import SignUp from '@/components/SignUp';

// Minimalistic 'S' Logo
const SLogo = () => (
  <div className="flex items-center justify-center w-10 h-10 bg-royal-blue rounded-md text-white">
    <span className="text-2xl font-bold tracking-tighter">S</span>
  </div>
);

// This component is removed as requested
// const SuperSkipButton = () => {
//   const { superSkip } = useAppContext();
//   
//   return (
//     <div className="flex justify-center my-6">
//       <button
//         onClick={superSkip}
//         className="super-skip-button bg-bitcoin text-white"
//       >
//         Super Skip
//       </button>
//     </div>
//   );
// };

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
        return <HabitSkipper />; // Removed the SuperSkipButton component
      case 5:
        return <SignUp />;
      default:
        return <HabitSelector />;
    }
  };

  return (
    <div className="app-container">
      <header className="flex justify-center md:justify-between items-center py-4 mb-4">
        <Link to="/" className="flex items-center gap-2">
          <SLogo />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-royal-blue">Skiipper</h1>
            <p className="text-xs text-gray-500 ml-1">Set Sail</p>
          </div>
        </Link>
        <p className="hidden md:block text-sm text-gray-500">Skip, Save, & Stack Sats!</p>
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
