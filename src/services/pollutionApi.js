const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'dummy_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const fetchWithMockFallback = async (url, mockDataCreator) => {
  try {
    const res = await fetch(url);
    if (res.status === 401) {
      console.warn("OpenWeather API key invalid or missing. Using mock pollution data.");
      return mockDataCreator();
    }
    if (!res.ok) throw new Error(`Pollution API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return mockDataCreator();
  }
};

export const pollutionApi = {
  // Get current air pollution by coordinates
  getCurrentPollution: async (lat, lon) => {
    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    return fetchWithMockFallback(url, () => getMockPollution(lat, lon));
  },
  
  // Get historical pollution data (last 24 hours)
  getHistoricalPollution: async (lat, lon) => {
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours ago
    const url = `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`;
    
    return fetchWithMockFallback(url, () => getMockHistoricalPollution(lat, lon));
  }
};

// Generate realistic looking mock pollution data
function getMockPollution(lat, lon) {
  // Semi-random based on coords
  const baseValue = Math.abs(lat + lon) % 150;
  const aqi = Math.max(1, Math.min(5, Math.ceil(baseValue / 30)));
  
  return {
    coord: { lat, lon },
    list: [{
      dt: Math.floor(Date.now() / 1000),
      main: { aqi },
      components: {
        co: 200 + baseValue * 2,
        no: 0.1 + baseValue / 100,
        no2: 0.5 + baseValue / 50,
        o3: 40 + baseValue / 2,
        so2: 1.5 + baseValue / 20,
        pm2_5: 5 + baseValue / 4,
        pm10: 10 + baseValue / 2,
        nh3: 0.5 + baseValue / 40
      }
    }]
  };
}

function getMockHistoricalPollution(lat, lon) {
  const current = Math.floor(Date.now() / 1000);
  const list = [];
  let currentVal = Math.abs(lat + lon) % 150;
  
  // Generate 24 hours of data
  for (let i = 24; i >= 0; i--) {
    const dt = current - (i * 3600);
    // Add some random walk to values
    currentVal = Math.max(10, currentVal + (Math.random() * 20 - 10));
    const aqi = Math.max(1, Math.min(5, Math.ceil(currentVal / 30)));
    
    list.push({
      dt,
      main: { aqi },
      components: {
        co: 200 + currentVal * 2,
        no: 0.1 + currentVal / 100,
        no2: 0.5 + currentVal / 50,
        o3: 40 + currentVal / 2,
        so2: 1.5 + currentVal / 20,
        pm2_5: 5 + currentVal / 4,
        pm10: 10 + currentVal / 2,
        nh3: 0.5 + currentVal / 40
      }
    });
  }
  
  return { coord: { lat, lon }, list };
}
