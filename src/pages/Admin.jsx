import React, { useState, useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import RoomsAdmin from './Admin/RoomsAdmin';
import UsersAdmin from './Admin/UsersAdmin';
import ReservationsAdmin from './Admin/ReservationsAdmin';
import RevenueChart from './Admin/RevenueChart';
import { Pie } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import RoomEditForm from './Admin/RoomEditForm';
import UserEditForm from './Admin/UserEditForm';

const StatCard = ({ title, value, icon, color }) => (
  <div className="col">
    <div className="card text-center p-3 shadow-sm h-100">
      <div className={`fs-2 fw-bold ${color}`}><i className={`fa-solid ${icon} me-2`}></i>{value}</div>
      <div className="text-muted">{title}</div>
    </div>
  </div>
);

export default function Admin({ user, habitaciones, reservas, users, deleteReservation, deleteUser, updateRoom, updateUser, createRoom, deleteRoom, createUser }) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('rooms');
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreating, setIsCreating] = useState(null); // 'room' o 'user'

  const { stats, roomStatusData } = useMemo(() => {
    const finalizadas = reservas.filter(r => r.estado === 'finalizada');
    const totalNights = finalizadas.reduce((acc, res) => acc + differenceInDays(new Date(res.fecha_fin), new Date(res.fecha_inicio)), 0);
    const totalRevenue = finalizadas.reduce((acc, res) => {
      const room = habitaciones.datos.find(r => r.id_habitacion === res.id_habitacion);
      const nights = differenceInDays(new Date(res.fecha_fin), new Date(res.fecha_inicio));
      return acc + (room && nights > 0 ? nights * parseFloat(room.precio_noche) : 0);
    }, 0);
    
    const occupancy = habitaciones.datos.length > 0 
      ? ((habitaciones.datos.filter(r => r.estado === 'ocupada').length) / habitaciones.datos.length) * 100 
      : 0;

    const statusCounts = habitaciones.datos.reduce((acc, room) => {
      acc[room.estado] = (acc[room.estado] || 0) + 1;
      return acc;
    }, {});

    const pieData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: theme === 'light' ? ['#198754', '#dc3545', '#ffc107', '#6c757d'] : ['#20c997', '#ff8c00', '#ffca2c', '#adb5bd'],
        borderColor: theme === 'light' ? '#fff' : '#300A24',
        borderWidth: 2,
      }],
    };

    return {
      stats: {
        totalRevenue: totalRevenue.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
        avgRate: finalizadas.length > 0 ? (totalRevenue / finalizadas.length).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '$0',
        avgStay: finalizadas.length > 0 ? (totalNights / finalizadas.length).toFixed(1) : 0,
        occupancy: occupancy.toFixed(1) + '%',
      },
      roomStatusData: pieData,
    };
  }, [reservas, habitaciones, theme]);

  const handleAddRoom = () => {
    setEditingRoom({ numero: '', tipo: '', capacidad: 1, precio_noche: 0, descripcion: '' });
  };

  const handleAddUser = () => {
    setEditingUser({ nombre: '', apellido: '', email: '', telefono: '', tipo_usuario: 'cliente' });
  };

  const handleSaveRoom = (data) => {
    if (data.id_habitacion) {
      updateRoom(data);
    } else {
      createRoom(data);
    }
    setEditingRoom(null);
  };

  const handleSaveUser = (data) => {
    if (data.id_usuario) {
      updateUser(data);
    } else {
      createUser(data);
    }
    setEditingUser(null);
  };

  return (
    <div className="container-fluid py-4 main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Panel de Gerencia</h3>
          <p className="text-muted mb-0">Bienvenido, {user.datos.nombre}. Visión general del negocio.</p>
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
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <RevenueChart reservations={reservas} rooms={habitaciones.datos} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title mb-3">Estado de Habitaciones</h5>
              <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ position: 'relative', height: '300px' }}>
                <Pie data={roomStatusData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: theme === 'light' ? '#495057' : '#dee2e6' } } } }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablas de Gestión */}
      <div className="card shadow-sm">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item"><button className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>Habitaciones</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Usuarios</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>Reservas</button></li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'rooms' && <RoomsAdmin rooms={habitaciones.datos} onAdd={handleAddRoom} onEdit={setEditingRoom} onDelete={deleteRoom} />}
          {activeTab === 'users' && <UsersAdmin users={users} onAdd={handleAddUser} onEdit={setEditingUser} onDelete={deleteUser} />}
          {activeTab === 'reservations' && <ReservationsAdmin reservations={reservas} onDelete={deleteReservation} />}
        </div>
      </div>

      {/* Modales de Edición / Creación */}
      {editingRoom && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered"><div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">{editingRoom.id_habitacion ? 'Editar' : 'Crear'} Habitación</h5><button type="button" className="btn-close" onClick={() => setEditingRoom(null)}></button></div>
            <div className="modal-body"><RoomEditForm room={editingRoom} onSave={handleSaveRoom} onCancel={() => setEditingRoom(null)} /></div>
          </div></div>
        </div>
      )}
      {editingUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered"><div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">{editingUser.id_usuario ? 'Editar' : 'Crear'} Usuario</h5><button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button></div>
            <div className="modal-body"><UserEditForm user={editingUser} onSave={handleSaveUser} onCancel={() => setEditingUser(null)} /></div>
          </div></div>
        </div>
      )}
    </div>
  );
}
