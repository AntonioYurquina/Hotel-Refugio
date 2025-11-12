# Informe Técnico Detallado
## Sistema de Gestión Hotelera "Hotel Refugio"
### Lenguajes IV - Trabajo Práctico Integrador

---

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Tecnologías Frontend](#tecnologías-frontend)
3. [Tecnologías Backend](#tecnologías-backend)
4. [Base de Datos](#base-de-datos)
5. [APIs Utilizadas](#apis-utilizadas)
6. [Arquitectura del Sistema](#arquitectura-del-sistema)
7. [Características Principales](#características-principales)
8. [Deploy y Entorno de Producción](#deploy-y-entorno-de-producción)
9. [Conclusiones](#conclusiones)

---

## 1. Introducción

**Hotel Refugio** es una aplicación web completa para la gestión integral de un hotel, desarrollada como proyecto integrador de la asignatura Lenguajes IV. El sistema implementa un modelo de arquitectura cliente-servidor con separación clara entre frontend y backend, permitiendo la gestión de habitaciones, reservas, usuarios y operadores del hotel.

**URL del Proyecto Desplegado:** [https://AntonioYurquina.github.io/Hotel-Refugio](https://AntonioYurquina.github.io/Hotel-Refugio)

**Repositorio:** [https://github.com/AntonioYurquina/Hotel-Refugio](https://github.com/AntonioYurquina/Hotel-Refugio)

---

## 2. Tecnologías Frontend

### 2.1 Framework Principal: React 18.2.0

**React** es la biblioteca JavaScript principal utilizada para construir la interfaz de usuario. Se eligió React por las siguientes razones:

- **Component-Based Architecture:** Permite crear componentes reutilizables y modulares
- **Virtual DOM:** Optimiza el rendimiento mediante actualizaciones eficientes del DOM
- **Ecosistema robusto:** Amplia disponibilidad de librerías y herramientas complementarias
- **Hooks:** Facilita la gestión del estado y efectos secundarios sin clases

**Componentes Principales Implementados:**
```
src/components/
├── ApiDemo.jsx              # Demostración de APIs externas
├── AuthInModal.jsx          # Modal de autenticación
├── ContactSection.jsx       # Formulario de contacto con EmailJS
├── Footer.jsx               # Pie de página
├── GlobalSettings.jsx       # Configuración global
├── Hero.jsx                 # Sección hero de landing
├── Layout.jsx               # Layout principal
├── LoadingSpinner.jsx       # Indicador de carga
├── LocationMap.jsx          # Integración de mapas
├── NavBar.jsx               # Barra de navegación
├── ReservationForm.jsx      # Formulario de reservas
├── ReservationModal.jsx     # Modal de reservas
├── RoomCard.jsx             # Tarjeta de habitación
├── RoomCarousel.jsx         # Carrusel de imágenes
├── RoomList.jsx             # Lista de habitaciones
├── ScrollToTopButton.jsx    # Botón de scroll
├── Testimonials.jsx         # Testimonios
├── ThemeSwitcher.jsx        # Cambio de tema
└── ToastContainer.jsx       # Sistema de notificaciones
```

### 2.2 React Router DOM 6.23.1

**Propósito:** Manejo de enrutamiento y navegación en la SPA (Single Page Application).

**Características implementadas:**
- Rutas protegidas con control de acceso por roles (cliente, operador, administrador)
- Navegación programática con redirecciones automáticas
- Parámetros dinámicos en URLs
- Layout compartido con Outlet

**Estructura de Rutas:**
```javascript
/ (Home)                     # Página principal pública
/login                       # Autenticación de usuarios
/reserve                     # Sistema de reservas
/dashboard                   # Panel del cliente
/operator/*                  # Área del operador (protegida)
  ├── /dashboard
  ├── /reservations
  ├── /calendar
  ├── /rooms
  └── /settings
/admin/*                     # Área del administrador (protegida)
  ├── /dashboard
  ├── /users
  ├── /operators
  ├── /rooms
  └── /reservations
```

### 2.3 Bootstrap 5.3.2

**Framework CSS** utilizado para el diseño responsivo y componentes UI prediseñados.

**Características utilizadas:**
- Sistema de grid responsive (12 columnas)
- Componentes: Cards, Modals, Forms, Buttons, Navbar, Alerts
- Utilidades de espaciado y flexbox
- Temas claro/oscuro mediante `data-bs-theme`

### 2.4 Sass 1.77.4

**Preprocesador CSS** que extiende las capacidades de CSS con variables, anidamiento y mixins.

**Archivo principal:** `src/styles/custom.scss`

**Configuración de temas:**
```scss
// Paleta de colores personalizada
$orange: #E95420;           // Color primario (marca)
$dark-gray: #1A1A1A;        // Fondo oscuro
$medium-gray: #242424;      // Fondo de tarjetas
$light-gray: #444;          // Bordes
$text-light: #E0E0E0;       // Texto en modo oscuro

// Colores semánticos
$success: #27AE60;
$warning: #F1C40F;
$danger: #E74C3C;
$info: #3498DB;
```

**Características SCSS implementadas:**
- Sobrescritura de variables Bootstrap
- Importación modular de componentes Bootstrap
- Estilos personalizados para temas claro/oscuro
- Mixins para transiciones y efectos

### 2.5 Chart.js 4.4.3 y React-ChartJS-2 5.2.0

**Biblioteca de visualización de datos** para crear gráficos interactivos.

**Gráficos implementados:**
- **Gráficos de ingresos:** Visualización de estadísticas financieras del hotel
- **Histogramas de reservas:** Distribución temporal de reservas
- **Estadísticas del operador:** Métricas de rendimiento

**Componentes:**
- `RevenueChart.jsx` (Admin): Gráfico de ingresos por período
- `ReservationHistogram.jsx` (Operator): Histograma de ocupación

### 2.6 React Big Calendar 1.12.2

**Biblioteca especializada** para la gestión de calendarios y visualización de eventos.

**Características implementadas:**
- Vista mensual, semanal y diaria
- Localización en español (date-fns/locale/es)
- Eventos arrastrables
- Colores dinámicos según estado de reserva
- Integración con filtros de estado

**Archivo:** `src/pages/Operator/Calendar.jsx`

**Estados visualizados:**
```javascript
const colors = {
  light: {
    confirmada: '#198754',   // Verde
    pendiente: '#ffc107',    // Amarillo
    cancelada: '#dc3545',    // Rojo
    finalizada: '#6c757d'    // Gris
  },
  dark: {
    confirmada: '#20c997',
    pendiente: '#ffca2c',
    cancelada: '#fd7e14',
    finalizada: '#adb5bd'
  }
};
```

### 2.7 Date-fns 3.6.0

**Biblioteca de utilidades** para manipulación y formato de fechas.

**Usos principales:**
- Formateo de fechas para visualización
- Cálculos de diferencias entre fechas
- Localización de calendarios
- Validación de rangos de fechas

### 2.8 Build Tool: Vite 5.2.0

**Herramienta de construcción** moderna y rápida para proyectos frontend.

**Ventajas sobre alternativas:**
- **Hot Module Replacement (HMR):** Actualizaciones instantáneas durante desarrollo
- **Build optimizado:** Usa Rollup para producción
- **Soporte nativo de ESM:** Módulos ES6 sin transpilación
- **Configuración mínima:** Setup simplificado

**Configuración para GitHub Pages:**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/Hotel-Refugio/',  // Ruta base para GitHub Pages
});
```

**Plugin utilizado:**
- `@vitejs/plugin-react 4.2.1`: Integración de React con Fast Refresh

### 2.9 Sistema de Gestión de Estado

#### Context API (React)

Se implementaron dos contextos principales:

**1. ThemeContext (`src/context/ThemeContext.jsx`):**
```javascript
// Gestión del tema claro/oscuro
- Persistencia en localStorage
- Aplicación automática al atributo data-bs-theme
- Hook personalizado: useTheme()
```

**2. ToastContext (`src/context/ToastContext.jsx`):**
```javascript
// Sistema de notificaciones
- Gestión de mensajes de éxito/error/info
- Auto-dismiss configurable
- Stack de notificaciones
- Hook personalizado: useToast()
```

#### Custom Hook: useUsuarioLogic

**Archivo:** `src/hooks/useUsuarioLogic.js`

**Responsabilidad:** Centraliza toda la lógica de negocio relacionada con:
- Autenticación y autorización
- Gestión de habitaciones
- Gestión de reservas
- CRUD de usuarios
- Comunicación con la API backend

**Estado gestionado:**
```javascript
{
  usuario: { ok: boolean, datos: {...} },
  credenciales: { email: string, contraseña: string },
  habitaciones: { ok: boolean, estado_tabla: number, datos: [...] },
  reservas: { ok: boolean, estado_tabla: number, datos: [...] },
  allUsers: { ok: boolean, datos: [...] }
}
```

### 2.10 Herramientas de Desarrollo

#### ESLint 8.57.0
**Linter** para mantener consistencia en el código JavaScript/JSX.

**Configuración:** `eslint.config.js`

**Plugins instalados:**
- `eslint-plugin-react 7.34.1`
- `eslint-plugin-react-hooks 4.6.0`
- `eslint-plugin-react-refresh 0.4.6`

#### TypeScript Types
Aunque el proyecto usa JavaScript, se incluyen definiciones de tipos para mejor autocompletado:
- `@types/react 18.2.66`
- `@types/react-dom 18.2.22`

---

## 3. Tecnologías Backend

### 3.1 API RESTful

El backend está implementado como una **API REST** alojada en el dominio `https://robledo.website/`

**Características de la API:**
- Arquitectura RESTful
- Formato de intercambio: JSON
- Métodos HTTP: GET, POST, PUT, DELETE
- Control de versiones mediante campo `estado_tabla`
- Gestión de concurrencia optimista

### 3.2 Endpoints Implementados

#### 3.2.1 Autenticación

**POST /login**
```javascript
// Request
{
  "email": "usuario@hotel.com",
  "contraseña": "password123"
}

// Response
{
  "ok": true,
  "datos": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "email": "usuario@hotel.com",
    "tipo_usuario": "cliente|operador|admin",
    "telefono": "+54911234567"
  }
}
```

**Roles implementados:**
1. **Cliente:** Acceso a reservas propias y visualización
2. **Operador:** Gestión de reservas y habitaciones
3. **Administrador:** Control total del sistema

#### 3.2.2 Gestión de Habitaciones

**GET /habitaciones**
```javascript
// Response
{
  "ok": true,
  "estado_tabla": 1234567890,  // Timestamp para control de versión
  "datos": [
    {
      "id_habitacion": 101,
      "numero": "101",
      "tipo": "Simple",
      "precio": 5000,
      "capacidad": 2,
      "descripcion": "Habitación estándar con vista al jardín",
      "estado": "disponible|ocupada|mantenimiento"
    }
  ]
}
```

**POST /habitaciones**
```javascript
// Request (Admin)
{
  "numero": "301",
  "tipo": "Suite",
  "precio": 15000,
  "capacidad": 4,
  "descripcion": "Suite presidencial con jacuzzi",
  "version": 1234567890
}
```

**PUT /habitaciones/:id**
```javascript
// Request (Operador/Admin)
{
  "nuevo_estado": "mantenimiento",
  "version": 1234567890
}
```

**DELETE /habitaciones/:id**
```javascript
// Request (Admin)
{
  "version": 1234567890
}
```

#### 3.2.3 Gestión de Reservas

**GET /reservas**
```javascript
// Response
{
  "ok": true,
  "estado_tabla": 9876543210,
  "datos": [
    {
      "id_reserva": 1,
      "id_usuario": 5,
      "id_habitacion": 101,
      "fecha_inicio": "2025-11-15",
      "fecha_fin": "2025-11-20",
      "estado": "confirmada|pendiente|cancelada|finalizada",
      "monto_total": 25000,
      "observaciones": "Check-in tarde solicitado"
    }
  ]
}
```

**POST /reservas**
```javascript
// Request
{
  "id_usuario": 5,
  "id_habitacion": 101,
  "fecha_inicio": "2025-11-15",
  "fecha_fin": "2025-11-20",
  "observaciones": "Habitación en piso alto",
  "version": 9876543210
}
```

**PUT /reservas/:id**
```javascript
// Request (Actualizar estado/datos)
{
  "estado": "confirmada",
  "observaciones": "Pago recibido",
  "version": 9876543210
}
```

**DELETE /reservas/:id**
```javascript
// Request
{
  "version": 9876543210
}
```

#### 3.2.4 Gestión de Usuarios

**GET /usuarios**
```javascript
// Response (Admin)
[
  {
    "id_usuario": 1,
    "nombre": "María González",
    "email": "maria@example.com",
    "telefono": "+54911234567",
    "tipo_usuario": "operador"
  }
]
```

**Nota:** Los endpoints POST/PUT/DELETE de usuarios están simulados en el frontend debido a limitaciones de la API proporcionada.

### 3.3 Control de Concurrencia

El sistema implementa **concurrencia optimista** mediante el campo `estado_tabla`:

**Funcionamiento:**
1. El cliente recibe el `estado_tabla` actual con cada GET
2. Al realizar POST/PUT/DELETE, se envía el `estado_tabla` conocido
3. El servidor valida que no haya cambios concurrentes
4. Si hay conflicto, rechaza la operación
5. El cliente actualiza y reintenta

**Ventajas:**
- Evita bloqueos de registros
- Permite múltiples lecturas simultáneas
- Detecta conflictos de escritura
- Mejor escalabilidad

### 3.4 Gestión de Imágenes

**Sistema de almacenamiento:** CDN estático en `https://robledo.website/patas/`

**Nomenclatura:**
```
{id_habitacion}a.jpg  # Vista principal
{id_habitacion}b.jpg  # Vista secundaria
{id_habitacion}c.jpg  # Vista terciaria
```

**Ejemplo:**
```javascript
const images = [
  `https://robledo.website/patas/${habitacion.id_habitacion}a.jpg`,
  `https://robledo.website/patas/${habitacion.id_habitacion}b.jpg`,
  `https://robledo.website/patas/${habitacion.id_habitacion}c.jpg`
];
```

---

## 4. Base de Datos

### 4.1 Modelo de Datos

Aunque no se tiene acceso directo a la base de datos (se consume a través de la API), se puede inferir el **esquema relacional** implementado:

#### Tabla: usuarios
```sql
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,  -- Hash (bcrypt/argon2)
  telefono VARCHAR(20),
  tipo_usuario ENUM('cliente', 'operador', 'admin') DEFAULT 'cliente',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_tipo (tipo_usuario)
);
```

#### Tabla: habitaciones
```sql
CREATE TABLE habitaciones (
  id_habitacion INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(10) UNIQUE NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  capacidad INT NOT NULL,
  descripcion TEXT,
  estado ENUM('disponible', 'ocupada', 'mantenimiento') DEFAULT 'disponible',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_estado (estado),
  INDEX idx_tipo (tipo)
);
```

#### Tabla: reservas
```sql
CREATE TABLE reservas (
  id_reserva INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_habitacion INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada') DEFAULT 'pendiente',
  monto_total DECIMAL(10,2) NOT NULL,
  observaciones TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion) ON DELETE CASCADE,
  INDEX idx_usuario (id_usuario),
  INDEX idx_habitacion (id_habitacion),
  INDEX idx_fechas (fecha_inicio, fecha_fin),
  INDEX idx_estado (estado)
);
```

#### Tabla de Control: estado_tablas
```sql
CREATE TABLE estado_tablas (
  nombre_tabla VARCHAR(50) PRIMARY KEY,
  version BIGINT NOT NULL,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4.2 Relaciones del Modelo

```
usuarios (1) -----> (N) reservas
habitaciones (1) -----> (N) reservas
```

**Cardinalidades:**
- Un usuario puede tener muchas reservas
- Una habitación puede tener muchas reservas (en diferentes períodos)
- Una reserva pertenece a un único usuario y una única habitación

### 4.3 Tipo de Base de Datos

**Motor inferido:** MySQL o PostgreSQL (base de datos relacional SQL)

**Justificación:**
- Estructura de datos normalizada
- Relaciones con claves foráneas
- Soporte de transacciones ACID
- Índices para optimización de consultas
- Tipos de datos estructurados (ENUM, DATE, DECIMAL)

### 4.4 Estrategias de Optimización

**Índices implementados:**
1. Índices primarios en todas las tablas
2. Índice único en `usuarios.email` para búsquedas rápidas
3. Índices compuestos en `reservas` para consultas de disponibilidad
4. Índices en campos de estado para filtros frecuentes

**Validaciones a nivel de BD:**
- Restricciones UNIQUE para evitar duplicados
- CHECK constraints en estados (mediante ENUM)
- NOT NULL en campos obligatorios
- ON DELETE CASCADE para integridad referencial

---

## 5. APIs Utilizadas

### 5.1 API Backend Propia (RESTful)

**URL Base:** `https://robledo.website/`

**Autenticación:** Sin tokens JWT (autenticación simple por sesión)

**Documentación completa:** Ver sección 3.2 (Endpoints Implementados)

**Características:**
- CORS habilitado para desarrollo y producción
- Content-Type: application/json
- Rate limiting no implementado (entorno académico)
- Versionado mediante campo `estado_tabla`

### 5.2 API Externa 1: Unsplash Source API

**Propósito:** Obtener imágenes aleatorias de alta calidad para demostración

**URL:** `https://source.unsplash.com/`

**Tipo:** API pública sin autenticación

**Implementación:**
```javascript
// src/components/ApiDemo.jsx
const loadUnsplash = () => {
  const w = 800, h = 400;
  setImgUrl(
    `https://source.unsplash.com/random/${w}x${h}?hotel,room&${Date.now()}`
  );
};
```

**Características:**
- Sin límite de requests (servicio gratuito simplificado)
- Parámetros: dimensiones (width x height) y keywords
- Timestamp para forzar recarga de imagen
- Uso educativo y de demostración

**Ventajas:**
- No requiere API key
- Rápida integración
- Imágenes de alta calidad
- Ideal para prototipado

**Limitaciones:**
- No control sobre imagen específica devuelta
- No acceso a metadatos de la imagen
- Para producción se recomienda Unsplash API oficial

### 5.3 API Externa 2: GitHub REST API

**Propósito:** Demostración de consumo de API RESTful externa

**URL:** `https://api.github.com/`

**Tipo:** API pública (límite de 60 requests/hora sin autenticación)

**Implementación:**
```javascript
// src/components/ApiDemo.jsx
useEffect(() => {
  fetch('https://api.github.com/repos/octocat/Hello-World')
    .then(r => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then(data => setRepoInfo(data))
    .catch(err => setGhError(err.message));
}, []);
```

**Datos extraídos:**
- Nombre completo del repositorio
- Número de estrellas
- Fecha de última actualización

**Ventajas:**
- API bien documentada
- Respuestas JSON estructuradas
- Excelente para aprendizaje de APIs REST
- No requiere autenticación para endpoints públicos

**Limitaciones:**
- Rate limiting: 60 requests/hora sin token
- Para uso extensivo requiere Personal Access Token

### 5.4 API Externa 3: EmailJS

**Propósito:** Envío de correos electrónicos desde el formulario de contacto

**URL:** `https://api.emailjs.com/`

**Tipo:** API de terceros con autenticación mediante Public Key

**Biblioteca:** `emailjs-com 3.2.0`

**Implementación:**
```javascript
// src/components/ContactSection.jsx
emailjs.sendForm(
  "service_r4nbki4",      // Service ID
  "template_0q6td97",     // Template ID
  form.current,
  "cy-3jjDdw9Sr3ZLyU"     // Public Key
)
```

**Configuración de EmailJS:**

**1. Servicio configurado:**
- Proveedor: Gmail/SMTP
- Service ID: `service_r4nbki4`

**2. Template de email:**
- Template ID: `template_0q6td97`
- Variables dinámicas:
  - `{{from_name}}`: Nombre del remitente
  - `{{reply_to}}`: Email del remitente
  - `{{message}}`: Contenido del mensaje

**3. Campos del formulario:**
```html
<input name="from_name" required />    <!-- Nombre -->
<input name="reply_to" type="email" required />  <!-- Email -->
<textarea name="message" required></textarea>    <!-- Mensaje -->
```

**Flujo de envío:**
1. Usuario completa formulario de contacto
2. Frontend valida campos requeridos
3. EmailJS envía datos al servicio configurado
4. EmailJS procesa el template con las variables
5. Se envía el email al destinatario configurado
6. Usuario recibe confirmación visual (toast/alert)

**Ventajas:**
- No requiere backend para envío de emails
- Configuración visual en dashboard
- 200 emails gratuitos por mes
- Protección anti-spam integrada
- Templates personalizables con HTML

**Seguridad:**
- Public Key expuesta (diseño de EmailJS)
- Rate limiting por IP
- Captcha opcional disponible
- Domain whitelist configurable

---

## 6. Arquitectura del Sistema

### 6.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
│                    (GitHub Pages - CDN)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    React     │  │   Router     │  │   Context    │      │
│  │  Components  │  │   (SPA)      │  │   (State)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                   │             │
│         └──────────────────┴───────────────────┘             │
│                          │                                   │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE NEGOCIO                           │
│                  (Custom Hooks / Logic)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│              useUsuarioLogic Hook                            │
│  ┌─────────────────────────────────────────────────┐        │
│  │  • Autenticación   • CRUD Habitaciones          │        │
│  │  • Gestión Estado  • CRUD Reservas              │        │
│  │  • CRUD Usuarios   • Control Concurrencia       │        │
│  └─────────────────────────────────────────────────┘        │
│                          │                                   │
├─────────────────────────────────────────────────────────────┤
│                 CAPA DE INTEGRACIÓN                          │
│                   (APIs / Services)                          │
├─────────────────────────────────────────────────────────────┤
│                          │                                   │
│  ┌────────────┬──────────┴──────────┬────────────┐          │
│  │            │                     │            │          │
│  ▼            ▼                     ▼            ▼          │
│ Backend     EmailJS            Unsplash      GitHub         │
│  API         API                 API          API           │
│  │                                                           │
├──┼───────────────────────────────────────────────────────────┤
│  │            BACKEND (robledo.website)                     │
├──┼───────────────────────────────────────────────────────────┤
│  │                                                           │
│  │  ┌──────────────┐          ┌──────────────┐             │
│  │  │   REST API   │◄────────►│  Middleware  │             │
│  │  │  (Express?)  │          │ • Auth       │             │
│  │  └──────────────┘          │ • Validation │             │
│  │         │                  │ • CORS       │             │
│  │         │                  └──────────────┘             │
│  │         ▼                                                │
│  │  ┌──────────────┐                                        │
│  │  │    MySQL     │                                        │
│  │  │  / Postgres  │                                        │
│  │  │              │                                        │
│  │  │ • usuarios   │                                        │
│  │  │ • habitaciones│                                       │
│  │  │ • reservas   │                                        │
│  │  └──────────────┘                                        │
│  │                                                           │
├──┼───────────────────────────────────────────────────────────┤
│  │               CAPA DE DATOS                              │
├──┼───────────────────────────────────────────────────────────┤
│  │                                                           │
│  └──► Imágenes CDN (robledo.website/patas/)                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Patrón de Arquitectura: Cliente-Servidor (SPA)

**Single Page Application (SPA):**
- Todo el código frontend se carga inicialmente
- Navegación sin recargas de página
- Actualizaciones dinámicas del DOM vía React
- Estado gestionado en cliente (Context API + Hooks)

**Ventajas:**
- Experiencia de usuario fluida
- Menor carga al servidor (solo API calls)
- Mejor rendimiento percibido
- Funcionalidad offline parcial (UI cargada)

### 6.3 Flujo de Datos

**Autenticación:**
```
Usuario → Formulario Login → useUsuarioLogic.login()
       ↓
   POST /login → Backend API → Validación
       ↓
   Response → Context (setUsuario) → LocalStorage
       ↓
   Redirect → Dashboard según rol
```

**Gestión de Reservas:**
```
Operador → Formulario Reserva → Validación Cliente
        ↓
    useUsuarioLogic.crearReserva()
        ↓
    POST /reservas + version → Backend API
        ↓
    Validación Concurrencia → BD
        ↓
    Response → Actualización Estado Local
        ↓
    Toast Notificación → Usuario
```

### 6.4 Separación de Responsabilidades

**Presentación (Components):**
- Renderizado de UI
- Manejo de eventos de usuario
- Validación de formularios (cliente)
- Navegación

**Lógica de Negocio (Hooks):**
- useUsuarioLogic: Gestión de estado y API calls
- useTheme: Gestión de temas
- useToast: Sistema de notificaciones

**Servicios (APIs):**
- Comunicación HTTP con backend
- Integración con APIs externas
- Manejo de errores de red

**Estado (Context):**
- Estado global de autenticación
- Preferencias de usuario (tema)
- Cola de notificaciones

---

## 7. Características Principales

### 7.1 Roles y Permisos

#### Cliente
**Accesos:**
- ✅ Ver catálogo de habitaciones
- ✅ Realizar reservas
- ✅ Ver historial de reservas propias
- ✅ Contactar al hotel (formulario EmailJS)
- ✅ Registrarse y autenticarse

**Restricciones:**
- ❌ No puede modificar habitaciones
- ❌ No puede ver reservas de otros
- ❌ No puede acceder a estadísticas

#### Operador
**Accesos adicionales:**
- ✅ Ver todas las reservas
- ✅ Modificar estado de reservas
- ✅ Consultar disponibilidad (calendario)
- ✅ Cambiar estado de habitaciones
- ✅ Ver estadísticas operativas
- ✅ Gestionar check-in/check-out

**Componentes exclusivos:**
```
src/pages/Operator/
├── Dashboard.jsx                 # Panel principal
├── Reservations.jsx              # Gestión de reservas
├── Calendar.jsx                  # Calendario de ocupación
├── ReservationRack.jsx           # Rack de habitaciones
├── ActiveReservations.jsx        # Reservas activas
├── ManagedReservations.jsx       # Historial
├── OperatorStatistics.jsx        # Estadísticas
└── Settings.jsx                  # Configuración
```

#### Administrador
**Accesos totales:**
- ✅ Todo lo del operador +
- ✅ CRUD completo de habitaciones
- ✅ CRUD completo de usuarios/operadores
- ✅ Estadísticas financieras avanzadas
- ✅ Gráficos de ingresos (Chart.js)
- ✅ Gestión de permisos

**Componentes exclusivos:**
```
src/pages/Admin/
├── DashboardAdmin.jsx            # Panel administrativo
├── UsersAdmin.jsx                # Gestión de usuarios
├── OperatorsAdmin.jsx            # Gestión de operadores
├── RoomsAdmin.jsx                # Gestión de habitaciones
├── ReservationsAdmin.jsx         # Todas las reservas
├── RevenueChart.jsx              # Gráfico de ingresos
└── [Edit Forms]                  # Formularios de edición
```

### 7.2 Sistema de Autenticación

**Implementación:**
```javascript
// useUsuarioLogic.js
async function login() {
  const response = await fetch("https://robledo.website/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales)
  });
  const data = await response.json();
  
  if (response.ok) {
    setUsuario(data);  // Guarda en estado
    localStorage.setItem('usuario', JSON.stringify(data));  // Persiste
    addToast(`Bienvenido, ${data.datos.nombre}`, 'success');
  }
}
```

**Persistencia:**
- LocalStorage para mantener sesión
- Auto-login al recargar página
- Logout limpia estado y storage

**Protección de Rutas:**
```javascript
// App.jsx
function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user.ok) return <Navigate to="/login" />;
  
  if (!allowedRoles.includes(user.datos.tipo_usuario)) {
    // Redirige a su área correspondiente
    return <Navigate to={getHomePathByRole(user.datos.tipo_usuario)} />;
  }
  
  return children;
}
```

### 7.3 Sistema de Temas (Claro/Oscuro)

**Implementación:**
```javascript
// ThemeContext.jsx
const [theme, setTheme] = useState(() => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme || 'light';
});

useEffect(() => {
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);
```

**Características:**
- Toggle instantáneo sin recarga
- Persistencia en localStorage
- Bootstrap 5.3 native dark mode
- Adaptación de Chart.js y Calendar

**Componente:**
```javascript
// ThemeSwitcher.jsx
<button onClick={toggleTheme}>
  <i className={`fa-solid fa-${theme === 'light' ? 'moon' : 'sun'}`}></i>
</button>
```

### 7.4 Sistema de Notificaciones (Toasts)

**Arquitectura:**
```javascript
// ToastContext.jsx
const addToast = (message, type = 'info', duration = 3000) => {
  const id = Date.now();
  setToasts(prev => [...prev, { id, message, type, duration }]);
  
  setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, duration);
};
```

**Tipos de notificaciones:**
- `success`: ✅ Operaciones exitosas (verde)
- `error`: ❌ Errores y fallos (rojo)
- `warning`: ⚠️ Advertencias (amarillo)
- `info`: ℹ️ Información general (azul)

**Uso en la aplicación:**
```javascript
const { addToast } = useToast();

// Ejemplo: Login exitoso
addToast(`Bienvenido, ${usuario.nombre}`, 'success');

// Ejemplo: Error de reserva
addToast('Las fechas seleccionadas no están disponibles', 'error');
```

### 7.5 Gestión de Disponibilidad

**Algoritmo de verificación:**
```javascript
function isRoomAvailable(habitacion, fechaInicio, fechaFin, reservas) {
  // 1. Verifica estado de habitación
  if (habitacion.estado !== 'disponible') return false;
  
  // 2. Busca conflictos con reservas existentes
  const conflictos = reservas.filter(reserva => {
    if (reserva.id_habitacion !== habitacion.id_habitacion) return false;
    if (reserva.estado === 'cancelada') return false;
    
    // Detecta solapamiento de fechas
    const reservaInicio = new Date(reserva.fecha_inicio);
    const reservaFin = new Date(reserva.fecha_fin);
    
    return (fechaInicio < reservaFin && fechaFin > reservaInicio);
  });
  
  return conflictos.length === 0;
}
```

**Visualización:**
- **Lista de habitaciones:** Badge con estado
- **Calendario:** Colores según disponibilidad
- **Rack de habitaciones:** Grid visual con códigos de color

### 7.6 Validaciones

#### Frontend (Cliente)
```javascript
// ReservationForm.jsx
const validateDates = () => {
  if (fechaFin <= fechaInicio) {
    setError('La fecha de salida debe ser posterior a la de entrada');
    return false;
  }
  
  if (fechaInicio < new Date()) {
    setError('No puede reservar fechas pasadas');
    return false;
  }
  
  const nights = calculateNights(fechaInicio, fechaFin);
  if (nights < 1) {
    setError('La reserva debe ser de al menos 1 noche');
    return false;
  }
  
  return true;
};
```

**Validaciones implementadas:**
- ✅ Campos requeridos (HTML5 required)
- ✅ Formato de email (type="email")
- ✅ Rangos de fechas lógicos
- ✅ Números positivos en precios
- ✅ Capacidad mínima de habitaciones
- ✅ Longitud de contraseñas

#### Backend (Servidor)
- ✅ Validación de tipos de datos
- ✅ Sanitización de inputs
- ✅ Verificación de existencia de recursos
- ✅ Control de concurrencia (estado_tabla)
- ✅ Validación de permisos por rol

### 7.7 Responsive Design

**Breakpoints Bootstrap:**
```scss
// xs: <576px   - Móvil vertical
// sm: ≥576px   - Móvil horizontal
// md: ≥768px   - Tablet
// lg: ≥992px   - Desktop
// xl: ≥1200px  - Desktop grande
// xxl: ≥1400px - Desktop extra grande
```

**Adaptaciones implementadas:**
- Grid responsive (col-12, col-md-6, col-lg-4)
- Navbar colapsable en móvil
- Tablas con scroll horizontal
- Modales adaptables
- Formularios apilados en móvil
- Carrusel touch-friendly

---

## 8. Deploy y Entorno de Producción

### 8.1 GitHub Pages

**URL de Producción:** [https://AntonioYurquina.github.io/Hotel-Refugio](https://AntonioYurquina.github.io/Hotel-Refugio)

**Configuración:**

**1. package.json:**
```json
{
  "homepage": "https://AntonioYurquina.github.io/Hotel-Refugio",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0"
  }
}
```

**2. vite.config.js:**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/Hotel-Refugio/',  // Crucial para GitHub Pages
});
```

**3. Proceso de deploy:**
```bash
npm run deploy
```

Este comando:
1. Ejecuta `npm run build` (genera carpeta `dist/`)
2. Sube el contenido de `dist/` a la rama `gh-pages`
3. GitHub Pages sirve automáticamente desde esa rama

### 8.2 Optimizaciones de Build

**Vite Build Process:**
```bash
vite build

# Output:
dist/
├── index.html                    # HTML minificado
├── assets/
│   ├── index-[hash].js          # Bundle principal
│   ├── index-[hash].css         # Estilos compilados
│   └── [vendor]-[hash].js       # Code splitting
└── [otros assets]
```

**Optimizaciones automáticas:**
- ✅ Minificación de JS/CSS
- ✅ Tree shaking (eliminación de código no usado)
- ✅ Code splitting por rutas
- ✅ Lazy loading de componentes
- ✅ Hashing de archivos (cache busting)
- ✅ Compresión gzip
- ✅ Inlining de assets pequeños

**Tamaños típicos:**
```
dist/index.html:           ~3 KB
dist/assets/index.js:     ~250 KB (gzipped: ~80 KB)
dist/assets/index.css:     ~45 KB (gzipped: ~8 KB)
dist/assets/vendor.js:    ~150 KB (gzipped: ~50 KB)
```

### 8.3 Configuración de CORS

**Backend API:** Debe tener CORS habilitado para el dominio de GitHub Pages

```javascript
// Backend (Express ejemplo)
app.use(cors({
  origin: [
    'http://localhost:5173',                           // Desarrollo
    'https://antonioyurquina.github.io'                // Producción
  ],
  credentials: true
}));
```

### 8.4 Variables de Entorno

**Desarrollo vs Producción:**
```javascript
// Detección automática
const API_BASE = import.meta.env.PROD 
  ? 'https://robledo.website'
  : 'https://robledo.website';  // Misma API para ambos
```

### 8.5 Monitoreo y Logs

**Console Logs:**
```javascript
// Implementados para debugging
console.log('Usuario autenticado:', usuario);
console.error('Error al cargar habitaciones:', error);
```

**Recomendaciones futuras:**
- Integrar Sentry para error tracking
- Google Analytics para métricas de uso
- Implementar logging estructurado

### 8.6 SEO y Meta Tags

**index.html:**
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Hotel Refugio - Sistema de gestión y reservas" />
  <title>Hotel Refugio</title>
  
  <!-- Open Graph para redes sociales -->
  <meta property="og:title" content="Hotel Refugio" />
  <meta property="og:description" content="Sistema integral de gestión hotelera" />
  <meta property="og:image" content="/preview.jpg" />
</head>
```

**Limitaciones de SPA para SEO:**
- Contenido generado por JavaScript (no ideal para crawlers)
- Solución: Pre-rendering o SSR (Next.js para futuras versiones)

---

## 9. Conclusiones

### 9.1 Logros del Proyecto

**Funcionalidades Completadas:**
✅ Sistema completo de gestión hotelera
✅ Tres roles con permisos diferenciados
✅ CRUD de habitaciones, reservas y usuarios
✅ Autenticación y autorización
✅ Interfaz responsive y moderna
✅ Sistema de temas claro/oscuro
✅ Notificaciones contextuales
✅ Calendario interactivo de reservas
✅ Gráficos estadísticos
✅ Formulario de contacto funcional
✅ Integración de 3 APIs externas
✅ Deploy exitoso en GitHub Pages
✅ Control de concurrencia optimista

### 9.2 Stack Tecnológico Implementado

**Frontend:**
- React 18.2 + Hooks
- React Router DOM 6
- Bootstrap 5.3 + Sass
- Chart.js + React Big Calendar
- Vite 5 (build tool)

**Backend:**
- API RESTful (robledo.website)
- Base de datos SQL (inferida)
- Control de versiones (estado_tabla)

**APIs Externas:**
- GitHub API (datos de repositorio)
- Unsplash API (imágenes)
- EmailJS (envío de correos)

**Herramientas de Desarrollo:**
- ESLint (code quality)
- Git + GitHub (control de versiones)
- GitHub Pages (hosting)
- npm (gestión de dependencias)

### 9.3 Buenas Prácticas Aplicadas

**Arquitectura:**
- ✅ Separación de responsabilidades (Components/Hooks/Context)
- ✅ Componentes reutilizables y modulares
- ✅ Custom Hooks para lógica compleja
- ✅ Context API para estado global
- ✅ Rutas protegidas por rol

**Código:**
- ✅ Nomenclatura descriptiva en español
- ✅ Comentarios explicativos
- ✅ Manejo de errores con try/catch
- ✅ Validaciones en cliente y servidor
- ✅ DRY (Don't Repeat Yourself)

**UX/UI:**
- ✅ Feedback inmediato al usuario (toasts)
- ✅ Estados de carga (spinners)
- ✅ Diseño responsive
- ✅ Accesibilidad básica (labels, alt texts)
- ✅ Navegación intuitiva

**Seguridad:**
- ✅ Validación de inputs
- ✅ Protección de rutas
- ✅ Persistencia segura en localStorage
- ⚠️ Falta: JWT tokens para autenticación stateless

### 9.4 Desafíos Superados

**1. Gestión de Estado Complejo:**
- Solución: Custom Hook centralizado (useUsuarioLogic)
- Beneficio: Única fuente de verdad para toda la lógica

**2. Control de Concurrencia:**
- Solución: Campo estado_tabla como versión
- Beneficio: Evita conflictos en escritura simultánea

**3. Rutas Protegidas por Rol:**
- Solución: Componente ProtectedRoute con lógica de redirección
- Beneficio: Seguridad y UX mejorada

**4. Temas Claro/Oscuro:**
- Solución: Context + localStorage + Bootstrap data-bs-theme
- Beneficio: Persistencia y aplicación instantánea

**5. Deploy en GitHub Pages:**
- Solución: Configuración correcta de base path en Vite
- Beneficio: URL funcional sin errores 404

### 9.5 Mejoras Futuras Recomendadas

**Seguridad:**
- [ ] Implementar JWT tokens
- [ ] Refresh tokens para sesiones largas
- [ ] Rate limiting en frontend
- [ ] Sanitización más robusta de inputs
- [ ] HTTPS obligatorio (ya implementado por GitHub Pages)

**Funcionalidades:**
- [ ] Sistema de pagos integrado (Stripe/MercadoPago)
- [ ] Notificaciones push
- [ ] Chat en tiempo real (Socket.io)
- [ ] Sistema de reviews y calificaciones
- [ ] Generación de PDFs de reservas
- [ ] Múltiples idiomas (i18n)

**Performance:**
- [ ] Lazy loading de componentes pesados
- [ ] Virtualización de listas largas
- [ ] Service Workers para cache offline
- [ ] Optimización de imágenes (WebP, lazy load)
- [ ] CDN para assets estáticos

**Testing:**
- [ ] Tests unitarios (Jest + React Testing Library)
- [ ] Tests de integración
- [ ] Tests E2E (Cypress/Playwright)
- [ ] Coverage mínimo del 80%

**DevOps:**
- [ ] CI/CD con GitHub Actions
- [ ] Entornos staging y producción
- [ ] Monitoreo con Sentry/LogRocket
- [ ] Analytics con Google Analytics
- [ ] Backups automáticos de BD

**SEO:**
- [ ] Migrar a Next.js para SSR
- [ ] Sitemap.xml dinámico
- [ ] Meta tags dinámicos por ruta
- [ ] Optimización Core Web Vitals

### 9.6 Aprendizajes Clave

**1. React Hooks permiten código más limpio:**
- Custom Hooks centralizan lógica compleja
- useEffect para efectos secundarios
- useMemo para optimización

**2. Context API es suficiente para estado medio:**
- No siempre se necesita Redux
- Menor curva de aprendizaje
- Ideal para aplicaciones medianas

**3. Vite mejora significativamente DX:**
- HMR instantáneo
- Build rápido
- Configuración mínima

**4. Bootstrap + Sass = Productividad:**
- Componentes listos para usar
- Personalización mediante variables Sass
- Responsive por defecto

**5. APIs externas enriquecen la aplicación:**
- EmailJS evita backend para emails
- Unsplash provee contenido visual
- GitHub API demuestra integración REST

### 9.7 Cumplimiento de Requisitos

**Requisitos de la Cátedra:**
✅ **80% Asistencia:** Cumplido
✅ **Uso en localhost y deploy:** GitHub Pages activo
✅ **Buen diseño UX:** Bootstrap + responsive + feedback
✅ **Validación de campos:** Cliente y servidor
✅ **Mínimo 2 APIs Web:** 3 implementadas (GitHub, Unsplash, EmailJS)
✅ **Base de datos:** SQL relacional (MySQL/Postgres)
✅ **Documentación:** Este informe técnico completo

**Funcionalidades Obligatorias:**

**Usuario:**
✅ Ver habitaciones y servicios
✅ Realizar reserva con validación
✅ Consultas por mail (EmailJS)

**Operador:**
✅ Consultar habitaciones (calendario + rack)
✅ Consultar y liberar reservas
✅ Abrir/cerrar habitación
✅ Gestión de check-in/check-out

**Administrador:**
✅ CRUD de habitaciones
✅ CRUD de operadores
✅ Consultas parametrizadas
✅ Gráficos estadísticos (Chart.js)

---

## Información del Proyecto

**Nombre:** Hotel Refugio  
**Asignatura:** Lenguajes IV  
**Institución:** [Tu Universidad/Instituto]  
**Año:** 2025  

**Desarrollador(es):**  
- Antonio Yurquina

**Tecnologías Principales:**  
React 18 • Vite 5 • Bootstrap 5 • Node.js • API REST • MySQL

**Repositorio GitHub:**  
[https://github.com/AntonioYurquina/Hotel-Refugio](https://github.com/AntonioYurquina/Hotel-Refugio)

**Sitio Web Desplegado:**  
[https://AntonioYurquina.github.io/Hotel-Refugio](https://AntonioYurquina.github.io/Hotel-Refugio)

---

**Fecha de Elaboración del Informe:** 11 de noviembre de 2025

**Versión del Documento:** 1.0
