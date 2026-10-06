# Hotel Refugio

Sistema de gestión hotelera: un sitio de reservas para huéspedes y dos paneles internos, uno
para el operador de recepción y otro para la gerencia. Todo funciona sobre una API REST y una
base de datos PostgreSQL real.

**[Ver demo en vivo](https://antonioyurquina.github.io/Hotel-Refugio/)**

## Probalo

Entrá desde **Login** con cualquiera de estos usuarios. La contraseña de todos es `demo1234`.

| Rol | Email | Qué vas a ver |
|---|---|---|
| Cliente | `lucia.fernandez@example.com` | Mi Panel: sus reservas y habitaciones recomendadas |
| Operador | `operador@hotelrefugio.example` | Calendario, rack de reservas, llegadas y salidas del día, mapa de habitaciones |
| Administrador | `admin@hotelrefugio.example` | Panel de gerencia: ingresos, ocupación, alta y edición de habitaciones |

> Es una base de **demostración pública**: todos los datos son ficticios, cualquiera puede
> modificarlos y se restablecen solos todos los días. No cargues datos reales.

## Qué muestra

- **Sitio público.** Catálogo y carrusel de habitaciones con fotos, y un buscador por fechas y
  cantidad de huéspedes que descarta las habitaciones ya reservadas en ese período. La solicitud
  de reserva calcula noches y total, y se envía por correo (EmailJS).
- **Panel del cliente.** Reservas próximas y pasadas, con recomendaciones de habitaciones libres.
- **Panel del operador.** Calendario de reservas, rack por habitación y día, indicadores de
  ocupación, llegadas, salidas y pendientes, mapa de habitaciones para cambiar su estado, y gestor
  para crear, editar y cancelar reservas.
- **Panel de gerencia.** Ingresos, estadía y tarifa promedio, gráfico de ingresos, estado de las
  habitaciones y ABM de habitaciones, reservas y usuarios.

## Cómo está armado

```
React + Vite  ──REST──▶  Supabase (PostgREST)  ──▶  PostgreSQL
(GitHub Pages)
```

El sitio es estático y habla directo con la API REST que Supabase genera sobre la base. Las
reglas viven en la base, no en la interfaz:

- **Integridad.** Una restricción de exclusión sobre rangos de fechas impide que dos reservas
  activas se pisen en la misma habitación, aunque falle la validación de la pantalla. El día de
  salida queda libre para la siguiente entrada. También hay `CHECK` en estados, capacidades y
  fechas, y claves foráneas con borrado en cascada.
- **Seguridad por filas (RLS).** La tabla de usuarios no es legible desde la API: se expone una
  vista sin el hash de la contraseña. El login lo resuelve una función en el servidor que
  verifica con bcrypt y nunca devuelve el hash.
- **Datos de ejemplo vivos.** `reset_demo()` vuelve a cargar usuarios, habitaciones y reservas
  con fechas calculadas respecto de hoy, así el panel siempre tiene llegadas, salidas y
  estadías en curso.

El esquema completo está en [`supabase/schema.sql`](supabase/schema.sql).

## Correrlo en local

```bash
npm install
npm run dev
```

El archivo `.env` apunta a la base de demostración (la URL y la clave pública `anon` son
públicas por diseño; la protección real es RLS). Para usar tu propia base:

1. Crear un proyecto gratuito en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pegar y ejecutar [`supabase/schema.sql`](supabase/schema.sql).
3. En **Project Settings → API**, copiar la URL y la clave pública a un archivo `.env.local`:

   ```
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-publica
   ```

Para generar el build: `npm run build`.

## Stack

`React 18` `Vite` `React Router` `Bootstrap 5` `Chart.js` `React Big Calendar` `date-fns`
`EmailJS` `PostgreSQL` `Supabase`

## Notas

- El alta, la edición y la baja de **usuarios** se simulan en el navegador a propósito, para que
  ningún dato personal real llegue a una base pública. Habitaciones y reservas sí se guardan.
- Las fotos de las habitaciones son de [Unsplash](https://unsplash.com) (Unsplash License) y
  están incluidas en el repositorio, por lo que el sitio no depende de servicios externos.
- Nació como trabajo integrador de Lenguajes IV (UCASAL), con una API provista por la cátedra.
  Esa API dejó de existir y se reemplazó por esta base propia. El informe técnico original se
  conserva en [`docs/`](docs/informe-tecnico-original.md).
