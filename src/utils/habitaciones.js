import { imagenHabitacion, imagenPorDefecto } from '../config';
import { aNumero, capitalizar } from './formato';
import { esReservable } from './reservas';

// Adapta una Habitacion de la API (precio_noche como string, tipo en minúsculas) a lo que muestran las tarjetas.
export function adaptarHabitacion(h) {
  return {
    id: h.id_habitacion,
    numero: h.numero,
    tipo: h.tipo,
    name: `Habitación ${h.numero} · ${capitalizar(h.tipo)}`,
    price: aNumero(h.precio_noche),
    capacity: aNumero(h.capacidad),
    description: h.descripcion,
    reservable: esReservable(h),
    estado: h.estado,
    amenities: ['Wi-Fi', 'TV', 'Servicio a la habitación'],
    images: [0, 1, 2].map((variante) => imagenHabitacion(h.id_habitacion, variante)),
  };
}

// La API tiene fotos solo para algunas habitaciones: si falta una se muestra la imagen por defecto.
export const alFallarImagen = (e) => {
  if (e.currentTarget.src !== imagenPorDefecto) e.currentTarget.src = imagenPorDefecto;
};
