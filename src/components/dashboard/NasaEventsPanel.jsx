import React, { useState, useEffect } from 'react';
import GlowCard from '../ui/GlowCard';
import StatusBadge from '../ui/StatusBadge';
import { nasaApi } from '../../services/nasaApi';
import { Flame, CloudLightning, Mountain, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatISODate } from '../../utils/formatters';

const NasaEventsPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const data = await nasaApi.getEvents(5, 'open');
      if (data && data.events) {
        setEvents(data.events.slice(0, 5));
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const getEventIcon = (categories) => {
    if (!categories || categories.length === 0) return <AlertCircle className="w-5 h-5" />;
    const cat = categories[0].id.toLowerCase();
    
    if (cat.includes('wildfire')) return <Flame className="w-5 h-5 text-orange-500" />;
    if (cat.includes('storm')) return <CloudLightning className="w-5 h-5 text-blue-400" />;
    if (cat.includes('volcano')) return <Mountain className="w-5 h-5 text-red-500" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <GlowCard className="h-full flex flex-col" color="amber">
      <div className="mb-4">
        <h3 className="font-orbitron text-[var(--color-neon-amber)] text-lg">EONET Feed</h3>
        <p className="text-xs text-gray-400 tracking-wider uppercase">NASA GLOBAL EVENT TRACKER</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-6 h-6 border-2 border-[var(--color-space-600)] border-t-[var(--color-neon-amber)] rounded-full animate-spin"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-8">No active events detected.</p>
        ) : (
          events.map((event) => {
            const date = event.geometry && event.geometry.length > 0 ? event.geometry[0].date : null;
            return (
              <div key={event.id} className="bg-[var(--color-space-800)] p-3 rounded border border-[rgba(255,183,0,0.2)] hover:border-[rgba(255,183,0,0.5)] transition-colors">
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    {getEventIcon(event.categories)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate" title={event.title}>
                      {event.title}
                    </h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-[var(--color-neon-cyan)]">
                        {event.categories?.[0]?.title || 'Unknown'}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {formatISODate(date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlowCard>
  );
};

export default NasaEventsPanel;
