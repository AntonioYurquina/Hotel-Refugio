# Hotel Refugio (React + Vite)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### [Instrucciones básicas de uso](file:///home/tony/GITHUB/vault/TONY/Hotel-Refugio/README.md)

1. Instalar dependencias:
   npm install

2. Levantar en desarrollo:
   npm run dev

3. Build:
   npm run build

La app es una base para el TP: contiene la especificación y demo de 2 APIs (Unsplash y GitHub). Completar backend, BD y funcionalidades según enunciado.

### [README.md](file:///home/tony/GITHUB/vault/TONY/Hotel-Refugio/README.md)
Instrucciones para correr el proyecto.

Notas:
- Las reservas y estado de habitaciones se almacenan en localStorage (hr_reservations, hr_rooms).
- Imagenes: Unsplash (source.unsplash.com). Formas reales de envío de mail y procesamiento de pagos deben integrarse con APIs/Backend.

## Credenciales de Acceso

Para acceder a los paneles de gestión, utiliza los botones en la barra de navegación e introduce la clave correspondiente:

-   **Panel de Operador:**
    -   **Botón:** `Operador`
    -   **Contraseña:** `admin2025`

-   **Panel de Administrador:**
    -   **Botón:** `Admin`
    -   **Contraseña:** `superadmin2026`
