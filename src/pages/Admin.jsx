import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardAdmin from './Admin/DashboardAdmin';
import RoomsAdmin from './Admin/RoomsAdmin';
import UsersAdmin from './Admin/UsersAdmin';

export default function Admin({ user, habitaciones, manejarActualizacion, reservas, users }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const deleteRoom = (id) => {
    alert(`Funcionalidad de eliminar habitación ${id} no implementada.`);
  };

  const deleteOperator = (id) => {
    alert(`Funcionalidad de eliminar usuario ${id} no implementada.`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Panel de Administrador</h3>
          <p className="text-muted mb-0">Bienvenido, {user.datos.nombre}.</p>
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/')}>Volver al sitio</button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
            Habitaciones
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Usuarios
          </button>
        </li>
      </ul>

      {activeTab === 'dashboard' && <DashboardAdmin rooms={habitaciones.datos} operators={users} reservations={reservas} />}
      {activeTab === 'rooms' && <RoomsAdmin rooms={habitaciones.datos} deleteRoom={deleteRoom} />}
      {activeTab === 'users' && <UsersAdmin users={users} deleteUser={deleteOperator} />}
    </div>
  );
}
