import { useEffect, useState } from "react";

interface WaterVisualizationProps {
  wqi: number;
  quality: string;
}

const getWaterColor = (wqi: number): string => {
  if (wqi >= 91) return "#16a34a"; // Excellent - Green
  if (wqi >= 71) return "#eab308"; // Good - Yellow
  if (wqi >= 51) return "#f97316"; // Medium - Orange
  if (wqi >= 26) return "#dc2626"; // Bad - Red
  return "#991b1b"; // Very Bad - Dark Red
};

const getWaterClass = (quality: string): string => {
  switch (quality.toLowerCase()) {
    case 'excellent': return 'quality-excellent';
    case 'good': return 'quality-good';
    case 'medium': return 'quality-medium';
    case 'bad': return 'quality-bad';
    case 'very bad': return 'quality-very-bad';
    default: return 'quality-medium';
  }
};

export const WaterVisualization = ({ wqi, quality }: WaterVisualizationProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const waterColor = getWaterColor(wqi);
  const waterClass = getWaterClass(quality);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRipple = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      };
      setRipples(prev => [...prev.slice(-2), newRipple]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-blue-100 to-blue-300 shadow-2xl">
      {/* Water Container */}
      <div 
        className={`absolute inset-0 water-flow transition-all duration-1000 ${waterClass}`}
        style={{
          background: `linear-gradient(135deg, ${waterColor}20, ${waterColor}60, ${waterColor}40)`,
          backgroundSize: '200% 200%',
        }}
      >
        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            className="relative w-full h-24"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="0"
                fill={waterColor}
                opacity="0.7"
                className="wave-animation"
                style={{ animationDelay: '0s' }}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="3"
                fill={waterColor}
                opacity="0.5"
                className="wave-animation"
                style={{ animationDelay: '-1s' }}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="5"
                fill={waterColor}
                opacity="0.3"
                className="wave-animation"
                style={{ animationDelay: '-2s' }}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="7"
                fill={waterColor}
                opacity="0.1"
                className="wave-animation"
                style={{ animationDelay: '-3s' }}
              />
            </g>
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute w-4 h-4 border-2 border-white/30 rounded-full water-ripple"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Quality indicator overlay */}
        <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="text-white font-bold text-sm">
            Water Quality: {quality}
          </div>
          <div className="font-bold text-white/80">
            WQI: {wqi.toFixed(1)}
          </div>
        </div>

        {/* Color gradient bar */}
        
      </div>
    </div>
  );
};