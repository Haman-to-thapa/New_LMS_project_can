import React from 'react';

const InfinityLoader = ({
  size = 100,
  color = '#3b82f6', // blue-500
  strokeWidth = 4,
  speed = 2,
  className = '',
  circle = true, // Add outer circle
  circleColor = 'rgba(59, 130, 246, 0.1)' // Light blue
}) => {
  const height = size / 2; // Maintain 2:1 aspect ratio

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg
        className="relative"
        viewBox="0 0 100 50"
        width={size}
        height={height}
        aria-label="Loading..."
        role="status"
      >
        {/* Outer circle (conditional) */}
        {circle && (
          <circle
            cx="50"
            cy="25"
            r="23"
            fill="none"
            stroke={circleColor}
            strokeWidth={strokeWidth}
          />
        )}

        {/* Infinity symbol */}
        <path
          d="M20,25 C20,10 35,10 35,25 C35,40 50,40 50,25 C50,10 65,10 65,25 C65,40 80,40 80,25"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray="100"
          strokeDashoffset="100"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="100;0;100"
            dur={`${speed}s`}
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};

export default InfinityLoader;