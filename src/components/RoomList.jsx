import React, { useState } from 'react';
import RoomCard from './RoomCard';
import ReservationForm from './ReservationForm';

export default function RoomList({ rooms, addReservation, user }) {
  const [selected, setSelected] = useState(null);

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

  return (
    <div>
      <div id="rooms" className="row g-4">
        {rooms.map(room => (
          <div key={room.id} className="col-md-6 col-lg-4">
            <RoomCard room={room} onSelect={() => setSelected(room)} />
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selected.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div id="roomCarousel" className="carousel slide mb-3" data-bs-ride="carousel">
                      <div className="carousel-inner">
                        {selected.images.map((img, index) => (
                          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <img src={img} className="d-block w-100" alt={`Imagen ${index + 1} de ${selected.name}`} />
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
                    <p>{selected.description}</p>
                    <h6>Comodidades:</h6>
                    <ul>
                      {selected.amenities.map(a => <li key={a}>{a}</li>)}
                    </ul>
                    <p className="fs-4 fw-bold text-primary">${selected.price.toFixed(2)} <span className="fs-6 fw-normal text-muted">/ noche</span></p>
                  </div>
                </div>
                <hr />
                <ReservationForm room={selected} onClose={() => setSelected(null)} addReservation={addReservation} user={user} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
