import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";

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
      const response = await fetch("https://robledo.website/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales)
      });
      const data = await response.json();
      if (response.ok) {
        setUsuario(data);
        addToast(`Bienvenido, ${data.datos.nombre}`, 'success');
      } else {
        addToast('Credenciales incorrectas', 'error');
      }
    } catch (error) {
      addToast('Error de conexión', 'error');
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
      const response = await fetch("https://robledo.website/usuarios");
      const data = await response.json();
      // Corregido: La API de usuarios devuelve un array directamente.
      // Se verifica que la respuesta sea exitosa y que los datos sean un array.
      if (response.ok && Array.isArray(data)) {
        setAllUsers({ ok: true, datos: data });
      } else {
        console.error("La respuesta de la API de usuarios no es un array válido.");
        setAllUsers({ ok: false, datos: [] });
      }
    } catch (error) {
      console.error("Error al descargar usuarios:", error);
    }
  }

  // Las funciones de gestión de usuarios (registrar, actualizar, eliminar) se mantienen como simulaciones locales
  // ya que la API proporcionada no incluye estos endpoints.
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
      const response = await fetch("https://robledo.website/habitaciones");
      const data = await response.json();
      if (data.ok) setHabitaciones(data);
    } catch (error) {
      console.error("Error al cargar habitaciones:", error);
    }
  }

  async function manejarActualizacion(id_habitacion, nuevo_estado, version) {
    try {
      const response = await fetch(`https://robledo.website/habitaciones/${id_habitacion}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado, version })
      });
      if (response.ok) await cargarHabitaciones();
    } catch (error) {
      console.error("Error al actualizar habitación:", error);
    }
  }

  async function actualizarHabitacionAdmin(roomData) {
    setHabitaciones(prev => ({
      ...prev,
      datos: prev.datos.map(h => h.id_habitacion === roomData.id_habitacion ? { ...h, ...roomData } : h)
    }));
    addToast(`Habitación ${roomData.numero} actualizada (simulado).`, 'success');
  }

  async function crearHabitacion(roomData) {
    try {
      const response = await fetch("https://robledo.website/habitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...roomData, version: habitaciones.estado_tabla }),
      });
      if (response.ok) {
        cargarHabitaciones();
        // Aquí iría un toast de éxito
      } else {
        // Aquí iría un toast de error
      }
    } catch (error) {
      console.error("Error al crear la habitación:", error);
    }
  }

  async function eliminarHabitacion(roomId) {
    try {
      const response = await fetch(`https://robledo.website/habitaciones/${roomId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: habitaciones.estado_tabla }),
      });
      if (response.ok) {
        cargarHabitaciones();
        // Aquí iría un toast de éxito
      } else {
        // Aquí iría un toast de error
      }
    } catch (error) {
      console.error("Error al eliminar la habitación:", error);
    }
  }

  // --- LÓGICA DE RESERVAS ---
  async function descargarReservas() {
    try {
      const response = await fetch("https://robledo.website/reservas");
      const data = await response.json();
      if (data.ok) setReservas(data);
    } catch (error) {
      console.error("Error al descargar reservas:", error);
    }
  }

  async function crearReserva(reservaData) {
    try {
      const body = { ...reservaData, version: reservas.estado_tabla };
      const response = await fetch("https://robledo.website/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const nuevaReserva = await response.json();

      if (response.ok) {
        setReservas(prev => ({
          ...prev,
          datos: [...prev.datos, nuevaReserva.datos],
          estado_tabla: nuevaReserva.estado_tabla
        }));
        alert('Reserva creada con éxito.');
      } else {
        alert(`Error al crear la reserva: ${nuevaReserva.mensaje}`);
      }
    } catch (error) {
      console.error("Error de red al crear reserva:", error);
    }
  }

  async function actualizarReserva(reservaData) {
    try {
      const { id_reserva, ...dataToUpdate } = reservaData;
      const body = { ...dataToUpdate, version: reservas.estado_tabla };
      
      // Actualización optimista del UI
      setReservas(prev => ({
        ...prev,
        datos: prev.datos.map(r => r.id_reserva === id_reserva ? { ...r, ...reservaData } : r)
      }));

      const response = await fetch(`https://robledo.website/reservas/${id_reserva}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        addToast('Reserva actualizada con éxito.', 'success');
        // Opcional: recargar para sincronizar el estado de la tabla si es necesario
        const data = await response.json();
        setReservas(prev => ({ ...prev, estado_tabla: data.estado_tabla }));
      } else {
        const errorData = await response.json();
        addToast(`Error al actualizar la reserva: ${errorData.mensaje}`, 'error');
        descargarReservas(); // Revertir el cambio optimista si hay un error
      }
    } catch (error) {
      console.error("Error de red al actualizar reserva:", error);
      descargarReservas(); // Revertir el cambio optimista si hay un error
    }
  }

  async function eliminarReserva(idReserva) {
    try {
      // Actualización optimista del UI
      const reservaOriginal = reservas.datos.find(r => r.id_reserva === idReserva);
      setReservas(prev => ({
        ...prev,
        datos: prev.datos.filter(r => r.id_reserva !== idReserva)
      }));

      const response = await fetch(`https://robledo.website/reservas/${idReserva}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: reservas.estado_tabla }),
      });

      if (response.ok) {
        alert('Reserva eliminada con éxito.');
        const data = await response.json();
        setReservas(prev => ({ ...prev, estado_tabla: data.estado_tabla }));
      } else {
        const errorData = await response.json();
        alert(`Error al eliminar la reserva: ${errorData.mensaje}`);
        // Revertir el cambio optimista si hay un error
        if (reservaOriginal) {
          setReservas(prev => ({ ...prev, datos: [...prev.datos, reservaOriginal] }));
        }
      }
    } catch (error) {
      console.error("Error de red al eliminar reserva:", error);
      descargarReservas(); // Revertir
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
    actualizarReserva,
    crearHabitacion, // Exportar nueva función
    eliminarHabitacion, // Exportar nueva función
  };
}
