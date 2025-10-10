import React, { useState, useMemo } from 'react';

export default function Reservations({ reservations, processPayment, releaseReservation }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredReservations = useMemo(() => reservations.filter(res => {
    const matchesQuery = res.name.toLowerCase().includes(query.toLowerCase()) ||
      res.email.toLowerCase().includes(query.toLowerCase()) ||
      res.roomName.toLowerCase().includes(query.toLowerCase());
    
    if (filter === 'all') return matchesQuery;
    if (filter === 'paid') return matchesQuery && res.paid;
    if (filter === 'unpaid') return matchesQuery && !res.paid;
    return matchesQuery;
  }), [reservations, query, filter]);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5>Gestionar Reservas ({filteredReservations.length})</h5>
        <div className="d-flex gap-2">
          <div className="btn-group">
            <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('all')}>Todas</button>
            <button className={`btn btn-sm ${filter === 'paid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('paid')}>Pagadas</button>
            <button className={`btn btn-sm ${filter === 'unpaid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('unpaid')}>No Pagadas</button>
          </div>
          <input 
            type="text" 
            className="form-control form-control-sm w-auto" 
            placeholder="Buscar reserva..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>
      {filteredReservations.length === 0 && <p className="text-muted">No se encontraron reservas.</p>}
      <div className="list-group">
        {filteredReservations.map(res => (
          <div key={res.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <strong>{res.roomName}</strong> — {res.name} · {res.checkin} ➜ {res.checkout}
              <div className="small text-muted">{res.email} · {res.guests} huéspedes</div>
            </div>
            <div className="d-flex gap-2 mt-2 mt-md-0">
              <button className="btn btn-sm btn-outline-success" onClick={() => processPayment(res.id)} disabled={res.paid}>
                <i className={`fa-solid ${res.paid ? 'fa-circle-check' : 'fa-credit-card'} me-1`}></i>
                {res.paid ? 'Pagado' : 'Pagar'}
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => releaseReservation(res.id)}>
                <i className="fa-solid fa-trash-can me-1"></i>Liberar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
