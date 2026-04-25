import React, { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Search, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '../../hooks/useDebounce';

const TopBar = () => {
  const { currentCity, loading, error, changeCity, fetchCityData } = useAppContext();
  const { user } = useAuth();
  
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  // Handle search when debounced value changes
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 2) {
      handleSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleSearch = async (query) => {
    setSearchError('');
    const result = await changeCity(query);
    if (!result.success) {
      setSearchError(result.error);
    } else {
      setSearchInput(''); // Clear on success
    }
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim().length > 2) {
      handleSearch(searchInput.trim());
    }
  };

  return (
    <header className="h-20 bg-[#0a0a1a] border-b border-opacity-20 border-[var(--color-neon-cyan)] flex items-center justify-between px-6 z-10 sticky top-0">
      {/* Current Location Display */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-orbitron uppercase tracking-wider mb-1">Target Coordinates</span>
          <div className="flex items-center gap-2">
            <MapPin className="text-[var(--color-neon-cyan)] w-5 h-5" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              {currentCity.name}, {currentCity.country}
            </h2>
            <span className="text-xs text-[var(--color-neon-cyan)] ml-2 bg-[rgba(0,240,255,0.1)] px-2 py-0.5 rounded border border-[var(--color-neon-cyan)] border-opacity-30">
              {currentCity.lat.toFixed(2)}, {currentCity.lon.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        
        {/* Search Bar */}
        <form onSubmit={onSearchSubmit} className="relative hidden md:block max-w-md w-full">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[var(--color-neon-cyan)] transition-colors" />
            <input
              type="text"
              placeholder="Target new city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[var(--color-space-800)] border border-gray-700 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:border-[var(--color-neon-cyan)] focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-inter text-sm"
            />
          </div>
          {searchError && (
            <div className="absolute top-full left-0 mt-2 text-xs text-[var(--color-neon-red)] flex items-center gap-1 bg-[#0a0a1a] border border-[var(--color-neon-red)] px-3 py-1 rounded shadow-lg z-50">
              <AlertTriangle w={12} h={12} /> {searchError}
            </div>
          )}
        </form>

        {/* Sync Status / Manual Refresh */}
        <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 font-orbitron tracking-widest uppercase">Telemetry</p>
            <p className="text-sm text-[var(--color-neon-green)] flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--color-neon-green)] animate-pulse"></span>
              Online
            </p>
          </div>
          <button 
            onClick={() => fetchCityData()}
            disabled={loading}
            className={`p-2 rounded-full border transition-all ${
              loading 
                ? 'border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] animate-spin glow-cyan' 
                : error 
                  ? 'border-[var(--color-neon-red)] text-[var(--color-neon-red)] hover:bg-[rgba(255,7,58,0.1)]'
                  : 'border-gray-700 text-gray-400 hover:text-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)] hover:bg-[rgba(0,240,255,0.05)]'
            }`}
            title="Force refresh telemetry"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
