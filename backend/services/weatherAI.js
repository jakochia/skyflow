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

      // Log the actual response structure for debugging
      console.log('📦 API Response Structure:', JSON.stringify(data, null, 2));

      return this.normalizeResponse(data);
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach WeatherAI service');
      }
      throw error;
    }
  }

  normalizeResponse(data) {
    // Try multiple possible field names for location
    const locationName = data.name || 
                        data.city || 
                        data.location?.name || 
                        data.location?.city || 
                        data.address?.city ||
                        data.address?.town ||
                        'Unknown Location';

    // Try multiple possible field names for country
    const country = data.country || 
                   data.sys?.country || 
                   data.location?.country ||
                   data.address?.country ||
                   '';

    // Try multiple possible field names for temperature
    const temp = data.main?.temp || 
                data.temperature || 
                data.current?.temp ||
                data.current?.temperature ||
                null;

    // Try multiple possible field names for humidity
    const humidity = data.main?.humidity || 
                    data.humidity || 
                    data.current?.humidity ||
                    null;

    // Try multiple possible field names for wind speed
    const windSpeed = data.wind?.speed || 
                     data.wind_speed || 
                     data.current?.wind_speed ||
                     data.current?.wind?.speed ||
                     null;

    // Try multiple possible field names for pressure
    const pressure = data.main?.pressure || 
                    data.pressure || 
                    data.current?.pressure ||
                    null;

    // Try multiple possible field names for condition
    const condition = data.weather?.[0]?.main || 
                     data.condition || 
                     data.current?.condition ||
                     data.current?.weather?.[0]?.main ||
                     'Unknown';

    // Try multiple possible field names for description
    const description = data.weather?.[0]?.description || 
                       data.description || 
                       data.current?.description ||
                       data.current?.weather?.[0]?.description ||
                       '';

    // Try multiple possible field names for icon
    const icon = data.weather?.[0]?.icon || 
                data.icon || 
                data.current?.icon ||
                data.current?.weather?.[0]?.icon ||
                '01d';

    // Try multiple possible field names for sunrise/sunset
    const sunrise = data.sys?.sunrise || 
                   data.sunrise || 
                   data.current?.sunrise ||
                   null;

    const sunset = data.sys?.sunset || 
                  data.sunset || 
                  data.current?.sunset ||
                  null;

    // Try multiple possible field names for cloud cover
    const cloudCover = data.clouds?.all || 
                      data.cloud_cover || 
                      data.current?.clouds?.all ||
                      data.current?.cloud_cover ||
                      null;

    // Try multiple possible field names for visibility
    const visibility = data.visibility || 
                      data.current?.visibility ||
                      null;

    const normalized = {
      location: {
        name: locationName,
        country: country,
        lat: data.coord?.lat || data.lat || lat || null,
        lon: data.coord?.lon || data.lon || lon || null,
        timezone: data.timezone || null
      },
      current: {
        temperature: temp,
        feelsLike: data.main?.feels_like || data.feels_like || data.current?.feels_like || null,
        humidity: humidity,
        pressure: pressure,
        windSpeed: windSpeed,
        windDeg: data.wind?.deg || data.wind_deg || null,
        cloudCover: cloudCover,
        visibility: visibility,
        condition: condition,
        description: description,
        icon: icon,
        uvi: data.uvi || data.current?.uvi || null,
        sunrise: sunrise,
        sunset: sunset
      },
      aiInsight: data.ai_summary || data.ai || data.insight || data.ai_insight || null,
      forecast: data.forecast || data.daily || [],
      hourly: data.hourly || [],
      units: data.units || 'metric',
      timestamp: data.dt || Date.now() / 1000
    };

    console.log('✅ Normalized Data:', JSON.stringify(normalized, null, 2));
    return normalized;
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
