
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
            background: 'linear-gradient(to bottom, #f8d49f, #e7b96f, #daa95d)'
          }}
        >
          <div className="absolute inset-0">
            {/* Sand texture */}
            <div 
              className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '150px'
              }}
            ></div>
            
            {/* Sand lighting effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-amber-900/20"></div>
          </div>
        </div>
        
        {/* Wavy divider between sand and water with improved ripple effect */}
        <div 
          className={cn(
            "absolute left-0 right-0 h-16 transition-all duration-500 ease-in-out z-10",
            isSkipped ? "-top-16" : "top-[calc(50%-16px)]"
          )}
        >
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" 
               className="absolute bottom-0 left-0 w-full h-16">
            {/* Base wave */}
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              fill="#33C3F0" fillOpacity=".9"
            ></path>
            {/* Secondary wave for depth */}
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              fill="#33C3F0" fillOpacity=".6"
            ></path>
            {/* Foam/ripple effect at the top */}
            <path 
              d="M0,0V5c47.79,22.2,103.59,12.17,158,8,70.36-5.37,136.33-13.31,206.8-17.5C438.64,32.43,512.34,23.67,583,22.05c69.27,8,138.3,14.88,209.4,3.08,36.15-6,69.85-17.84,104.45-19.34C989.49,5,1113,-4.29,1200,2.47V0Z" 
              fill="white" fillOpacity=".3"
            ></path>
          </svg>
        </div>
        
        {/* Water part with improved gradient and effect */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-500 ease-in-out",
            isSkipped ? "h-full" : "h-1/2"
          )}
          style={{
            background: 'linear-gradient(to bottom, #33C3F0, #1E90FF, #0067A0)'
          }}
        >
          <div className="absolute inset-0">
            {/* Water texture effect */}
            <div className="absolute inset-0 opacity-20">
              {/* Subtle noise texture */}
              <div 
                className="h-full w-full opacity-40"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.25' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px'
                }}
              ></div>
            </div>
            
            {/* Water shine/reflection */}
            <div 
              className="absolute inset-x-0 top-0 h-24 opacity-30"
              style={{ 
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 70%)' 
              }}
            ></div>
            
            {/* Small subtle waves */}
            <div className="absolute inset-0 overflow-hidden opacity-40">
              <div 
                className="absolute top-1/4 left-0 right-0 h-1 bg-sky-100 rounded-full transform -rotate-1"
                style={{animation: 'ocean-wave 7s ease-in-out infinite alternate'}}
              ></div>
              <div 
                className="absolute top-2/4 left-0 right-0 h-1 bg-sky-100 rounded-full transform rotate-1"
                style={{animation: 'ocean-wave 5s ease-in-out infinite alternate-reverse'}}
              ></div>
              <div 
                className="absolute top-3/4 left-0 right-0 h-px bg-sky-100 rounded-full"
                style={{animation: 'ocean-wave 8s ease-in-out infinite alternate'}}
              ></div>
            </div>
            
            {/* Additional depth effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
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

        @keyframes ocean-wave {
          0% {
            transform: translateX(-10px);
          }
          100% {
            transform: translateX(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default HabitCard;
