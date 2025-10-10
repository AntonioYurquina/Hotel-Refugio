import React, { useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DashboardAdmin({ rooms, users, reservations }) {
  const safeReservations = reservations || [];
  const safeRooms = rooms || [];
  const safeUsers = users || [];

  const totalRevenue = safeReservations.length * 2500; // Simulación

  const occupancy = safeRooms.length > 0 
    ? ((safeRooms.length - safeRooms.filter(r => r.estado === 'disponible').length) / safeRooms.length) * 100 
    : 0;

  const roomStatusData = useMemo(() => {
    const statusCounts = safeRooms.reduce((acc, room) => {
      acc[room.estado] = (acc[room.estado] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#198754', '#dc3545', '#ffc107', '#6c757d'],
      }],
    };
  }, [safeRooms]);

  const userRolesData = useMemo(() => {
    const roleCounts = safeUsers.reduce((acc, user) => {
      acc[user.tipo_usuario] = (acc[user.tipo_usuario] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(roleCounts),
      datasets: [{
        label: 'Nº de Usuarios',
        data: Object.values(roleCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }],
    };
  }, [safeUsers]);

  return (
    <section>
      <h5>Estadísticas Globales</h5>
      <div className="row g-3 mb-4">
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
            <div className="fs-2 fw-bold text-primary">{safeRooms.length}</div>
            <div className="text-muted">Habitaciones Totales</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-info">{safeUsers.length}</div>
            <div className="text-muted">Usuarios Registrados</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <h5>Estado de Habitaciones</h5>
          <div className="card p-3">
            <Pie data={roomStatusData} />
          </div>
        </div>
        <div className="col-md-7">
          <h5>Distribución de Roles</h5>
          <div className="card p-3">
            <Bar data={userRolesData} />
          </div>
        </div>
      </div>
    </section>
  );
}
