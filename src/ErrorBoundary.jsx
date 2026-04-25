import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center z-10 relative">
          <div className="glass-panel glow-red p-8 rounded-xl max-w-lg w-full">
            <AlertTriangle className="w-16 h-16 text-[var(--color-neon-red)] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[var(--color-neon-red)] mb-2 font-orbitron">SYSTEM FAILURE</h2>
            <p className="text-gray-300 mb-6 font-light">
              Mission Control encountered an unexpected error. 
            </p>
            <div className="bg-[#0a0a1a] p-4 rounded text-left overflow-auto text-xs text-red-400 mb-6 max-h-32 border border-red-900/30">
              {this.state.error && this.state.error.toString()}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[var(--color-space-700)] hover:bg-[var(--color-space-600)] border border-[var(--color-neon-red)] text-white px-6 py-2 rounded transition-all duration-300 glow-red"
            >
              REBOOT SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
