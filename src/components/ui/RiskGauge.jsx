import React from 'react';

const RiskGauge = ({ score, size = 200, colorClass = 'var(--color-neon-cyan)', glowClass = 'glow-cyan' }) => {
  // SVG coordinates for semi-circle
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size - strokeWidth;
  
  // Calculate stroke dasharray for the semi-circle gauge
  const circumference = Math.PI * radius;
  const dashArray = circumference;
  // Fill proportion based on score (0-100)
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg 
        width={size} 
        height={size / 2 + strokeWidth} 
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        className="overflow-visible"
      >
        {/* Background Arc */}
        <path
          d={`M ${strokeWidth/2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${cy}`}
          fill="none"
          stroke="var(--color-space-600)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Foreground (Score) Arc */}
        <path
          d={`M ${strokeWidth/2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${cy}`}
          fill="none"
          stroke={colorClass}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          className={`transition-all duration-1000 ease-out`}
          style={{ filter: `drop-shadow(0 0 8px ${colorClass})` }}
        />
      </svg>
      
      {/* Center Text overlay */}
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-4xl font-bold font-orbitron" style={{ color: colorClass, textShadow: `0 0 10px ${colorClass}` }}>
          {score}
        </span>
        <span className="text-xs uppercase tracking-widest text-gray-400 mt-1">Risk Index</span>
      </div>
    </div>
  );
};

export default RiskGauge;
