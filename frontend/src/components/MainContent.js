// MainContent.js
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import WeatherCard from './WeatherCard';
import WeatherForecastCard from './WeatherForecastCard';
import { getWeather } from './api';
import './MainContent.css';
import './Alerts.css';
import './WeatherForecastCard.css';


import sunnyIcon from '../weather_icons/sunny_icon.png';
import cloudySunIcon from '../weather_icons/cloudy_sun_icon.png';
import cloudyIcon from '../weather_icons/cloudy_icon.png';
import rainyIcon from '../weather_icons/cloudy_rain_icon.png';
import windyIcon from '../weather_icons/windy_icon.png';
import warningIcon from '../weather_icons/warning.png';

function MainContent() {
  return (
    <div className="content-area">
      <Routes>
        <Route path="/" element={<CityWeather city="Austin" state="TX" />} />
        <Route path="/forecast" element={<Forecast city="Austin" state="TX" />} />
        <Route path="/alerts" element={<Alerts city="Austin" state="TX" />} />
        <Route path="/city/:cityName/:stateCode" element={<CityWeather />} />
        <Route path="/forecast/:cityName/:stateCode" element={<Forecast />} />
        <Route path="/alerts/:cityName/:stateCode" element={<Alerts />} />
      </Routes>
    </div>
  );
}

const getWeatherIcon = (forecast) => {
  const lowerForecast = forecast.toLowerCase();
  if (lowerForecast.includes('sunny') || lowerForecast.includes('clear')) return sunnyIcon;
  if (lowerForecast.includes('partly cloudy')) return cloudySunIcon;
  if (lowerForecast.includes('cloudy') && lowerForecast.includes('rain')) return rainyIcon;
  if (lowerForecast.includes('cloudy')) return cloudyIcon;
  if (lowerForecast.includes('rain') || lowerForecast.includes('showers')) return rainyIcon;
  if (lowerForecast.includes('wind')) return windyIcon;
  return sunnyIcon; // default icon
};

function CityWeather() {
  const { cityName, stateCode } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const city = cityName || 'Austin';
  const state = stateCode || 'TX';

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const data = await getWeather(city, state, false);
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, state]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!weatherData) return null;

  const currentWeather = weatherData.weather[0];
  
  return (
    <div>
      <h2 className="city-title">{city}, {state}</h2>
      <div className="weather-nav">
        <Link to={`/city/${city}/${state}`} className="weather-nav-button active">Current Weather</Link>
        <Link to={`/forecast/${city}/${state}`} className="weather-nav-button">7-Day Forecast</Link>
        <Link to={`/alerts/${city}/${state}`} className="weather-nav-button">Weather Alerts</Link>
      </div>
      <WeatherCard 
        city={`${city}, ${state}`}
        temperature={currentWeather.temperature}
        condition={currentWeather.detailed_forecast}
        precipitation={currentWeather.precipitation}
        icon={getWeatherIcon(currentWeather.detailed_forecast)}
      />
    </div>
  );
}

function Forecast() {
  const { cityName, stateCode } = useParams();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setLoading(true);
        const data = await getWeather(cityName, stateCode, true);
        setForecastData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch forecast data');
        setLoading(false);
      }
    };

    fetchForecastData();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cityName, stateCode]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!forecastData) return null;

  const dayForecasts = forecastData.weather.filter((_, index) => index % 2 === 0);
  const nightForecasts = forecastData.weather.filter((_, index) => index % 2 !== 0);

  return (
    <div>
      <h2 className="city-title">{cityName}, {stateCode}</h2>
      <div className="weather-nav">
        <Link to={`/city/${cityName}/${stateCode}`} className="weather-nav-button">Current Weather</Link>
        <Link to={`/forecast/${cityName}/${stateCode}`} className="weather-nav-button active">7-Day Forecast</Link>
        <Link to={`/alerts/${cityName}/${stateCode}`} className="weather-nav-button">Weather Alerts</Link>
        </div>
      <h3 class = "h3-title">7-Day Forecast</h3>
      <div className={`forecast-container ${windowWidth <= 768 ? 'mobile' : 'desktop'}`}>
        <div className="day-forecasts">
          {dayForecasts.map((period, index) => (
            <WeatherForecastCard 
              key={`day-${index}`}
              day={new Date(period.start_time).toLocaleDateString('en-US', { weekday: 'short' })}
              icon={getWeatherIcon(period.detailed_forecast)}
              temperature={period.temperature}
              isDay={true}
              isCurrentDay={index === 0}
            />
          ))}
        </div>
        <div className="night-forecasts">
          {nightForecasts.map((period, index) => (
            <WeatherForecastCard 
              key={`night-${index}`}
              day={new Date(period.start_time).toLocaleDateString('en-US', { weekday: 'short' })}
              icon={getWeatherIcon(period.detailed_forecast)}
              temperature={period.temperature}
              isDay={false}
              isCurrentDay={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!alertsData) return null;

  return (
    <div>
      <h2 className="city-title">{cityName}, {stateCode}</h2>
      <div className="weather-nav">
        <Link to={`/city/${cityName}/${stateCode}`} className="weather-nav-button">Current Weather</Link>
        <Link to={`/forecast/${cityName}/${stateCode}`} className="weather-nav-button">7-Day Forecast</Link>
        <Link to={`/alerts/${cityName}/${stateCode}`} className="weather-nav-button active">Weather Alerts</Link>
      </div>
      <h3 class = "h3-title">Weather Alerts</h3>
      {alertsData.alerts.length > 0 ? (
        alertsData.alerts.map((alert, index) => (
          <div  className="alert-card">
            <h4>{alert.event}</h4>
            <p>{alert.description}</p>
          </div>
        ))
      ) : (
        <div className="alert-card">
          <h4>No Weather Alerts</h4>
          <p>There are currently no active weather alerts for this area.</p>
        </div>
      )}
    </div>
  );
}

export default MainContent;