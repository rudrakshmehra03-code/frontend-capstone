// Format numbers to a specific number of decimal places
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return '--';
  return Number(num).toFixed(decimals);
};

// Format Unix timestamp to local time string
export const formatTime = (unixTime) => {
  if (!unixTime) return '--:--';
  return new Date(unixTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format Unix timestamp to date string
export const formatDate = (unixTime) => {
  if (!unixTime) return '--/--/----';
  return new Date(unixTime * 1000).toLocaleDateString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format ISO date string
export const formatISODate = (isoString) => {
  if (!isoString) return '--';
  const date = new Date(isoString);
  return date.toLocaleDateString([], {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format AQI string based on value
export const getAQIDescription = (aqi) => {
  switch(aqi) {
    case 1: return { text: 'Good', color: 'text-green-400' };
    case 2: return { text: 'Fair', color: 'text-yellow-400' };
    case 3: return { text: 'Moderate', color: 'text-orange-400' };
    case 4: return { text: 'Poor', color: 'text-red-400' };
    case 5: return { text: 'Very Poor', color: 'text-purple-400' };
    default: return { text: 'Unknown', color: 'text-gray-400' };
  }
};
