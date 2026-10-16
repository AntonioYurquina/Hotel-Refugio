# Hotel Refugio

Sistema de gestión hotelero (proyecto de la facultad) hecho con React y Vite. Tiene tres frentes:

- **Sitio público:** habitaciones con galería y portal de reservas con búsqueda por fechas.
- **Panel de operador:** calendario, rack de 30 días, mapa de habitaciones, gestor de reservas y estadísticas.
- **Panel de gerencia:** ingresos, ocupación, estadía promedio, alta de habitaciones y usuarios, y todas las reservas.

**Demo:** https://AntonioYurquina.github.io/Hotel-Refugio

## Dos modos de funcionamiento

La aplicación habla con la **API Hotel v1** (contrato en `docs/INFORME_PMBOK.md`, sección 3.2) y puede correr de dos formas:

| Modo | Cuándo | Datos |
| ---- | ------ | ----- |
| **Demo** (por defecto) | sin `VITE_API_URL` | API simulada en memoria (`src/demo/`) con el mismo contrato que la real: versiones, 409, enums, fechas ISO. Los cambios duran hasta recargar. |
| **API real** | con `VITE_API_URL` | El servidor de la API. El modo demo se desactiva solo. |

Para usar la API real copiá `.env.example` a `.env.local` y completá la URL base.

En modo demo hay un acceso de un clic por rol y un botón **«Simular cambio de otro usuario»** que muestra en vivo el control de concurrencia: la siguiente escritura recibe un `409`, la app recarga los datos y avisa. También podés usar las cuentas `cliente@example.com`, `operador@example.com` y `admin@example.com` con la contraseña `demo`.

## Instalación y ejecución

```bash
npm install
npm run dev        # desarrollo (modo demo, o API real si hay .env.local)
npm run build      # build de producción
npm run lint       # ESLint, sin advertencias
npm test           # pruebas unitarias (Vitest)
npm run deploy     # publica en GitHub Pages
```

Pruebas contra la API real (solo lectura y respuestas 409 a propósito):

```bash
VITE_API_URL=<url base> npm test
VITE_API_URL=<url base> VITE_API_REAL_ESCRIBIR=1 npm test   # además crea y elimina una reserva de prueba
```

## Estructura

```
src/api/        cliente de la API (ErrorApi, un método por ruta)
src/demo/       API simulada y datos ficticios
src/hooks/      useHotel: estado, versiones de tabla y escrituras con manejo de 409
src/utils/      fechas (zona Argentina), validaciones, reglas de reservas, estadísticas
src/components/ui/  Modal accesible, confirmación, insignias, pantallas de carga/error
src/pages/      sitio público, panel de operador y de gerencia
```

## Qué permite (y qué no) la API v1

La interfaz se adapta a las operaciones que existen: se pueden **crear habitaciones y cambiar su estado**, **crear, modificar y eliminar reservas**, **iniciar sesión** y **registrar usuarios**. No hay edición ni borrado de habitaciones o usuarios, ni listado de usuarios (`GET /usuarios` es una ruta de test que expone contraseñas y no se usa contra la API real). La API tampoco valida solapamientos de reservas ni el orden de las fechas: lo hace el frontend (`src/utils/reservas.js`).

## Servicios externos

- **Open-Meteo:** pronóstico del clima de Salta en el inicio (gratuito, sin clave; si falla, la sección se oculta).
- **Google Maps:** mapa embebido y enlace «Cómo llegar».
- **EmailJS:** formulario de contacto y soporte del operador.

## Tecnologías

React 18, Vite, React Router, Bootstrap 5, Chart.js, React Big Calendar, date-fns y Vitest.
