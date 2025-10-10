import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operator from './pages/Operator';
import Admin from './pages/Admin';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard'; // Importar el nuevo componente
import { useUsuarioLogic } from './hooks/useUsuarioLogic';

// Componente para proteger rutas
function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user.ok || !allowedRoles.includes(user.datos.tipo_usuario)) {
    return <Navigate to="/login" replace />;
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
    allUsers,
    descargarUsuarios
  } = useUsuarioLogic();

  useEffect(() => {
    cargarHabitaciones();
    descargarReservas();
    descargarUsuarios();
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <Layout user={usuario} logout={logout}>
      <Routes>
        <Route path="/" element={
          <Home habitaciones={habitaciones.datos} />
        } />
        <Route path="/login" element={
          <Login 
            credenciales={credenciales} 
            actualizarCredenciales={actualizarCredenciales} 
            handleLogin={login} 
          />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute user={usuario} allowedRoles={['cliente', 'operador', 'administrador']}>
            <UserDashboard user={usuario} allReservations={reservas.datos} />
          </ProtectedRoute>
        } />
        <Route path="/operator" element={
          <ProtectedRoute user={usuario} allowedRoles={['operador', 'administrador']}>
            <Operator 
              user={usuario} // <-- Añadir usuario
              habitaciones={habitaciones} 
              manejarActualizacion={manejarActualizacion}
              reservas={reservas.datos}
            />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute user={usuario} allowedRoles={['administrador']}>
            <Admin 
              user={usuario} // <-- Añadir usuario
              habitaciones={habitaciones}
              manejarActualizacion={manejarActualizacion}
              reservas={reservas.datos}
              users={allUsers.datos}
            />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}
