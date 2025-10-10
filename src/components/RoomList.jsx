import React, { useState } from 'react';
import RoomCard from './RoomCard';
import ReservationForm from './ReservationForm';

export default function RoomList({ rooms, addReservation }) {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  const filtered = rooms.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4 d-flex">
        <input className="form-control me-2" placeholder="Buscar por nombre o tipo de habitación..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div id="rooms" className="row g-4">
        {filtered.map(room => (
          <div className="col-md-6 col-lg-4" key={room.id}>
            <RoomCard room={room} onSelect={setSelected} />
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selected.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <p>{selected.description}</p>
                <ul>
                  {selected.amenities.map(a => <li key={a}>{a}</li>)}
                </ul>
                <ReservationForm room={selected} onClose={() => setSelected(null)} addReservation={addReservation} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
