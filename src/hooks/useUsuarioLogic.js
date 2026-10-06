import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import * as api from "../api/hotelApi";

export function useUsuarioLogic() {
  const { addToast } = useToast();

  // --- ESTADOS PRINCIPALES ---
  const [usuario, setUsuario] = useState(() => {
    try {
      const item = window.localStorage.getItem('usuario');
      return item ? JSON.parse(item) : { ok: false, datos: {} };
    } catch (error) {
      return { ok: false, datos: {} };
    }
  });
  const [credenciales, setCredenciales] = useState({ email: "", contraseña: "" });
  const [habitaciones, setHabitaciones] = useState({ ok: null, estado_tabla: null, datos: [] });
  const [reservas, setReservas] = useState({ ok: null, estado_tabla: null, datos: [] });
  const [allUsers, setAllUsers] = useState({ ok: null, datos: [] });

  useEffect(() => {
    try {
      window.localStorage.setItem('usuario', JSON.stringify(usuario));
    } catch (error) {
      console.error("Error al guardar el usuario en localStorage", error);
    }
  }, [usuario]);

  // --- LÓGICA DE AUTENTICACIÓN Y USUARIOS ---
  async function login() {
    if (!credenciales.email || !credenciales.contraseña) return;
    try {
      const data = await api.login(credenciales.email, credenciales.contraseña);
      setUsuario(data);
      addToast(`Bienvenido, ${data.datos.nombre}`, 'success');
    } catch (error) {
      addToast(error.status === 401 ? 'Credenciales incorrectas' : error.message, 'error');
    }
  }

  function actualizarCredenciales(email, contraseña) {
    setCredenciales({ email, contraseña });
  }

  function logout() {
    setUsuario({ ok: false, datos: {} });
    setCredenciales({ email: "", contraseña: "" });
  }

  async function descargarUsuarios() {
    try {
      const data = await api.listarUsuarios();
      setAllUsers({ ok: true, datos: data });
    } catch (error) {
      console.error("Error al descargar usuarios:", error);
      setAllUsers({ ok: false, datos: [] });
    }
  }

  // Registrar, actualizar y eliminar usuarios son simulaciones locales a propósito:
  // la base de demostración es pública y no debe recibir datos personales reales.
  async function registrarUsuario(userData) {
    const newUser = { id_usuario: Date.now(), ...userData, tipo_usuario: 'cliente' };
    setAllUsers(prev => ({ ...prev, datos: [newUser, ...prev.datos] }));
    setUsuario({ ok: true, datos: newUser });
    addToast(`¡Bienvenido, ${userData.nombre}! Registro exitoso (simulado).`, 'success');
  }

  async function actualizarUsuario(userData) {
    setAllUsers(prev => ({
      ...prev,
      datos: prev.datos.map(u => u.id_usuario === userData.id_usuario ? { ...u, ...userData } : u)
    }));
    addToast(`Usuario ${userData.nombre} actualizado (simulado).`, 'success');
  }

  async function eliminarUsuario(id) {
    setAllUsers(prev => ({ ...prev, datos: prev.datos.filter(u => u.id_usuario !== id) }));
    addToast(`Usuario con ID ${id} eliminado (simulado).`, 'success');
  }

  // --- LÓGICA DE HABITACIONES ---
  async function cargarHabitaciones() {
    try {
      setHabitaciones(await api.listarHabitaciones());
    } catch (error) {
      console.error("Error al cargar habitaciones:", error);
      addToast(error.message, 'error');
    }
  }

  async function manejarActualizacion(id_habitacion, nuevo_estado) {
    try {
      await api.cambiarEstadoHabitacion(id_habitacion, nuevo_estado);
      await cargarHabitaciones();
    } catch (error) {
      console.error("Error al actualizar habitación:", error);
      addToast(error.message, 'error');
    }
  }

  async function actualizarHabitacionAdmin(roomData) {
    try {
      await api.actualizarHabitacion(roomData.id_habitacion, roomData);
      await cargarHabitaciones();
      addToast(`Habitación ${roomData.numero} actualizada.`, 'success');
    } catch (error) {
      console.error("Error al actualizar la habitación:", error);
      addToast(error.message, 'error');
    }
  }

  async function crearHabitacion(roomData) {
    try {
      await api.crearHabitacion(roomData);
      await cargarHabitaciones();
      addToast(`Habitación ${roomData.numero} creada.`, 'success');
    } catch (error) {
      console.error("Error al crear la habitación:", error);
      addToast(error.message, 'error');
    }
  }

  async function eliminarHabitacion(roomId) {
    try {
      await api.eliminarHabitacion(roomId);
      // Las reservas de la habitación se borran en cascada: se recargan las dos listas.
      await Promise.all([cargarHabitaciones(), descargarReservas()]);
      addToast('Habitación eliminada.', 'success');
    } catch (error) {
      console.error("Error al eliminar la habitación:", error);
      addToast(error.message, 'error');
    }
  }

  // --- LÓGICA DE RESERVAS ---
  async function descargarReservas() {
    try {
      setReservas(await api.listarReservas());
    } catch (error) {
      console.error("Error al descargar reservas:", error);
    }
  }

  async function crearReserva(reservaData) {
    try {
      const nuevaReserva = await api.crearReserva(reservaData);
      setReservas(prev => ({
        ...prev,
        datos: [...prev.datos, nuevaReserva.datos],
        estado_tabla: nuevaReserva.estado_tabla
      }));
      addToast('Reserva creada con éxito.', 'success');
    } catch (error) {
      console.error("Error al crear reserva:", error);
      addToast(`Error al crear la reserva: ${error.message}`, 'error');
    }
  }

  async function actualizarReserva(reservaData) {
    const { id_reserva, ...dataToUpdate } = reservaData;
    try {
      // Actualización optimista del UI
      setReservas(prev => ({
        ...prev,
        datos: prev.datos.map(r => r.id_reserva === id_reserva ? {
          ...r,
          ...reservaData,
          fecha_inicio: api.fechaLocal(reservaData.fecha_inicio ?? r.fecha_inicio),
          fecha_fin: api.fechaLocal(reservaData.fecha_fin ?? r.fecha_fin),
        } : r)
      }));

      const data = await api.actualizarReserva(id_reserva, dataToUpdate);
      addToast('Reserva actualizada con éxito.', 'success');
      setReservas(prev => ({ ...prev, estado_tabla: data.estado_tabla }));
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      addToast(`Error al actualizar la reserva: ${error.message}`, 'error');
      descargarReservas(); // Revertir el cambio optimista si hay un error
    }
  }

  async function eliminarReserva(idReserva) {
    // Actualización optimista del UI
    const reservaOriginal = reservas.datos.find(r => r.id_reserva === idReserva);
    setReservas(prev => ({
      ...prev,
      datos: prev.datos.filter(r => r.id_reserva !== idReserva)
    }));

    try {
      const data = await api.eliminarReserva(idReserva);
      addToast('Reserva eliminada con éxito.', 'success');
      setReservas(prev => ({ ...prev, estado_tabla: data.estado_tabla }));
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      addToast(`Error al eliminar la reserva: ${error.message}`, 'error');
      // Revertir el cambio optimista
      if (reservaOriginal) {
        setReservas(prev => ({ ...prev, datos: [...prev.datos, reservaOriginal] }));
      }
    }
  }

  // --- Funciones Wrapper solicitadas ---
  const manejarNuevaReserva = crearReserva;
  const manejarEliminarReserva = eliminarReserva;

  return {
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
    manejarNuevaReserva, // Exportar con el nombre solicitado
    manejarEliminarReserva, // Exportar con el nombre solicitado
    actualizarReserva,
    allUsers,
    descargarUsuarios,
    eliminarUsuario,
    registrarUsuario,
    actualizarHabitacionAdmin,
    actualizarUsuario,
    crearHabitacion,
    eliminarHabitacion,
  };
}
