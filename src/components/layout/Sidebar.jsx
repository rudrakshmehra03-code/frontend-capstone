import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, FileText, Bell, LogOut, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Mission Control', icon: <LayoutDashboard size={20} /> },
    { path: '/earth-scanner', label: 'Earth Scanner', icon: <Globe size={20} /> },
    { path: '/reports', label: 'Observations', icon: <FileText size={20} /> },
    { path: '/alerts', label: 'Event Alerts', icon: <Bell size={20} /> },
  ];

  return (
    <aside className="w-64 flex flex-col bg-[#0a0a1a] border-r border-opacity-20 border-[var(--color-neon-cyan)] z-20 h-screen hidden md:flex">
      {/* Brand */}
      <div className="p-6 border-b border-opacity-20 border-[var(--color-neon-cyan)] flex items-center gap-3">
        <Terminal className="text-[var(--color-neon-cyan)] w-8 h-8" />
        <div>
          <h1 className="font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-green)] text-sm leading-tight">
            ORBITAL
            <br/>GUARDIAN
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
              ${isActive 
                ? 'bg-[var(--color-neon-cyan-muted)] text-[var(--color-neon-cyan)] glow-cyan border border-[var(--color-neon-cyan)] border-opacity-50' 
                : 'text-gray-400 hover:text-[var(--color-neon-cyan)] hover:bg-[rgba(0,240,255,0.05)] border border-transparent'
              }
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-opacity-20 border-[var(--color-neon-cyan)]">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-space-800)] mb-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-space-600)] flex items-center justify-center border border-[var(--color-neon-cyan)]">
            <span className="font-orbitron font-bold text-xs text-[var(--color-neon-cyan)]">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.username || 'Commander'}</p>
            <p className="text-xs text-[var(--color-neon-cyan)] capitalize truncate">Level {user?.clearanceLevel || 1} {user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-gray-400 hover:text-[var(--color-neon-red)] hover:bg-[rgba(255,7,58,0.1)] transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
