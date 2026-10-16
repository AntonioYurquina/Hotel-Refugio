import React, { useState, useMemo } from 'react';
import RoomList from '../components/RoomList';
import heroImage from '../components/image.png';
import { adaptarHabitacion } from '../utils/habitaciones';
import { habitacionLibre } from '../utils/reservas';
import { formatearFecha, hoyApi, noches, sumarDias } from '../utils/fechas';

const FILTROS_VACIOS = { checkin: '', checkout: '', guests: 1 };

export default function Reserve({ habitaciones, user, reservas, login, registrarUsuario, crearReserva }) {
  const [filters, setFilters] = useState(FILTROS_VACIOS);
  const hoy = hoyApi();

  const rooms = useMemo(() => habitaciones.map(adaptarHabitacion), [habitaciones]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((anteriores) => {
      const siguientes = { ...anteriores, [name]: name === 'guests' ? Math.max(1, Number(value) || 1) : value };
      // Si la salida quedó antes de la nueva entrada se limpia, para no mostrar un rango imposible.
      if (siguientes.checkout && siguientes.checkin && noches(siguientes.checkin, siguientes.checkout) < 1) siguientes.checkout = '';
      return siguientes;
    });
  };

  const rangoCompleto = Boolean(filters.checkin && filters.checkout);

  const filteredRooms = useMemo(
    () =>
      rooms.filter(
        (room) =>
          room.reservable &&
          room.capacity >= filters.guests &&
          (!rangoCompleto || habitacionLibre(room.id, filters.checkin, filters.checkout, reservas)),
      ),
    [rooms, reservas, filters, rangoCompleto],
  );

  const headerStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '40vh',
  };

  return (
    <>
      <header className="hero-section text-center text-white d-flex align-items-center justify-content-center" style={headerStyle}>
        <div>
          <h1 className="display-4 fw-bold">Portal de Reservas</h1>
          <p className="lead">Encontrá la habitación perfecta para tu estadía.</p>
        </div>
      </header>

      <div className="container py-5">
        <form className="card shadow-sm mb-5" onSubmit={(e) => e.preventDefault()} aria-label="Buscar habitaciones">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label htmlFor="filtro-checkin" className="form-label">Entrada</label>
                <input id="filtro-checkin" type="date" name="checkin" className="form-control" min={hoy} value={filters.checkin} onChange={handleFilterChange} />
              </div>
              <div className="col-md-4">
                <label htmlFor="filtro-checkout" className="form-label">Salida</label>
                <input id="filtro-checkout" type="date" name="checkout" className="form-control" min={filters.checkin ? sumarDias(filters.checkin, 1) : hoy} value={filters.checkout} onChange={handleFilterChange} />
              </div>
              <div className="col-md-2">
                <label htmlFor="filtro-huespedes" className="form-label">Huéspedes</label>
                <input id="filtro-huespedes" type="number" name="guests" className="form-control" value={filters.guests} min="1" onChange={handleFilterChange} />
              </div>
              <div className="col-md-2">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setFilters(FILTROS_VACIOS)}>Limpiar</button>
              </div>
            </div>
          </div>
        </form>

        <h2 className="h4 mb-4" aria-live="polite">
          {rangoCompleto ? `Disponibles del ${formatearFecha(filters.checkin)} al ${formatearFecha(filters.checkout)}` : 'Habitaciones'} ({filteredRooms.length})
        </h2>
        {filteredRooms.length === 0 && (
          <div className="alert alert-warning" role="status">
            No hay habitaciones disponibles para los criterios elegidos. Probá con otras fechas o menos huéspedes.
          </div>
        )}
        <RoomList
          rooms={filteredRooms}
          user={user}
          reservas={reservas}
          initialFilters={filters}
          login={login}
          registrarUsuario={registrarUsuario}
          crearReserva={crearReserva}
        />
      </div>
    </>
  );
}
