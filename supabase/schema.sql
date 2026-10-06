-- ============================================================================
-- Hotel Refugio · base de datos de demostración (PostgreSQL / Supabase)
--
-- Pegar este archivo completo en el SQL Editor de Supabase y ejecutarlo.
-- Es idempotente: se puede volver a correr sin romper nada.
--
-- Qué crea:
--   · tablas  usuarios, habitaciones, reservas (con restricciones reales)
--   · RLS     la API pública (anon) solo toca lo que la demo necesita
--   · login() verificación de contraseña en el servidor (bcrypt)
--   · reset_demo()  restablece los datos de ejemplo, con fechas relativas a hoy
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

-- ----------------------------------------------------------------------------
-- Tablas
-- ----------------------------------------------------------------------------

create table if not exists public.usuarios (
  id_usuario     integer generated always as identity primary key,
  nombre         text        not null check (char_length(nombre)   between 1 and 60),
  apellido       text        not null check (char_length(apellido) between 1 and 60),
  email          text        not null unique check (email ~* '^\S+@\S+\.\S+$'),
  password_hash  text        not null,
  telefono       text        check (char_length(telefono) <= 30),
  tipo_usuario   text        not null default 'cliente'
                             check (tipo_usuario in ('cliente', 'operador', 'admin')),
  fecha_registro timestamptz not null default now()
);

create table if not exists public.habitaciones (
  id_habitacion  integer generated always as identity primary key,
  numero         text          not null unique check (char_length(numero) between 1 and 10),
  tipo           text          not null check (char_length(tipo) between 1 and 40),
  capacidad      integer       not null check (capacidad between 1 and 12),
  precio_noche   numeric(10,2) not null check (precio_noche >= 0),
  descripcion    text          check (char_length(descripcion) <= 400),
  estado         text          not null default 'disponible'
                               check (estado in ('disponible', 'ocupada', 'mantenimiento', 'cerrada')),
  fecha_creacion timestamptz   not null default now()
);

create table if not exists public.reservas (
  id_reserva     integer generated always as identity primary key,
  id_usuario     integer     not null references public.usuarios (id_usuario)       on delete cascade,
  id_habitacion  integer     not null references public.habitaciones (id_habitacion) on delete cascade,
  fecha_inicio   date        not null,
  fecha_fin      date        not null,
  estado         text        not null default 'pendiente'
                             check (estado in ('pendiente', 'confirmada', 'cancelada', 'finalizada')),
  fecha_creacion timestamptz not null default now(),
  constraint reservas_fechas_validas check (fecha_fin > fecha_inicio),
  -- Una habitación no puede tener dos reservas activas que se pisen en fechas.
  -- El día de salida queda libre para la próxima entrada: rango [inicio, fin).
  constraint reservas_sin_solape exclude using gist (
    id_habitacion with =,
    daterange(fecha_inicio, fecha_fin, '[)') with &&
  ) where (estado in ('pendiente', 'confirmada'))
);

create index if not exists reservas_usuario_idx    on public.reservas (id_usuario);
create index if not exists reservas_habitacion_idx on public.reservas (id_habitacion);

-- ----------------------------------------------------------------------------
-- Vista pública de usuarios: todo menos el hash de la contraseña.
-- La tabla base no es legible desde la API.
-- ----------------------------------------------------------------------------

create or replace view public.usuarios_publico as
  select id_usuario, nombre, apellido, email, telefono, tipo_usuario, fecha_registro
  from public.usuarios;

-- ----------------------------------------------------------------------------
-- Seguridad (RLS)
--
-- Es una base de DEMOSTRACIÓN: la clave pública (anon) viaja dentro del sitio,
-- así que cualquiera puede leer y modificar habitaciones y reservas. Por eso
-- reset_demo() restablece todo cada día. Los usuarios son ficticios y nunca se
-- escriben desde la web; las contraseñas se verifican solo en login().
-- ----------------------------------------------------------------------------

alter table public.usuarios     enable row level security;
alter table public.habitaciones enable row level security;
alter table public.reservas     enable row level security;

revoke all on public.usuarios, public.habitaciones, public.reservas, public.usuarios_publico
  from anon, authenticated;

grant select, insert, update, delete on public.habitaciones, public.reservas to anon, authenticated;
grant select on public.usuarios_publico to anon, authenticated;

drop policy if exists habitaciones_demo on public.habitaciones;
create policy habitaciones_demo on public.habitaciones
  for all to anon, authenticated using (true) with check (true);

drop policy if exists reservas_demo on public.reservas;
create policy reservas_demo on public.reservas
  for all to anon, authenticated using (true) with check (true);

-- usuarios: RLS activa y ninguna policy para anon → la tabla base queda cerrada.

-- ----------------------------------------------------------------------------
-- login(): verifica la contraseña en el servidor y devuelve el usuario sin hash
-- ----------------------------------------------------------------------------

create or replace function public.login(p_email text, p_contrasena text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  u public.usuarios;
begin
  select * into u from public.usuarios where lower(email) = lower(trim(p_email));

  if not found or u.password_hash <> crypt(p_contrasena, u.password_hash) then
    return jsonb_build_object('ok', false, 'mensaje', 'Credenciales incorrectas');
  end if;

  return jsonb_build_object(
    'ok', true,
    'datos', jsonb_build_object(
      'id_usuario',   u.id_usuario,
      'nombre',       u.nombre,
      'apellido',     u.apellido,
      'email',        u.email,
      'telefono',     u.telefono,
      'tipo_usuario', u.tipo_usuario
    )
  );
end;
$$;

revoke all on function public.login(text, text) from public;
grant execute on function public.login(text, text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- reset_demo(): borra todo y vuelve a cargar los datos de ejemplo.
-- Las reservas se calculan respecto de HOY, así el panel del operador siempre
-- tiene llegadas, salidas y estadías en curso.
--
-- Usuarios de demostración (contraseña de todos: demo1234)
--   admin@hotelrefugio.example      → panel de administración
--   operador@hotelrefugio.example   → panel de operador
--   lucia.fernandez@example.com     → cliente
-- ----------------------------------------------------------------------------

create or replace function public.reset_demo()
returns void
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  hoy  constant date := current_date;
  clave constant text := crypt('demo1234', gen_salt('bf'));
begin
  truncate public.reservas, public.habitaciones, public.usuarios restart identity cascade;

  insert into public.usuarios (nombre, apellido, email, password_hash, telefono, tipo_usuario) values
    ('Joaquín',   'Medina',    'admin@hotelrefugio.example',     clave, '+54 387 555-0100', 'admin'),
    ('Camila',    'Torres',    'operador@hotelrefugio.example',  clave, '+54 387 555-0101', 'operador'),
    ('Lucía',     'Fernández', 'lucia.fernandez@example.com',    clave, '+54 387 555-0102', 'cliente'),
    ('Mateo',     'Gómez',     'mateo.gomez@example.com',        clave, '+54 387 555-0103', 'cliente'),
    ('Sofía',     'Herrera',   'sofia.herrera@example.com',      clave, '+54 387 555-0104', 'cliente'),
    ('Tomás',     'Aguirre',   'tomas.aguirre@example.com',      clave, '+54 387 555-0105', 'cliente'),
    ('Valentina', 'Ríos',      'valentina.rios@example.com',     clave, '+54 387 555-0106', 'cliente'),
    ('Nicolás',   'Paz',       'nicolas.paz@example.com',        clave, '+54 387 555-0107', 'cliente');

  -- ids 1..12, en este orden
  insert into public.habitaciones (numero, tipo, capacidad, precio_noche, descripcion, estado) values
    ('101', 'Simple',   1,  45000, 'Cama individual, escritorio y baño privado. Ideal para viajes de trabajo.', 'disponible'),
    ('102', 'Simple',   1,  45000, 'Cama individual con vista al jardín y desayuno incluido.',                  'disponible'),
    ('103', 'Simple',   1,  45000, 'Cama individual, climatización y Wi-Fi de alta velocidad.',                 'ocupada'),
    ('104', 'Simple',   1,  45000, 'Cama individual. Cerrada por renovación del baño.',                         'mantenimiento'),
    ('201', 'Doble',    2,  68000, 'Cama matrimonial, balcón y baño con ducha de lluvia.',                      'disponible'),
    ('202', 'Doble',    2,  68000, 'Dos camas twin, escritorio y vista a la montaña.',                          'ocupada'),
    ('203', 'Doble',    3,  72000, 'Cama matrimonial más cama adicional. Ideal para tres huéspedes.',           'disponible'),
    ('204', 'Doble',    2,  68000, 'Cama matrimonial, silenciosa, en el ala del jardín.',                       'disponible'),
    ('301', 'Familiar', 4,  95000, 'Dos ambientes, dos camas dobles y sala de estar.',                          'disponible'),
    ('302', 'Familiar', 5, 110000, 'Dos ambientes con cuna disponible, kitchenette y balcón.',                  'ocupada'),
    ('401', 'Suite',    2, 150000, 'Suite con sala, bañera de hidromasaje y vista panorámica.',                 'disponible'),
    ('402', 'Suite',    3, 185000, 'Suite premium con terraza privada. Cerrada temporalmente.',                 'cerrada');

  -- Historial de estadías finalizadas (alimenta los gráficos de ingresos)
  insert into public.reservas (id_usuario, id_habitacion, fecha_inicio, fecha_fin, estado)
  select u, h, hoy + d, hoy + d + n, 'finalizada'
  from (values
    (3,  5, -95, 3), (4, 11, -92, 4), (5,  9, -88, 5), (6,  1, -80, 2),
    (7,  6, -77, 3), (8, 12, -70, 4), (3,  7, -64, 2), (4,  2, -58, 3),
    (5, 10, -52, 6), (6, 11, -47, 3), (7,  5, -41, 4), (8,  8, -35, 2),
    (3,  9, -29, 5), (4, 12, -24, 3), (5,  1, -18, 2), (6,  6, -14, 3),
    (7, 11, -10, 4), (8,  7,  -8, 2)
  ) as t (u, h, d, n);

  -- Estadías en curso, llegada y salida de hoy, y reservas futuras
  insert into public.reservas (id_usuario, id_habitacion, fecha_inicio, fecha_fin, estado) values
    (4,  3, hoy - 2,  hoy + 1,  'confirmada'),   -- en casa (103)
    (5,  6, hoy - 1,  hoy + 3,  'confirmada'),   -- en casa (202)
    (3, 10, hoy - 3,  hoy + 2,  'confirmada'),   -- en casa (302)
    (6,  5, hoy,      hoy + 3,  'confirmada'),   -- llega hoy (201)
    (7,  9, hoy - 4,  hoy,      'confirmada'),   -- se va hoy (301)
    (7,  2, hoy + 1,  hoy + 3,  'confirmada'),
    (6,  1, hoy + 2,  hoy + 4,  'pendiente'),
    (8, 11, hoy + 5,  hoy + 9,  'confirmada'),
    (3,  7, hoy + 7,  hoy + 10, 'pendiente'),
    (5,  9, hoy + 10, hoy + 14, 'pendiente'),
    (4,  8, hoy + 12, hoy + 15, 'confirmada'),
    (8,  5, hoy + 6,  hoy + 8,  'cancelada');
end;
$$;

revoke all on function public.reset_demo() from public;
grant execute on function public.reset_demo() to anon, authenticated;

-- Carga inicial
select public.reset_demo();

-- ----------------------------------------------------------------------------
-- Opcional: restablecer cada noche desde la propia base.
-- Requiere habilitar la extensión pg_cron (Database → Extensions).
--
--   select cron.schedule('reset-demo-hotel-refugio', '0 6 * * *', $$select public.reset_demo()$$);
-- ----------------------------------------------------------------------------
