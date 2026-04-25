import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts';
import GlowCard from '../ui/GlowCard';

const PollutionChart = ({ data }) => {
  if (!data || !data.list || data.list.length === 0) {
    return <div className="text-gray-500 text-center py-10">No chart data available.</div>;
  }

  const components = data.list[0].components;
  
  // Format data for Recharts
  const chartData = [
    { name: 'PM2.5', value: components.pm2_5, limit: 25, color: '#ff073a' },
    { name: 'PM10', value: components.pm10, limit: 50, color: '#ffb700' },
    { name: 'O₃', value: components.o3, limit: 100, color: '#00f0ff' },
    { name: 'NO₂', value: components.no2, limit: 40, color: '#39ff14' },
    { name: 'SO₂', value: components.so2, limit: 20, color: '#a020f0' },
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = ((data.value / data.limit) * 100).toFixed(0);
      return (
        <div className="bg-[var(--color-space-800)] border border-[var(--color-neon-cyan)] p-3 rounded shadow-lg glow-cyan">
          <p className="font-orbitron text-white mb-1">{label}</p>
          <p className="text-sm" style={{ color: data.color }}>
            Value: <span className="font-bold">{Number(data.value).toFixed(2)}</span> μg/m³
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Safe Limit: {data.limit} μg/m³
          </p>
          <p className={`text-xs mt-1 font-bold ${percent > 100 ? 'text-[var(--color-neon-red)]' : 'text-[var(--color-neon-green)]'}`}>
            {percent}% of safe limit
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlowCard className="h-full w-full p-4" color="cyan">
      <h3 className="font-orbitron text-[var(--color-neon-cyan)] mb-6 text-sm uppercase tracking-widest">
        Atmospheric Composition Profile
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#252552" vertical={false} />
            <XAxis dataKey="name" stroke="#a0aec0" tick={{ fill: '#a0aec0', fontFamily: 'Inter', fontSize: 12 }} />
            <YAxis stroke="#a0aec0" tick={{ fill: '#a0aec0', fontFamily: 'Inter', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,240,255,0.05)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > entry.limit ? '#ff073a' : entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[var(--color-neon-red)] rounded-full"></span> Exceeds Safe Limit</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[var(--color-neon-cyan)] rounded-full"></span> Within Safe Limit</span>
      </div>
    </GlowCard>
  );
};

export default PollutionChart;
