import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from './RoomCard';
import ReservationForm from './ReservationForm';
import AuthInModal from './AuthInModal';

export default function RoomList({ rooms, user, interactive, initialFilters, login, actualizarCredenciales, registrarUsuario }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!rooms) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Cargando habitaciones...</p>
      </div>
    );
  }

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div id="rooms" className="row g-4">
        {rooms.map(room => (
          <div key={room.id} className="col-md-6 col-lg-4">
            <RoomCard 
              room={room} 
              onSelect={() => handleSelectRoom(room)} 
              isInteractive={true} // Todas las tarjetas son clicables para ver detalles
            />
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedRoom.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div id="roomCarousel" className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-inner">
                        {selectedRoom.images.map((img, index) => (
                          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <img src={img} className="d-block w-100" alt={`Imagen ${index + 1} de ${selectedRoom.name}`} />
                          </div>
                        ))}
                      </div>
                      <button className="carousel-control-prev" type="button" data-bs-target="#roomCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target="#roomCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <p>{selectedRoom.description}</p>
                    <h6>Comodidades:</h6>
                    <ul>
                      {selectedRoom.amenities.map(a => <li key={a}>{a}</li>)}
                    </ul>
                    <p className="fs-4 fw-bold text-primary">${selectedRoom.price.toFixed(2)} <span className="fs-6 fw-normal text-muted">/ noche</span></p>
                  </div>
                </div>
                <hr />
                
                {interactive ? (
                  user.ok ? (
                    <ReservationForm 
                      room={selectedRoom} 
                      onClose={handleCloseModal} 
                      user={user} 
                      initialData={initialFilters}
                    />
                  ) : (
                    isModalOpen ? (
                      <AuthInModal 
                        login={login} 
                        actualizarCredenciales={actualizarCredenciales} 
                        registrarUsuario={registrarUsuario} 
                      />
                    ) : (
                      <div className="text-center p-3">
                        <button className="btn btn-primary btn-lg" onClick={() => setIsModalOpen(true)}>
                          Iniciar Sesión para Reservar
                        </button>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center p-3">
                    <p>¿Te gusta esta habitación?</p>
                    <Link to="/reserve" className="btn btn-success btn-lg">
                      Ir al Portal de Reservas
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
