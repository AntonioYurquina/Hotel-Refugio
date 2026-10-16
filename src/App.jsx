import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operator from './pages/Operator';
import Admin from './pages/Admin';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import Reserve from './pages/Reserve';
import { useHotel } from './hooks/useHotel';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { PantallaCarga, PantallaError } from './components/ui/PantallaEstado';

const INICIO_POR_ROL = { admin: '/admin', operador: '/operator', cliente: '/dashboard' };

function RutaProtegida({ user, roles, children }) {
  if (!user.ok) return <Navigate to="/login" replace />;
  if (!roles.includes(user.datos.tipo_usuario)) return <Navigate to={INICIO_POR_ROL[user.datos.tipo_usuario]} replace />;
  return children;
}

function AppContent() {
  const hotel = useHotel();
  const { usuario, habitaciones, reservas, usuarios, carga, recargarTodo } = hotel;

  useEffect(() => {
    recargarTodo();
  }, [recargarTodo]);

  if (carga.estado === 'cargando') return <PantallaCarga />;
  if (carga.estado === 'error') return <PantallaError mensaje={carga.error} onReintentar={recargarTodo} />;

  return (
    <Layout user={usuario} logout={hotel.logout}>
      <Routes>
        <Route path="/" element={<Home habitaciones={habitaciones.datos} />} />
        <Route
          path="/reserve"
          element={
            <Reserve
              habitaciones={habitaciones.datos}
              user={usuario}
              reservas={reservas.datos}
              login={hotel.login}
              registrarUsuario={hotel.registrarUsuario}
              crearReserva={hotel.crearReserva}
            />
          }
        />
        <Route
          path="/login"
          element={
            usuario.ok ? (
              <Navigate to={INICIO_POR_ROL[usuario.datos.tipo_usuario]} replace />
            ) : (
              <Login login={hotel.login} registrarUsuario={hotel.registrarUsuario} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <RutaProtegida user={usuario} roles={['cliente']}>
              <UserDashboard user={usuario} reservas={reservas.datos} habitaciones={habitaciones.datos} />
            </RutaProtegida>
          }
        />
        <Route
          path="/operator"
          element={
            <RutaProtegida user={usuario} roles={['operador', 'admin']}>
              <Operator
                user={usuario}
                habitaciones={habitaciones.datos}
                reservas={reservas.datos}
                usuarios={usuarios}
                recargar={recargarTodo}
                cambiarEstadoHabitacion={hotel.cambiarEstadoHabitacion}
                crearReserva={hotel.crearReserva}
                modificarReserva={hotel.modificarReserva}
                cambiarEstadoReserva={hotel.cambiarEstadoReserva}
                eliminarReserva={hotel.eliminarReserva}
              />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin"
          element={
            <RutaProtegida user={usuario} roles={['admin']}>
              <Admin
                user={usuario}
                habitaciones={habitaciones.datos}
                reservas={reservas.datos}
                usuarios={usuarios}
                cambiarEstadoHabitacion={hotel.cambiarEstadoHabitacion}
                crearHabitacion={hotel.crearHabitacion}
                crearUsuario={(datos) => hotel.registrarUsuario(datos, { iniciarSesion: false })}
                eliminarReserva={hotel.eliminarReserva}
              />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
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
