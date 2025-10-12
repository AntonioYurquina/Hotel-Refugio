import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoomCard from '../components/RoomCard';

const getStatusBadge = (status) => {
  switch (status) {
    case 'confirmada': return 'bg-success';
    case 'pendiente': return 'bg-warning text-dark';
    case 'cancelada': return 'bg-danger';
    case 'finalizada': return 'bg-secondary';
    default: return 'bg-light';
  }
};

const ReservationCard = ({ reservation, room, isPast, onBookAgain }) => (
  <div className="list-group-item">
    <div className="d-flex w-100 justify-content-between align-items-center">
      <div>
        <h5 className="mb-1">{room ? `Habitación ${room.numero} (${room.tipo})` : `Reserva #${reservation.id_reserva}`}</h5>
        <p className="mb-1 small">
          Del <strong>{new Date(reservation.fecha_inicio).toLocaleDateString()}</strong> al <strong>{new Date(reservation.fecha_fin).toLocaleDateString()}</strong>
        </p>
        <span className={`badge ${getStatusBadge(reservation.estado)}`}>{reservation.estado}</span>
      </div>
      {isPast && (
        <button className="btn btn-sm btn-outline-primary" onClick={() => onBookAgain(room)}>
          <i className="fa-solid fa-repeat me-1"></i> Reservar de Nuevo
        </button>
      )}
    </div>
  </div>
);

export default function UserDashboard({ user, allReservations, habitaciones }) {
  const navigate = useNavigate();

  const userReservations = useMemo(() => {
    if (!allReservations || !user.ok) return [];
    return allReservations.filter(res => res.id_usuario === user.datos.id_usuario);
  }, [allReservations, user]);

  const upcomingReservations = useMemo(() => {
    const now = new Date();
    return userReservations
      .filter(res => new Date(res.fecha_fin) >= now && (res.estado === 'confirmada' || res.estado === 'pendiente'))
      .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));
  }, [userReservations]);

  const pastReservations = useMemo(() => {
    const now = new Date();
    return userReservations
      .filter(res => new Date(res.fecha_fin) < now || res.estado === 'cancelada' || res.estado === 'finalizada')
      .sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));
  }, [userReservations]);

  const findRoomById = (id) => habitaciones.find(h => h.id_habitacion === id);

  const recommendedRooms = useMemo(() => {
    if (!habitaciones) return [];
    const availableRooms = habitaciones.filter(h => h.estado === 'disponible');
    
    const roomTypes = ['simple', 'doble', 'suite'];
    const recommendations = [];

    roomTypes.forEach(type => {
      const found = availableRooms.find(r => r.tipo === type && !recommendations.some(rec => rec.id === r.id_habitacion));
      if (found) {
        recommendations.push({
          id: found.id_habitacion,
          name: `Habitación ${found.numero} (${found.tipo})`,
          price: parseFloat(found.precio_noche),
          capacity: parseInt(found.capacidad, 10),
          description: found.descripcion,
          images: [`https://robledo.website/patas/${found.id_habitacion}a.jpg`]
        });
      }
    });
    
    return recommendations.slice(0, 3); // Mostrar hasta 3 recomendaciones
  }, [habitaciones]);

  return (
    <div className="container py-5 main-content">
      <h2 className="display-6 fw-bold mb-3">Bienvenido, {user.datos.nombre}</h2>
      <p className="lead text-muted mb-5">Aquí puedes gestionar tus reservas y planificar tu próxima escapada.</p>

      {userReservations.length === 0 ? (
        <div className="text-center p-5 bg-body-tertiary rounded">
          <i className="fa-solid fa-suitcase-rolling fa-3x text-muted mb-4"></i>
          <h4 className="fw-bold">Aún no tienes reservas</h4>
          <p className="text-muted">
            Parece que todavía no has hecho ninguna reserva con nosotros.
            <br />
            ¿Listo para tu próxima aventura?
          </p>
          <Link to="/reserve" className="btn btn-primary mt-3">
            Explorar Habitaciones
          </Link>
        </div>
      ) : (
        <div className="row g-5">
          <div className="col-lg-6">
            <h3 className="h4 mb-3">Próximas Reservas</h3>
            {upcomingReservations.length > 0 ? (
              <div className="list-group">
                {upcomingReservations.map(res => (
                  <ReservationCard key={res.id_reserva} reservation={res} room={findRoomById(res.id_habitacion)} isPast={false} />
                ))}
              </div>
            ) : (
              <p className="text-muted">No tienes próximas reservas.</p>
            )}
          </div>
          <div className="col-lg-6">
            <h3 className="h4 mb-3">Historial de Reservas</h3>
            {pastReservations.length > 0 ? (
              <div className="list-group">
                {pastReservations.map(res => (
                  <ReservationCard 
                    key={res.id_reserva} 
                    reservation={res} 
                    room={findRoomById(res.id_habitacion)} 
                    isPast={true}
                    onBookAgain={() => navigate('/reserve')}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted">No tienes reservas en tu historial.</p>
            )}
          </div>
        </div>
      )}

      {/* Sección de "Tentación" / Recomendaciones */}
      {recommendedRooms.length > 0 && (
        <div className="mt-5 pt-5 border-top">
          <h3 className="h4 mb-4 text-center">Nuestras Recomendaciones para Ti</h3>
          <p className="text-center text-muted mb-4">Descubre otras habitaciones disponibles para tu próxima experiencia.</p>
          <div className="row g-4">
            {recommendedRooms.map(room => (
              <div key={room.id} className="col-md-4">
                <RoomCard 
                  room={room}
                  isInteractive={true}
                  onSelect={() => navigate('/reserve')}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
