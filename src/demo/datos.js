const DIA = 86400000;

export const CLAVE_DEMO = 'demo';

// Misma representación de fechas que la API real: ISO UTC con la medianoche argentina (03:00 UTC).
const isoArgentina = (aaaammdd) => `${aaaammdd}T03:00:00.000Z`;

export function crearDatosDemo() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = (dias) => new Date(hoy.getTime() + dias * DIA);
  const diaISO = (dias) => {
    const f = fecha(dias);
    return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
  };
  const diaDelMes = (anio, mes, dia) => new Date(Date.UTC(anio, mes, dia)).toISOString().slice(0, 10);

  // [id, número, tipo, precio por noche (ARS), capacidad, descripción, estado]
  const habitaciones = [
    [1, 101, 'simple', 1500, 1, 'Habitación sencilla con cama individual.', 'disponible'],
    [2, 102, 'simple', 1600, 1, 'Cama individual con vista al jardín.', 'ocupada'],
    [3, 103, 'doble', 2500, 2, 'Habitación doble con dos camas.', 'disponible'],
    [4, 104, 'doble', 2600, 2, 'Cama matrimonial con vista al jardín.', 'ocupada'],
    [5, 105, 'doble', 2700, 2, 'Cama matrimonial con vista a las sierras.', 'disponible'],
    [6, 201, 'doble', 2800, 3, 'Doble con balcón y cuna disponible.', 'disponible'],
    [7, 202, 'suite', 5000, 4, 'Suite amplia con sala de estar.', 'mantenimiento'],
    [8, 203, 'suite', 5200, 4, 'Suite con cocina pequeña y balcón.', 'ocupada'],
    [9, 204, 'suite', 5500, 2, 'Suite con jacuzzi y vista panorámica.', 'disponible'],
    [10, 205, 'suite', 5800, 3, 'Suite junior con sala de estar.', 'cerrada'],
  ].map(([id_habitacion, numero, tipo, precio_noche, capacidad, descripcion, estado]) =>
    ({ id_habitacion, numero, tipo, capacidad, precio_noche: precio_noche.toFixed(2), estado, descripcion }));

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
    id_usuario, nombre, apellido, email, telefono: `387555${String(110 + i).padStart(4, '0')}`, tipo_usuario,
  }));

  // [id_habitacion, id_usuario, entrada (días desde hoy), salida, estado, creación (días desde hoy)]
  const proximas = [
    [2, 3, -2, 2, 'confirmada', -20], [4, 4, -1, 3, 'confirmada', -15], [8, 5, -3, 1, 'confirmada', -25],
    [3, 6, 0, 3, 'confirmada', -9], [5, 7, 1, 4, 'confirmada', -7], [6, 8, 2, 6, 'pendiente', -2],
    [1, 9, 3, 5, 'confirmada', -5], [9, 10, 4, 9, 'pendiente', -1], [4, 6, 5, 8, 'confirmada', -4],
    [8, 7, 6, 10, 'pendiente', -3], [3, 3, 7, 12, 'confirmada', -6], [6, 4, 9, 14, 'confirmada', -8],
    [5, 5, 10, 13, 'pendiente', -1], [1, 8, 12, 17, 'confirmada', -2], [9, 9, 14, 19, 'confirmada', -3],
    [2, 10, 16, 20, 'pendiente', 0], [8, 6, 18, 23, 'confirmada', -1], [3, 7, 20, 26, 'confirmada', 0],
    [7, 3, -12, -9, 'cancelada', -30], [10, 5, -6, -4, 'cancelada', -20],
  ].map(([id_habitacion, id_usuario, a, b, estado, c]) => ({
    id_habitacion, id_usuario, estado,
    fecha_inicio: isoArgentina(diaISO(a)), fecha_fin: isoArgentina(diaISO(b)), fecha_creacion: fecha(c).toISOString(),
  }));

  // Estadías finalizadas de los meses anteriores, para que los gráficos del panel tengan historia.
  const anio = hoy.getFullYear();
  const orden = [1, 3, 4, 5, 6, 8, 9, 2, 7, 10];
  const finalizadas = [];
  let k = 0;
  for (let mes = 0; mes < hoy.getMonth(); mes++) {
    const cantidad = 3 + ((mes * 2) % 4);
    for (let j = 0; j < cantidad; j++) {
      const inicio = diaDelMes(anio, mes, 2 + j * 6);
      const fin = diaDelMes(anio, mes, 2 + j * 6 + 2 + (k % 4));
      finalizadas.push({
        id_habitacion: orden[k % orden.length], id_usuario: 3 + (k % 8), estado: 'finalizada',
        fecha_inicio: isoArgentina(inicio), fecha_fin: isoArgentina(fin), fecha_creacion: isoArgentina(inicio),
      });
      k++;
    }
  }
  const reservas = [...finalizadas, ...proximas].map((r, i) => ({ id_reserva: i + 1, ...r }));

  return { habitaciones, usuarios, reservas, version: { habitaciones: 331, reservas: 73 } };
}
