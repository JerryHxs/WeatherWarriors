// ForecastCard.js
import React from 'react';

function ForecastCard({ forecastData }) {
  return (
    <div className="forecast-card">
      <h2>7-Day Forecast for {forecastData.city}, {forecastData.state}</h2>
      {forecastData.forecast.map((day, index) => (
        <div key={index} className="forecast-day">
          <p>Date: {new Date(day.start_time).toLocaleDateString()}</p>
          <p>Temperature: {day.temperature}°F</p>
          <p>Condition: {day.detailed_forecast}</p>
        </div>
      ))}
    </div>
  );
}

export default ForecastCard;