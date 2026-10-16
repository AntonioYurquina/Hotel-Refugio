import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/cliente';
import { CAPACIDADES } from '../config';
import { useToast } from '../context/toastContext';
import { ROLES, validarReserva } from '../utils/reservas';

const SIN_SESION = { ok: false, datos: {} };

// La API v1 no usa tokens: el login solo devuelve los datos del usuario y es el frontend quien los recuerda.
function leerSesion() {
  try {
    const guardada = JSON.parse(window.localStorage.getItem('usuario'));
    const datos = guardada?.datos;
    return guardada?.ok && Number.isInteger(datos?.id_usuario) && ROLES.includes(datos?.tipo_usuario) ? guardada : SIN_SESION;
  } catch {
    return SIN_SESION;
  }
}

const porNumero = (a, b) => a.numero - b.numero;
const porId = (a, b) => a.id_reserva - b.id_reserva;

export function useHotel() {
  const { addToast } = useToast();
  const [usuario, setUsuario] = useState(leerSesion);
  const [habitaciones, setHabitaciones] = useState({ estado_tabla: null, datos: [] });
  const [reservas, setReservas] = useState({ estado_tabla: null, datos: [] });
  const [usuarios, setUsuarios] = useState([]);
  const [carga, setCarga] = useState({ estado: 'cargando', error: null });

  // La versión de cada tabla se lee desde una referencia para no usar nunca un valor viejo dentro de un cierre.
  const versiones = useRef({ habitaciones: null, reservas: null });
  const datos = useRef({ habitaciones: [], reservas: [] });
  datos.current = { habitaciones: habitaciones.datos, reservas: reservas.datos };

  useEffect(() => {
    try {
      window.localStorage.setItem('usuario', JSON.stringify(usuario));
    } catch {
      // Sin almacenamiento disponible (modo privado): la sesión dura hasta recargar.
    }
  }, [usuario]);

  const guardarHabitaciones = useCallback((lista, version) => {
    versiones.current.habitaciones = version;
    setHabitaciones({ estado_tabla: version, datos: [...lista].sort(porNumero) });
  }, []);
  const guardarReservas = useCallback((lista, version) => {
    versiones.current.reservas = version;
    setReservas({ estado_tabla: version, datos: [...lista].sort(porId) });
  }, []);

  const recargarHabitaciones = useCallback(async () => {
    const r = await api.listarHabitaciones();
    guardarHabitaciones(r.datos, r.version);
  }, [guardarHabitaciones]);
  const recargarReservas = useCallback(async () => {
    const r = await api.listarReservas();
    guardarReservas(r.datos, r.version);
  }, [guardarReservas]);

  const recargarTodo = useCallback(async () => {
    setCarga((c) => ({ ...c, estado: c.estado === 'listo' ? 'listo' : 'cargando', error: null }));
    try {
      await Promise.all([
        recargarHabitaciones(),
        recargarReservas(),
        CAPACIDADES.directorioUsuarios ? api.listarUsuarios().then(setUsuarios) : Promise.resolve(),
      ]);
      setCarga({ estado: 'listo', error: null });
    } catch (error) {
      setCarga({ estado: 'error', error: error.message });
    }
  }, [recargarHabitaciones, recargarReservas]);

  // Toda escritura sigue el mismo ciclo: enviar con la última versión conocida, guardar la versión nueva y, si la
  // API responde 409, volver a leer la tabla y avisar para que la persona reintente con datos frescos.
  const escribir = useCallback(
    async (tabla, accion, aplicar, mensajeExito) => {
      try {
        const r = await accion(versiones.current[tabla]);
        aplicar(r);
        if (mensajeExito) addToast(mensajeExito, 'success');
        return { ok: true, datos: r.datos };
      } catch (error) {
        if (error.esConflicto) {
          await (tabla === 'reservas' ? recargarReservas() : recargarHabitaciones()).catch(() => {});
          addToast('Otra persona modificó los datos mientras trabajabas. Ya los actualizamos: revisalos y volvé a intentar.', 'warning');
        } else {
          addToast(error.message, 'error');
        }
        return { ok: false, error, conflicto: Boolean(error.esConflicto) };
      }
    },
    [addToast, recargarHabitaciones, recargarReservas],
  );

  // ---- Sesión -------------------------------------------------------------------------------------------
  const login = useCallback(
    async (email, contraseña) => {
      try {
        const datosUsuario = await api.iniciarSesion(email, contraseña);
        setUsuario({ ok: true, datos: datosUsuario });
        addToast(`Bienvenido, ${datosUsuario.nombre}`, 'success');
        return true;
      } catch (error) {
        addToast(error.message, 'error');
        return false;
      }
    },
    [addToast],
  );

  const logout = useCallback(() => setUsuario(SIN_SESION), []);

  const registrarUsuario = useCallback(
    async (nuevo, { iniciarSesion = true } = {}) => {
      try {
        await api.registrar({ tipo_usuario: 'cliente', ...nuevo });
      } catch (error) {
        addToast(error.message, 'error');
        return false;
      }
      if (iniciarSesion) return login(nuevo.email, nuevo['contraseña']);
      addToast(`Usuario ${nuevo.nombre} creado.`, 'success');
      if (CAPACIDADES.directorioUsuarios) api.listarUsuarios().then(setUsuarios).catch(() => {});
      return true;
    },
    [addToast, login],
  );

  // ---- Habitaciones -------------------------------------------------------------------------------------
  const cambiarEstadoHabitacion = useCallback(
    (id, estado) =>
      escribir(
        'habitaciones',
        (version) => api.cambiarEstadoHabitacion(id, estado, version),
        (r) => guardarHabitaciones(datos.current.habitaciones.map((h) => (h.id_habitacion === id ? r.datos : h)), r.version),
        'Estado de la habitación actualizado.',
      ),
    [escribir, guardarHabitaciones],
  );

  const crearHabitacion = useCallback(
    (nueva) =>
      escribir(
        'habitaciones',
        () => api.crearHabitacion(nueva),
        (r) => guardarHabitaciones([...datos.current.habitaciones, r.datos], r.version),
        `Habitación ${nueva.numero} creada.`,
      ),
    [escribir, guardarHabitaciones],
  );

  // ---- Reservas -----------------------------------------------------------------------------------------
  const rechazar = useCallback(
    (mensaje) => {
      addToast(mensaje, 'error');
      return { ok: false, error: new Error(mensaje), conflicto: false };
    },
    [addToast],
  );

  const crearReserva = useCallback(
    (reserva) => {
      const problema = validarReserva(reserva, datos.current.reservas, datos.current.habitaciones);
      if (problema) return Promise.resolve(rechazar(problema));
      return escribir(
        'reservas',
        (version) => api.crearReserva(reserva, version),
        (r) => guardarReservas([...datos.current.reservas, r.datos], r.version),
        'Reserva creada con éxito.',
      );
    },
    [escribir, guardarReservas, rechazar],
  );

  const modificarReserva = useCallback(
    (reserva, { soloEstado = false, estadoAnterior = null } = {}) => {
      const reactiva = soloEstado && estadoAnterior === 'cancelada' && reserva.estado !== 'cancelada';
      const problema =
        soloEstado && !reactiva
          ? null
          : validarReserva(reserva, datos.current.reservas, datos.current.habitaciones, {
              idExcluido: reserva.id_reserva,
              validarFechas: !soloEstado,
            });
      if (problema) return Promise.resolve(rechazar(problema));
      return escribir(
        'reservas',
        (version) => api.modificarReserva(reserva.id_reserva, reserva, version),
        (r) => guardarReservas(datos.current.reservas.map((x) => (x.id_reserva === reserva.id_reserva ? r.datos : x)), r.version),
        'Reserva actualizada.',
      );
    },
    [escribir, guardarReservas, rechazar],
  );

  const cambiarEstadoReserva = useCallback(
    (reserva, estado) => modificarReserva({ ...reserva, estado }, { soloEstado: true, estadoAnterior: reserva.estado }),
    [modificarReserva],
  );

  const eliminarReserva = useCallback(
    (id) =>
      escribir(
        'reservas',
        (version) => api.eliminarReserva(id, version),
        (r) => guardarReservas(datos.current.reservas.filter((x) => x.id_reserva !== id), r.version),
        `Reserva #${id} eliminada.`,
      ),
    [escribir, guardarReservas],
  );

  return {
    usuario, login, logout, registrarUsuario,
    habitaciones, reservas, usuarios, carga, recargarTodo, recargarHabitaciones, recargarReservas,
    cambiarEstadoHabitacion, crearHabitacion,
    crearReserva, modificarReserva, cambiarEstadoReserva, eliminarReserva,
  };
}
