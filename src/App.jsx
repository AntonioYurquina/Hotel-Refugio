import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operator from './pages/Operator';
import Admin from './pages/Admin';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import Reserve from './pages/Reserve';
import { useUsuarioLogic } from './hooks/useUsuarioLogic';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext'; // Importar ToastProvider
import LoadingSpinner from './components/LoadingSpinner'; // Importar el nuevo spinner

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

function AppContent() { // Se extrae el contenido para usar el hook
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
    manejarNuevaReserva,
    manejarEliminarReserva,
    allUsers,
    descargarUsuarios,
    eliminarUsuario,
    registrarUsuario,
    actualizarHabitacionAdmin,
    actualizarUsuario,
    actualizarReserva,
    crearHabitacion, // Importar nueva función
    eliminarHabitacion, // Importar nueva función
  } = useUsuarioLogic();

  useEffect(() => {
    cargarHabitaciones();
    descargarReservas();
    descargarUsuarios();
  }, []);

  if (habitaciones.datos === null || reservas.datos === null || allUsers.datos === null) {
    return <LoadingSpinner />;
  }

  return (
    <Layout user={usuario} logout={logout}>
      <Routes>
        <Route path="/" element={<Home habitaciones={habitaciones.datos} user={usuario} />} />
        <Route path="/reserve" element={
          <Reserve 
            habitaciones={habitaciones.datos} 
            user={usuario} 
            reservas={reservas.datos}
            login={login}
            actualizarCredenciales={actualizarCredenciales}
            registrarUsuario={registrarUsuario}
          />
        } />
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
              registrarUsuario={registrarUsuario}
            />
          )
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute user={usuario} allowedRoles={['cliente']}>
            <UserDashboard 
              user={usuario} 
              allReservations={reservas.datos} 
              habitaciones={habitaciones.datos} 
            />
          </ProtectedRoute>
        } />
        <Route path="/operator" element={
          <ProtectedRoute user={usuario} allowedRoles={['operador', 'admin']}>
            <Operator 
              user={usuario}
              habitaciones={habitaciones} 
              manejarActualizacion={manejarActualizacion}
              reservas={reservas.datos}
              crearReserva={manejarNuevaReserva}
              eliminarReserva={manejarEliminarReserva}
              actualizarReserva={actualizarReserva}
              cargarHabitaciones={cargarHabitaciones}
              descargarReservas={descargarReservas}
              users={allUsers.datos}
              updateUser={actualizarUsuario}
              deleteUser={eliminarUsuario}
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
              deleteReservation={manejarEliminarReserva}
              deleteUser={eliminarUsuario}
              updateRoom={actualizarHabitacionAdmin}
              updateUser={actualizarUsuario}
              createRoom={crearHabitacion}
              deleteRoom={eliminarHabitacion}
              createUser={registrarUsuario}
            />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
