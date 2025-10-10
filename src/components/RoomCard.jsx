import React from 'react';

export default function RoomCard({ room, onSelect }) {
  // Usamos la primera imagen del array de imágenes
  const img = room.images && room.images.length > 0 ? room.images[0] : 'https://via.placeholder.com/800x600?text=Sin+Imagen';
  
  return (
    <div className="card h-100 shadow-sm card-room">
      <img src={img} alt={room.name} className="card-img-top" />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{room.name}</h5>
        <p className="card-text text-muted small">{room.description}</p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold fs-5 text-primary">${room.price}<small className="text-muted fw-normal">/noche</small></span>
            <span className="text-muted small"><i className="fa-solid fa-user-group me-1"></i>{room.capacity}</span>
          </div>
          <button 
            className="btn btn-primary w-100 mt-2" 
            onClick={() => onSelect(room)}
            disabled={!room.open}
          >
            {room.open ? 'Reservar ahora' : 'No disponible'}
          </button>
        </div>
      </div>
    </div>
  );
}
