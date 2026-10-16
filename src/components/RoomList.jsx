import React, { useState } from 'react';
import RoomCard from './RoomCard';
import ReservationForm from './ReservationForm';
import AuthInModal from './AuthInModal';
import Modal from './ui/Modal';
import { formatearPrecio } from '../utils/formato';
import { alFallarImagen } from '../utils/habitaciones';

export default function RoomList({ rooms, user, reservas, initialFilters, login, registrarUsuario, crearReserva }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const cerrar = () => setSelectedRoom(null);

  return (
    <div>
      <div id="rooms" className="row g-4">
        {rooms.map((room) => (
          <div key={room.id} className="col-md-6 col-lg-4">
            <RoomCard room={room} onSelect={() => setSelectedRoom(room)} isInteractive />
          </div>
        ))}
      </div>

      {selectedRoom && (
        <Modal titulo={selectedRoom.name} onClose={cerrar} tamano="modal-lg">
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <div id="roomCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {selectedRoom.images.map((img, index) => (
                    <div key={img} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img src={img} onError={alFallarImagen} className="d-block w-100 rounded" alt={`Foto ${index + 1} de la ${selectedRoom.name}`} />
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#roomCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Foto anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#roomCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Foto siguiente</span>
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <p>{selectedRoom.description}</p>
              <p className="mb-2"><i className="fa-solid fa-user-group me-2" aria-hidden="true"></i>Hasta {selectedRoom.capacity} {selectedRoom.capacity === 1 ? 'persona' : 'personas'}</p>
              <h3 className="h6">Comodidades</h3>
              <ul>{selectedRoom.amenities.map((a) => <li key={a}>{a}</li>)}</ul>
              <p className="fs-4 fw-bold text-brand-orange mb-0">
                {formatearPrecio(selectedRoom.price)} <span className="fs-6 fw-normal text-muted">/ noche</span>
              </p>
            </div>
          </div>
          <hr />
          {user.ok && user.datos.tipo_usuario === 'cliente' ? (
            <ReservationForm room={selectedRoom} user={user} reservas={reservas} initialData={initialFilters} crearReserva={crearReserva} onClose={cerrar} />
          ) : user.ok ? (
            <div className="alert alert-info mb-0">
              Estás con una cuenta de {user.datos.tipo_usuario}. Las reservas de clientes se cargan desde el panel de operador.
            </div>
          ) : (
            <AuthInModal login={login} registrarUsuario={registrarUsuario} />
          )}
        </Modal>
      )}
    </div>
  );
}
