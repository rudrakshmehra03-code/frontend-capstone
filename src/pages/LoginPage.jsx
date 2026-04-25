import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlowCard from '../components/ui/GlowCard';
import { Terminal, Shield, KeyRound, AlertTriangle } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Authorization credentials required.");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passcodes do not match.");
      return;
    }

    const action = isLogin ? login : signup;
    const result = action(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || "Access denied.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="starfield z-0"></div>
      
      {/* Central orbital rings decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[var(--color-neon-cyan)] rounded-full opacity-10 animate-spin-slow pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[var(--color-neon-green)] rounded-full opacity-10 animate-[spin_20s_linear_infinite_reverse] pointer-events-none z-0"></div>

      <GlowCard className="w-full max-w-md relative z-10 p-8" color="cyan">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--color-neon-cyan)] flex items-center justify-center mb-4 glow-cyan bg-[var(--color-space-800)] relative">
            <Terminal className="text-[var(--color-neon-cyan)] w-8 h-8" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-[var(--color-neon-green)] rounded-full animate-ping"></div>
          </div>
          <h1 className="text-3xl font-orbitron font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-green)]">
            ORBITAL
          </h1>
          <h2 className="text-sm font-inter tracking-[0.3em] text-gray-400 mt-1 uppercase">
            Earth Guardian
          </h2>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          <button 
            className={`flex-1 py-2 font-orbitron text-sm uppercase tracking-wider transition-colors ${isLogin ? 'text-[var(--color-neon-cyan)] border-b-2 border-[var(--color-neon-cyan)]' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Terminal Login
          </button>
          <button 
            className={`flex-1 py-2 font-orbitron text-sm uppercase tracking-wider transition-colors ${!isLogin ? 'text-[var(--color-neon-cyan)] border-b-2 border-[var(--color-neon-cyan)]' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            New Operator
          </button>
        </div>

        {error && (
          <div className="bg-[rgba(255,7,58,0.1)] border border-[var(--color-neon-red)] text-[var(--color-neon-red)] px-4 py-3 rounded mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest mb-2">
              Operator ID
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[var(--color-space-800)] border border-gray-700 text-white rounded pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--color-neon-cyan)] focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-inter"
                placeholder="Enter identifier"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest mb-2">
              Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[var(--color-space-800)] border border-gray-700 text-white rounded pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--color-neon-cyan)] focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-inter"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest mb-2">
                Confirm Passcode
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-space-800)] border border-gray-700 text-white rounded pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--color-neon-cyan)] focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-inter"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[var(--color-space-700)] hover:bg-[var(--color-space-600)] border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] font-orbitron tracking-widest uppercase py-3 rounded mt-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            {isLogin ? 'Initiate Uplink' : 'Register Operator'}
          </button>
          
          {isLogin && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Authorized personnel only. For demonstration use any credentials.
            </p>
          )}
        </form>
      </GlowCard>
    </div>
  );
};

export default LoginPage;
