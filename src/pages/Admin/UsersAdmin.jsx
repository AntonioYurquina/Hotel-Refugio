import React, { useMemo, useState } from 'react';

const comillas = (valor) => `"${String(valor ?? '').replace(/"/g, '""')}"`;

function exportarCsv(usuarios) {
  const columnas = ['id_usuario', 'nombre', 'apellido', 'email', 'telefono', 'tipo_usuario'];
  const filas = [columnas.join(','), ...usuarios.map((u) => columnas.map((c) => comillas(u[c])).join(','))];
  const url = URL.createObjectURL(new Blob(['﻿' + filas.join('\n')], { type: 'text/csv;charset=utf-8' }));
  const enlace = Object.assign(document.createElement('a'), { href: url, download: 'usuarios.csv' });
  enlace.click();
  URL.revokeObjectURL(url);
}

export default function UsersAdmin({ users, onAdd }) {
  const [busqueda, setBusqueda] = useState('');
  const hayDirectorio = users.length > 0;

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return users.filter((u) => !texto || `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(texto));
  }, [users, busqueda]);

  return (
    <section aria-label="Usuarios">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Usuarios{hayDirectorio && ` (${filtrados.length})`}</h2>
        <div className="d-flex gap-2">
          {hayDirectorio && <button className="btn btn-secondary btn-sm" onClick={() => exportarCsv(filtrados)}><i className="fa-solid fa-file-csv me-1" aria-hidden="true"></i> Exportar</button>}
          <button className="btn btn-primary btn-sm" onClick={onAdd}><i className="fa-solid fa-plus me-1" aria-hidden="true"></i> Añadir usuario</button>
        </div>
      </div>

      {!hayDirectorio ? (
        <div className="alert alert-info" role="note">
          <i className="fa-solid fa-circle-info me-2" aria-hidden="true"></i>
          La API Hotel v1 no ofrece un listado de usuarios: su única ruta (<code>GET /usuarios</code>) es de pruebas y expone las contraseñas, por eso la aplicación no la usa.
          Desde acá podés crear usuarios; en las reservas se identifica a cada cliente por su número.
        </div>
      ) : (
        <>
          <label htmlFor="buscar-usuario" className="visually-hidden">Buscar usuarios</label>
          <input id="buscar-usuario" type="search" className="form-control mb-3" placeholder="Buscar por nombre, apellido o email…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Rol</th></tr></thead>
              <tbody>
                {filtrados.map((u) => (
                  <tr key={u.id_usuario}>
                    <td>{u.id_usuario}</td><td>{u.nombre} {u.apellido}</td><td>{u.email}</td><td>{u.telefono || '—'}</td>
                    <td><span className="badge bg-secondary text-capitalize">{u.tipo_usuario}</span></td>
                  </tr>
                ))}
                {filtrados.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">Sin resultados.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
