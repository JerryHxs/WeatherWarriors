import React, { useState, useEffect } from 'react';
import './PopupMessage.css';

function PopupMessage({ message, duration = 2000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="popup-message">
      {message}
    </div>
  );
}

export default PopupMessage;