import React from 'react';

export default function DashboardAdmin({ rooms, operators, reservations }) {
  const totalRevenue = reservations
    .filter(r => r.paid)
    .reduce((sum, r) => sum + r.room.price, 0);

  const occupancy = rooms.length > 0 
    ? ((rooms.length - rooms.filter(r => r.open).length) / rooms.length) * 100 
    : 0;

  return (
    <section>
      <h5>Estadísticas Globales</h5>
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-success">${totalRevenue.toLocaleString()}</div>
            <div className="text-muted">Ingresos Totales (Simulado)</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-danger">{occupancy.toFixed(1)}%</div>
            <div className="text-muted">Ocupación Actual</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-primary">{rooms.length}</div>
            <div className="text-muted">Habitaciones Totales</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-info">{operators.length}</div>
            <div className="text-muted">Operadores Activos</div>
          </div>
        </div>
      </div>
    </section>
  );
}
