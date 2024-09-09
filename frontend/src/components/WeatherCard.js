// WeatherCard.js
import React from 'react';
import './WeatherCard.css';

// Import weather icons
import sunnyIcon from '../weather_icons/sunny_icon.png';
import cloudySunIcon from '../weather_icons/cloudy_sun_icon.png';
import cloudyIcon from '../weather_icons/cloudy_icon.png';
import cloudyRainIcon from '../weather_icons/cloudy_rain_icon.png';
import cloudDayRainIcon from '../weather_icons/cloud_day_rain_icon.png';
import windyIcon from '../weather_icons/windy_icon.png';

function WeatherCard({ city, state, temperature, condition, precipitation, icon }) {
  const getWeatherIcon = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny')) return sunnyIcon;
    if (lowerCondition.includes('partly cloudy')) return cloudySunIcon;
    if (lowerCondition.includes('cloudy') && lowerCondition.includes('rain')) return cloudyRainIcon;
    if (lowerCondition.includes('cloudy')) return cloudyIcon;
    if (lowerCondition.includes('rain')) return cloudDayRainIcon;
    if (lowerCondition.includes('windy')) return windyIcon;
    return sunnyIcon; // default icon
  };

  return (
    <div className="card weather-card">
      <div className="weather-header">
        <h3 className="weather-title">{city}, {state}</h3>
        <img src={icon} alt={condition} className="weather-icon" />
      </div>
      <div className="weather-info">
        <p className="condition">
          <strong>Today's weather: </strong>
          {condition}
        </p>
        <p className="temperature">
          <img src={require('../weather_icons/thermometer_weather_icon.png')} alt="Temperature" className="info-icon" />
          <strong>Temperature: </strong>{temperature}°F / {Math.round((temperature - 32) * 5/9)}°C
        </p>
        <p className="precipitation">
          <img src={require('../weather_icons/percentage_precipitation_icon.png')} alt="Precipitation" className="info-icon" />
          <strong>Precipitation: </strong>{precipitation || '0%'}
        </p>
      </div>
    </div>
  );
}

export default WeatherCard;