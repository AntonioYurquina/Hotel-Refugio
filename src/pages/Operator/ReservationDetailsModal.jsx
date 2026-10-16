import React from 'react';
import Modal from '../../components/ui/Modal';
import EstadoBadge from '../../components/ui/EstadoBadge';
import { etiquetaUsuario } from '../../utils/reservas';
import { formatearFecha, noches } from '../../utils/fechas';
import { aNumero, capitalizar, formatearPrecio } from '../../utils/formato';

export default function ReservationDetailsModal({ reservation, room, users, currentUser, onEdit, onDelete, onClose }) {
  const cantidad = noches(reservation.fecha_inicio, reservation.fecha_fin);
  const cliente = users?.find((u) => u.id_usuario === reservation.id_usuario);

  return (
    <Modal
      titulo={`Reserva #${reservation.id_reserva}`}
      onClose={onClose}
      pie={
        <>
          <button type="button" className="btn btn-outline-danger me-auto" onClick={onDelete}><i className="fa-solid fa-trash-can me-1" aria-hidden="true"></i> Eliminar</button>
          <button type="button" className="btn btn-primary" onClick={onEdit}><i className="fa-solid fa-pencil me-1" aria-hidden="true"></i> Editar</button>
        </>
      }
    >
      <dl className="row mb-0">
        <dt className="col-4">Estado</dt><dd className="col-8"><EstadoBadge estado={reservation.estado} /></dd>
        <dt className="col-4">Habitación</dt><dd className="col-8">{room ? `${room.numero} · ${capitalizar(room.tipo)}` : `#${reservation.id_habitacion}`}</dd>
        <dt className="col-4">Cliente</dt><dd className="col-8">{etiquetaUsuario(users, reservation.id_usuario, currentUser)}{cliente && <small className="d-block text-muted">{cliente.email}</small>}</dd>
        <dt className="col-4">Fechas</dt><dd className="col-8">{formatearFecha(reservation.fecha_inicio)} al {formatearFecha(reservation.fecha_fin)} ({cantidad} {cantidad === 1 ? 'noche' : 'noches'})</dd>
        {room && <><dt className="col-4">Total</dt><dd className="col-8 mb-0">{formatearPrecio(cantidad * aNumero(room.precio_noche))}</dd></>}
      </dl>
    </Modal>
  );
}
