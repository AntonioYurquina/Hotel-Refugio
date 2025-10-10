import React from 'react';

export default function Dashboard({ stats, recentReservations }) {
  return (
    <section>
      <h5>Resumen del Hotel</h5>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 fw-bold text-primary">{stats.totalReservations}</div>
            <div className="text-muted">Reservas Activas</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 fw-bold text-success">{stats.availableRooms}</div>
            <div className="text-muted">Habitaciones Disponibles</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 fw-bold text-danger">{stats.occupancy}%</div>
            <div className="text-muted">Tasa de Ocupación</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 fw-bold text-warning">{stats.needsCleaning}</div>
            <div className="text-muted">Requieren Limpieza</div>
          </div>
        </div>
      </div>
      <h5>Actividad Reciente</h5>
      <div className="list-group">
        {recentReservations.length > 0 ? recentReservations.map(res => (
          <div key={res.id} className="list-group-item">
            <i className="fa-solid fa-calendar-check me-2 text-success"></i>
            Nueva reserva para <strong>{res.roomName}</strong> por {res.name}.
            <span className="text-muted small float-end">{new Date(res.createdAt).toLocaleDateString()}</span>
          </div>
        )) : <p className="text-muted">No hay actividad reciente.</p>}
      </div>
    </section>
  );
}
