import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCard from './RoomCard';

// Función para agrupar las habitaciones para el carrusel
const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export default function RoomCarousel({ rooms }) {
  const navigate = useNavigate();
  
  // Agrupar habitaciones: 1 por slide en móvil, 3 en escritorio
  const groupedRooms = chunkArray(rooms, 3);

  if (!rooms || rooms.length === 0) {
    return <p className="text-center text-muted">No hay habitaciones para mostrar en este momento.</p>;
  }

  return (
    <div id="roomCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {groupedRooms.map((roomGroup, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div className="row g-4 justify-content-center">
              {roomGroup.map(room => (
                <div key={room.id} className="col-lg-4 col-md-6">
                  <RoomCard 
                    room={room}
                    isInteractive={true}
                    onSelect={() => navigate('/reserve')}
                  />
                </div>
              ))}
            </div>
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
  );
}
