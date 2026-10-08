# Hotel Refugio

Sistema de gestión hotelero (proyecto de la facultad) hecho con React y Vite. Tiene tres frentes:

- **Sitio público:** habitaciones con galería, reservas y contacto.
- **Panel de operador:** calendario de reservas, rack, mapa de habitaciones y estadísticas.
- **Panel de administración:** ingresos, ocupación, estadía promedio y gestión de usuarios, habitaciones y reservas.

**Demo:** https://AntonioYurquina.github.io/Hotel-Refugio

## Demo con datos ficticios

El servidor original ya no está en línea, así que la demo funciona sin backend: una API simulada en memoria
(`src/demo/`) responde a las mismas rutas que el servidor real y carga habitaciones, usuarios y reservas
ficticias. Los cambios que hagas (crear una reserva, cambiar el estado de una habitación) se mantienen hasta
recargar la página. Las fechas se calculan respecto del día actual, y si una reserva choca con otra en la misma
habitación se rechaza.

Desde el ingreso hay un acceso de un clic por rol. También podés usar estas cuentas con la contraseña `demo`:

| Rol           | Email                  |
| ------------- | ---------------------- |
| Cliente       | `cliente@example.com`  |
| Operador      | `operador@example.com` |
| Administrador | `admin@example.com`    |

## Instalación y ejecución

```bash
npm install
npm run dev      # desarrollo
npm run build    # build de producción
npm run deploy   # publica en GitHub Pages
```

Por defecto la app corre en modo demo. Para usar un backend propio, definí `VITE_API_URL` (por ejemplo en un
archivo `.env`) con la URL base de la API; el modo demo se desactiva solo.

## Tecnologías

React 18, Vite, React Router, Bootstrap 5, Chart.js, React Big Calendar y date-fns.
