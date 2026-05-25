import React from 'react';

export default function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div className="loading-overlay">
      <div className="spinner" />
    </div>
  );
}
