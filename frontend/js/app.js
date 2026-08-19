// ============================================================
// SKYFLOW - PART 1
// ============================================================

// ===== Global Cities Database =====
const CITIES = {
    'Nairobi': { lat: -1.2921, lon: 36.8219, country: 'Kenya', continent: 'Africa' },
    'London': { lat: 51.5074, lon: -0.1278, country: 'United Kingdom', continent: 'Europe' },
    'New York': { lat: 40.7128, lon: -74.0060, country: 'USA', continent: 'North America' },
    'Tokyo': { lat: 35.6762, lon: 139.6503, country: 'Japan', continent: 'Asia' },
    'Sydney': { lat: -33.8688, lon: 151.2093, country: 'Australia', continent: 'Oceania' },
    'Cape Town': { lat: -33.9249, lon: 18.4241, country: 'South Africa', continent: 'Africa' },
    'Paris': { lat: 48.8566, lon: 2.3522, country: 'France', continent: 'Europe' },
    'Berlin': { lat: 52.5200, lon: 13.4050, country: 'Germany', continent: 'Europe' },
    'Rome': { lat: 41.9028, lon: 12.4964, country: 'Italy', continent: 'Europe' },
    'Madrid': { lat: 40.4168, lon: -3.7038, country: 'Spain', continent: 'Europe' },
    'Moscow': { lat: 55.7558, lon: 37.6173, country: 'Russia', continent: 'Europe' },
    'Dubai': { lat: 25.2048, lon: 55.2708, country: 'UAE', continent: 'Asia' },
    'Singapore': { lat: 1.3521, lon: 103.8198, country: 'Singapore', continent: 'Asia' },
    'Mumbai': { lat: 19.0760, lon: 72.8777, country: 'India', continent: 'Asia' },
    'Shanghai': { lat: 31.2304, lon: 121.4737, country: 'China', continent: 'Asia' },
    'Seoul': { lat: 37.5665, lon: 126.9780, country: 'South Korea', continent: 'Asia' },
    'Bangkok': { lat: 13.7563, lon: 100.5018, country: 'Thailand', continent: 'Asia' },
    'Mexico City': { lat: 19.4326, lon: -99.1332, country: 'Mexico', continent: 'North America' },
    'Los Angeles': { lat: 34.0522, lon: -118.2437, country: 'USA', continent: 'North America' },
    'Chicago': { lat: 41.8781, lon: -87.6298, country: 'USA', continent: 'North America' },
    'Toronto': { lat: 43.6532, lon: -79.3832, country: 'Canada', continent: 'North America' },
    'Sao Paulo': { lat: -23.5505, lon: -46.6333, country: 'Brazil', continent: 'South America' },
    'Buenos Aires': { lat: -34.6037, lon: -58.3816, country: 'Argentina', continent: 'South America' },
    'Lima': { lat: -12.0464, lon: -77.0428, country: 'Peru', continent: 'South America' },
    'Cairo': { lat: 30.0444, lon: 31.2357, country: 'Egypt', continent: 'Africa' },
    'Lagos': { lat: 6.5244, lon: 3.3792, country: 'Nigeria', continent: 'Africa' },
    'Casablanca': { lat: 33.5731, lon: -7.5898, country: 'Morocco', continent: 'Africa' },
    'Auckland': { lat: -36.8485, lon: 174.7633, country: 'New Zealand', continent: 'Oceania' },
    'Istanbul': { lat: 41.0082, lon: 28.9784, country: 'Turkey', continent: 'Asia' },
    'Barcelona': { lat: 41.3851, lon: 2.1734, country: 'Spain', continent: 'Europe' },
};

// ===== State =====
const state = {
    lat: -1.2921,
    lon: 36.8219,
    city: 'Nairobi',
    units: 'metric',
    isLoading: false,
    lastUpdated: null
};

// ===== DOM =====
const $ = id => document.getElementById(id);
const DOM = {
    searchInput: $('searchInput'),
    searchBtn: $('searchBtn'),
    locationBtn: $('locationBtn'),
    refreshBtn: $('refreshBtn'),
    unitToggle: $('unitToggle'),
    unitActive: $('unitActive'),
    unitInactive: $('unitInactive'),
    loading: $('loading'),
    error: $('error'),
    errorMsg: $('errorMsg'),
    retryBtn: $('retryBtn'),
    weatherContent: $('weatherContent'),
    cityName: $('cityName'),
    countryInfo: $('countryInfo'),
    weatherDesc: $('weatherDesc'),
    mainTemp: $('mainTemp'),
    weatherEmoji: $('weatherEmoji'),
    metricTemp: $('metricTemp'),
    metricHumidity: $('metricHumidity'),
    metricWind: $('metricWind'),
    metricPressure: $('metricPressure'),
    aiSection: $('aiSection'),
    aiText: $('aiText'),
    hourlySection: $('hourlySection'),
    hourlyList: $('hourlyList'),
    forecastSection: $('forecastSection'),
    forecastList: $('forecastList'),
    extraSection: $('extraSection'),
    sunriseTime: $('sunriseTime'),
    sunsetTime: $('sunsetTime'),
    cloudCover: $('cloudCover'),
    visibility: $('visibility'),
    timestamp: $('timestamp'),
    quickBtns: document.querySelectorAll('.quick-cities button')
};

// ===== API =====
async function fetchWeather(lat, lon, units = state.units) {
    if (state.isLoading) return;
    state.isLoading = true;
    showLoading(true);
    hideError();
    
    try {
        const params = new URLSearchParams({ 
            lat, 
            lon, 
            days: 7, 
            ai: true, 
            units, 
            lang: 'en' 
        });
        
        console.log('🌤️ Fetching weather for:', lat, lon);
        
        const res = await fetch(`/api/weather?${params.toString()}`);
        const data = await res.json();
        
        console.log('📦 API Response:', data);
        
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }
        
        if (!data.data || !data.data.current) {
            throw new Error('Invalid weather data received');
        }
        
        state.lat = lat;
        state.lon = lon;
        state.lastUpdated = new Date();
        renderWeather(data.data);
        showLoading(false);
        
    } catch (err) {
        console.error('❌ Weather fetch error:', err);
        showLoading(false);
        showError(err.message || 'Unable to load weather data. Please try again.');
    } finally {
        state.isLoading = false;
    }
}

// ===== Render =====
function renderWeather(data) {
    console.log('🎨 Rendering weather data:', data);
    
    const { current, location, forecast, hourly, aiInsight } = data;
    
    // === CITY NAME ===
    const cityName = location?.name || state.city || 'Unknown Location';
    DOM.cityName.textContent = cityName;
    console.log('📍 City:', cityName);
    
    // === COUNTRY & CONTINENT ===
    let cityInfo = null;
    const searchName = DOM.searchInput.value.trim();
    if (searchName && CITIES[searchName]) {
        cityInfo = CITIES[searchName];
    } else {
        for (const [name, info] of Object.entries(CITIES)) {
            if (Math.abs(info.lat - state.lat) < 0.5 && Math.abs(info.lon - state.lon) < 0.5) {
                cityInfo = info;
                break;
            }
        }
    }
    
    if (cityInfo) {
        DOM.countryInfo.textContent = `${cityInfo.country}, ${cityInfo.continent}`;
    } else if (location?.country) {
        DOM.countryInfo.textContent = location.country;
    } else {
        DOM.countryInfo.textContent = 'Global';
    }
    
    // === WEATHER DESCRIPTION ===
    DOM.weatherDesc.textContent = current?.description || current?.condition || '--';
    
    // === TEMPERATURE ===
    const temp = current?.temperature;
    if (temp !== null && temp !== undefined && !isNaN(temp)) {
        const formatted = formatTemp(temp);
        DOM.mainTemp.textContent = formatted;
        DOM.metricTemp.textContent = formatted;
        console.log('🌡️ Temperature:', formatted);
    } else {
        DOM.mainTemp.textContent = '--';
        DOM.metricTemp.textContent = '--';
        console.warn('⚠️ No temperature data');
    }
    
    // === WEATHER EMOJI ===
    DOM.weatherEmoji.textContent = getEmoji(current?.condition, current?.icon);
    
    // === HUMIDITY ===
    if (current?.humidity !== null && current?.humidity !== undefined) {
        DOM.metricHumidity.textContent = `${current.humidity}%`;
    } else {
        DOM.metricHumidity.textContent = '--';
    }
    
    // === WIND ===
    if (current?.windSpeed !== null && current?.windSpeed !== undefined) {
        DOM.metricWind.textContent = formatWind(current.windSpeed);
    } else {
        DOM.metricWind.textContent = '--';
    }
    
    // === PRESSURE ===
    if (current?.pressure !== null && current?.pressure !== undefined) {
        DOM.metricPressure.textContent = `${current.pressure} hPa`;
    } else {
        DOM.metricPressure.textContent = '--';
    }
    
    // === AI INSIGHT ===
    if (aiInsight) {
        DOM.aiSection.style.display = 'block';
        DOM.aiText.textContent = aiInsight;
    } else {
        DOM.aiSection.style.display = 'none';
    }
    
    // === HOURLY FORECAST ===
    if (hourly && hourly.length > 0) {
        DOM.hourlySection.style.display = 'block';
        DOM.hourlyList.innerHTML = hourly.slice(0, 24).map(h => {
            let timeStr = '--:--';
            if (h.dt) {
                const time = new Date(h.dt * 1000);
                if (!isNaN(time.getTime())) {
                    timeStr = time.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                }
            }
            const tempVal = h.temp !== undefined ? h.temp : (h.temperature || null);
            const cond = h.condition || h.main || '--';
            const icon = h.icon || h.weather_icon || null;
            return `
                <div class="hourly-card">
                    <div style="font-size:12px;color:var(--muted);">${timeStr}</div>
                    <div style="font-size:26px;margin:4px 0;">${getEmoji(cond, icon)}</div>
                    <div style="font-size:18px;font-weight:700;">
                        ${tempVal !== null && !isNaN(tempVal) ? formatTemp(tempVal) : '--'}
                    </div>
                    <div style="font-size:11px;color:var(--muted);">
                        ${cond.length > 8 ? cond.slice(0, 8) : cond}
                    </div>
                </div>
            `;
        }).join('');
    } else {
        DOM.hourlySection.style.display = 'none';
    }
    
    // === 7-DAY FORECAST ===
    if (forecast && forecast.length > 0) {
        DOM.forecastSection.style.display = 'block';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const todayStr = today.toDateString();
        
        DOM.forecastList.innerHTML = forecast.slice(0, 7).map((f, i) => {
            let dayName = '--';
            let dateStr = '--';
            
            if (f.dt) {
                const d = new Date(f.dt * 1000);
                if (!isNaN(d.getTime())) {
                    if (d.toDateString() === todayStr) {
                        dayName = 'Today';
                    } else {
                        dayName = days[d.getDay()];
                    }
                    dateStr = d.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                    });
                }
            } else if (f.date) {
                const d = new Date(f.date);
                if (!isNaN(d.getTime())) {
                    if (d.toDateString() === todayStr) {
                        dayName = 'Today';
                    } else {
                        dayName = days[d.getDay()];
                    }
                    dateStr = d.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                    });
                }
            } else {
                const d = new Date(today);
                d.setDate(d.getDate() + i + 1);
                if (i === 0) {
                    dayName = 'Today';
                } else {
                    dayName = days[d.getDay()];
                }
                dateStr = d.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                });
            }
            
            const high = f.temp?.max !== undefined ? f.temp.max : (f.temp || f.high || null);
            const low = f.temp?.min !== undefined ? f.temp.min : (f.temp_min || f.low || null);
            const cond = f.condition || f.main || '--';
            const icon = f.icon || f.weather_icon || null;
            
            return `
                <div class="forecast-card">
                    <div>
                        <strong>${dayName}</strong>
                        <br>
                        <span style="color:var(--muted);font-size:12px;">${dateStr}</span>
                    </div>
                    <div style="font-size:26px;">${getEmoji(cond, icon)}</div>
                    <div>${cond.length > 12 ? cond.slice(0, 12) : cond}</div>
                    <div>
                        <strong>${high !== null && !isNaN(high) ? formatTemp(high) : '--'}</strong>
                        <span style="color:var(--muted);">
                            ${low !== null && !isNaN(low) ? formatTemp(low) : '--'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        DOM.forecastSection.style.display = 'none';
    }
    
    // === EXTRA DETAILS ===
    DOM.extraSection.style.display = 'block';
    
    if (current?.sunrise) {
        DOM.sunriseTime.textContent = formatTime(current.sunrise);
    } else {
        DOM.sunriseTime.textContent = '--';
    }
    
    if (current?.sunset) {
        DOM.sunsetTime.textContent = formatTime(current.sunset);
    } else {
        DOM.sunsetTime.textContent = '--';
    }
    
    if (current?.cloudCover !== null && current?.cloudCover !== undefined) {
        DOM.cloudCover.textContent = `${current.cloudCover}%`;
    } else {
        DOM.cloudCover.textContent = '--';
    }
    
    if (current?.visibility !== null && current?.visibility !== undefined) {
        DOM.visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    } else {
        DOM.visibility.textContent = '--';
    }
    
    DOM.timestamp.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    DOM.weatherContent.style.display = 'block';
}// ============================================================
// SKYFLOW - PART 2
// ============================================================

// ===== Utilities =====
function formatTemp(t) {
    if (t === null || t === undefined || isNaN(t)) return '--';
    const v = Math.round(t);
    return state.units === 'metric' ? `${v}°C` : `${Math.round(v * 9/5 + 32)}°F`;
}

function formatWind(s) {
    if (s === null || s === undefined || isNaN(s)) return '--';
    return state.units === 'metric' ? `${Math.round(s * 3.6)} km/h` : `${Math.round(s * 2.237)} mph`;
}

function formatTime(ts) {
    if (!ts) return '--';
    const date = new Date(ts * 1000);
    if (isNaN(date.getTime())) return '--';
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function getEmoji(condition, icon) {
    const c = (condition || '').toLowerCase();
    if (c.includes('thunder') || c.includes('storm')) return '⛈️';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '🌧️';
    if (c.includes('snow') || c.includes('sleet')) return '❄️';
    if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️';
    if (c.includes('clear') || c.includes('sunny')) return '☀️';
    if (c.includes('cloud') || c.includes('overcast')) return '☁️';
    if (c.includes('partly')) return '⛅';
    if (icon) {
        const i = String(icon);
        if (i.includes('01')) return '☀️';
        if (i.includes('02')) return '⛅';
        if (i.includes('03') || i.includes('04')) return '☁️';
        if (i.includes('09') || i.includes('10')) return '🌧️';
        if (i.includes('11')) return '⛈️';
        if (i.includes('13')) return '❄️';
        if (i.includes('50')) return '🌫️';
    }
    return '🌤️';
}

function detectCityFromInput(input) {
    const trimmed = input.trim();
    if (CITIES[trimmed]) return CITIES[trimmed];
    for (const [name, info] of Object.entries(CITIES)) {
        if (name.toLowerCase() === trimmed.toLowerCase()) return info;
    }
    for (const [name, info] of Object.entries(CITIES)) {
        if (name.toLowerCase().includes(trimmed.toLowerCase()) || 
            trimmed.toLowerCase().includes(name.toLowerCase())) {
            return info;
        }
    }
    return null;
}

// ===== UI Helpers =====
function showLoading(show) {
    DOM.loading.style.display = show ? 'block' : 'none';
    if (show) DOM.weatherContent.style.display = 'none';
}

function showError(msg) {
    DOM.error.style.display = 'block';
    DOM.errorMsg.textContent = msg || 'Unable to load weather data.';
    DOM.weatherContent.style.display = 'none';
}

function hideError() {
    DOM.error.style.display = 'none';
}

// ===== Actions =====
function searchWeather() {
    const input = DOM.searchInput.value.trim();
    if (!input) { 
        showError('Please enter a city or coordinates'); 
        return; 
    }
    
    const parts = input.split(',').map(s => s.trim());
    if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
            state.city = input;
            fetchWeather(lat, lon);
            return;
        }
    }
    
    const cityInfo = detectCityFromInput(input);
    if (cityInfo) {
        state.city = input;
        DOM.searchInput.value = input;
        fetchWeather(cityInfo.lat, cityInfo.lon);
        return;
    }
    
    showError(`City "${input}" not found. Try: Nairobi, London, NYC, Tokyo, Sydney, Cape Town`);
}

function useLocation() {
    if (!navigator.geolocation) { 
        showError('Geolocation not supported'); 
        return; 
    }
    DOM.locationBtn.textContent = '📍 Getting...';
    DOM.locationBtn.disabled = true;
    navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude, longitude } = pos.coords;
            state.city = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            DOM.searchInput.value = state.city;
            DOM.locationBtn.textContent = '📍 Use My Location';
            DOM.locationBtn.disabled = false;
            fetchWeather(latitude, longitude);
        },
        () => {
            DOM.locationBtn.textContent = '📍 Use My Location';
            DOM.locationBtn.disabled = false;
            showError('Unable to get location. Please search manually.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

function toggleUnits() {
    state.units = state.units === 'metric' ? 'imperial' : 'metric';
    DOM.unitActive.textContent = state.units === 'metric' ? '°C' : '°F';
    DOM.unitInactive.textContent = state.units === 'metric' ? '°F' : '°C';
    if (state.lat && state.lon) {
        fetchWeather(state.lat, state.lon);
    }
}

function refreshWeather() {
    if (state.lat && state.lon) {
        DOM.refreshBtn.classList.add('spinning');
        fetchWeather(state.lat, state.lon).finally(() => {
            setTimeout(() => DOM.refreshBtn.classList.remove('spinning'), 400);
        });
    }
}

// ===== Events =====
DOM.searchBtn.addEventListener('click', searchWeather);
DOM.searchInput.addEventListener('keypress', e => { 
    if (e.key === 'Enter') searchWeather(); 
});
DOM.locationBtn.addEventListener('click', useLocation);
DOM.refreshBtn.addEventListener('click', refreshWeather);
DOM.unitToggle.addEventListener('click', toggleUnits);
DOM.retryBtn.addEventListener('click', () => {
    if (state.lat && state.lon) {
        fetchWeather(state.lat, state.lon);
    } else {
        searchWeather();
    }
});

DOM.quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const city = btn.dataset.city;
        const lat = parseFloat(btn.dataset.lat);
        const lon = parseFloat(btn.dataset.lon);
        DOM.searchInput.value = city;
        state.city = city;
        fetchWeather(lat, lon);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { 
        e.preventDefault(); 
        searchWeather(); 
    }
    if (e.key === 'Escape') {
        hideError();
    }
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    DOM.searchInput.value = 'Nairobi';
    fetchWeather(state.lat, state.lon);
});
