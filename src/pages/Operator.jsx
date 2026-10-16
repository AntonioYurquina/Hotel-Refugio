import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OperatorCalendar from './Operator/Calendar';
import Rooms from './Operator/Rooms';
import LoadReservationForm from './Operator/LoadReservationForm';
import ReservationRack from './Operator/ReservationRack';
import SupportModal from './Operator/SupportModal';
import EditReservationForm from './Operator/EditReservationForm';
import ManagedReservations from './Operator/ManagedReservations';
import OperatorStatistics from './Operator/OperatorStatistics';
import ReservationDetailsModal from './Operator/ReservationDetailsModal';
import ReservationStatusManager from './Operator/ReservationStatusManager';
import ReservationHistogram from './Operator/ReservationHistogram';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { indicadoresOperador } from '../utils/estadisticas';
import { aFechaApi } from '../utils/fechas';

const Indicador = ({ valor, titulo, color }) => (
  <div className="col-6 col-md">
    <div className="card text-center p-3 shadow-sm h-100">
      <div className={`fs-2 fw-bold ${color}`}>{valor}</div>
      <div className="text-muted">{titulo}</div>
    </div>
  </div>
);

export default function Operator({
  user, habitaciones, reservas, usuarios, recargar,
  cambiarEstadoHabitacion, crearReserva, modificarReserva, cambiarEstadoReserva, eliminarReserva,
}) {
  const navigate = useNavigate();
  const [creando, setCreando] = useState(null); // null | {} con fechas iniciales
  const [soporte, setSoporte] = useState(false);
  const [editando, setEditando] = useState(null);
  const [viendo, setViendo] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [recargando, setRecargando] = useState(false);

  const indicadores = useMemo(() => indicadoresOperador(habitaciones, reservas), [habitaciones, reservas]);

  const recargarDatos = async () => {
    setRecargando(true);
    await recargar();
    setRecargando(false);
  };

  const elegirRango = ({ start, end }) => setCreando({ fecha_inicio: aFechaApi(start), fecha_fin: aFechaApi(end) });

  const guardarNueva = async (reserva) => {
    const r = await crearReserva(reserva);
    if (r.ok) setCreando(null);
  };
  const guardarEdicion = async (reserva) => {
    const r = await modificarReserva(reserva);
    if (r.ok) setEditando(null);
  };
  const confirmarEliminacion = async () => {
    const r = await eliminarReserva(eliminando.id_reserva);
    if (r.ok) setEliminando(null);
  };

  // Siempre se muestra la versión más reciente de la reserva abierta (puede cambiar tras una recarga).
  const reservaAbierta = viendo && reservas.find((r) => r.id_reserva === viendo.id_reserva);

  return (
    <div className="container-fluid px-4 main-content">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3">Panel de operador</h1>
          <p className="text-muted mb-0">Bienvenido, {user.datos.nombre}.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-info" onClick={recargarDatos} disabled={recargando}>
            {recargando ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : <i className="fa-solid fa-rotate me-1" aria-hidden="true"></i>} Recargar
          </button>
          <button className="btn btn-warning" onClick={() => setSoporte(true)}>Soporte</button>
          <button className="btn btn-primary" onClick={() => setCreando({})}><i className="fa-solid fa-plus me-1" aria-hidden="true"></i> Crear reserva</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Volver al sitio</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <Indicador valor={`${indicadores.ocupacion.toFixed(1)}%`} titulo="Ocupación" color="text-danger" />
        <Indicador valor={indicadores.disponibles} titulo="Disponibles" color="text-success" />
        <Indicador valor={indicadores.llegadasHoy} titulo="Llegadas hoy" color="text-primary" />
        <Indicador valor={indicadores.salidasHoy} titulo="Salidas hoy" color="text-info" />
        <Indicador valor={indicadores.pendientes} titulo="Pendientes" color="text-warning" />
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm h-100"><div className="card-body">
            <h2 className="h5 card-title mb-3">Calendario de reservas</h2>
            <OperatorCalendar reservations={reservas} rooms={habitaciones} onSelectEvent={(e) => setViendo(e.resource)} onSelectSlot={elegirRango} />
          </div></div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm h-100"><div className="card-body d-flex flex-column">
            <h2 className="h5 card-title mb-3">Análisis de reservas</h2>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              <OperatorStatistics reservations={reservas} />
            </div>
          </div></div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm"><div className="card-body">
            <h2 className="h5 card-title mb-3">Rack de reservas (próximos 30 días)</h2>
            <ReservationRack rooms={habitaciones} reservations={reservas} onEditReservation={setViendo} />
          </div></div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm"><div className="card-body">
            <h2 className="h5 card-title mb-3">Mapa de habitaciones</h2>
            <Rooms rooms={habitaciones} toggleRoom={cambiarEstadoHabitacion} />
          </div></div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card shadow-sm"><div className="card-body">
            <h2 className="h5 card-title mb-3">Gestor de reservas</h2>
            <ReservationStatusManager reservations={reservas} rooms={habitaciones} users={usuarios} currentUser={user.datos} onUpdateStatus={cambiarEstadoReserva} />
          </div></div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm mb-4"><div className="card-body">
            <h2 className="h5 card-title mb-3">Reservas por mes</h2>
            <ReservationHistogram reservations={reservas} />
          </div></div>
          <div className="card shadow-sm"><div className="card-body">
            <h2 className="h5 card-title mb-3">Últimas reservas</h2>
            <ManagedReservations reservations={reservas} rooms={habitaciones} users={usuarios} currentUser={user.datos} onEdit={setEditando} />
          </div></div>
        </div>
      </div>

      {creando && (
        <Modal titulo="Crear nueva reserva" onClose={() => setCreando(null)}>
          <LoadReservationForm rooms={habitaciones} reservations={reservas} users={usuarios} onSave={guardarNueva} onCancel={() => setCreando(null)} initialData={creando} />
        </Modal>
      )}
      {soporte && (
        <Modal titulo="Contactar a soporte" onClose={() => setSoporte(false)}>
          <SupportModal user={user} onCancel={() => setSoporte(false)} />
        </Modal>
      )}
      {editando && (
        <Modal titulo={`Editar reserva #${editando.id_reserva}`} onClose={() => setEditando(null)}>
          <EditReservationForm reservation={editando} rooms={habitaciones} reservations={reservas} onSave={guardarEdicion} onCancel={() => setEditando(null)} />
        </Modal>
      )}
      {reservaAbierta && (
        <ReservationDetailsModal
          reservation={reservaAbierta}
          room={habitaciones.find((h) => h.id_habitacion === reservaAbierta.id_habitacion)}
          users={usuarios}
          currentUser={user.datos}
          onClose={() => setViendo(null)}
          onEdit={() => { setEditando(reservaAbierta); setViendo(null); }}
          onDelete={() => { setEliminando(reservaAbierta); setViendo(null); }}
        />
      )}
      {eliminando && (
        <ConfirmDialog
          titulo="Eliminar reserva"
          mensaje={`¿Seguro que querés eliminar la reserva #${eliminando.id_reserva}? Para conservar el historial conviene cancelarla en lugar de borrarla.`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setEliminando(null)}
        />
      )}
    </div>
  );
}
