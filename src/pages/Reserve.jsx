import React, { useState, useMemo } from 'react';
import RoomList from '../components/RoomList';
import heroImage from '../components/image.png';

export default function Reserve({ habitaciones, user, reservas, login, actualizarCredenciales, registrarUsuario }) {
  const [filters, setFilters] = useState({
    checkin: '',
    checkout: '',
    guests: 1,
  });

  const adaptedRooms = useMemo(() => habitaciones ? habitaciones.map(h => ({
    id: h.id_habitacion,
    name: `Habitación ${h.numero} (${h.tipo})`,
    price: parseFloat(h.precio_noche),
    capacity: parseInt(h.capacidad, 10),
    description: h.descripcion,
    open: h.estado === 'disponible',
    amenities: ['WiFi', 'TV', 'Servicio a la habitación'],
    images: [
      `https://robledo.website/patas/${h.id_habitacion}a.jpg`,
      `https://robledo.website/patas/${h.id_habitacion}b.jpg`,
      `https://robledo.website/patas/${h.id_habitacion}c.jpg`,
    ]
  })) : [], [habitaciones]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFilters({ checkin: '', checkout: '', guests: 1 });
  };

  const filteredRooms = useMemo(() => {
    const hasDateFilter = filters.checkin && filters.checkout;

    // Si no hay fechas válidas, muestra todas las habitaciones abiertas.
    if (!hasDateFilter) {
      return adaptedRooms.filter(room => room.open);
    }

    const checkinDate = new Date(filters.checkin);
    const checkoutDate = new Date(filters.checkout);

    // Validar que la fecha de check-out sea posterior a la de check-in
    if (checkoutDate <= checkinDate) {
      return [];
    }

    return adaptedRooms.filter(room => {
      // 1. Filtrar por capacidad y estado 'disponible'
      if (room.capacity < filters.guests || !room.open) {
        return false;
      }

      // 2. Filtrar por disponibilidad de fechas
      const isUnavailable = reservas.some(res => {
        if (res.id_habitacion !== room.id) return false;
        // Corregido: usar fecha_inicio y fecha_fin de la API
        const resStart = new Date(res.fecha_inicio);
        const resEnd = new Date(res.fecha_fin);
        // Comprobar si hay solapamiento de fechas
        return (checkinDate < resEnd && checkoutDate > resStart);
      });

      return !isUnavailable;
    });
  }, [filters, adaptedRooms, reservas]);

  const showFilterResults = filters.checkin && filters.checkout;

  const headerStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '60vh', // Altura similar a la del Hero, pero un poco más corta
  };

  return (
    <>
      <header 
        className="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style={headerStyle}
      >
        <div>
          <h1 className="display-4 fw-bold">Portal de Reservas</h1>
          <p className="lead">Encuentra la habitación perfecta para tu estadía.</p>
        </div>
      </header>

      <div className="container py-5">
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Check-in</label>
                <input type="date" name="checkin" className="form-control" value={filters.checkin} onChange={handleFilterChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Check-out</label>
                <input type="date" name="checkout" className="form-control" value={filters.checkout} onChange={handleFilterChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Huéspedes</label>
                <input type="number" name="guests" className="form-control" value={filters.guests} min="1" onChange={handleFilterChange} />
              </div>
              <div className="col-md-2">
                <button className="btn btn-outline-secondary w-100" onClick={handleClear}>Limpiar</button>
              </div>
            </div>
          </div>
        </div>

        <h3 className="h4 mb-4">
          {showFilterResults ? `Resultados de la Búsqueda (${filteredRooms.length})` : `Habitaciones Disponibles (${filteredRooms.length})`}
        </h3>
        {showFilterResults && filteredRooms.length === 0 && (
          <div className="alert alert-warning">No se encontraron habitaciones disponibles para los criterios seleccionados.</div>
        )}
        <RoomList 
          rooms={filteredRooms} 
          user={user} 
          interactive={true} 
          initialFilters={filters}
          login={login}
          actualizarCredenciales={actualizarCredenciales}
          registrarUsuario={registrarUsuario}
        />
      </div>
    </>
  );
}
