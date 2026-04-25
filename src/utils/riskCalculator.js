/**
 * Calculates Environmental Risk Score (0-100)
 * 
 * Formula:
 * Score = (AQI_normalized × 0.4) + (temp_deviation × 0.3) + (humidity_deviation × 0.3)
 * 
 * Categories:
 * 0-33: Safe
 * 34-66: Moderate
 * 67-100: Dangerous
 */

export const calculateRiskScore = (pollutionData, weatherData) => {
  if (!pollutionData || !weatherData) return null;

  // 1. AQI Normalization (AQI is 1-5 scale)
  const aqi = pollutionData.list[0].main.aqi;
  // Convert 1-5 scale to 0-100: (aqi / 5) * 100
  const aqiNormalized = (aqi / 5) * 100;

  // 2. Temperature Deviation
  // Ideal temp: 22°C. Acceptable range: 22 ± 28 (-6°C to +50°C)
  const tempCelsius = weatherData.main.temp;
  const tempDiff = Math.abs(tempCelsius - 22);
  const tempDeviation = Math.min((tempDiff / 28) * 100, 100);

  // 3. Humidity Deviation
  // Ideal humidity: 50%. Range: 0-100%
  const humidity = weatherData.main.humidity;
  const humidityDiff = Math.abs(humidity - 50);
  const humidityDeviation = Math.min((humidityDiff / 50) * 100, 100);

  // Calculate final score
  const score = (aqiNormalized * 0.4) + (tempDeviation * 0.3) + (humidityDeviation * 0.3);

  // Return integer score and category
  const finalScore = Math.round(score);
  
  let category = 'Safe';
  let colorClass = 'var(--color-neon-green)';
  let glowClass = 'glow-green';
  
  if (finalScore > 33 && finalScore <= 66) {
    category = 'Moderate';
    colorClass = 'var(--color-neon-amber)';
    glowClass = 'glow-amber';
  } else if (finalScore > 66) {
    category = 'Dangerous';
    colorClass = 'var(--color-neon-red)';
    glowClass = 'glow-red';
  }

  return {
    score: finalScore,
    category,
    colorClass,
    glowClass,
    breakdown: {
      aqiComponent: Math.round(aqiNormalized * 0.4),
      tempComponent: Math.round(tempDeviation * 0.3),
      humidityComponent: Math.round(humidityDeviation * 0.3)
    }
  };
};
