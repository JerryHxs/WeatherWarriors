// WeatherForecastCard.js
import React from 'react';
import './WeatherForecastCard.css';

function WeatherForecastCard({ day, icon, temperature, isDay, isCurrentDay }) {
  return (
    <div className={`weather-forecast-card ${isCurrentDay ? 'current-day' : ''} ${isDay ? 'day' : 'night'}`}>
      <p className="forecast-day">{day}</p>
      <img src={icon} alt={`${day} weather`} className="forecast-icon" />
      <p className="forecast-temp">{temperature}°</p>
    </div>
  );
}

export default WeatherForecastCard;