import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './ErrorBoundary';

// Lazy loading pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EarthScannerPage = lazy(() => import('./pages/EarthScannerPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <React.Suspense fallback={<div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center"><div className="w-16 h-16 border-4 border-t-[#00f0ff] border-[#252552] rounded-full animate-spin"></div></div>}>
                <LoginPage />
              </React.Suspense>
            } />
            
            {/* Protected Routes inside AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/earth-scanner" element={<EarthScannerPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
