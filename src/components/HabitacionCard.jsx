import React from 'react';

const HabitacionCard = React.memo(function HabitacionCard({ habitacion }) {
  return (
    <div className="card mb-3" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title">Habitación {habitacion.numero}</h5>
        <p className="card-text">{habitacion.descripcion}</p>
        <ul className="list-unstyled">
          <li><strong>Tipo:</strong> {habitacion.tipo}</li>
          <li><strong>Capacidad:</strong> {habitacion.capacidad}</li>
          <li><strong>Precio:</strong> ${habitacion.precio_noche}</li>
          <li><strong>Estado:</strong> {habitacion.estado}</li>
        </ul>
      </div>
    </div>
  );
});

export default HabitacionCard;
