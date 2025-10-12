import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="custom-spinner"></div>
      <p className="mt-3 text-muted">Cargando Hotel Refugio...</p>
    </div>
  );
}
