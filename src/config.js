import { imagenDemo } from './demo/imagenes';

export const API_URL = import.meta.env.VITE_API_URL || 'https://api.demo.hotel-refugio';
export const DEMO = !import.meta.env.VITE_API_URL;

export const imagenHabitacion = (idHabitacion, variante = 0) =>
  DEMO ? imagenDemo(idHabitacion, variante) : `${API_URL}/patas/${idHabitacion}${'abc'[variante]}.jpg`;
