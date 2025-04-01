
import React, { useState, useEffect } from 'react';
import { Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Undo, LifeBuoy, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import CustomSkipModal from './CustomSkipModal';

interface HabitCardProps {
  habit: Habit;
  onClick: () => void;
  onUndo: () => void;
  onCustomSkip?: (name: string, emoji: string, amount: number) => void;
  progress: { completed: number; total: number };
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onClick, 
  onUndo, 
  onCustomSkip,
  progress 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isSkipped = progress.completed > 0;
  const [showCustomSkipModal, setShowCustomSkipModal] = useState(false);
  
  // Reset animation state when habit skipped status changes
  useEffect(() => {
    setIsAnimating(isSkipped);
  }, [isSkipped]);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const handleUndoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUndo();
  };
  
  const handleAddCustomSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCustomSkipModal(true);
  };
  
  const handleSaveCustomSkip = (name: string, emoji: string, amount: number) => {
    if (onCustomSkip) {
      onCustomSkip(name, emoji, amount);
    }
  };
  
  return (
    <div 
      className={cn(
        "relative flex flex-col justify-between rounded-3xl p-6 h-full min-h-[260px] transition-all duration-500 ease-in-out cursor-pointer shadow-md hover:shadow-lg overflow-hidden habit-card",
        isSkipped ? "text-white" : "text-gray-800"
      )}
      onClick={handleClick}
    >
      {/* Background with Sand and Water as SVG shapes */}
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 1200 600"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full z-0"
      >
        {/* Define gradients and patterns */}
        <defs>
          <linearGradient id={`sandGradient-${habit.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffcb7d', stopOpacity: 1 }} />
            <stop offset="20%" style={{ stopColor: '#ffbb54', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#ffa730', stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: '#ff9d1f', stopOpacity: 1 }} />
            <stop offset="80%" style={{ stopColor: '#ff9000', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ffbb54', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id={`waterGradient-${habit.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#80E0F5', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#1E90FF', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#003D66', stopOpacity: 1 }} />
          </linearGradient>
          
          <pattern id={`sandPattern-${habit.id}`} patternUnits="userSpaceOnUse" width="80" height="80">
            <rect width="80" height="80" fill="transparent" />
            <image
              href="data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"
              width="80"
              height="80"
              opacity="0.7"
            />
            <image
              href="data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='speckleFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.9 0 0 0 0 0.5 0 0 0 0 0.1 0 0 0 0.3 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23speckleFilter)'/%3E%3C/svg%3E"
              width="40"
              height="40"
              opacity="0.6"
            />
          </pattern>
          
          <mask id={`sandMask-${habit.id}`}>
            <path
              d="M0,0H1200V300C1180,320,1120,280,1060,300C980,320,900,280,820,300C740,320,660,280,580,300C500,320,420,280,340,300C260,320,180,280,100,300C40,320,0,280,0,300V0Z"
              fill="white"
            />
          </mask>
          
          <linearGradient id={`sandLighting-${habit.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255, 233, 180, 0.4)', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: 'transparent', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255, 144, 0, 0.2)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Sand Base (Always visible) */}
        <rect
          x="0"
          y="0"
          width="1200"
          height="600"
          fill={`url(#sandGradient-${habit.id})`}
        />
        
        {/* Sand Texture */}
        <rect
          x="0"
          y="0"
          width="1200"
          height="600"
          fill={`url(#sandPattern-${habit.id})`}
          mask={`url(#sandMask-${habit.id})`}
          className={isSkipped ? "opacity-0" : "opacity-65"}
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        />
        
        {/* Sand Lighting Effect */}
        <path
          d="M0,0H1200V300C1180,320,1120,280,1060,300C980,320,900,280,820,300C740,320,660,280,580,300C500,320,420,280,340,300C260,320,180,280,100,300C40,320,0,280,0,300V0Z"
          fill={`url(#sandLighting-${habit.id})`}
          className={isSkipped ? "opacity-0" : "opacity-100"}
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        />
        
        {/* Water Group - Uses CSS transform for the flood animation */}
        <g className={`water-group ${isSkipped ? "water-skipped" : ""}`}>
          {/* Water Shape - Only does the ripple animation */}
          <path
            className="water-shape"
            d="M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0V600H0Z"
            fill={`url(#waterGradient-${habit.id})`}
          />
          
          {/* Foam Effect on the Water's Edge (Enlarged) */}
          <path
            className="foam-shape"
            d="M0,-30V50C35,25,100,65,200,40C300,15,400,45,500,20C600,-5,700,25,800,0C900,-25,1000,0,1100,-25C1160,-40,1200,-10,1200,-30V50C1160,75,1080,35,980,60C880,85,780,45,680,70C580,95,480,55,380,80C280,105,180,65,80,90C30,105,0,70,0,50Z"
            fill="white"
            fillOpacity="0.5"
          />
          
          {/* Second Foam Layer (Additional enlarged white wash) */}
          <path
            className="foam-shape-secondary"
            d="M0,-10V40C45,15,120,55,220,30C320,5,420,35,520,10C620,-15,720,15,820,-10C920,-35,1020,-10,1120,-35C1170,-45,1200,-20,1200,-10V40C1150,65,1060,25,960,50C860,75,760,35,660,60C560,85,460,45,360,70C260,95,160,55,60,80C20,90,0,60,0,40Z"
            fill="white"
            fillOpacity="0.3"
          />
        </g>
      </svg>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-5xl mb-2">{habit.emoji}</div>
        <h3 className="text-xl md:text-2xl font-bold text-center break-words">{habit.name}</h3>
        <div className="text-xl md:text-2xl font-semibold mt-2">
          {progress.completed}/{progress.total} Skips
        </div>
      </div>
      
      <div className="relative z-10 flex justify-center mt-4">
        {isSkipped ? (
          <div className="lifebuoyContainer lifebuoyAnim">
            <div className="lifebuoyOuter">
              <div className="lifebuoyRing"></div>
              <div className="lifebuoyCenter text-white">
                {formatCurrency(habit.expense)}
              </div>
              <div className="lifebuoySegments"></div>
              <div className="lifebuoyNubs">
                <div></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xl font-semibold">
            Skip & Save {formatCurrency(habit.expense)}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-3 left-3 z-20">
        <Button
          size="sm"
          variant="ghost" 
          className="bg-white/20 hover:bg-white/30 transition-colors"
          onClick={handleAddCustomSkip}
        >
          <Plus size={16} className="mr-1" />
          Add Custom Skip
        </Button>
      </div>
      
      {isSkipped && (
        <button 
          className="absolute top-3 right-3 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-20"
          onClick={handleUndoClick}
        >
          <Undo size={18} />
        </button>
      )}

      <CustomSkipModal 
        habit={habit}
        isOpen={showCustomSkipModal}
        onClose={() => setShowCustomSkipModal(false)}
        onSave={handleSaveCustomSkip}
      />

      <style>
        {`
        /* Lifebuoy styles */
        .lifebuoyContainer {
          position: relative;
          width: 100px;
          height: 100px;
          opacity: 0;
          margin: 0 auto;
        }

        .lifebuoyAnim {
          animation: throwLifebuoy 0.5s ease-out forwards;
          animation-delay: 0.5s;
        }

        @keyframes throwLifebuoy {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateX(0) scale(1.2);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .lifebuoyOuter {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .lifebuoyRing {
          position: absolute;
          width: 100%;
          height: 100%;
          background: transparent;
          border: 10px solid #ff7300;
          border-radius: 50%;
          box-sizing: border-box;
          box-shadow: 0 0 10px rgba(255, 115, 0, 0.5), inset 0 0 5px rgba(255, 115, 0, 0.3);
        }

        .lifebuoySegments {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(
            #ff7300 0deg 45deg,
            white 45deg 90deg,
            #ff7300 90deg 135deg,
            white 135deg 180deg,
            #ff7300 180deg 225deg,
            white 225deg 270deg,
            #ff7300 270deg 315deg,
            white 315deg 360deg
          );
          -webkit-mask: radial-gradient(transparent 40%, #fff 40%);
          mask: radial-gradient(transparent 40%, #fff 40%);
          opacity: 0.9;
          transform: rotate(22.5deg);
        }

        .lifebuoyNubs {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .lifebuoyNubs::before,
        .lifebuoyNubs::after,
        .lifebuoyNubs > div::before,
        .lifebuoyNubs > div::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          background: #ff7300;
          border-radius: 50%;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        }

        .lifebuoyNubs::before {
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
        }

        .lifebuoyNubs::after {
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
        }

        .lifebuoyNubs > div::before {
          top: 50%;
          left: -6px;
          transform: translateY(-50%);
        }

        .lifebuoyNubs > div::after {
          top: 50%;
          right: -6px;
          transform: translateY(-50%);
        }

        .lifebuoyCenter {
          position: absolute;
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: bold;
          color: #22c55e;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          z-index: 1;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        /* Water animation styles */
        .water-group {
          transform: translateY(300px);
          transition: transform 0.5s ease-in-out;
        }

        .water-group.water-skipped {
          transform: translateY(0);
        }

        .water-shape {
          animation: ripple-wave 3s ease-in-out infinite;
        }

        .foam-shape {
          animation: wave-foam 2.5s ease-in-out infinite reverse;
        }

        .foam-shape-secondary {
          animation: wave-foam-secondary 3s ease-in-out infinite;
        }

        @keyframes ripple-wave {
          0% {
            d: path("M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0V600H0Z");
          }
          50% {
            d: path("M0,0V40C40,20,100,60,180,40C260,20,340,40,420,20C500,0,580,20,660,0C740,-20,820,0,900,-20C980,-40,1060,-20,1140,0C1200,-20,1200,0,1200,0V600H0Z");
          }
          100% {
            d: path("M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0V600H0Z");
          }
        }

        @keyframes wave-foam {
          0% {
            d: path("M0,-30V50C35,25,100,65,200,40C300,15,400,45,500,20C600,-5,700,25,800,0C900,-25,1000,0,1100,-25C1160,-40,1200,-10,1200,-30V50C1160,75,1080,35,980,60C880,85,780,45,680,70C580,95,480,55,380,80C280,105,180,65,80,90C30,105,0,70,0,50Z");
            opacity: 0.5;
          }
          50% {
            d: path("M0,-20V40C50,15,130,55,230,30C330,5,430,35,530,10C630,-15,730,5,830,-20C930,-45,1030,-15,1130,-40C1180,-55,1200,-25,1200,-20V40C1140,65,1060,25,960,50C860,75,760,35,660,60C560,85,460,45,360,70C260,95,160,55,60,80C20,95,0,60,0,40Z");
            opacity: 0.7;
          }
          100% {
            d: path("M0,-30V50C35,25,100,65,200,40C300,15,400,45,500,20C600,-5,700,25,800,0C900,-25,1000,0,1100,-25C1160,-40,1200,-10,1200,-30V50C1160,75,1080,35,980,60C880,85,780,45,680,70C580,95,480,55,380,80C280,105,180,65,80,90C30,105,0,70,0,50Z");
            opacity: 0.5;
          }
        }

        @keyframes wave-foam-secondary {
          0% {
            d: path("M0,-10V40C45,15,120,55,220,30C320,5,420,35,520,10C620,-15,720,15,820,-10C920,-35,1020,-10,1120,-35C1170,-45,1200,-20,1200,-10V40C1150,65,1060,25,960,50C860,75,760,35,660,60C560,85,460,45,360,70C260,95,160,55,60,80C20,90,0,60,0,40Z");
            opacity: 0.3;
          }
          50% {
            d: path("M0,-15V35C55,10,140,50,240,25C340,0,440,30,540,5C640,-20,740,10,840,-15C940,-40,1040,-15,1140,-40C1180,-50,1200,-25,1200,-15V35C1130,60,1040,20,940,45C840,70,740,30,640,55C540,80,440,40,340,65C240,90,140,50,40,75C10,85,0,55,0,35Z");
            opacity: 0.4;
          }
          100% {
            d: path("M0,-10V40C45,15,120,55,220,30C320,5,420,35,520,10C620,-15,720,15,820,-10C920,-35,1020,-10,1120,-35C1170,-45,1200,-20,1200,-10V40C1150,65,1060,25,960,50C860,75,760,35,660,60C560,85,460,45,360,70C260,95,160,55,60,80C20,90,0,60,0,40Z");
            opacity: 0.3;
          }
        }
        `}
      </style>
    </div>
  );
};

export default HabitCard;
