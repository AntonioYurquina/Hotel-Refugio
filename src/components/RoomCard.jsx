import React from 'react';
import { formatearPrecio } from '../utils/formato';
import { alFallarImagen } from '../utils/habitaciones';

export default function RoomCard({ room, isInteractive, onSelect }) {
  const contenido = (
    <>
      <img src={room.images[0]} onError={alFallarImagen} className="card-img-top" alt={`Foto de la ${room.name}`} loading="lazy" style={{ height: '200px', objectFit: 'cover' }} />
      <div className="card-body d-flex flex-column text-start">
        <h3 className="card-title h5">{room.name}</h3>
        <p className="card-text text-muted flex-grow-1">{room.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fw-bold fs-5 text-brand-orange">
            {formatearPrecio(room.price)}<small className="text-muted fw-normal"> / noche</small>
          </span>
          <span className="text-muted" title={`Capacidad: ${room.capacity} ${room.capacity === 1 ? 'persona' : 'personas'}`}>
            <i className="fa-solid fa-user-group me-1" aria-hidden="true"></i>{room.capacity}
          </span>
        </div>
      </div>
    </>
  );

  if (!isInteractive) return <div className="card h-100 shadow-sm">{contenido}</div>;
  return (
    <button type="button" className="card h-100 shadow-sm card-hover-effect w-100 p-0 text-start" onClick={onSelect}>
      {contenido}
    </button>
  );
}
