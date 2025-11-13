# Hotel Refugio — Aplicación Frontend

Este proyecto es una aplicación web para la gestión de un hotel, desarrollada con React y Vite.

**Página Desplegada:** [https://AntonioYurquina.github.io/Hotel-Refugio](https://AntonioYurquina.github.io/Hotel-Refugio)

## Cómo Copiar el Repositorio en tu Teléfono

### Opción 1: Android

1.  **Usar Termux (Terminal Linux):**
    -   Instala [Termux](https://f-droid.org/en/packages/com.termux/) desde F-Droid
    -   Abre Termux y ejecuta:
        ```bash
        pkg update && pkg upgrade
        pkg install git nodejs
        git clone https://github.com/AntonioYurquina/Hotel-Refugio.git
        cd Hotel-Refugio
        npm install
        npm run dev
        ```

2.  **Usar una App de Git (más fácil):**
    -   Instala **MGit** o **GitNex** desde Play Store o F-Droid
    -   Abre la app y selecciona "Clonar repositorio"
    -   Pega la URL: `https://github.com/AntonioYurquina/Hotel-Refugio.git`
    -   La app descargará el repositorio en tu teléfono

### Opción 2: iOS

1.  **Usar Working Copy:**
    -   Instala [Working Copy](https://workingcopyapp.com/) desde App Store
    -   Abre la app y toca el botón "+"
    -   Selecciona "Clone repository"
    -   Pega la URL: `https://github.com/AntonioYurquina/Hotel-Refugio.git`
    -   La app clonará el repositorio

2.  **Usar GitHub Mobile:**
    -   Instala la app oficial de GitHub
    -   Busca el repositorio `AntonioYurquina/Hotel-Refugio`
    -   Puedes ver el código pero no ejecutarlo directamente

### Nota Importante
Para ejecutar la aplicación en tu teléfono necesitas un entorno de desarrollo (Node.js). Termux en Android es la opción más completa. En iOS, necesitarías servicios en la nube como GitHub Codespaces o usar la versión desplegada: [https://AntonioYurquina.github.io/Hotel-Refugio](https://AntonioYurquina.github.io/Hotel-Refugio)

## Instalación y Ejecución

1.  **Instalar dependencias:**
   npm install

2.  **Levantar en desarrollo:**
   npm run dev

3.  **Build:**
   npm run build

La app es una base para el TP: contiene la especificación y demo de 2 APIs (Unsplash y GitHub). Completar backend, BD y funcionalidades según enunciado.

## Credenciales de Acceso

Para acceder a los paneles de gestión, utiliza los botones en la barra de navegación e introduce la clave correspondiente:

-   **Panel de Operador:**
    -   **Botón:** `Operador`
    -   **Contraseña:** `admin2025`

-   **Panel de Administrador:**
    -   **Botón:** `Admin`
    -   **Contraseña:** `superadmin2026`
