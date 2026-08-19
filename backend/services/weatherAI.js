const API_KEY = process.env.WEATHER_AI_API_KEY || 'wai_live_154f1f0fdbe33dc0fff01c7fbc96f3e9';
const BASE_URL = 'https://api.weather-ai.co/v1';

class WeatherAIService {
  async getWeather({ lat, lon, days = 7, ai = true, units = 'metric', lang = 'en' }) {
    try {
      // Use just the weather endpoint with all parameters
      const url = new URL(`${BASE_URL}/weather`);
      url.searchParams.append('lat', lat);
      url.searchParams.append('lon', lon);
      url.searchParams.append('days', days);
      url.searchParams.append('ai', ai);
      url.searchParams.append('units', units);
      url.searchParams.append('lang', lang);
      url.searchParams.append('include', 'current,minutely,hourly,daily,alerts');

      console.log('🌤️ URL:', url.toString());

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📦 Full API Response:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }
}

module.exports = new WeatherAIService();
