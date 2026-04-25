// NASA Earth Observatory Natural Event Tracker (EONET) API
// No API key required for EONET!

const BASE_URL = 'https://eonet.gsfc.nasa.gov/api/v3';

export const nasaApi = {
  // Get natural events (wildfires, volcanoes, storms, etc.)
  getEvents: async (limit = 20, status = 'open') => {
    try {
      const url = `${BASE_URL}/events?limit=${limit}&status=${status}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`NASA API error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch NASA events:", error);
      return { events: [] };
    }
  },
  
  // Get events by specific category (e.g., 'wildfires', 'volcanoes')
  getEventsByCategory: async (categoryId, limit = 20) => {
    try {
      const url = `${BASE_URL}/categories/${categoryId}?limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`NASA API error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error(`Failed to fetch NASA events for category ${categoryId}:`, error);
      return { events: [] };
    }
  },
  
  // Get all categories available
  getCategories: async () => {
    try {
      const url = `${BASE_URL}/categories`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`NASA API error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch NASA categories:", error);
      return { categories: [] };
    }
  }
};
