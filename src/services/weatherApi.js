const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'dummy_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper to handle API responses and fallback to mock data on 401
const fetchWithMockFallback = async (url, mockDataCreator) => {
  try {
    const res = await fetch(url);
    if (res.status === 401) {
      console.warn("OpenWeather API key invalid or missing. Using mock data for demonstration.");
      return mockDataCreator();
    }
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return mockDataCreator();
  }
};

export const weatherApi = {
  // Get weather by coordinates
  getWeatherByCoords: async (lat, lon) => {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return fetchWithMockFallback(url, () => getMockWeather(lat, lon));
  },
  
  // Geocoding: Get coordinates by city name
  getCoordsByCity: async (city) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    try {
      const res = await fetch(url);
      if (res.status === 401) {
        return [{ name: city, lat: 28.6139, lon: 77.2090, country: "IN" }]; // Default fallback coordinates (Delhi)
      }
      if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
      return [{ name: city, lat: 28.6139, lon: 77.2090, country: "IN" }];
    }
  }
};

// Realistic mock data generator for when API key is missing
function getMockWeather(lat, lon) {
  // Generate some semi-random but realistic looking data based on coords
  const temp = 20 + (lat % 15);
  return {
    coord: { lat, lon },
    weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
    main: {
      temp: temp,
      feels_like: temp + 1,
      temp_min: temp - 2,
      temp_max: temp + 3,
      pressure: 1012,
      humidity: 45 + Math.abs(lat % 30)
    },
    visibility: 10000,
    wind: { speed: 4.5, deg: 180 },
    name: "Mock City",
    sys: { country: "MK" }
  };
}
