import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import EstadoBadge from '../components/ui/EstadoBadge';
import { adaptarHabitacion } from '../utils/habitaciones';
import { aFechaApi, formatearFecha, hoyApi, noches } from '../utils/fechas';
import { formatearPrecio, aNumero, capitalizar } from '../utils/formato';
import { TIPOS_HABITACION } from '../utils/reservas';

function TarjetaReserva({ reserva, habitacion }) {
  const cantidad = noches(reserva.fecha_inicio, reserva.fecha_fin);
  return (
    <div className="list-group-item">
      <div className="d-flex w-100 justify-content-between align-items-start gap-2">
        <div>
          <h3 className="h6 mb-1">{habitacion ? `Habitación ${habitacion.numero} · ${capitalizar(habitacion.tipo)}` : `Reserva #${reserva.id_reserva}`}</h3>
          <p className="mb-1 small">
            Del <strong>{formatearFecha(reserva.fecha_inicio)}</strong> al <strong>{formatearFecha(reserva.fecha_fin)}</strong>
            {habitacion && cantidad > 0 && <span className="text-muted"> · {cantidad} {cantidad === 1 ? 'noche' : 'noches'} · {formatearPrecio(cantidad * aNumero(habitacion.precio_noche))}</span>}
          </p>
          <EstadoBadge estado={reserva.estado} />
        </div>
        <span className="text-muted small">#{reserva.id_reserva}</span>
      </div>
    </div>
  );
}

export default function UserDashboard({ user, reservas, habitaciones }) {
  const navigate = useNavigate();
  const hoy = hoyApi();

  const propias = useMemo(() => reservas.filter((r) => r.id_usuario === user.datos.id_usuario), [reservas, user]);
  const proximas = useMemo(
    () =>
      propias
        .filter((r) => aFechaApi(r.fecha_fin) >= hoy && (r.estado === 'confirmada' || r.estado === 'pendiente'))
        .sort((a, b) => aFechaApi(a.fecha_inicio).localeCompare(aFechaApi(b.fecha_inicio))),
    [propias, hoy],
  );
  const historial = useMemo(
    () =>
      propias
        .filter((r) => !proximas.includes(r))
        .sort((a, b) => aFechaApi(b.fecha_inicio).localeCompare(aFechaApi(a.fecha_inicio))),
    [propias, proximas],
  );
  const habitacionDe = (id) => habitaciones.find((h) => h.id_habitacion === id);

  const recomendadas = useMemo(() => {
    const libres = habitaciones.filter((h) => h.estado === 'disponible');
    return TIPOS_HABITACION.map((tipo) => libres.find((h) => h.tipo === tipo)).filter(Boolean).map(adaptarHabitacion);
  }, [habitaciones]);

  return (
    <div className="container py-5 main-content">
      <h1 className="display-6 fw-bold mb-3">Bienvenido, {user.datos.nombre}</h1>
      <p className="lead text-muted mb-5">Acá podés seguir tus reservas y planificar tu próxima escapada.</p>

      {propias.length === 0 ? (
        <div className="text-center p-5 bg-body-tertiary rounded">
          <i className="fa-solid fa-suitcase-rolling fa-3x text-muted mb-4" aria-hidden="true"></i>
          <h2 className="h4 fw-bold">Todavía no tenés reservas</h2>
          <p className="text-muted">¿Listo para tu próxima aventura?</p>
          <Link to="/reserve" className="btn btn-primary mt-2">Explorar habitaciones</Link>
        </div>
      ) : (
        <div className="row g-5">
          <div className="col-lg-6">
            <h2 className="h4 mb-3">Próximas reservas</h2>
            {proximas.length > 0 ? (
              <div className="list-group">{proximas.map((r) => <TarjetaReserva key={r.id_reserva} reserva={r} habitacion={habitacionDe(r.id_habitacion)} />)}</div>
            ) : (
              <p className="text-muted">No tenés próximas reservas.</p>
            )}
          </div>
          <div className="col-lg-6">
            <h2 className="h4 mb-3">Historial</h2>
            {historial.length > 0 ? (
              <div className="list-group">{historial.map((r) => <TarjetaReserva key={r.id_reserva} reserva={r} habitacion={habitacionDe(r.id_habitacion)} />)}</div>
            ) : (
              <p className="text-muted">Tu historial está vacío.</p>
            )}
          </div>
        </div>
      )}

      {recomendadas.length > 0 && (
        <div className="mt-5 pt-5 border-top">
          <h2 className="h4 mb-2 text-center">Te recomendamos</h2>
          <p className="text-center text-muted mb-4">Habitaciones disponibles para tu próxima estadía.</p>
          <div className="row g-4">
            {recomendadas.map((room) => (
              <div key={room.id} className="col-md-4">
                <RoomCard room={room} isInteractive onSelect={() => navigate('/reserve')} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
