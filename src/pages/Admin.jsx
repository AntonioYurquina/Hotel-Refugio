import React, { useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import RoomsAdmin from './Admin/RoomsAdmin';
import UsersAdmin from './Admin/UsersAdmin';
import ReservationsAdmin from './Admin/ReservationsAdmin';
import RevenueChart from './Admin/RevenueChart';
import RoomCreateForm from './Admin/RoomCreateForm';
import UserCreateForm from './Admin/UserCreateForm';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useTheme } from '../context/themeContext';
import { indicadoresGerencia } from '../utils/estadisticas';
import { formatearPrecio, capitalizar } from '../utils/formato';

const COLOR_ESTADO = {
  light: { disponible: '#198754', ocupada: '#dc3545', mantenimiento: '#ffc107', cerrada: '#6c757d' },
  dark: { disponible: '#20c997', ocupada: '#ff8c00', mantenimiento: '#ffca2c', cerrada: '#adb5bd' },
};

const Indicador = ({ titulo, valor, icono, color }) => (
  <div className="col">
    <div className="card text-center p-3 shadow-sm h-100">
      <div className={`fs-2 fw-bold ${color}`}><i className={`fa-solid ${icono} me-2`} aria-hidden="true"></i>{valor}</div>
      <div className="text-muted">{titulo}</div>
    </div>
  </div>
);

const PESTANAS = [['rooms', 'Habitaciones'], ['users', 'Usuarios'], ['reservations', 'Reservas']];

export default function Admin({ user, habitaciones, reservas, usuarios, cambiarEstadoHabitacion, crearHabitacion, crearUsuario, eliminarReserva }) {
  const { theme } = useTheme();
  const [pestana, setPestana] = useState('rooms');
  const [creando, setCreando] = useState(null); // 'habitacion' | 'usuario'
  const [eliminando, setEliminando] = useState(null);

  const indicadores = useMemo(() => indicadoresGerencia(habitaciones, reservas), [habitaciones, reservas]);

  const datosTorta = useMemo(() => {
    const estados = Object.keys(indicadores.estadosHabitacion);
    return {
      labels: estados.map(capitalizar),
      datasets: [{
        data: estados.map((e) => indicadores.estadosHabitacion[e]),
        backgroundColor: estados.map((e) => COLOR_ESTADO[theme][e]),
        borderColor: theme === 'light' ? '#fff' : '#300A24',
        borderWidth: 2,
      }],
    };
  }, [indicadores, theme]);

  const guardarHabitacion = async (datos) => {
    const r = await crearHabitacion(datos);
    if (r.ok) setCreando(null);
  };
  const guardarUsuario = async (datos) => {
    if (await crearUsuario(datos)) setCreando(null);
  };
  const confirmarEliminacion = async () => {
    const r = await eliminarReserva(eliminando.id_reserva);
    if (r.ok) setEliminando(null);
  };

  return (
    <div className="container-fluid py-4 main-content">
      <div className="mb-4">
        <h1 className="h3">Panel de gerencia</h1>
        <p className="text-muted mb-0">Bienvenido, {user.datos.nombre}. Visión general del negocio.</p>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-4">
        <Indicador titulo="Ingresos (finalizadas)" valor={formatearPrecio(indicadores.ingresos)} icono="fa-sack-dollar" color="text-success" />
        <Indicador titulo="Ocupación actual" valor={`${indicadores.ocupacion.toFixed(1)}%`} icono="fa-chart-pie" color="text-danger" />
        <Indicador titulo="Estadía promedio" valor={`${indicadores.estadiaPromedio.toFixed(1)} noches`} icono="fa-bed" color="text-primary" />
        <Indicador titulo="Ingreso por reserva" valor={formatearPrecio(indicadores.tarifaPromedio)} icono="fa-tag" color="text-info" />
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm h-100"><div className="card-body"><RevenueChart reservations={reservas} rooms={habitaciones} /></div></div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm h-100"><div className="card-body d-flex flex-column">
            <h2 className="h5 card-title mb-3">Estado de habitaciones</h2>
            <div style={{ position: 'relative', height: '280px' }}>
              <Pie data={datosTorta} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: theme === 'light' ? '#495057' : '#dee2e6' } } } }} />
            </div>
          </div></div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs" role="tablist">
            {PESTANAS.map(([id, texto]) => (
              <li key={id} className="nav-item" role="presentation">
                <button type="button" role="tab" aria-selected={pestana === id} className={`nav-link ${pestana === id ? 'active' : ''}`} onClick={() => setPestana(id)}>{texto}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body" role="tabpanel">
          {pestana === 'rooms' && <RoomsAdmin rooms={habitaciones} onAdd={() => setCreando('habitacion')} onChangeState={cambiarEstadoHabitacion} />}
          {pestana === 'users' && <UsersAdmin users={usuarios} onAdd={() => setCreando('usuario')} />}
          {pestana === 'reservations' && <ReservationsAdmin reservations={reservas} rooms={habitaciones} users={usuarios} currentUser={user.datos} onDelete={setEliminando} />}
        </div>
      </div>

      {creando === 'habitacion' && (
        <Modal titulo="Crear habitación" onClose={() => setCreando(null)}>
          <RoomCreateForm existing={habitaciones} onSave={guardarHabitacion} onCancel={() => setCreando(null)} />
        </Modal>
      )}
      {creando === 'usuario' && (
        <Modal titulo="Crear usuario" onClose={() => setCreando(null)}>
          <UserCreateForm onSave={guardarUsuario} onCancel={() => setCreando(null)} />
        </Modal>
      )}
      {eliminando && (
        <ConfirmDialog
          titulo="Eliminar reserva"
          mensaje={`¿Seguro que querés eliminar la reserva #${eliminando.id_reserva}? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setEliminando(null)}
        />
      )}
    </div>
  );
}
