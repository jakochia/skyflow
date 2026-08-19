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

      // LOG THE FULL RESPONSE
      console.log('📦 FULL API RESPONSE:', JSON.stringify(data, null, 2));

      return this.normalizeResponse(data);
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  normalizeResponse(data) {
    // Helper to safely get nested values
    const get = (obj, path, fallback = null) => {
      const parts = path.split('.');
      let current = obj;
      for (const part of parts) {
        if (current === undefined || current === null || typeof current !== 'object') {
          return fallback;
        }
        current = current[part];
      }
      return current !== undefined && current !== null ? current : fallback;
    };

    // Extract all possible data
    const result = {
      location: {
        name: get(data, 'name') || get(data, 'city') || get(data, 'location.name') || get(data, 'address.city') || 'Unknown Location',
        country: get(data, 'country') || get(data, 'sys.country') || get(data, 'location.country') || '',
        lat: get(data, 'coord.lat') || get(data, 'lat') || null,
        lon: get(data, 'coord.lon') || get(data, 'lon') || null,
      },
      current: {
        temperature: get(data, 'main.temp') || get(data, 'temperature') || get(data, 'current.temp') || null,
        feelsLike: get(data, 'main.feels_like') || get(data, 'feels_like') || get(data, 'current.feels_like') || null,
        humidity: get(data, 'main.humidity') || get(data, 'humidity') || get(data, 'current.humidity') || null,
        pressure: get(data, 'main.pressure') || get(data, 'pressure') || get(data, 'current.pressure') || null,
        windSpeed: get(data, 'wind.speed') || get(data, 'wind_speed') || get(data, 'current.wind.speed') || null,
        windDeg: get(data, 'wind.deg') || get(data, 'wind_deg') || null,
        cloudCover: get(data, 'clouds.all') || get(data, 'cloud_cover') || get(data, 'current.cloud_cover') || null,
        visibility: get(data, 'visibility') || get(data, 'current.visibility') || null,
        condition: get(data, 'weather.0.main') || get(data, 'condition') || get(data, 'current.condition') || 'Unknown',
        description: get(data, 'weather.0.description') || get(data, 'description') || get(data, 'current.description') || '',
        icon: get(data, 'weather.0.icon') || get(data, 'icon') || get(data, 'current.icon') || '01d',
        uvi: get(data, 'uvi') || get(data, 'current.uvi') || null,
        sunrise: get(data, 'sys.sunrise') || get(data, 'sunrise') || get(data, 'current.sunrise') || null,
        sunset: get(data, 'sys.sunset') || get(data, 'sunset') || get(data, 'current.sunset') || null,
      },
      aiInsight: get(data, 'ai_summary') || get(data, 'ai') || get(data, 'insight') || get(data, 'ai_insight') || null,
      forecast: get(data, 'forecast') || get(data, 'daily') || [],
      hourly: get(data, 'hourly') || [],
      timestamp: get(data, 'dt') || Math.floor(Date.now() / 1000),
    };

    console.log('✅ NORMALIZED DATA:', JSON.stringify(result, null, 2));
    return result;
  }

  handleApiError(status, data) {
    let message = 'Weather service error';
    switch (status) {
      case 401: message = 'Invalid API key.';
        break;
      case 403: message = 'Access forbidden.';
        break;
      case 429: message = 'Rate limit exceeded.';
        break;
      case 500:
      case 503: message = 'Weather service unavailable.';
        break;
      default: message = data.message || data.error || 'Unknown error';
    }
    const error = new Error(message);
    error.status = status;
    return error;
  }
}

module.exports = new WeatherAIService();
