import React from 'react';

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <img 
          src="/atom-logo.png" 
          alt="Loading" 
          className="w-16 h-16 mx-auto animate-pulse"
          style={{ filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.8))' }}
        />
        <div className="space-y-2">
          <div className="skeleton-neuro h-4 w-48 mx-auto rounded" />
          <div className="skeleton-neuro h-3 w-32 mx-auto rounded" />
        </div>
      </div>
    </div>
  );
}
