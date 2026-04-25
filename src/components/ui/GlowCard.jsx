import React from 'react';

const GlowCard = ({ children, className = '', color = 'cyan', ...props }) => {
  // Map color prop to CSS classes defined in index.css
  const colorMap = {
    cyan: 'glow-cyan border-[var(--color-neon-cyan)]',
    green: 'glow-green border-[var(--color-neon-green)]',
    amber: 'glow-amber border-[var(--color-neon-amber)]',
    red: 'glow-red border-[var(--color-neon-red)]',
  };

  const glowClass = colorMap[color] || colorMap.cyan;

  return (
    <div 
      className={`glass-panel rounded-xl border border-opacity-30 p-5 ${glowClass} transition-all duration-300 hover:shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlowCard;
