import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, FileText, Bell, Globe } from 'lucide-react';

const StatsGrid = () => {
  const { reports, alerts, currentCity } = useAppContext();
  const { user } = useAuth();

  const stats = [
    {
      label: 'Security Clearance',
      value: `Level ${user?.clearanceLevel || 1}`,
      icon: <Shield className="w-5 h-5 text-[var(--color-neon-cyan)]" />,
      color: 'border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)]'
    },
    {
      label: 'Filed Observations',
      value: reports.length.toString(),
      icon: <FileText className="w-5 h-5 text-[var(--color-neon-green)]" />,
      color: 'border-[var(--color-neon-green)] text-[var(--color-neon-green)]'
    },
    {
      label: 'Active Monitored City',
      value: currentCity.name,
      icon: <Globe className="w-5 h-5 text-[var(--color-neon-cyan)]" />,
      color: 'border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)]'
    },
    {
      label: 'Custom Alerts',
      value: alerts.length.toString(),
      icon: <Bell className="w-5 h-5 text-[var(--color-neon-amber)]" />,
      color: 'border-[var(--color-neon-amber)] text-[var(--color-neon-amber)]'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="glass-panel p-4 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors flex items-center gap-4">
          <div className={`p-3 rounded-full border bg-[rgba(0,0,0,0.3)] ${stat.color} border-opacity-30`}>
            {stat.icon}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-gray-400 font-orbitron uppercase tracking-wider truncate">
              {stat.label}
            </p>
            <p className="text-lg font-bold text-white truncate">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
