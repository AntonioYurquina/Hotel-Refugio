import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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

export default function Operator({ user, habitaciones, manejarActualizacion, reservas, crearReserva, eliminarReserva, actualizarReserva, cargarHabitaciones, descargarReservas, users }) {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalData, setCreateModalData] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [viewingReservation, setViewingReservation] = useState(null);
  const [isReloading, setIsReloading] = useState(false);

  const stats = useMemo(() => {
    if (!habitaciones.datos || !reservas) return {};
    const totalRooms = habitaciones.datos.length;
    const availableRooms = habitaciones.datos.filter(r => r.estado === 'disponible').length;
    const occupancy = totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms) * 100 : 0;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const arrivalsToday = reservas.filter(res => new Date(res.fecha_inicio).setHours(0, 0, 0, 0) === today && res.estado === 'confirmada').length;
    const departuresToday = reservas.filter(res => new Date(res.fecha_fin).setHours(0, 0, 0, 0) === today && res.estado === 'confirmada').length;
    const pendingReservations = reservas.filter(res => res.estado === 'pendiente').length;

    return {
      occupancy: occupancy.toFixed(1),
      availableRooms,
      arrivalsToday,
      departuresToday,
      pendingReservations,
    };
  }, [habitaciones, reservas]);

  const handleSaveReservation = (formData) => {
    crearReserva(formData);
    setShowCreateModal(false);
  };

  const handleUpdateReservation = (formData) => {
    actualizarReserva(formData);
    setEditingReservation(null);
  };

  const handleReload = async () => {
    setIsReloading(true);
    await Promise.all([cargarHabitaciones(), descargarReservas()]);
    setIsReloading(false);
  };

  const handleSelectSlot = (slotInfo) => {
    setCreateModalData({
      fecha_inicio: format(slotInfo.start, 'yyyy-MM-dd'),
      fecha_fin: format(slotInfo.end, 'yyyy-MM-dd'),
    });
    setShowCreateModal(true);
  };

  const handleOpenCreateModal = () => {
    setCreateModalData(null);
    setShowCreateModal(true);
  };

  const findUserById = (id) => users.find(u => u.id_usuario === id);
  const findRoomById = (id) => habitaciones.datos.find(h => h.id_habitacion === id);

  return (
    <div className="container-fluid px-4 main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Panel de Operador</h3>
          <p className="text-muted mb-0">Bienvenido, {user.datos.nombre}.</p>
        </div>
        <div>
          <button className="btn btn-outline-info me-2" onClick={handleReload} disabled={isReloading}>
            {isReloading ? <span className="spinner-border spinner-border-sm"></span> : 'Recargar'}
          </button>
          <button className="btn btn-warning me-2" onClick={() => setShowSupportModal(true)}>Soporte</button>
          <button className="btn btn-primary me-2" onClick={handleOpenCreateModal}>Crear Reserva</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/')}>Volver al sitio</button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="row g-4 mb-4">
        <div className="col"><div className="card text-center p-3 shadow-sm h-100"><div className="fs-2 fw-bold text-danger">{stats.occupancy}%</div><div className="text-muted">Ocupación</div></div></div>
        <div className="col"><div className="card text-center p-3 shadow-sm h-100"><div className="fs-2 fw-bold text-success">{stats.availableRooms}</div><div className="text-muted">Disponibles</div></div></div>
        <div className="col"><div className="card text-center p-3 shadow-sm h-100"><div className="fs-2 fw-bold text-primary">{stats.arrivalsToday}</div><div className="text-muted">Llegadas Hoy</div></div></div>
        <div className="col"><div className="card text-center p-3 shadow-sm h-100"><div className="fs-2 fw-bold text-info">{stats.departuresToday}</div><div className="text-muted">Salidas Hoy</div></div></div>
        <div className="col"><div className="card text-center p-3 shadow-sm h-100"><div className="fs-2 fw-bold text-warning">{stats.pendingReservations}</div><div className="text-muted">Pendientes</div></div></div>
      </div>

      {/* Nueva sección de Gestión y Análisis de Reservas */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Calendario de Reservas</h5>
              <OperatorCalendar 
                reservations={reservas} 
                rooms={habitaciones} 
                onSelectEvent={(event) => setViewingReservation(event.resource)}
                onSelectSlot={handleSelectSlot}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title mb-3">Análisis de Reservas</h5>
              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <OperatorStatistics reservations={reservas} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rack de Reservas y Mapa de Habitaciones */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Rack de Reservas</h5>
              <ReservationRack rooms={habitaciones.datos} reservations={reservas} onEditReservation={setEditingReservation} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Mapa de Habitaciones</h5>
              <Rooms rooms={habitaciones.datos} toggleRoom={(id, estado) => manejarActualizacion(id, estado, habitaciones.estado_tabla)} />
            </div>
          </div>
        </div>
      </div>

      {/* Nuevos bloques de gestión y análisis */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Gestor de Reservas</h5>
              <ReservationStatusManager reservations={reservas} onUpdateStatus={actualizarReserva} />
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Histograma de Reservas</h5>
              <ReservationHistogram reservations={reservas} />
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}><div className="modal-dialog modal-dialog-centered"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">Crear Nueva Reserva</h5><button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button></div>
          <div className="modal-body"><LoadReservationForm rooms={habitaciones.datos} onSave={handleSaveReservation} onCancel={() => setShowCreateModal(false)} initialData={createModalData} /></div>
        </div></div></div>
      )}
      {showSupportModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}><div className="modal-dialog modal-dialog-centered"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">Contactar a Soporte</h5><button type="button" className="btn-close" onClick={() => setShowSupportModal(false)}></button></div>
          <div className="modal-body"><SupportModal user={user} onCancel={() => setShowSupportModal(false)} /></div>
        </div></div></div>
      )}
      {editingReservation && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}><div className="modal-dialog modal-dialog-centered"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">Editar Reserva #{editingReservation.id_reserva}</h5><button type="button" className="btn-close" onClick={() => setEditingReservation(null)}></button></div>
          <div className="modal-body"><EditReservationForm reservation={editingReservation} onSave={handleUpdateReservation} onCancel={() => setEditingReservation(null)} /></div>
        </div></div></div>
      )}
      {viewingReservation && (
        <ReservationDetailsModal
          reservation={viewingReservation}
          room={findRoomById(viewingReservation.id_habitacion)}
          user={findUserById(viewingReservation.id_usuario)}
          onClose={() => setViewingReservation(null)}
          onEdit={() => {
            setEditingReservation(viewingReservation);
            setViewingReservation(null);
          }}
          onDelete={(id) => {
            if (window.confirm(`¿Seguro que quieres eliminar la reserva #${id}?`)) {
              eliminarReserva(id);
              setViewingReservation(null);
            }
          }}
        />
      )}
    </div>
  );
}
