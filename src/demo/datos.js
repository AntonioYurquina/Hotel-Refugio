const DIA = 86400000;

export const CLAVE_DEMO = 'demo';

export function crearDatosDemo() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = (dias) => new Date(hoy.getTime() + dias * DIA).toISOString().slice(0, 10);
  const fechaUTC = (anio, mes, dia) => new Date(Date.UTC(anio, mes, dia)).toISOString().slice(0, 10);

  const habitaciones = [
    [1, '101', 'Simple', 65, 1, 'Cama individual, baño privado y escritorio.', 'disponible'],
    [2, '102', 'Simple', 65, 1, 'Cama individual con vista al jardín.', 'ocupada'],
    [3, '103', 'Doble', 100, 2, 'Camas twin o matrimonial, baño privado y calefacción.', 'disponible'],
    [4, '104', 'Doble', 100, 2, 'Cama matrimonial, balcón y desayuno incluido.', 'ocupada'],
    [5, '105', 'Doble', 105, 2, 'Cama matrimonial con vista a las sierras.', 'disponible'],
    [6, '201', 'Familiar', 180, 4, 'Espaciosa, con cuna disponible. Ideal para familias.', 'disponible'],
    [7, '202', 'Familiar', 185, 4, 'Dos ambientes, cocina pequeña y balcón.', 'mantenimiento'],
    [8, '203', 'Suite', 150, 2, 'Cama king, escritorio, minibar y vista panorámica.', 'ocupada'],
    [9, '204', 'Suite', 160, 2, 'Suite con jacuzzi y vista panorámica.', 'disponible'],
    [10, '205', 'Suite', 170, 3, 'Suite junior con sala de estar.', 'cerrada'],
  ].map(([id_habitacion, numero, tipo, precio_noche, capacidad, descripcion, estado]) =>
    ({ id_habitacion, numero, tipo, precio_noche: precio_noche.toFixed(2), capacidad, descripcion, estado }));

  const personas = [
    [1, 'Admin', 'Refugio', 'admin@example.com', 'admin'],
    [2, 'Lucía', 'Fernández', 'operador@example.com', 'operador'],
    [3, 'Martín', 'Gómez', 'cliente@example.com', 'cliente'],
    [4, 'Camila', 'Rojas', 'camila.rojas@example.com', 'cliente'],
    [5, 'Joaquín', 'Pereyra', 'joaquin.pereyra@example.com', 'cliente'],
    [6, 'Valentina', 'Suárez', 'valentina.suarez@example.com', 'cliente'],
    [7, 'Tomás', 'Aguirre', 'tomas.aguirre@example.com', 'cliente'],
    [8, 'Sofía', 'Navarro', 'sofia.navarro@example.com', 'cliente'],
    [9, 'Nicolás', 'Herrera', 'nicolas.herrera@example.com', 'cliente'],
    [10, 'Julieta', 'Molina', 'julieta.molina@example.com', 'cliente'],
  ];
  const usuarios = personas.map(([id_usuario, nombre, apellido, email, tipo_usuario], i) => ({
    id_usuario, nombre, apellido, email, tipo_usuario, telefono: `387 555-01${String(10 + i).padStart(2, '0')}`,
  }));

  // [id_habitacion, id_usuario, inicio (días desde hoy), fin, estado, creación]
  const proximas = [
    [2, 3, -2, 2, 'confirmada', -20], [4, 4, -1, 3, 'confirmada', -15], [8, 5, -3, 1, 'confirmada', -25],
    [3, 6, 0, 3, 'confirmada', -9], [5, 7, 1, 4, 'confirmada', -7], [6, 8, 2, 6, 'pendiente', -2],
    [1, 9, 3, 5, 'confirmada', -5], [9, 10, 4, 9, 'pendiente', -1], [4, 6, 5, 8, 'confirmada', -4],
    [8, 7, 6, 10, 'pendiente', -3], [3, 3, 7, 12, 'confirmada', -6], [6, 4, 9, 14, 'confirmada', -8],
    [5, 5, 10, 13, 'pendiente', -1], [1, 8, 12, 17, 'confirmada', -2], [9, 9, 14, 19, 'confirmada', -3],
    [2, 10, 16, 20, 'pendiente', 0], [8, 6, 18, 23, 'confirmada', -1], [3, 7, 20, 26, 'confirmada', 0],
    [7, 3, -12, -9, 'cancelada', -30], [10, 5, -6, -4, 'cancelada', -20],
  ].map(([id_habitacion, id_usuario, a, b, estado, c]) =>
    ({ id_habitacion, id_usuario, estado, fecha_inicio: fecha(a), fecha_fin: fecha(b), fecha_creacion: fecha(c) }));

  const anio = hoy.getFullYear();
  const orden = [1, 3, 4, 5, 6, 8, 9, 2, 7, 10];
  const finalizadas = [];
  let k = 0;
  for (let mes = 0; mes < hoy.getMonth(); mes++) {
    const cantidad = 3 + ((mes * 2) % 4);
    for (let j = 0; j < cantidad; j++) {
      const inicio = fechaUTC(anio, mes, 2 + j * 6);
      const fin = fechaUTC(anio, mes, 2 + j * 6 + 2 + (k % 4));
      finalizadas.push({
        id_habitacion: orden[k % orden.length], id_usuario: 3 + (k % 8), estado: 'finalizada',
        fecha_inicio: inicio, fecha_fin: fin, fecha_creacion: inicio,
      });
      k++;
    }
  }
  const reservas = [...finalizadas, ...proximas].map((r, i) => ({ id_reserva: i + 1, ...r }));

  return { habitaciones, usuarios, reservas, version: { habitaciones: 1, reservas: 1 } };
}
