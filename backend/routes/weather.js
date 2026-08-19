const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherAI');

router.get('/weather', async (req, res, next) => {
  try {
    const { lat, lon, days = 7, ai = true, units = 'metric', lang = 'en' } = req.query;
    
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid coordinates. Please provide valid latitude and longitude.' 
      });
    }
    
    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      return res.status(400).json({ 
        success: false, 
        error: 'Coordinates out of range. Latitude: -90 to 90, Longitude: -180 to 180.' 
      });
    }
    
    const weatherData = await weatherService.getWeather({
      lat: latNum,
      lon: lonNum,
      days: parseInt(days),
      ai: ai === 'true',
      units,
      lang
    });
    
    res.json({ success: true, data: weatherData });
  } catch (error) {
    next(error);
  }
});

router.get('/weather/current', async (req, res, next) => {
  try {
    const { lat, lon, units = 'metric', lang = 'en' } = req.query;
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid coordinates.' 
      });
    }
    
    const weatherData = await weatherService.getCurrentWeather({
      lat: latNum,
      lon: lonNum,
      units,
      lang
    });
    
    res.json({ success: true, data: weatherData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
