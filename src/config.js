import { imagenDemo } from './demo/imagenes';

// Sin VITE_API_URL la app corre en modo demo: una API simulada en memoria (src/demo/) con el mismo contrato
// que la API real. Con VITE_API_URL apunta al servidor real y el modo demo se desactiva solo.
export const API_URL = (import.meta.env.VITE_API_URL || 'https://api.demo.hotel-refugio').replace(/\/+$/, '');
export const DEMO = !import.meta.env.VITE_API_URL;

// Lo que la API v1 permite hacer. El resto de la interfaz se adapta a estas capacidades en lugar de simular
// operaciones que el servidor no tiene.
export const CAPACIDADES = {
  // GET /usuarios es una ruta de test (devuelve las contraseñas) y no debe usarse contra la API real.
  directorioUsuarios: DEMO,
  // La API v1 solo cambia el estado de una habitación (PUT) y no tiene DELETE de habitaciones ni de usuarios.
  editarHabitacion: false,
  eliminarHabitacion: false,
  gestionarUsuarios: false,
};

export const imagenHabitacion = (idHabitacion, variante = 0) =>
  DEMO ? imagenDemo(idHabitacion, variante) : `${API_URL}/patas/${idHabitacion}${'abc'[variante]}.jpg`;

// Imagen por defecto para las habitaciones que no tienen fotos (la API no indica cuál corresponde a cada una).
export const imagenPorDefecto = imagenDemo(0, 0);
