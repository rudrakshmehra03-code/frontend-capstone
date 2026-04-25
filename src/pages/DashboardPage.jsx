import React from 'react';
import { useAppContext } from '../context/AppContext';
import GlowCard from '../components/ui/GlowCard';
import RiskGauge from '../components/ui/RiskGauge';
import AQIOverview from '../components/dashboard/AQIOverview';
import WeatherPanel from '../components/dashboard/WeatherPanel';
import NasaEventsPanel from '../components/dashboard/NasaEventsPanel';
import StatsGrid from '../components/dashboard/StatsGrid';

const DashboardPage = () => {
  const { currentCity, riskData, pollutionData, weatherData, loading } = useAppContext();

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-[fade-in_0.5s_ease-out]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-green)] mb-1">
            MISSION CONTROL
          </h1>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-orbitron">
            Global Environmental Telemetry Array
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Risk Score & Weather */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GlowCard 
            className="flex-1 flex flex-col items-center justify-center py-8" 
            color={riskData?.category === 'Dangerous' ? 'red' : riskData?.category === 'Moderate' ? 'amber' : 'green'}
          >
            <h3 className="font-orbitron text-gray-300 text-center mb-6 uppercase tracking-widest">
              Environmental Risk Index
            </h3>
            
            {riskData ? (
              <div className="flex flex-col items-center">
                <RiskGauge 
                  score={riskData.score} 
                  colorClass={riskData.colorClass} 
                  glowClass={riskData.glowClass} 
                  size={240} 
                />
                <div className={`mt-6 px-4 py-1 border rounded text-sm font-medium tracking-widest uppercase ${riskData.colorClass.replace('var(', '').replace(')', '')} bg-opacity-10`} style={{ color: riskData.colorClass, borderColor: riskData.colorClass }}>
                  {riskData.category}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Calculating...</div>
            )}
          </GlowCard>
          
          <div className="h-64">
             <WeatherPanel weatherData={weatherData} />
          </div>
        </div>

        {/* Middle Column: AQI Breakdown */}
        <div className="lg:col-span-1">
          <AQIOverview pollutionData={pollutionData} />
        </div>

        {/* Right Column: NASA Feed */}
        <div className="lg:col-span-1 h-[400px] lg:h-auto">
          <NasaEventsPanel />
        </div>
        
      </div>

      {/* Bottom row */}
      <div className="mt-8">
        <StatsGrid />
      </div>

    </div>
  );
};

export default DashboardPage;
