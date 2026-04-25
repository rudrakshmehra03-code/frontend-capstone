import React from 'react';
import GlowCard from '../ui/GlowCard';
import { Thermometer, Droplets, Wind, Gauge } from 'lucide-react';

const WeatherPanel = ({ weatherData }) => {
  if (!weatherData || !weatherData.main) {
    return (
      <GlowCard className="h-full" color="cyan">
        <h3 className="font-orbitron text-[var(--color-neon-cyan)] mb-4">Meteorological Data</h3>
        <p className="text-gray-400">Telemetry offline.</p>
      </GlowCard>
    );
  }

  const { main, wind, weather } = weatherData;
  const condition = weather && weather.length > 0 ? weather[0] : null;

  const metrics = [
    { 
      label: 'Temperature', 
      value: `${Math.round(main.temp)}°C`, 
      subtext: `Feels like ${Math.round(main.feels_like)}°C`,
      icon: <Thermometer className="w-5 h-5 text-[var(--color-neon-amber)]" />
    },
    { 
      label: 'Humidity', 
      value: `${main.humidity}%`, 
      subtext: 'Relative humidity',
      icon: <Droplets className="w-5 h-5 text-[var(--color-neon-cyan)]" />
    },
    { 
      label: 'Wind Speed', 
      value: `${wind.speed} m/s`, 
      subtext: `Direction: ${wind.deg}°`,
      icon: <Wind className="w-5 h-5 text-gray-300" />
    },
    { 
      label: 'Pressure', 
      value: `${main.pressure} hPa`, 
      subtext: 'Sea level',
      icon: <Gauge className="w-5 h-5 text-[var(--color-neon-green)]" />
    }
  ];

  return (
    <GlowCard className="h-full flex flex-col" color="cyan">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-orbitron text-[var(--color-neon-cyan)] text-lg">Meteorological</h3>
          <p className="text-xs text-gray-400 tracking-wider uppercase">SURFACE CONDITIONS</p>
        </div>
        {condition && (
          <div className="text-right flex flex-col items-end">
            <img 
              src={`https://openweathermap.org/img/wn/${condition.icon}.png`} 
              alt={condition.main}
              className="w-10 h-10 -my-2 opacity-80"
            />
            <span className="text-xs text-gray-300 capitalize mt-1">{condition.description}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-[rgba(0,0,0,0.3)] p-3 rounded border border-[var(--color-space-600)] flex items-center gap-3">
            <div className="p-2 bg-[var(--color-space-700)] rounded-full border border-gray-700">
              {metric.icon}
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">{metric.label}</div>
              <div className="text-lg font-orbitron text-white">{metric.value}</div>
              <div className="text-[10px] text-gray-500 truncate">{metric.subtext}</div>
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  );
};

export default WeatherPanel;
