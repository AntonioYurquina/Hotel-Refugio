import React, { useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import { differenceInDays } from 'date-fns';
import StatCard from './StatCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Admin({ rooms, users, reservations }) {
  const { theme } = useTheme();

  const safeReservations = reservations || [];
  const safeRooms = rooms || [];
  const safeUsers = users || [];

  const stats = useMemo(() => {
    const totalRevenue = safeReservations
      .filter(res => res.estado === 'finalizada')
      .reduce((acc, res) => {
        const room = safeRooms.find(r => r.id_habitacion === res.id_habitacion);
        if (!room) return acc;
        const nights = differenceInDays(new Date(res.fecha_fin), new Date(res.fecha_inicio));
        return acc + (nights > 0 ? nights * parseFloat(room.precio_noche) : 0);
      }, 0);

    const occupancy = safeRooms.length > 0 
      ? ((safeRooms.filter(r => r.estado === 'ocupada').length) / safeRooms.length) * 100 
      : 0;
      
    const today = new Date().setHours(0, 0, 0, 0);
    const checkInsToday = safeReservations.filter(res => new Date(res.fecha_inicio).setHours(0, 0, 0, 0) === today && res.estado === 'confirmada').length;
    
    const activeReservations = safeReservations.filter(res => res.estado === 'confirmada' || res.estado === 'pendiente').length;

    return { totalRevenue, occupancy, checkInsToday, activeReservations };
  }, [safeReservations, safeRooms]);

  const themeColors = {
    pie: {
      light: ['#198754', '#dc3545', '#ffc107', '#6c757d'],
      dark: ['#20c997', '#ff8c00', '#ffca2c', '#adb5bd'], // Naranja para 'ocupada' en modo oscuro
    },
    bar: {
      light: 'rgba(233, 84, 32, 0.6)', // Naranja Ubuntu
      dark: 'rgba(233, 84, 32, 0.8)',  // Naranja Ubuntu más opaco
    },
    text: theme === 'light' ? '#495057' : '#dee2e6',
  };

  const roomStatusData = useMemo(() => {
    const statusCounts = safeRooms.reduce((acc, room) => {
      acc[room.estado] = (acc[room.estado] || 0) + 1;
      return acc;
    }, {});
    const pieData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#27AE60', '#E74C3C', '#F1C40F', '#95A5A6'], // Paleta profesional
        borderColor: theme === 'light' ? '#fff' : '#242424',
        borderWidth: 2,
      }],
    };

    return {
      labels: Object.keys(statusCounts),
      datasets: [pieData],
    };
  }, [safeRooms, theme]);

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
        backgroundColor: themeColors.bar[theme],
      }],
    };
  }, [safeUsers, theme]);

  const chartOptions = {
    plugins: {
      legend: { labels: { color: themeColors.text } }
    },
    scales: {
      y: {
        ticks: { color: themeColors.text },
        grid: { color: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }
      },
      x: {
        ticks: { color: themeColors.text },
        grid: { color: 'transparent' } // Quitar rejilla vertical para un look más limpio
      }
    }
  };

  return (
    <section>
      <h5>Estadísticas Globales</h5>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-success">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-muted">Ingresos (Finalizadas)</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-danger">{stats.occupancy.toFixed(1)}%</div>
            <div className="text-muted">Ocupación Actual</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-primary">{stats.checkInsToday}</div>
            <div className="text-muted">Check-ins Hoy</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="fs-2 fw-bold text-info">{stats.activeReservations}</div>
            <div className="text-muted">Reservas Activas</div>
          </div>
        </div>
      </div>

      {/* KPIs Estratégicos */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-4">
        <StatCard title="Ingresos Totales" value={stats.totalRevenue} icon="fa-sack-dollar" color="text-success" />
        <StatCard title="Ocupación Actual" value={stats.occupancy} icon="fa-chart-pie" color="text-danger" />
        <StatCard title="Estadía Promedio" value={`${stats.avgStay} Noches`} icon="fa-bed" color="text-primary" />
        <StatCard title="Tarifa Promedio" value={stats.avgRate} icon="fa-tag" color="text-info" />
      </div>

      {/* Visualizaciones de Datos */}
      <div className="row g-4 mb-4">
        <div className="col-md-5">
          <h5>Estado de Habitaciones</h5>
          <div className="card p-3">
            <Pie data={roomStatusData} options={{ plugins: { legend: { labels: { color: themeColors.text } } } }} />
          </div>
        </div>
        <div className="col-md-7">
          <h5>Distribución de Roles</h5>
          <div className="card p-3">
            <Bar data={userRolesData} options={chartOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}