import React from 'react';

export default function RoomCard({ room, isInteractive, onSelect }) {
  const cardClasses = `card h-100 shadow-sm ${isInteractive ? 'cursor-pointer card-hover-effect' : ''}`;

  return (
    <div className={cardClasses} onClick={isInteractive ? onSelect : null}>
      <img src={room.images[0]} className="card-img-top" alt={room.name} style={{ height: '200px', objectFit: 'cover' }} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{room.name}</h5>
        <p className="card-text text-muted flex-grow-1">{room.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fw-bold fs-5 text-brand-orange">${room.price.toFixed(2)}<small className="text-muted fw-normal">/noche</small></span>
          <span className="text-muted"><i className="fa-solid fa-user-group me-1"></i> {room.capacity}</span>
        </div>
      </div>
    </div>
  );
}
