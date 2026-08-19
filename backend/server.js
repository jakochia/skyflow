require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const weatherRoutes = require('./routes/weather');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://skyflow-weather.onrender.com'] 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'SkyFlow API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌊 SkyFlow server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
