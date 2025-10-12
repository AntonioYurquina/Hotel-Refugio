import React, { useState, useMemo } from 'react';

// Función de utilidad para exportar a CSV
const exportToCsv = (filename, rows) => {
  const processRow = row => Object.values(row).map(val => `"${val}"`).join(',');
  const csvContent = "data:text/csv;charset=utf-8," 
    + [Object.keys(rows[0]), ...rows.map(processRow)].join('\n');
  
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function UsersAdmin({ users, onAdd, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Usuarios ({filteredUsers.length})</h5>
        <div>
          <button className="btn btn-secondary btn-sm me-2" onClick={() => exportToCsv('usuarios.csv', filteredUsers)}>
            <i className="fa-solid fa-file-csv me-1"></i> Exportar
          </button>
          <button className="btn btn-primary btn-sm" onClick={onAdd}>
            <i className="fa-solid fa-plus me-1"></i> Añadir Usuario
          </button>
        </div>
      </div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre, apellido o email..."
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id_usuario}>
                <td>{user.id_usuario}</td>
                <td>{user.nombre} {user.apellido}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td><span className="badge bg-secondary">{user.tipo_usuario}</span></td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onEdit(user)}>
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(user.id_usuario)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
