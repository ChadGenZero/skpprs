
import React from 'react';
import { Habit } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Undo, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onClick: () => void;
  onUndo: () => void;
  progress: { completed: number; total: number };
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onClick, 
  onUndo, 
  progress 
}) => {
  const isSkipped = progress.completed > 0;
  
  return (
    <div 
      className={cn(
        "relative flex flex-col justify-between rounded-3xl p-6 h-full min-h-[260px] transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg overflow-hidden habit-card",
        isSkipped ? "text-white" : "text-gray-800"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Sand part */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 transition-all duration-500 ease-in-out",
            isSkipped ? "h-0" : "h-1/2"
          )}
          style={{
            background: 'linear-gradient(to bottom, #f7e1a8, #edd3a0, #d4a76a, #c2975a, #a87e4a, #c2975a)', // More diverse sand tones
          }}
        >
          <div className="absolute inset-0">
            {/* Sand texture with enhanced graininess */}
            <div 
              className="absolute inset-0 opacity-50" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
                                 url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='speckleFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0 0 0 0 0 0.3 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23speckleFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '80px, 40px',
                backgroundBlendMode: 'overlay, soft-light',
                filter: 'contrast(1.2) brightness(1.1)',
              }}
            ></div>
            
            {/* Sand lighting and shadow effect */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(255, 255, 200, 0.3) 0%, transparent 70%, rgba(0, 0, 0, 0.2) 100%)',
                backgroundImage: 'radial-gradient(circle at 60% 20%, rgba(255, 255, 200, 0.4) 0%, transparent 50%)',
              }}
            ></div>
          </div>
        </div>
        
        {/* Water part with a single shape and ripple wave line at the top */}
        <div 
          className={cn(
            "absolute left-0 right-0 bottom-0 transition-all duration-500 ease-in-out",
            isSkipped ? "h-full top-0" : "h-1/2 top-1/2"
          )}
        >
          {/* Water background */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #80E0F5 0%, #1E90FF 50%, #003D66 100%)', // Ocean tones
            }}
          >
            {/* Water texture */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '120px',
                animation: 'water-shimmer 8s linear infinite',
              }}
            ></div>
          </div>
          
          {/* Ripple wave line at the top */}
          <svg 
            preserveAspectRatio="none" 
            viewBox="0 0 1200 120" 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute top-0 left-0 w-full h-16"
          >
            {/* Main ripple wave */}
            <path 
              d="M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0H0Z"
              fill="#1E90FF" 
              fillOpacity="0.9"
              style={{ animation: 'ripple-wave 3s ease-in-out infinite' }}
            ></path>
            {/* Foam effect on the ripple */}
            <path 
              d="M0,0V30C15,15,60,40,140,25C220,10,300,30,380,15C460,0,540,20,620,5C700,-10,780,10,860,-5C940,-20,1020,0,1100,-15C1160,-20,1200,0,1200,0H0Z"
              fill="white" 
              fillOpacity="0.5"
              style={{ animation: 'wave-foam 2.5s ease-in-out infinite reverse' }}
            ></path>
          </svg>
        </div>
      </div>
      
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
              <div className="lifebuoyCenter">
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
      
      {isSkipped && (
        <button 
          className="absolute top-3 right-3 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-20"
          onClick={(e) => {
            e.stopPropagation();
            onUndo();
          }}
        >
          <Undo size={18} />
        </button>
      )}

      <style>{`
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
          border: 12px solid #d3d3d3;
          border-radius: 50%;
          box-sizing: border-box;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .lifebuoySegments {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(
            #ff4500 0deg 45deg,
            #d3d3d3 45deg 90deg,
            #ff0000 90deg 135deg,
            #d3d3d3 135deg 180deg,
            #ff4500 180deg 225deg,
            #d3d3d3 225deg 270deg,
            #ff0000 270deg 315deg,
            #d3d3d3 315deg 360deg
          );
          -webkit-mask: radial-gradient(transparent 40%, #fff 40%);
          mask: radial-gradient(transparent 40%, #fff 40%);
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
          width: 10px;
          height: 10px;
          background: #a9a9a9;
          border-radius: 50%;
        }

        .lifebuoyNubs::before {
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .lifebuoyNubs::after {
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .lifebuoyNubs > div::before {
          top: 50%;
          left: -5px;
          transform: translateY(-50%);
        }

        .lifebuoyNubs > div::after {
          top: 50%;
          right: -5px;
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
          color: #fff;
          text-align: center;
          z-index: 1;
        }

        /* Water and wave animations */
        @keyframes water-shimmer {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 120px 120px;
          }
        }

        @keyframes ripple-wave {
          0% {
            transform: translateX(0) scaleY(1);
            d: path("M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0H0Z");
          }
          50% {
            transform: translateX(-20px) scaleY(1.2);
            d: path("M0,0V40C40,20,100,60,180,40C260,20,340,40,420,20C500,0,580,20,660,0C740,-20,820,0,900,-20C980,-40,1060,-20,1140,0C1200,-20,1200,0,1200,0H0Z");
          }
          100% {
            transform: translateX(0) scaleY(1);
            d: path("M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0H0Z");
          }
        }

        @keyframes wave-foam {
          0% {
            transform: translateX(0) scaleY(1);
            opacity: 0.5;
          }
          50% {
            transform: translateX(-15px) scaleY(1.3);
            opacity: 0.8;
          }
          100% {
            transform: translateX(0) scaleY(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default HabitCard;
