import React from 'react';

export function PantallaCarga({ texto = 'Cargando Hotel Refugio…' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-muted" role="status">
      <div className="spinner-border text-primary mb-3" aria-hidden="true"></div>
      <p className="mb-0">{texto}</p>
    </div>
  );
}

export function PantallaError({ mensaje, onReintentar }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center px-3" role="alert">
      <i className="fa-solid fa-plug-circle-xmark fa-3x text-danger mb-3" aria-hidden="true"></i>
      <h1 className="h4">No pudimos cargar los datos del hotel</h1>
      <p className="text-muted">{mensaje}</p>
      <button type="button" className="btn btn-primary" onClick={onReintentar}>
        <i className="fa-solid fa-rotate-right me-2" aria-hidden="true"></i>Reintentar
      </button>
    </div>
  );
}
