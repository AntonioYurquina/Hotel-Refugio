import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalSettings from '../components/GlobalSettings';

export default function Operator({ rooms, setRooms, reservations, setReservations, gpt5Enabled, setGpt5Enabled }) {
  const navigate = useNavigate();

  const toggleRoom = (id) => {
    const updated = rooms.map(r => r.id === id ? { ...r, open: !r.open } : r);
    setRooms(updated);
    localStorage.setItem('hr_rooms', JSON.stringify(updated));
  };

  const releaseReservation = (id) => {
    const updated = reservations.filter(r => r.id !== id);
    setReservations(updated);
    localStorage.setItem('hr_reservations', JSON.stringify(updated));
  };

  const processPayment = (id) => {
    const updated = reservations.map(r => r.id === id ? { ...r, paid: true, status: 'paid' } : r);
    setReservations(updated);
    localStorage.setItem('hr_reservations', JSON.stringify(updated));
    alert('Pago procesado (simulado).');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Panel de Operador</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/')}>Volver al sitio</button>
      </div>

      <section className="mb-4">
        <GlobalSettings gpt5Enabled={gpt5Enabled} setGpt5Enabled={setGpt5Enabled} />
      </section>

      <section className="mb-4">
        <h5>Habitaciones</h5>
        <div className="row g-3">
          {rooms.map(r => (
            <div className="col-md-3" key={r.id}>
              <div className="card p-2">
                <strong>{r.name}</strong>
                <div className="small text-muted">Estado: {r.open ? 'Abierta' : 'Cerrada'}</div>
                <div className="mt-2 d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => toggleRoom(r.id)}>
                    {r.open ? 'Cerrar' : 'Abrir'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h5>Reservas</h5>
        {reservations.length === 0 && <p className="text-muted">No hay reservas.</p>}
        <div className="list-group">
          {reservations.map(res => (
            <div key={res.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{res.roomName}</strong> — {res.name} · {res.checkin} ➜ {res.checkout}
                <div className="small text-muted">{res.email} · {res.guests} huéspedes</div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-success" onClick={() => processPayment(res.id)}>
                  {res.paid ? 'Pagado' : 'Procesar pago'}
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => releaseReservation(res.id)}>Liberar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
