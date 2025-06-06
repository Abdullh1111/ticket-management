import React from 'react';

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <div
      className="border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-10"
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default LoadingSpinner;
