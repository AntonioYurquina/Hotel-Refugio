import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardAdmin from './Admin/DashboardAdmin';
import RoomsAdmin from './Admin/RoomsAdmin';
import UsersAdmin from './Admin/UsersAdmin';
import ReservationsAdmin from './Admin/ReservationsAdmin';

export default function Admin({ user, habitaciones, manejarActualizacion, reservas, users, deleteReservation, deleteUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('');

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setModalType('');
  };

  const handleSave = (item) => {
    alert(`Guardando cambios para ${modalType} (simulado): ${JSON.stringify(item)}`);
    handleCloseModal();
  };

  const addRoom = () => alert('Funcionalidad para añadir habitación no implementada.');
  const deleteRoom = (id) => {
    if (window.confirm(`¿Seguro que quieres eliminar la habitación con ID ${id}?`)) {
      alert(`Eliminando habitación ${id}... (no implementado)`);
    }
  };

  const addUser = () => alert('Funcionalidad para añadir usuario no implementada.');

  if (!habitaciones.datos || !users || !reservas) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Cargando datos del panel...</p>
      </div>
    );
  }

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
          <button className={`nav-link ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>
            Reservas
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Usuarios
          </button>
        </li>
      </ul>

      {activeTab === 'dashboard' && <DashboardAdmin rooms={habitaciones.datos} users={users} reservations={reservas} />}
      {activeTab === 'rooms' && <RoomsAdmin rooms={habitaciones.datos} onAdd={addRoom} onEdit={(room) => handleEdit(room, 'room')} onDelete={deleteRoom} />}
      {activeTab === 'reservations' && <ReservationsAdmin reservations={reservas} onDelete={deleteReservation} />}
      {activeTab === 'users' && <UsersAdmin users={users} onAdd={addUser} onEdit={(user) => handleEdit(user, 'user')} onDelete={deleteUser} />}

      {editingItem && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar {modalType === 'room' ? 'Habitación' : 'Usuario'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p>Editando ID: {modalType === 'room' ? editingItem.id_habitacion : editingItem.id_usuario}</p>
                <textarea className="form-control" rows="5" defaultValue={JSON.stringify(editingItem, null, 2)} />
                <small className="text-muted">La edición real no está implementada. Esto es una simulación.</small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={() => handleSave(editingItem)}>Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
