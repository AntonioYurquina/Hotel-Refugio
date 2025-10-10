import { useState } from "react";

export function useUsuarioLogic() {
  const [usuario, setUsuario] = useState({ ok: false, datos: {} });
  const [credenciales, setCredenciales] = useState({ email: "", contraseña: "" });
  const [habitaciones, setHabitaciones] = useState({ ok: null, estado_tabla: null, datos: null });
  const [reservas, setReservas] = useState({ ok: null, estado_tabla: null, datos: null });
  const [allUsers, setAllUsers] = useState({ ok: null, estado_tabla: null, datos: null });

  // --- Lógica de Carga ---
  async function cargarHabitaciones() {
    try {
      const response = await fetch("https://robledo.website/habitaciones");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setHabitaciones(data);
    } catch (error) {
      console.error("Error al cargar habitaciones:", error);
      setHabitaciones({ ok: false, datos: [] });
    }
  }

  async function descargarReservas() {
    try {
      const response = await fetch("https://robledo.website/reservas");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error("Error al descargar reservas:", error);
      setReservas({ ok: false, datos: [] });
    }
  }

  async function descargarUsuarios() {
    try {
      const response = await fetch("https://robledo.website/usuarios");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Error al descargar usuarios:", error);
      setAllUsers({ ok: false, datos: [] });
    }
  }

  // --- Lógica de Autenticación ---
  async function login() {
    if (!credenciales.email || !credenciales.contraseña) {
      alert("Por favor, ingrese email y contraseña.");
      return null;
    }
    try {
      const response = await fetch("https://robledo.website/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales)
      });
      if (!response.ok) {
        alert("Credenciales incorrectas. Intente de nuevo.");
        return null;
      }
      const data = await response.json();
      setUsuario(data);
      return data;
    } catch (error) {
      console.log("Error en login:", error);
      return null;
    }
  }

  function actualizarCredenciales(email, contraseña) {
    setCredenciales({ email, contraseña });
  }

  function logout() {
    setUsuario({ ok: false, datos: {} });
    setCredenciales({ email: "", contraseña: "" });
  }

  // --- Lógica de Habitaciones ---
  async function manejarActualizacion(id_habitacion, nuevo_estado) {
    try {
      // La API real necesita la versión, pero la simulamos para el operador
      const version = habitaciones.estado_tabla;
      await fetch(`https://robledo.website/habitaciones/${id_habitacion}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado, version })
      });
      await cargarHabitaciones();
    } catch (error) {
      console.error("Error al actualizar habitación:", error);
    }
  }

  // --- Lógica de Reservas ---
  async function crearReserva(reservaData) {
    console.log("Simulando creación de reserva por Operador:", reservaData);
    const nuevaReserva = {
      id_reserva: Date.now(),
      ...reservaData,
    };
    setReservas(prev => ({ ...prev, datos: [nuevaReserva, ...prev.datos] }));
    alert("Reserva creada con éxito en el sistema.");
  }

  async function eliminarReserva(id_reserva) {
    if (window.confirm(`¿Seguro que quieres eliminar la reserva #${id_reserva}?`)) {
      console.log("Simulando eliminación de reserva:", id_reserva);
      setReservas(prev => ({
        ...prev,
        datos: prev.datos.filter(r => r.id_reserva !== id_reserva)
      }));
      alert(`Reserva ${id_reserva} eliminada.`);
    }
  }

  // --- Lógica de Usuarios (Simulada) ---
  async function eliminarUsuario(id_usuario) {
    if (id_usuario === usuario.datos.id_usuario) {
      alert("No puedes eliminarte a ti mismo.");
      return;
    }
    if (window.confirm(`¿Seguro que quieres eliminar el usuario con ID ${id_usuario}?`)) {
      setAllUsers(prev => ({
        ...prev,
        datos: prev.datos.filter(u => u.id_usuario !== id_usuario)
      }));
      alert(`Usuario ${id_usuario} eliminado (simulado).`);
    }
  }

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
    crearReserva,
    eliminarReserva,
    allUsers,
    descargarUsuarios,
    eliminarUsuario,
  };
}
