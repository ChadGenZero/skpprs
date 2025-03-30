
import React, { useEffect, useState } from 'react';
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
  const [animationKey, setAnimationKey] = useState(0);
  
  // Reset animation key when skipped status changes to force animation replay
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [isSkipped]);
  
  return (
    <div 
      className={cn(
        "relative flex flex-col justify-between rounded-3xl p-6 h-full min-h-[260px] transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg overflow-hidden habit-card",
        isSkipped ? "text-white" : "text-gray-800"
      )}
      onClick={onClick}
    >
      {/* Background with Sand and Water as SVG shapes */}
      <svg
        key={animationKey}
        preserveAspectRatio="none"
        viewBox="0 0 1200 600"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full z-0"
      >
        {/* Define gradients and patterns */}
        <defs>
          <linearGradient id={`sandGradient-${habit.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f7e1a8', stopOpacity: 1 }} />
            <stop offset="20%" style={{ stopColor: '#edd3a0', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#d4a76a', stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: '#c2975a', stopOpacity: 1 }} />
            <stop offset="80%" style={{ stopColor: '#a87e4a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#c2975a', stopOpacity: 1 }} />
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
              opacity="0.5"
            />
            <image
              href="data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='speckleFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0 0 0 0 0 0.3 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23speckleFilter)'/%3E%3C/svg%3E"
              width="40"
              height="40"
              opacity="0.5"
            />
          </pattern>
          
          <linearGradient id={`sandLighting-${habit.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 200, 0.3)', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: 'transparent', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(0, 0, 0, 0.2)', stopOpacity: 1 }} />
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
        
        {/* Sand Texture (Fades out when skipped) */}
        <rect
          x="0"
          y="0"
          width="1200"
          height="600"
          fill={`url(#sandPattern-${habit.id})`}
          opacity={isSkipped ? "0" : "0.5"}
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        />
        
        {/* Sand Lighting Effect (Fades out when skipped) */}
        <rect
          x="0" 
          y="0"
          width="1200"
          height="600"
          fill={`url(#sandLighting-${habit.id})`}
          opacity={isSkipped ? "0" : "1"}
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        />
        
        {/* Water Shape - The position transitions from bottom to top when skipped */}
        <path
          className={`water-shape-${habit.id}`}
          d={isSkipped ? 
            "M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0V600H0Z" : 
            "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240V600H0Z"
          }
          fill={`url(#waterGradient-${habit.id})`}
          style={{ transition: 'd 0.5s ease-in-out' }}
        />
        
        {/* Foam Effect on the Water's Edge - This also transitions with the water */}
        <path
          className={`foam-shape-${habit.id}`}
          d={isSkipped ? 
            "M0,0V30C15,15,60,40,140,25C220,10,300,30,380,15C460,0,540,20,620,5C700,-10,780,10,860,-5C940,-20,1020,0,1100,-15C1160,-20,1200,0,1200,0V30C1180,45,1120,20,1060,35C980,50,900,25,820,40C740,55,660,30,580,45C500,60,420,35,340,50C260,65,180,40,100,55C40,70,0,45,0,30Z" : 
            "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240C1180,260,1120,240,1060,260C980,280,900,260,820,280C740,300,660,280,580,300C500,320,420,300,340,320C260,340,180,320,100,340C40,360,0,340,0,320Z"
          }
          fill="white"
          fillOpacity="0.5"
          style={{ transition: 'd 0.5s ease-in-out' }}
        />
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

        /* Animation for water wave and foam */
        ${Array.from({ length: 5 }).map((_, i) => `
          .water-shape-${i + 1} {
            animation: ripple-wave-${i + 1} 3s ease-in-out infinite;
          }
          
          .foam-shape-${i + 1} {
            animation: wave-foam-${i + 1} 2.5s ease-in-out infinite reverse;
          }
          
          @keyframes ripple-wave-${i + 1} {
            0% {
              d: path("${isSkipped ? 
                "M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0V600H0Z" : 
                "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240V600H0Z"}");
            }
            50% {
              d: path("${isSkipped ? 
                "M0,0V40C40,20,100,60,180,40C260,20,340,40,420,20C500,0,580,20,660,0C740,-20,820,0,900,-20C980,-40,1060,-20,1140,0C1200,-20,1200,0,1200,0V600H0Z" : 
                "M0,300C40,280,100,320,180,300C260,280,340,300,420,280C500,260,580,280,660,260C740,240,820,260,900,240C980,220,1060,240,1140,220C1200,200,1200,220,1200,240V600H0Z"}");
            }
            100% {
              d: path("${isSkipped ? 
                "M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0V600H0Z" : 
                "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240V600H0Z"}");
            }
          }
          
          @keyframes wave-foam-${i + 1} {
            0% {
              d: path("${isSkipped ? 
                "M0,0V30C15,15,60,40,140,25C220,10,300,30,380,15C460,0,540,20,620,5C700,-10,780,10,860,-5C940,-20,1020,0,1100,-15C1160,-20,1200,0,1200,0V30C1180,45,1120,20,1060,35C980,50,900,25,820,40C740,55,660,30,580,45C500,60,420,35,340,50C260,65,180,40,100,55C40,70,0,45,0,30Z" : 
                "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240C1180,260,1120,240,1060,260C980,280,900,260,820,280C740,300,660,280,580,300C500,320,420,300,340,320C260,340,180,320,100,340C40,360,0,340,0,320Z"}");
              opacity: 0.5;
            }
            50% {
              d: path("${isSkipped ? 
                "M0,0V20C30,5,80,30,160,15C240,0,320,20,400,5C480,-10,560,0,640,-15C720,-30,800,-10,880,-25C960,-40,1040,-20,1120,-35C1180,-50,1200,-20,1200,0V20C1170,35,1110,10,1050,25C970,40,890,15,810,30C730,45,650,20,570,35C490,50,410,25,330,40C250,55,170,30,90,45C30,60,0,35,0,20Z" : 
                "M0,300C30,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240C1170,260,1110,240,1050,260C970,280,890,260,810,280C730,300,650,280,570,300C490,320,410,300,330,320C250,340,170,320,90,340C30,360,0,340,0,320Z"}");
              opacity: 0.8;
            }
            100% {
              d: path("${isSkipped ? 
                "M0,0V30C15,15,60,40,140,25C220,10,300,30,380,15C460,0,540,20,620,5C700,-10,780,10,860,-5C940,-20,1020,0,1100,-15C1160,-20,1200,0,1200,0V30C1180,45,1120,20,1060,35C980,50,900,25,820,40C740,55,660,30,580,45C500,60,420,35,340,50C260,65,180,40,100,55C40,70,0,45,0,30Z" : 
                "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240C1180,260,1120,240,1060,260C980,280,900,260,820,280C740,300,660,280,580,300C500,320,420,300,340,320C260,340,180,320,100,340C40,360,0,340,0,320Z"}");
              opacity: 0.5;
            }
          }
        `).join('\n')}
        
        /* Custom animations for each habit's water */
        .water-shape-${habit.id} {
          animation: ripple-wave-${habit.id} 3s ease-in-out infinite;
        }
        
        .foam-shape-${habit.id} {
          animation: wave-foam-${habit.id} 2.5s ease-in-out infinite reverse;
        }
        
        @keyframes ripple-wave-${habit.id} {
          0% {
            d: path("${isSkipped ? 
              "M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0V600H0Z" : 
              "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240V600H0Z"}");
          }
          50% {
            d: path("${isSkipped ? 
              "M0,0V40C40,20,100,60,180,40C260,20,340,40,420,20C500,0,580,20,660,0C740,-20,820,0,900,-20C980,-40,1060,-20,1140,0C1200,-20,1200,0,1200,0V600H0Z" : 
              "M0,300C40,280,100,320,180,300C260,280,340,300,420,280C500,260,580,280,660,260C740,240,820,260,900,240C980,220,1060,240,1140,220C1200,200,1200,220,1200,240V600H0Z"}");
          }
          100% {
            d: path("${isSkipped ? 
              "M0,0V60C20,40,80,80,160,60C240,40,320,60,400,40C480,20,560,40,640,20C720,0,800,20,880,0C960,-20,1040,0,1120,-20C1180,-40,1200,0,1200,0V600H0Z" : 
              "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240V600H0Z"}");
          }
        }
        
        @keyframes wave-foam-${habit.id} {
          0% {
            d: path("${isSkipped ? 
              "M0,0V30C15,15,60,40,140,25C220,10,300,30,380,15C460,0,540,20,620,5C700,-10,780,10,860,-5C940,-20,1020,0,1100,-15C1160,-20,1200,0,1200,0V30C1180,45,1120,20,1060,35C980,50,900,25,820,40C740,55,660,30,580,45C500,60,420,35,340,50C260,65,180,40,100,55C40,70,0,45,0,30Z" : 
              "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240C1180,260,1120,240,1060,260C980,280,900,260,820,280C740,300,660,280,580,300C500,320,420,300,340,320C260,340,180,320,100,340C40,360,0,340,0,320Z"}");
            opacity: 0.5;
          }
          50% {
            d: path("${isSkipped ? 
              "M0,0V20C30,5,80,30,160,15C240,0,320,20,400,5C480,-10,560,0,640,-15C720,-30,800,-10,880,-25C960,-40,1040,-20,1120,-35C1180,-50,1200,-20,1200,0V20C1170,35,1110,10,1050,25C970,40,890,15,810,30C730,45,650,20,570,35C490,50,410,25,330,40C250,55,170,30,90,45C30,60,0,35,0,20Z" : 
              "M0,300C30,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240C1170,260,1110,240,1050,260C970,280,890,260,810,280C730,300,650,280,570,300C490,320,410,300,330,320C250,340,170,320,90,340C30,360,0,340,0,320Z"}");
            opacity: 0.8;
          }
          100% {
            d: path("${isSkipped ? 
              "M0,0V30C15,15,60,40,140,25C220,10,300,30,380,15C460,0,540,20,620,5C700,-10,780,10,860,-5C940,-20,1020,0,1100,-15C1160,-20,1200,0,1200,0V30C1180,45,1120,20,1060,35C980,50,900,25,820,40C740,55,660,30,580,45C500,60,420,35,340,50C260,65,180,40,100,55C40,70,0,45,0,30Z" : 
              "M0,300C20,280,80,320,160,300C240,280,320,300,400,280C480,260,560,280,640,260C720,240,800,260,880,240C960,220,1040,240,1120,220C1180,200,1200,220,1200,240C1180,260,1120,240,1060,260C980,280,900,260,820,280C740,300,660,280,580,300C500,320,420,300,340,320C260,340,180,320,100,340C40,360,0,340,0,320Z"}");
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default HabitCard;
