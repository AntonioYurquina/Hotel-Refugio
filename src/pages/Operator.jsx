import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Operator/Dashboard';
import Rooms from './Operator/Rooms';
import OperatorCalendar from './Operator/Calendar'; // Importar Calendario

export default function Operator({ user, habitaciones, manejarActualizacion, reservas, crearReserva }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const dashboardStats = useMemo(() => {
    const totalRooms = habitaciones.datos.length;
    const availableRooms = habitaciones.datos.filter(r => r.estado === 'disponible').length;
    const occupancy = totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms) * 100 : 0;
    return {
      totalReservations: reservas.length,
      availableRooms,
      needsCleaning: habitaciones.datos.filter(r => r.estado === 'mantenimiento').length,
      occupancy: occupancy.toFixed(1),
    };
  }, [habitaciones, reservas]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Panel de Operador</h3>
          <p className="text-muted mb-0">Bienvenido, {user.datos.nombre}.</p>
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/')}>Volver al sitio</button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <i className="fa-solid fa-chart-line me-1"></i>Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
            <i className="fa-solid fa-calendar-days me-1"></i>Calendario y Reservas
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
            <i className="fa-solid fa-door-open me-1"></i>Mapa de Habitaciones
          </button>
        </li>
      </ul>

      <div>
        {activeTab === 'dashboard' && <Dashboard stats={dashboardStats} recentReservations={reservas.slice(0, 5)} />}
        {activeTab === 'calendar' && <OperatorCalendar reservations={reservas} rooms={habitaciones} onCreateReservation={crearReserva} />}
        {activeTab === 'rooms' && <Rooms rooms={habitaciones.datos} toggleRoom={(id, estado) => manejarActualizacion(id, estado)} />}
      </div>
    </div>
  );
}
