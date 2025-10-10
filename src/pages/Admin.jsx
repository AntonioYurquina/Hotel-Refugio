import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin({ rooms, setRooms, operators, setOperators }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rooms');

  // Lógica CRUD para habitaciones
  const handleRoomUpdate = (updatedRooms) => {
    setRooms(updatedRooms);
    localStorage.setItem('hr_rooms', JSON.stringify(updatedRooms));
  };
  const deleteRoom = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta habitación?')) {
      handleRoomUpdate(rooms.filter(r => r.id !== id));
    }
  };

  // Lógica CRUD para operadores
  const handleOperatorUpdate = (updatedOperators) => {
    setOperators(updatedOperators);
    localStorage.setItem('hr_operators', JSON.stringify(updatedOperators));
  };
  const deleteOperator = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este operador?')) {
      handleOperatorUpdate(operators.filter(op => op.id !== id));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Panel de Administrador</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/')}>Volver al sitio</button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
            Gestionar Habitaciones
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'operators' ? 'active' : ''}`} onClick={() => setActiveTab('operators')}>
            Gestionar Operadores
          </button>
        </li>
      </ul>

      {activeTab === 'rooms' && (
        <section>
          <h5>Habitaciones ({rooms.length})</h5>
          {/* Aquí iría un formulario para añadir/editar habitaciones */}
          <div className="list-group">
            {rooms.map(room => (
              <div key={room.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{room.name} - ${room.price}</span>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2">Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRoom(room.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'operators' && (
        <section>
          <h5>Operadores ({operators.length})</h5>
          {/* Aquí iría un formulario para añadir/editar operadores */}
          <div className="list-group">
            {operators.map(op => (
              <div key={op.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{op.name} ({op.role})</span>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2">Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteOperator(op.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
