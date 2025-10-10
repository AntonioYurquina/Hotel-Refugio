import React, { useMemo } from 'react';

export default function UserDashboard({ user, allReservations }) {
  const userReservations = useMemo(() => {
    if (!user.ok || !allReservations) {
      return [];
    }
    // Filtra las reservas para mostrar solo las del usuario actual
    return allReservations.filter(res => res.id_usuario === user.datos.id_usuario);
  }, [user, allReservations]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Mi Panel</h3>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Mi Perfil</h5>
            </div>
            <div className="card-body">
              <p><strong>Nombre:</strong> {user.datos.nombre} {user.datos.apellido}</p>
              <p><strong>Email:</strong> {user.datos.email}</p>
              <p><strong>Teléfono:</strong> {user.datos.telefono}</p>
              <p><strong>Tipo:</strong> <span className="badge bg-primary">{user.datos.tipo_usuario}</span></p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Mis Reservas ({userReservations.length})</h5>
            </div>
            <div className="list-group list-group-flush">
              {userReservations.length > 0 ? userReservations.map(res => (
                <div key={res.id_reserva} className="list-group-item">
                  <p className="mb-1"><strong>Habitación ID:</strong> {res.id_habitacion}</p>
                  <p className="mb-1"><strong>Check-in:</strong> {new Date(res.fecha_entrada).toLocaleDateString()}</p>
                  <p className="mb-0"><strong>Check-out:</strong> {new Date(res.fecha_salida).toLocaleDateString()}</p>
                </div>
              )) : (
                <div className="list-group-item">
                  <p className="text-muted mb-0">No tienes reservas activas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
