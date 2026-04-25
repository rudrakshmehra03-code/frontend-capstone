import React from 'react';

const StatusBadge = ({ status, text }) => {
  let colorClasses = '';
  
  switch (status?.toLowerCase()) {
    case 'safe':
    case 'good':
    case 'low':
      colorClasses = 'text-[var(--color-neon-green)] border-[var(--color-neon-green)] bg-[rgba(57,255,20,0.1)] glow-green';
      break;
    case 'moderate':
    case 'medium':
    case 'warning':
      colorClasses = 'text-[var(--color-neon-amber)] border-[var(--color-neon-amber)] bg-[rgba(255,183,0,0.1)] glow-amber';
      break;
    case 'dangerous':
    case 'high':
    case 'poor':
    case 'critical':
      colorClasses = 'text-[var(--color-neon-red)] border-[var(--color-neon-red)] bg-[rgba(255,7,58,0.1)] glow-red animate-pulse-fast';
      break;
    default:
      colorClasses = 'text-gray-300 border-gray-600 bg-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}>
      {text || status}
    </span>
  );
};

export default StatusBadge;
