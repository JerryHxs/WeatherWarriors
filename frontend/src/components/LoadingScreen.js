import React from 'react';
import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="sidebar loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>
        <p>Loading weather data...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;