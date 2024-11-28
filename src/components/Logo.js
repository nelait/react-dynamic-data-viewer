import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 }
  };

  const { width, height } = sizes[size] || sizes.medium;

  return (
    <div className="logo-container">
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="45" fill="#2196f3" />
        <path
          d="M30 50 L50 70 L70 30"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="logo-text">DataViewer</span>
    </div>
  );
};

export default Logo;
