import React from 'react';

export default function UsersAdmin({ users, onAdd, onEdit, onDelete }) {
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Usuarios ({users.length})</h5>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <i className="fa-solid fa-plus me-1"></i> Añadir Usuario
        </button>
      </div>
      <div className="list-group">
        {users.map(user => (
          <div key={user.id_usuario} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{user.nombre} {user.apellido}</strong>
              <span className="ms-2 badge bg-secondary">{user.tipo_usuario}</span>
              <small className="d-block text-muted">{user.email}</small>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onEdit(user)}>
                <i className="fa-solid fa-pencil"></i> Editar
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(user.id_usuario)}>
                <i className="fa-solid fa-trash-can"></i> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
