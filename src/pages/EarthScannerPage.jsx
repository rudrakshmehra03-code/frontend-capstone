import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { weatherApi } from '../services/weatherApi';
import GlowCard from '../components/ui/GlowCard';
import PollutionChart from '../components/scanner/PollutionChart';
import StatusBadge from '../components/ui/StatusBadge';
import { Search, MapPin, Crosshair, Map } from 'lucide-react';
import { calculateRiskScore } from '../utils/riskCalculator';

const EarthScannerPage = () => {
  const { currentCity, pollutionData, weatherData, riskData, changeCity, loading } = useAppContext();
  const [searchInput, setSearchInput] = useState('');
  const [searchHistory, setSearchHistory] = useState(['Tokyo', 'London', 'New York', 'Beijing', 'Mumbai']);
  
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchInput.trim().length > 2) {
      const res = await changeCity(searchInput.trim());
      if (res.success) {
        // Add to history
        const newHistory = [searchInput.trim(), ...searchHistory.filter(c => c.toLowerCase() !== searchInput.trim().toLowerCase())].slice(0, 5);
        setSearchHistory(newHistory);
        setSearchInput('');
      }
    }
  };

  const handleHistoryClick = (city) => {
    changeCity(city);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-[fade-in_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-green)] mb-1">
            EARTH SCANNER
          </h1>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-orbitron">
            Targeted Geographic Analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Search & Tools */}
        <div className="lg:col-span-1 space-y-6">
          <GlowCard color="cyan">
            <h3 className="font-orbitron text-[var(--color-neon-cyan)] mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
              <Crosshair size={16} /> Target Coordinates
            </h3>
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-[var(--color-space-800)] border border-[var(--color-neon-cyan)] text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-inter text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-neon-cyan)]" />
              </div>
              <button 
                type="submit"
                disabled={loading || searchInput.trim().length < 3}
                className="w-full mt-3 bg-[var(--color-space-700)] hover:bg-[var(--color-space-600)] border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] text-xs font-orbitron tracking-widest py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SCANNING...' : 'INITIATE SCAN'}
              </button>
            </form>

            <div>
              <h4 className="text-xs text-gray-500 font-orbitron uppercase tracking-widest mb-3 border-b border-gray-800 pb-1">
                Recent Scans
              </h4>
              <ul className="space-y-2">
                {searchHistory.map((city, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleHistoryClick(city)}
                      className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--color-neon-cyan)] hover:bg-[rgba(0,240,255,0.05)] p-2 rounded transition-colors text-left"
                    >
                      <MapPin size={14} className="shrink-0" />
                      <span className="truncate">{city}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </GlowCard>
          
          {/* Map Placeholder */}
          <GlowCard color="cyan" className="overflow-hidden p-0 h-48 relative flex items-center justify-center">
             <div className="absolute inset-0 bg-[var(--color-space-800)] opacity-50 flex items-center justify-center">
                <Map size={48} className="text-[var(--color-space-600)]" />
             </div>
             <div className="relative z-10 text-center">
                <Crosshair className="w-8 h-8 text-[var(--color-neon-cyan)] animate-pulse mx-auto mb-2" />
                <div className="bg-black/60 px-3 py-1 rounded border border-[var(--color-neon-cyan)] text-xs font-mono text-[var(--color-neon-cyan)]">
                  {currentCity.lat.toFixed(4)} N, {currentCity.lon.toFixed(4)} E
                </div>
             </div>
             {/* Radar Sweep Effect */}
             <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-[rgba(0,240,255,0.1)] to-transparent origin-bottom-right animate-[spin_4s_linear_infinite] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          </GlowCard>
        </div>

        {/* Right Column: Data & Charts */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowCard color={riskData?.category === 'Dangerous' ? 'red' : riskData?.category === 'Moderate' ? 'amber' : 'green'} className="col-span-1 md:col-span-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-orbitron text-2xl text-white tracking-wide">{currentCity.name}</h3>
                <StatusBadge status={riskData?.category} />
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-1 mb-6">
                <MapPin size={14} /> {currentCity.country}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-xs text-gray-500 uppercase font-orbitron">Risk Score</p>
                   <p className="text-3xl font-bold font-orbitron" style={{ color: riskData?.colorClass }}>
                     {riskData?.score} <span className="text-sm text-gray-500">/ 100</span>
                   </p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-orbitron">Air Quality</p>
                   <p className="text-3xl font-bold font-orbitron text-white">
                     {pollutionData?.list?.[0]?.main?.aqi} <span className="text-sm text-gray-500">/ 5</span>
                   </p>
                </div>
              </div>
            </GlowCard>
            
            <GlowCard color="cyan" className="col-span-1 flex flex-col justify-center">
              <p className="text-xs text-gray-500 uppercase font-orbitron mb-2">Current Surface Conditions</p>
              <div className="text-4xl font-bold text-white font-orbitron mb-1">
                {Math.round(weatherData?.main?.temp || 0)}°C
              </div>
              <p className="text-sm text-[var(--color-neon-cyan)] capitalize">
                {weatherData?.weather?.[0]?.description || 'Unknown'}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>Humidity: <span className="text-white">{weatherData?.main?.humidity}%</span></div>
                <div>Wind: <span className="text-white">{weatherData?.wind?.speed}m/s</span></div>
              </div>
            </GlowCard>
          </div>

          <div className="h-80">
            <PollutionChart data={pollutionData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthScannerPage;
