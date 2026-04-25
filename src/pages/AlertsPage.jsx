import React, { useState, useEffect, useRef, useCallback } from 'react';
import { nasaApi } from '../services/nasaApi';
import GlowCard from '../components/ui/GlowCard';
import StatusBadge from '../components/ui/StatusBadge';
import { formatISODate } from '../utils/formatters';
import { AlertTriangle, Filter, Flame, CloudLightning, Mountain, AlertCircle } from 'lucide-react';

const AlertsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('all'); // all, wildfires, severeStorms, volcanoes
  const observer = useRef();

  const EVENTS_PER_PAGE = 20; // Number of events to fetch per "page"

  const fetchEvents = useCallback(async (pageNum, currentFilter) => {
    try {
      setLoading(true);
      setError(null);
      
      // NASA EONET doesn't have true pagination, so we simulate infinite scroll 
      // by fetching a larger limit and slicing it based on page number.
      // In a real app, we would use API pagination if available.
      const limit = pageNum * EVENTS_PER_PAGE;
      let data;
      
      if (currentFilter === 'all') {
         data = await nasaApi.getEvents(limit, 'open');
      } else {
         data = await nasaApi.getEventsByCategory(currentFilter, limit);
      }

      if (data && data.events) {
        setEvents(data.events);
        setHasMore(data.events.length === limit); // If we got exactly the limit, there might be more
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to connect to EONET server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and filter changes
  useEffect(() => {
    setPage(1);
    setEvents([]);
    fetchEvents(1, filter);
  }, [filter, fetchEvents]);

  // Handle pagination loading
  useEffect(() => {
    if (page > 1) {
      fetchEvents(page, filter);
    }
  }, [page, filter, fetchEvents]);

  // Intersection Observer for Infinite Scroll
  const lastEventElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const getEventIcon = (categories) => {
    if (!categories || categories.length === 0) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    const cat = categories[0].id.toLowerCase();
    
    if (cat.includes('wildfire')) return <Flame className="w-5 h-5 text-[var(--color-neon-amber)]" />;
    if (cat.includes('storm')) return <CloudLightning className="w-5 h-5 text-[var(--color-neon-cyan)]" />;
    if (cat.includes('volcano')) return <Mountain className="w-5 h-5 text-[var(--color-neon-red)]" />;
    return <AlertTriangle className="w-5 h-5 text-[var(--color-neon-amber)]" />;
  };

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'wildfires', label: 'Wildfires' },
    { id: 'severeStorms', label: 'Severe Storms' },
    { id: 'volcanoes', label: 'Volcanoes' }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-[fade-in_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-green)] mb-1">
            GLOBAL ALERTS
          </h1>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-orbitron">
            NASA EONET Natural Event Tracker
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <GlowCard color="cyan" className="sticky top-24">
            <h3 className="font-orbitron text-[var(--color-neon-cyan)] mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
              <Filter size={16} /> Filters
            </h3>
            <div className="space-y-2">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`w-full text-left px-4 py-3 rounded border transition-colors ${
                    filter === f.id 
                      ? 'bg-[rgba(0,240,255,0.1)] border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] glow-cyan' 
                      : 'bg-[var(--color-space-800)] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <span className="font-orbitron text-xs tracking-wider uppercase">{f.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-800">
               <div className="bg-[rgba(255,183,0,0.1)] border border-[var(--color-neon-amber)] p-3 rounded flex gap-3 text-sm">
                  <AlertTriangle className="text-[var(--color-neon-amber)] w-5 h-5 shrink-0" />
                  <p className="text-gray-300 text-xs">Events shown are active occurrences monitored by NASA satellites. Data delay may occur.</p>
               </div>
            </div>
          </GlowCard>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-[rgba(255,7,58,0.1)] border border-[var(--color-neon-red)] p-4 rounded mb-6 text-[var(--color-neon-red)]">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {events.map((event, index) => {
              // Get color based on category
              const cat = event.categories?.[0]?.id?.toLowerCase() || '';
              let glowColor = 'cyan';
              let badgeStatus = 'Moderate';
              
              if (cat.includes('wildfire')) { glowColor = 'amber'; badgeStatus = 'Warning'; }
              if (cat.includes('volcano')) { glowColor = 'red'; badgeStatus = 'Danger'; }
              
              const isLastElement = events.length === index + 1;
              const coords = event.geometry?.[0]?.coordinates;
              const latLng = coords && Array.isArray(coords) && coords.length >= 2 
                ? `${coords[1].toFixed(2)} N, ${coords[0].toFixed(2)} E` 
                : 'Unknown Location';

              return (
                <div 
                  key={event.id} 
                  ref={isLastElement ? lastEventElementRef : null}
                >
                  <GlowCard color={glowColor} className="flex flex-col sm:flex-row gap-4 p-5">
                    <div className={`w-12 h-12 rounded-full border border-opacity-50 flex items-center justify-center shrink-0 border-[var(--color-neon-${glowColor})] bg-[rgba(var(--color-neon-${glowColor}),0.1)]`}>
                      {getEventIcon(event.categories)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h2 className="text-lg font-bold text-white font-inter">{event.title}</h2>
                        <StatusBadge status={badgeStatus} text={event.categories?.[0]?.title || 'Event'} />
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-mono mt-3 bg-[var(--color-space-800)] p-2 rounded border border-gray-700 w-fit">
                        <span>ID: {event.id}</span>
                        <span className="text-[var(--color-neon-cyan)]">{latLng}</span>
                        <span>{event.geometry?.[0]?.date ? formatISODate(event.geometry[0].date) : 'Ongoing'}</span>
                      </div>
                    </div>
                  </GlowCard>
                </div>
              );
            })}

            {loading && (
              <div className="py-8 flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-[var(--color-space-600)] border-t-[var(--color-neon-cyan)] rounded-full animate-spin glow-cyan"></div>
              </div>
            )}
            
            {!loading && events.length === 0 && !error && (
              <div className="py-12 text-center text-gray-500 font-orbitron">
                No active events found for this category.
              </div>
            )}
            
            {!loading && !hasMore && events.length > 0 && (
              <div className="py-6 text-center text-gray-500 text-sm font-inter">
                End of event stream.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
