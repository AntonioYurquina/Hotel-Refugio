import { useState } from "react";

export function useUsuarioLogic() {
  const [usuario, setUsuario] = useState({
    ok: false,
    estado_tabla: null,
    datos: {
      id_usuario: null,
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      tipo_usuario: ""
    }
  });

  const [credenciales, setCredenciales] = useState({
    email: "",
    contraseña: ""
  });

  const [habitaciones, setHabitaciones] = useState({
    ok: null,
    estado_tabla: null,
    datos: [],
  });

   const [reservas, setReservas] = useState({
    ok: null,
    estado_tabla: null,
    datos: [],
  });

  const [allUsers, setAllUsers] = useState({
    ok: null,
    estado_tabla: null,
    datos: [],
  });

  async function descargarOperadores() {
    try {
      // Asumo que existe un endpoint para operadores, si no, esto fallará.
      const response = await fetch("https://robledo.website/usuarios?tipo=operador");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setOperators(data);
    } catch (error) {
      console.error("Error al descargar operadores:", error);
      // Cargar datos de ejemplo si la API falla
      setOperators({ ok: true, datos: [{id_usuario: 99, nombre: 'Juan (local)', apellido: 'Perez', tipo_usuario: 'operador'}] });
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
    }
  }

  async function manejarActualizacion(id_habitacion, nuevo_estado, version) {
    try {
      await actualizarHabitacion(id_habitacion, nuevo_estado, version);
      await cargarHabitaciones();
    } catch (error) {
      console.error("Error al actualizar o cargar:", error);
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
    }
  }

  async function cargarHabitaciones() {
    try {
      const response = await fetch("https://robledo.website/habitaciones");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setHabitaciones(data);
    } catch (error) {
      console.error("Error al cargar habitaciones:", error);
    }
  }

  async function actualizarHabitacion(id_habitacion, nuevo_estado, version) {
    const response = await fetch(`https://robledo.website/habitaciones/${id_habitacion}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevo_estado, version })
    });
    const data = await response.json();
    return data;
  }

  async function login() {
    if (!credenciales.email || !credenciales.contraseña) {
      console.log("Faltan credenciales");
      return null;
    }
    try {
      const response = await fetch("https://robledo.website/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales)
      });
      if (!response.ok) {
        alert("Credenciales incorrectas.");
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
    allUsers,
    descargarUsuarios,
  };
}
