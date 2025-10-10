import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operator from './pages/Operator';
import Admin from './pages/Admin';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import Reserve from './pages/Reserve'; // <-- Importar nueva página
import { useUsuarioLogic } from './hooks/useUsuarioLogic';

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user.ok) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.datos.tipo_usuario)) {
    const homePath = user.datos.tipo_usuario === 'admin' ? '/admin' :
                     user.datos.tipo_usuario === 'operador' ? '/operator' :
                     '/dashboard';
    return <Navigate to={homePath} replace />;
  }
  return children;
}

export default function App() {
  const {
    usuario,
    credenciales,
    login,
    logout,
    actualizarCredenciales,
    habitaciones,
    cargarHabitaciones,
    manejarActualizacion,
    reservas,
    descargarReservas,
    crearReserva,
    eliminarReserva,
    allUsers,
    descargarUsuarios,
    eliminarUsuario
  } = useUsuarioLogic();

  useEffect(() => {
    cargarHabitaciones();
    descargarReservas();
    descargarUsuarios();
  }, []);

  if (habitaciones.datos === null || reservas.datos === null || allUsers.datos === null) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Layout user={usuario} logout={logout}>
      <Routes>
        <Route path="/" element={<Home habitaciones={habitaciones.datos} addReservation={crearReserva} user={usuario} />} />
        <Route path="/reserve" element={<Reserve habitaciones={habitaciones.datos} addReservation={crearReserva} user={usuario} reservas={reservas.datos} />} />
        <Route path="/login" element={
          usuario.ok ? (
            <Navigate to={
              usuario.datos.tipo_usuario === 'admin' ? '/admin' :
              usuario.datos.tipo_usuario === 'operador' ? '/operator' :
              '/dashboard'
            } replace />
          ) : (
            <Login 
              credenciales={credenciales} 
              actualizarCredenciales={actualizarCredenciales} 
              handleLogin={login} 
            />
          )
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute user={usuario} allowedRoles={['cliente']}>
            <UserDashboard user={usuario} allReservations={reservas.datos} />
          </ProtectedRoute>
        } />
        <Route path="/operator" element={
          <ProtectedRoute user={usuario} allowedRoles={['operador', 'admin']}>
            <Operator 
              user={usuario}
              habitaciones={habitaciones} 
              manejarActualizacion={manejarActualizacion}
              reservas={reservas.datos}
              crearReserva={crearReserva}
            />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute user={usuario} allowedRoles={['admin']}>
            <Admin 
              user={usuario}
              habitaciones={habitaciones}
              manejarActualizacion={manejarActualizacion}
              reservas={reservas.datos}
              users={allUsers.datos}
              deleteReservation={eliminarReserva}
              deleteUser={eliminarUsuario}
            />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}
