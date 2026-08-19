const API_KEY = process.env.WEATHER_AI_API_KEY || 'wai_live_154f1f0fdbe33dc0fff01c7fbc96f3e9';
const BASE_URL = 'https://api.weather-ai.co/v1';

class WeatherAIService {
  async getWeather({ lat, lon, days = 7, ai = true, units = 'metric', lang = 'en' }) {
    try {
      const url = new URL(`${BASE_URL}/weather`);
      url.searchParams.append('lat', lat);
      url.searchParams.append('lon', lon);
      url.searchParams.append('days', days);
      url.searchParams.append('ai', ai);
      url.searchParams.append('units', units);
      url.searchParams.append('lang', lang);

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.handleApiError(response.status, data);
      }

      return this.normalizeResponse(data);
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach WeatherAI service');
      }
      throw error;
    }
  }

  async getCurrentWeather({ lat, lon, units = 'metric', lang = 'en' }) {
    try {
      const url = new URL(`${BASE_URL}/current`);
      url.searchParams.append('lat', lat);
      url.searchParams.append('lon', lon);
      url.searchParams.append('units', units);
      url.searchParams.append('lang', lang);

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.handleApiError(response.status, data);
      }

      return this.normalizeCurrentWeather(data);
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach WeatherAI service');
      }
      throw error;
    }
  }

  normalizeResponse(data) {
    return {
      location: {
        name: data.name || data.city || 'Unknown Location',
        country: data.country || data.sys?.country || '',
        lat: data.coord?.lat || data.lat || null,
        lon: data.coord?.lon || data.lon || null,
        timezone: data.timezone || null
      },
      current: {
        temperature: data.main?.temp || data.temperature || null,
        feelsLike: data.main?.feels_like || data.feels_like || null,
        humidity: data.main?.humidity || data.humidity || null,
        pressure: data.main?.pressure || data.pressure || null,
        windSpeed: data.wind?.speed || data.wind_speed || null,
        windDeg: data.wind?.deg || data.wind_deg || null,
        cloudCover: data.clouds?.all || data.cloud_cover || null,
        visibility: data.visibility || null,
        condition: data.weather?.[0]?.main || data.condition || 'Unknown',
        description: data.weather?.[0]?.description || data.description || '',
        icon: data.weather?.[0]?.icon || data.icon || '01d',
        uvi: data.uvi || null,
        sunrise: data.sys?.sunrise || data.sunrise || null,
        sunset: data.sys?.sunset || data.sunset || null
      },
      aiInsight: data.ai_summary || data.ai || data.insight || null,
      forecast: data.forecast || data.daily || [],
      hourly: data.hourly || [],
      units: data.units || 'metric',
      timestamp: data.dt || Date.now() / 1000
    };
  }

  normalizeCurrentWeather(data) {
    return {
      location: {
        name: data.name || data.city || 'Unknown Location',
        country: data.country || data.sys?.country || '',
        lat: data.coord?.lat || data.lat || null,
        lon: data.coord?.lon || data.lon || null
      },
      current: {
        temperature: data.main?.temp || data.temperature || null,
        feelsLike: data.main?.feels_like || data.feels_like || null,
        humidity: data.main?.humidity || data.humidity || null,
        pressure: data.main?.pressure || data.pressure || null,
        windSpeed: data.wind?.speed || data.wind_speed || null,
        condition: data.weather?.[0]?.main || data.condition || 'Unknown',
        description: data.weather?.[0]?.description || data.description || '',
        icon: data.weather?.[0]?.icon || data.icon || '01d'
      },
      timestamp: data.dt || Date.now() / 1000
    };
  }

  handleApiError(status, data) {
    let message = 'Weather service error';
    
    switch (status) {
      case 401:
        message = 'Invalid API key. Please check your credentials.';
        break;
      case 403:
        message = 'Access forbidden. This feature may not be available in your plan.';
        break;
      case 429:
        message = 'Rate limit exceeded. Please wait before making more requests.';
        break;
      case 500:
      case 503:
        message = 'Weather service is temporarily unavailable. Please try again later.';
        break;
      default:
        message = data.message || data.error || 'An unexpected error occurred';
    }
    
    const error = new Error(message);
    error.status = status;
    error.data = data;
    return error;
  }
}

module.exports = new WeatherAIService();
