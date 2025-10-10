import React, { useState, useMemo } from 'react';

export default function Rooms({ rooms, toggleRoom, toggleCleaning }) {
  const [filter, setFilter] = useState('all');

  const filteredRooms = useMemo(() => {
    if (filter === 'all') return rooms;
    if (filter === 'available') return rooms.filter(r => r.open && !r.needsCleaning);
    if (filter === 'closed') return rooms.filter(r => !r.open);
    if (filter === 'cleaning') return rooms.filter(r => r.needsCleaning);
    return rooms;
  }, [rooms, filter]);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Control de Habitaciones ({filteredRooms.length})</h5>
        <div className="btn-group">
          <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('all')}>Todas</button>
          <button className={`btn btn-sm ${filter === 'available' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('available')}>Disponibles</button>
          <button className={`btn btn-sm ${filter === 'closed' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('closed')}>Cerradas</button>
          <button className={`btn btn-sm ${filter === 'cleaning' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('cleaning')}>Limpieza</button>
        </div>
      </div>
      <div className="row g-3">
        {filteredRooms.map(r => (
          <div className="col-md-4 col-lg-3" key={r.id}>
            <div className={`card p-2 ${!r.open ? 'bg-light' : ''}`}>
              <strong>{r.name}</strong>
              <div className="d-flex justify-content-between align-items-center">
                <span className={`badge ${r.open ? 'bg-success-subtle text-success-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'}`}>
                  {r.open ? 'Abierta' : 'Cerrada'}
                </span>
                {r.needsCleaning && (
                  <span className="badge bg-warning-subtle text-warning-emphasis" title="Requiere limpieza">
                    <i className="fa-solid fa-broom"></i>
                  </span>
                )}
              </div>
              <div className="mt-2 d-flex justify-content-between gap-2">
                <button className="btn btn-sm btn-outline-primary w-100" onClick={() => toggleRoom(r.id)}>
                  <i className={`fa-solid ${r.open ? 'fa-lock' : 'fa-lock-open'} me-1`}></i>
                  {r.open ? 'Cerrar' : 'Abrir'}
                </button>
                <button className="btn btn-sm btn-outline-warning w-100" onClick={() => toggleCleaning(r.id)}>
                  <i className={`fa-solid ${r.needsCleaning ? 'fa-check' : 'fa-broom'} me-1`}></i>
                  {r.needsCleaning ? 'OK' : 'Limpiar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
