
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
            background: 'linear-gradient(to bottom, #f7e1a8, #e6c78a, #d4a76a, #c2975a)', // More natural sand tones
          }}
        >
          <div className="absolute inset-0">
            {/* Sand texture with speckles */}
            <div 
              className="absolute inset-0 opacity-40" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"), 
                             url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='speckleFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23speckleFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '100px, 50px',
                backgroundBlendMode: 'overlay, multiply',
              }}
            ></div>
            
            {/* Sand lighting effect with subtle shimmer */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-yellow-100/40 via-transparent to-amber-900/30"
              style={{
                backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 200, 0.3) 0%, transparent 50%)',
              }}
            ></div>
          </div>
        </div>
        
        {/* Wavy divider between sand and water with natural wave shape and animation */}
        <div 
          className={cn(
            "absolute left-0 right-0 h-16 transition-all duration-500 ease-in-out z-10",
            isSkipped ? "-top-16" : "top-[calc(50%-16px)]"
          )}
        >
          <svg 
            preserveAspectRatio="none" 
            viewBox="0 0 1200 120" 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute bottom-0 left-0 w-full h-16"
          >
            {/* Base wave with more natural shape */}
            <path 
              d="M0,0V60C50,20,150,80,250,60C350,40,450,80,550,70C650,60,750,40,850,50C950,60,1050,80,1150,60C1200,40,1200,0,1200,0H0Z"
              fill="#33C3F0" 
              fillOpacity="0.9"
              style={{ animation: 'wave-flow 6s ease-in-out infinite' }}
            ></path>
            {/* Secondary wave for depth */}
            <path 
              d="M0,0V50C60,10,160,70,260,50C360,30,460,70,560,60C660,50,760,30,860,40C960,50,1060,70,1160,50C1200,30,1200,0,1200,0H0Z"
              fill="#1E90FF" 
              fillOpacity="0.6"
              style={{ animation: 'wave-flow 8s ease-in-out infinite reverse' }}
            ></path>
            {/* Foam effect at the shoreline */}
            <path 
              d="M0,0V20C50,5,150,25,250,15C350,5,450,25,550,20C650,15,750,5,850,10C950,15,1050,25,1150,15C1200,5,1200,0,1200,0H0Z"
              fill="white" 
              fillOpacity="0.5"
              style={{ animation: 'wave-flow 4s ease-in-out infinite' }}
            ></path>
          </svg>
        </div>
        
        {/* Water part with enhanced realism */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-500 ease-in-out",
            isSkipped ? "h-full" : "h-1/2"
          )}
          style={{
            background: 'linear-gradient(to bottom, #66D9EF 0%, #1E90FF 50%, #005B99 100%)', // More natural ocean tones
          }}
        >
          <div className="absolute inset-0">
            {/* Water texture effect */}
            <div className="absolute inset-0 opacity-30">
              <div 
                className="h-full w-full opacity-50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundSize: '150px',
                  animation: 'water-shimmer 10s linear infinite',
                }}
              ></div>
            </div>
            
            {/* Water shine/reflection */}
            <div 
              className="absolute inset-x-0 top-0 h-32 opacity-40"
              style={{ 
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 60%)',
                animation: 'shine-flow 15s linear infinite',
              }}
            ></div>
            
            {/* Dynamic waves */}
            <div className="absolute inset-0 overflow-hidden opacity-50">
              <div 
                className="absolute top-1/4 left-0 right-0 h-2 bg-sky-100/50 rounded-full transform -rotate-2"
                style={{ animation: 'ocean-wave 6s ease-in-out infinite alternate' }}
              ></div>
              <div 
                className="absolute top-2/4 left-0 right-0 h-2 bg-sky-100/40 rounded-full transform rotate-2"
                style={{ animation: 'ocean-wave 5s ease-in-out infinite alternate-reverse' }}
              ></div>
              <div 
                className="absolute top-3/4 left-0 right-0 h-1 bg-sky-100/30 rounded-full"
                style={{ animation: 'ocean-wave 7s ease-in-out infinite alternate' }}
              ></div>
            </div>
            
            {/* Depth effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
          </div>
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
          animation-delay: 0.5s; /* Reduced from 1s to 0.5s for faster appearance */
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
          border: 12px solid #d3d3d3; /* Light gray ring with hollow center */
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
            #ff4500 0deg 45deg, /* Orange */
            #d3d3d3 45deg 90deg, /* Gray */
            #ff0000 90deg 135deg, /* Red */
            #d3d3d3 135deg 180deg, /* Gray */
            #ff4500 180deg 225deg, /* Orange */
            #d3d3d3 225deg 270deg, /* Gray */
            #ff0000 270deg 315deg, /* Red */
            #d3d3d3 315deg 360deg /* Gray */
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
          background: #a9a9a9; /* Darker gray for nubs */
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
          color: #000;
          text-align: center;
          z-index: 1;
        }

        /* New animations for water and waves */
        @keyframes ocean-wave {
          0% {
            transform: translateX(-15px) scaleX(0.95);
          }
          100% {
            transform: translateX(15px) scaleX(1.05);
          }
        }

        @keyframes water-shimmer {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 150px 150px;
          }
        }

        @keyframes shine-flow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes wave-flow {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-20px);
          }
          100% {
            transform: translateX(0);
          }
        }
        `}
      </style>
    </div>
  );
};

export default HabitCard;
