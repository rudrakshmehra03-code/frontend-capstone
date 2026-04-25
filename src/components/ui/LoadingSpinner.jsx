import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Processing Telemetry...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-10">
      <div className="relative">
        {/* Outer Orbit */}
        <div className={`${sizeClasses[size]} border-[var(--color-space-600)] border-t-[var(--color-neon-cyan)] rounded-full animate-spin glow-cyan`}></div>
        {/* Inner Orbit */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size].replace('w-16 h-16', 'w-10 h-10').replace('w-24 h-24', 'w-16 h-16')} border-[var(--color-space-700)] border-b-[var(--color-neon-green)] rounded-full animate-[spin_2s_linear_infinite_reverse]`}></div>
      </div>
      {text && (
        <p className="mt-6 text-[var(--color-neon-cyan)] font-orbitron text-sm tracking-widest animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
