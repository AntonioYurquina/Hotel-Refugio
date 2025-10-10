export const initialRooms = [
  {
    id: 'r1',
    name: 'Suite Ejecutiva',
    price: 150,
    capacity: 2,
    description: 'Cama king, escritorio, minibar y vista panorámica.',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Desayuno incluido'],
    open: true,
    imgQuery: 'suite,hotel-room'
  },
  {
    id: 'r2',
    name: 'Doble Confort',
    price: 100,
    capacity: 2,
    description: 'Camas twin o matrimonio, baño privado, calefacción.',
    amenities: ['WiFi', 'TV', 'Calefacción'],
    open: true,
    imgQuery: 'double,hotel-room'
  },
  {
    id: 'r3',
    name: 'Habitación Familiar',
    price: 180,
    capacity: 4,
    description: 'Espaciosa, ideal para familias con niños.',
    amenities: ['WiFi', 'Cuna', 'Desayuno familiar'],
    open: true,
    imgQuery: 'family-room,hotel'
  },
  {
    id: 'r4',
    name: 'Individual Económica',
    price: 65,
    capacity: 1,
    description: 'Cama individual, baño compartido, opción económica.',
    amenities: ['WiFi'],
    open: true,
    imgQuery: 'single,hotel-room'
  }
];
