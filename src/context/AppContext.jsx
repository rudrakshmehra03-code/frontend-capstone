import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { weatherApi } from '../services/weatherApi';
import { pollutionApi } from '../services/pollutionApi';
import { calculateRiskScore } from '../utils/riskCalculator';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Global state
  const [currentCity, setCurrentCity] = useState({ name: 'Delhi', lat: 28.6139, lon: 77.2090, country: 'IN' });
  
  // Stored state
  const [reports, setReports] = useLocalStorage('orbital_reports', []);
  const [alerts, setAlerts] = useLocalStorage('orbital_custom_alerts', []);
  
  // Live data state
  const [weatherData, setWeatherData] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data for current city
  const fetchCityData = useCallback(async (cityCoords = currentCity) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, pollution] = await Promise.all([
        weatherApi.getWeatherByCoords(cityCoords.lat, cityCoords.lon),
        pollutionApi.getCurrentPollution(cityCoords.lat, cityCoords.lon)
      ]);
      
      setWeatherData(weather);
      setPollutionData(pollution);
      
      const risk = calculateRiskScore(pollution, weather);
      setRiskData(risk);
    } catch (err) {
      setError("Failed to sync telemetry data. Please retry.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentCity]);

  // Effect to load data when city changes
  useEffect(() => {
    fetchCityData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchCityData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [currentCity, fetchCityData]);

  // City search and update action
  const changeCity = async (cityName) => {
    setLoading(true);
    try {
      const results = await weatherApi.getCoordsByCity(cityName);
      if (results && results.length > 0) {
        const newCity = {
          name: results[0].name,
          lat: results[0].lat,
          lon: results[0].lon,
          country: results[0].country
        };
        setCurrentCity(newCity);
        return { success: true };
      }
      return { success: false, error: 'City not found on scanners.' };
    } catch (err) {
      return { success: false, error: 'Scanner communication error.' };
    } finally {
      setLoading(false);
    }
  };

  // CRUD for Reports
  const addReport = (reportData) => {
    const newReport = {
      ...reportData,
      id: Date.now().toString(),
      timestamp: Date.now(),
      city: currentCity.name
    };
    setReports(prev => [newReport, ...prev]);
  };
  
  const updateReport = (id, updatedData) => {
    setReports(prev => prev.map(report => report.id === id ? { ...report, ...updatedData, updatedAt: Date.now() } : report));
  };
  
  const deleteReport = (id) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const value = {
    currentCity,
    weatherData,
    pollutionData,
    riskData,
    loading,
    error,
    reports,
    alerts,
    changeCity,
    fetchCityData, // manual refresh
    addReport,
    updateReport,
    deleteReport,
    setAlerts
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
