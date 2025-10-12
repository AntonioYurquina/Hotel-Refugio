import React from 'react';

const getStatusClass = (status) => {
  switch (status) {
    case 'disponible': return 'bg-success text-white';
    case 'ocupada': return 'bg-danger text-white';
    case 'mantenimiento': return 'bg-warning text-dark';
    case 'cerrada': return 'bg-secondary text-white';
    default: return 'bg-light';
  }
};

export default function Rooms({ rooms, toggleRoom }) {
  return (
    <div className="row g-3">
      {rooms.map(room => (
        <div key={room.id_habitacion} className="col-6 col-md-4">
          <div className={`card shadow-sm room-card ${getStatusClass(room.estado)}`}>
            <div className="card-body text-center">
              <h6 className="card-title mb-1">Hab. {room.numero}</h6>
              <small className="d-block text-uppercase">{room.estado}</small>
              <div className="dropdown mt-2">
                <button className="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  Cambiar
                </button>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => toggleRoom(room.id_habitacion, 'disponible')}>Disponible</button></li>
                  <li><button className="dropdown-item" onClick={() => toggleRoom(room.id_habitacion, 'ocupada')}>Ocupada</button></li>
                  <li><button className="dropdown-item" onClick={() => toggleRoom(room.id_habitacion, 'mantenimiento')}>Mantenimiento</button></li>
                  <li><button className="dropdown-item" onClick={() => toggleRoom(room.id_habitacion, 'cerrada')}>Cerrada</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
