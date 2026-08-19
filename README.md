# 🌤️ SkyFlow - Global Weather Intelligence

> Read the sky. Understand the weather.

SkyFlow is a production-grade weather intelligence application that combines real-time weather data with AI-powered insights. Built with the WeatherAI API, it provides a beautiful, responsive dashboard with global city support.

![SkyFlow Dashboard](https://via.placeholder.com/800x400/061a3a/54c7f3?text=SkyFlow+Weather+Dashboard)

---

## ✨ Features

### 🌍 Global Coverage
- **30+ Cities** with country and continent information
- Support for coordinates-based search
- Quick access to popular cities

### 🌤️ Real-Time Weather
- Current temperature, humidity, wind, and pressure
- Weather conditions with emoji icons
- Sunrise and sunset times
- Cloud cover and visibility

### 🧠 AI-Powered Insights
- WeatherAI intelligent summaries
- Natural language weather descriptions
- Smart weather predictions

### 📊 Comprehensive Forecast
- 7-Day forecast with highs and lows
- Hourly forecast with 24-hour details
- Temperature trends and patterns

### 🎨 Beautiful UI
- Sky-inspired color theme
- Glassmorphism design
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions

### 🔒 Security
- API keys stored in environment variables
- Never exposed to frontend
- Secure backend proxy for all API calls

---

## 🏗️ Architecture

---

## 🛠️ Technologies

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling with custom properties |
| Vanilla JavaScript | All logic and interactivity |
| Fetch API | API communication |
| Google Fonts (Inter) | Typography |
| CSS Animations | Smooth transitions |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| dotenv | Environment variables |
| Helmet | Security headers |
| CORS | Cross-origin support |
| express-rate-limit | API rate limiting |

### API Integration
| Service | Purpose |
|---------|---------|
| WeatherAI API | Weather data and AI insights |

---

## 📦 Installation

### Prerequisites
- **Node.js** v14 or higher
- **npm** or **yarn**
- **Termux** or **Acode Terminal** (for Android)
- **WeatherAI API key** (already included)

### Local Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skyflow.git
cd SkyFlow
cd backend
npm Installation
node server.js