
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
            isSkipped ? "h-0" : "h-full"
          )}
          style={{
            background: 'linear-gradient(to bottom, #f7e1a8, #edd3a0, #d4a76a, #c2975a, #a87e4a)', // Diverse sand tones
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
        
        {/* Water part with ripple wave overlay */}
        <div 
          className={cn(
            "absolute left-0 right-0 bottom-0 transition-all duration-500 ease-in-out",
            isSkipped ? "h-full" : "h-1/2"
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

          {/* Ripple wave shape clipping the water */}
          <div className="absolute top-0 left-0 right-0 overflow-hidden">
            <svg 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
              className="w-full h-20 -translate-y-full"
              style={{ filter: 'drop-shadow(0px 3px 3px rgba(0,0,0,0.1))' }}
            >
              <path 
                d="M0,120 L0,40 C20,60,80,20,160,40 C240,60,320,40,400,60 C480,80,560,60,640,80 C720,100,800,80,880,100 C960,120,1040,100,1120,120 L1200,120 L1200,40 C1180,60,1120,20,1060,40 C980,60,900,40,820,60 C740,80,660,60,580,80 C500,100,420,80,340,100 C260,120,180,100,100,120 L0,120 Z"
                fill="#80E0F5"
                className="wave-path"
              />
            </svg>
          </div>
        </div>

        {/* Ripple wave overlay at the boundary */}
        <div 
          className={cn(
            "absolute left-0 right-0 z-10 transition-all duration-500 ease-in-out overflow-hidden",
            isSkipped ? "top-0 h-16" : `top-[calc(50%-16px)] h-16`
          )}
        >
          <svg 
            preserveAspectRatio="none" 
            viewBox="0 0 1200 120" 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute left-0 w-full h-full"
            style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.15))' }}
          >
            {/* Main ripple wave */}
            <path 
              d="M0,120 L0,40 C20,60,80,20,160,40 C240,60,320,40,400,60 C480,80,560,60,640,80 C720,100,800,80,880,100 C960,120,1040,100,1120,120 L1200,120 L1200,40 C1180,60,1120,20,1060,40 C980,60,900,40,820,60 C740,80,660,60,580,80 C500,100,420,80,340,100 C260,120,180,100,100,120 L0,120 Z"
              fill="#1E90FF" 
              fillOpacity="0.9"
              className="ripple-wave-main"
            />
            
            {/* Foam effect on the ripple */}
            <path 
              d="M0,120 L0,70 C15,85,60,60,140,75 C220,90,300,70,380,85 C460,100,540,80,620,95 C700,110,780,90,860,105 C940,120,1020,100,1100,115 C1160,130,1200,110,1200,120 L0,120 Z"
              fill="white" 
              fillOpacity="0.5"
              className="ripple-wave-foam"
            />
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

        /* Animate the wave paths */
        .ripple-wave-main {
          animation: ripple-wave 4s ease-in-out infinite;
        }

        .ripple-wave-foam {
          animation: wave-foam 3s ease-in-out infinite reverse;
        }

        .wave-path {
          animation: wave-path 5s ease-in-out infinite;
        }

        @keyframes ripple-wave {
          0% {
            d: path("M0,120 L0,40 C20,60,80,20,160,40 C240,60,320,40,400,60 C480,80,560,60,640,80 C720,100,800,80,880,100 C960,120,1040,100,1120,120 L1200,120 L1200,40 C1180,60,1120,20,1060,40 C980,60,900,40,820,60 C740,80,660,60,580,80 C500,100,420,80,340,100 C260,120,180,100,100,120 L0,120 Z");
          }
          50% {
            d: path("M0,120 L0,60 C40,80,100,40,180,60 C260,80,340,60,420,80 C500,100,580,80,660,100 C740,120,820,100,900,120 L1200,120 L1200,60 C1160,80,1100,40,1020,60 C940,80,860,60,780,80 C700,100,620,80,540,100 C460,120,380,100,300,120 L0,120 Z");
          }
          100% {
            d: path("M0,120 L0,40 C20,60,80,20,160,40 C240,60,320,40,400,60 C480,80,560,60,640,80 C720,100,800,80,880,100 C960,120,1040,100,1120,120 L1200,120 L1200,40 C1180,60,1120,20,1060,40 C980,60,900,40,820,60 C740,80,660,60,580,80 C500,100,420,80,340,100 C260,120,180,100,100,120 L0,120 Z");
          }
        }

        @keyframes wave-path {
          0% {
            d: path("M0,120 L0,40 C20,60,80,20,160,40 C240,60,320,40,400,60 C480,80,560,60,640,80 C720,100,800,80,880,100 C960,120,1040,100,1120,120 L1200,120 L1200,40 C1180,60,1120,20,1060,40 C980,60,900,40,820,60 C740,80,660,60,580,80 C500,100,420,80,340,100 C260,120,180,100,100,120 L0,120 Z");
          }
          50% {
            d: path("M0,120 L0,50 C30,70,90,30,170,50 C250,70,330,50,410,70 C490,90,570,70,650,90 C730,110,810,90,890,110 C970,130,1050,110,1130,130 L1200,120 L1200,50 C1170,70,1110,30,1030,50 C950,70,870,50,790,70 C710,90,630,70,550,90 C470,110,390,90,310,110 C230,130,150,110,70,130 L0,120 Z");
          }
          100% {
            d: path("M0,120 L0,40 C20,60,80,20,160,40 C240,60,320,40,400,60 C480,80,560,60,640,80 C720,100,800,80,880,100 C960,120,1040,100,1120,120 L1200,120 L1200,40 C1180,60,1120,20,1060,40 C980,60,900,40,820,60 C740,80,660,60,580,80 C500,100,420,80,340,100 C260,120,180,100,100,120 L0,120 Z");
          }
        }

        @keyframes wave-foam {
          0% {
            d: path("M0,120 L0,70 C15,85,60,60,140,75 C220,90,300,70,380,85 C460,100,540,80,620,95 C700,110,780,90,860,105 C940,120,1020,100,1100,115 C1160,130,1200,110,1200,120 L0,120 Z");
            opacity: 0.5;
          }
          50% {
            d: path("M0,120 L0,80 C30,95,70,70,150,85 C230,100,310,80,390,95 C470,110,550,90,630,105 C710,120,790,100,870,115 C950,130,1030,110,1110,125 C1170,140,1200,120,1200,120 L0,120 Z");
            opacity: 0.7;
          }
          100% {
            d: path("M0,120 L0,70 C15,85,60,60,140,75 C220,90,300,70,380,85 C460,100,540,80,620,95 C700,110,780,90,860,105 C940,120,1020,100,1100,115 C1160,130,1200,110,1200,120 L0,120 Z");
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default HabitCard;
