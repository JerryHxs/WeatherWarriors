import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { getCities, addCity } from './api';
import LoadingScreen from './LoadingScreen';
import PopupMessage from './PopupMessage';

function Sidebar() {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const fetchedCities = await getCities();
      setCities(fetchedCities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Failed to fetch cities. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const [city, state] = searchTerm.split(',').map(s => s.trim());
    if (city && state) {
      try {
        setLoading(true);
        await addCity(city, state);
        await fetchCities();
        setSearchTerm('');
        setError(null);
      } catch (error) {
        console.error('Error adding city:', error);
        setError('Failed to add city. Please enter a valid U.S. city and state.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter a valid U.S. city and state (e.g., Chicago, IL)');
    }
  };

  const filteredCities = cities.filter(city =>
    `${city.name}, ${city.state}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <nav className="sidebar">
      {error && <PopupMessage message={error} />}
      <div className="sidebar-header">
        <h1>Weather Warriors</h1>
      </div>
      <div className="sidebar-content">
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="search"
            placeholder="Add city (e.g. Chicago, IL)"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="saved-cities">
          <h2>Saved Cities</h2>
          <div className="cities-list">
            {filteredCities.map((city, index) => (
              <Link
                key={index}
                to={`/city/${city.name}/${city.state}`}
                className="city-button"
              >
                {city.name}, {city.state}
              </Link>
            ))}
          </div>
        </div>
        <div className="about-link">
          <Link to="/about" className="about-button">About</Link>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;