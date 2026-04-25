import React, { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { AppProvider } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, FileText, Bell } from 'lucide-react';

const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  // Route guard
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-space-900)] text-white relative">
        {/* Starfield Background Layer */}
        <div className="starfield z-0 pointer-events-none"></div>

        {/* Sidebar (Desktop) */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
          <TopBar />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 md:p-6 lg:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto h-full">
              {/* Suspense wrapper for lazy loaded routes */}
              <Suspense fallback={
                <div className="h-[60vh] flex items-center justify-center">
                  <LoadingSpinner text="Establishing uplink..." size="lg" />
                </div>
              }>
                <Outlet />
              </Suspense>
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden bg-[var(--color-space-800)] border-t border-[var(--color-neon-cyan)] border-opacity-30 p-3 flex justify-around">
            {[
              { path: '/dashboard', icon: <LayoutDashboard size={24} /> },
              { path: '/earth-scanner', icon: <Globe size={24} /> },
              { path: '/reports', icon: <FileText size={24} /> },
              { path: '/alerts', icon: <Bell size={24} /> },
            ].map(item => (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => `p-2 rounded-full ${isActive ? 'text-[var(--color-neon-cyan)] glow-cyan' : 'text-gray-400'}`}
              >
                {item.icon}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </AppProvider>
  );
};

export default AppLayout;
