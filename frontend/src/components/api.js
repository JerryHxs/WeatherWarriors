//api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getWeather = async (cityName, stateName, oneWeek = true) => {
  try {
    const response = await axios.get(`${API_URL}/weather/${cityName}/${stateName}?oneWeek=${oneWeek}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getCities = async () => {
  try {
    const response = await axios.get(`${API_URL}/cities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const addCity = async (city, state) => {
  try {
    const response = await axios.post(`${API_URL}/cities`, { city, state });
    return response.data;
  } catch (error) {
    console.error('Error adding city:', error);
    throw error;
  }
};