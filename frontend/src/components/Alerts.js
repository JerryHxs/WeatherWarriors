// Alerts.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getWeather } from './api';
import './Alerts.css';
import LoadingScreen from './LoadingScreen';

import warningIcon from '../weather_icons/warning.png';
import checkIcon from '../weather_icons/check.png';

function Alerts() {
  const { cityName, stateCode } = useParams();
  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlertsData = async () => {
      try {
        setLoading(true);
        const data = await getWeather(cityName, stateCode, true);
        setAlertsData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch alerts data');
        setLoading(false);
      }
    };

    fetchAlertsData();
  }, [cityName, stateCode]);

  if (loading) return <LoadingScreen />;
  if (error) return <div className="error-message">{error}</div>;
  if (!alertsData) return null;

  const hasAlerts = alertsData.alerts && alertsData.alerts.length > 0;

  return (
    <div className="alerts-container">
      <h2 className="city-title">{cityName}, {stateCode}</h2>
      <div className="weather-nav">
        <Link to={`/city/${cityName}/${stateCode}`} className="weather-nav-button">Current Weather</Link>
        <Link to={`/forecast/${cityName}/${stateCode}`} className="weather-nav-button">7-Day Forecast</Link>
        <Link to={`/alerts/${cityName}/${stateCode}`} className="weather-nav-button active">Weather Alerts</Link>
      </div>
      <h3>Weather Alerts</h3>
      <div className={`alert-card ${hasAlerts ? 'has-alerts' : 'no-alerts'}`}>
        <img 
          src={hasAlerts ? warningIcon : checkIcon} 
          alt={hasAlerts ? "Warning" : "All Clear"} 
          className="alert-icon"
        />
        <h4 className="alert-title">
          {hasAlerts ? alertsData.alerts[0].event : "No Weather Alerts"}
        </h4>
        <p className="alert-description">
          {hasAlerts 
            ? alertsData.alerts[0].description 
            : `There are currently no active weather alerts for ${cityName}, ${stateCode}.`
          }
        </p>
      </div>
    </div>
  );
}

export default Alerts;