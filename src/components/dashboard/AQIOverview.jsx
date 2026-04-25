import React from 'react';
import GlowCard from '../ui/GlowCard';
import StatusBadge from '../ui/StatusBadge';
import { getAQIDescription } from '../../utils/formatters';

const AQIOverview = ({ pollutionData }) => {
  if (!pollutionData || !pollutionData.list || pollutionData.list.length === 0) {
    return (
      <GlowCard className="h-full" color="cyan">
        <h3 className="font-orbitron text-[var(--color-neon-cyan)] mb-4">Atmospheric Quality</h3>
        <p className="text-gray-400">Telemetry offline.</p>
      </GlowCard>
    );
  }

  const data = pollutionData.list[0];
  const aqi = data.main.aqi;
  const aqiInfo = getAQIDescription(aqi);
  
  const components = [
    { name: 'PM2.5', value: data.components.pm2_5, unit: 'μg/m³', limit: 25 },
    { name: 'PM10', value: data.components.pm10, unit: 'μg/m³', limit: 50 },
    { name: 'O₃', value: data.components.o3, unit: 'μg/m³', limit: 100 },
    { name: 'NO₂', value: data.components.no2, unit: 'μg/m³', limit: 40 },
    { name: 'SO₂', value: data.components.so2, unit: 'μg/m³', limit: 20 },
    { name: 'CO', value: data.components.co, unit: 'μg/m³', limit: 4000 }
  ];

  return (
    <GlowCard className="h-full flex flex-col" color={aqi > 3 ? 'red' : aqi > 2 ? 'amber' : 'green'}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-orbitron text-[var(--color-neon-cyan)] text-lg">Atmospheric Quality</h3>
          <p className="text-xs text-gray-400 tracking-wider">AIR POLLUTION INDEX</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-orbitron" style={{ color: `var(--color-neon-${aqi > 3 ? 'red' : aqi > 2 ? 'amber' : 'green'})` }}>
            {aqi} <span className="text-sm text-gray-500">/ 5</span>
          </div>
          <StatusBadge status={aqi > 3 ? 'Danger' : aqi > 2 ? 'Warning' : 'Safe'} text={aqiInfo.text} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {components.map((comp) => {
          const ratio = comp.value / comp.limit;
          const isHigh = ratio > 1;
          const isWarning = ratio > 0.7 && !isHigh;
          
          return (
            <div key={comp.name} className="bg-[var(--color-space-800)] p-3 rounded border border-gray-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-gray-300">{comp.name}</span>
                <div className={`w-2 h-2 rounded-full ${isHigh ? 'bg-[var(--color-neon-red)] glow-red' : isWarning ? 'bg-[var(--color-neon-amber)] glow-amber' : 'bg-[var(--color-neon-green)] glow-green'}`}></div>
              </div>
              <div className="text-lg font-orbitron text-white">
                {comp.value.toFixed(1)}
                <span className="text-xs text-gray-500 ml-1 font-inter">{comp.unit}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-700 h-1 mt-2 rounded overflow-hidden">
                <div 
                  className={`h-full ${isHigh ? 'bg-[var(--color-neon-red)]' : isWarning ? 'bg-[var(--color-neon-amber)]' : 'bg-[var(--color-neon-green)]'}`}
                  style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
};

export default AQIOverview;
