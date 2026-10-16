import React from 'react';
import { ESTADOS_HABITACION } from '../../utils/reservas';
import { capitalizar } from '../../utils/formato';

const CLASES = {
  disponible: 'bg-success text-white',
  ocupada: 'bg-danger text-white',
  mantenimiento: 'bg-warning text-dark',
  cerrada: 'bg-secondary text-white',
};

export default function Rooms({ rooms, toggleRoom }) {
  return (
    <div className="row g-3">
      {rooms.map((room) => (
        <div key={room.id_habitacion} className="col-6 col-md-4 col-lg-6 col-xl-4">
          <div className={`card shadow-sm ${CLASES[room.estado] ?? ''}`}>
            <div className="card-body text-center p-2">
              <h3 className="h6 card-title mb-1">Hab. {room.numero}</h3>
              <small className="d-block text-capitalize" style={{ fontSize: "0.75rem" }}>{room.estado}</small>
              <div className="dropdown mt-2">
                <button className="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-label={`Cambiar el estado de la habitación ${room.numero}`}>
                  Cambiar
                </button>
                <ul className="dropdown-menu">
                  {ESTADOS_HABITACION.filter((e) => e !== room.estado).map((estado) => (
                    <li key={estado}><button type="button" className="dropdown-item" onClick={() => toggleRoom(room.id_habitacion, estado)}>{capitalizar(estado)}</button></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
