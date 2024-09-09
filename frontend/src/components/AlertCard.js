// AlertCard.js
import React from 'react';

function AlertCard({ alertsData }) {
  return (
    <div className="alert-card">
      <h2>Weather Alerts for {alertsData.city}, {alertsData.state}</h2>
      {alertsData.alerts.length > 0 ? (
        alertsData.alerts.map((alert, index) => (
          <div key={index} className="alert">
            <h3>{alert.event}</h3>
            <p>{alert.description}</p>
          </div>
        ))
      ) : (
        <p>No active weather alerts.</p>
      )}
    </div>
  );
}

export default AlertCard;