# ⚽ FaltaUno – Plataforma Web para Organizar Partidos de Fútbol 5vs5

FaltaUno es una aplicación web moderna diseñada para conectar jugadores, formar equipos, organizar partidos 5vs5 y gestionar resultados en tiempo real. Su objetivo es digitalizar y simplificar la organización del fútbol amateur.

Este proyecto corresponde al **Frontend**, desarrollado con **React + Vite**, **Tailwind CSS**, **Axios** y distintas librerías del ecosistema de React.

---

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad

* Registro de usuarios con **verificación por email** (anti cuentas falsas).
* Inicio de sesión seguro.
* Recuperación de contraseña.
* Manejo de sesiones con roles.

### 🧩 Roles del Sistema

* **Administrador:** CRUD de canchas y resolución de disputas.
* **Capitán:** Crear equipo, gestionar jugadores, crear partidos.
* **Jugador:** Pertenecer a un equipo y participar en partidos.
* **Usuario:** Navegación básica y posibilidad de unirse a un equipo.

---

## 👥 Gestión de Equipos

* Crear un equipo (si el nombre está disponible).
* Cambiar nombre del equipo.
* Eliminar equipo.
* Dejar un equipo.
* Poner el perfil **en modo público** para recibir invitaciones.
* Sistema de invitaciones para sumar jugadores.
* Notificaciones integradas para aceptar o rechazar solicitudes.
* Actualización automática del rol según el estado del jugador.

---

## ⚽ Gestión de Partidos (Game)

* Crear partidos 5vs5 (solo capitanes con equipo completo).
* Selección de cancha, fecha y horario.
* Partidos divididos por filtros:

  * **Abiertos**,
  * **En curso**,
  * **Por confirmar**,
  * **Historial**.
* Los equipos pueden unirse como visitantes.
* Cambios automáticos de localía si el local abandona.
* Confirmación de resultados por parte del visitante.
* Rechazo de resultados (alerta para el administrador).
* Resultados finales almacenados en historial.

---

## 🏟️ Panel de Administración (Admin)

* CRUD completo de canchas disponibles.
* Visualización de disputas por resultados rechazados.
* Control adicional sobre comportamiento de los equipos.

---

## 🛠️ Tecnologías Utilizadas

* **React 18 + Vite**
* **Tailwind CSS**
* **Axios**
* **React Router DOM**
* **Context API** para manejo de autenticación

---

## 📦 Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/FaltaUno-Frontend.git
cd FaltaUno-Frontend
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear el archivo **.env.local** en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4️⃣ Ejecutar el proyecto

```bash
npm run dev
```

La aplicación correrá en:

```
http://localhost:5173
```

---

## 🔑 Usuarios de Prueba

Puedes iniciar sesión con las siguientes cuentas:

### 👑 Administrador

* Email: **[admin@example.com](mailto:admin@example.com)**
* Contraseña: **Hola123456!**

### 🎖️ Capitán

* Email: **[capitan@example.com](mailto:capitan@example.com)**
* Contraseña: **Hola123456!!**

### 👤 Usuario

* Email: **[usuario@example.com](mailto:usuario@example.com)**
* Contraseña: **Hola1234567!**

---

## 🗺️ Rutas Disponibles

### 🔓 Rutas Públicas

* `/auth` – Registro e inicio de sesión
* `/verificacion` – Verificar email
* `/recuperar-contrasena` – Recuperar contraseña

### 🔐 Rutas Privadas (requieren login)

* `/` – Inicio
* `/perfil` – Perfil del usuario
* `/invitaciones` – Invitaciones recibidas
* `/game` – Sistema de partidos
* `/canchas` – Gestión de canchas (solo admin)
* `/store` – Tienda (en desarrollo)

---

## 🌱 Roadmap / Funcionalidades Futuras

Estas son las próximas funciones planificadas para FaltaUno:

### 💳 Pasarela de pagos

* Reservas de canchas mediante **MercadoPago** u otro método.
* Pagos automáticos para partidos.

### 🏆 Torneos

* Creación de torneos por parte de administradores.
* Torneos gratuitos y pagos.
* Tabla de posiciones.
* Premios y estadísticas.

### 🛒 Tienda integrada

* Compra de productos post-partido.
* Bebidas, botellas, indumentaria, energizantes y más.

### 💬 Chat en tiempo real (posible)

* Comunicación entre jugadores.
* Coordinación de equipos.

---

## 📚 Proyecto Académico

Este proyecto fue desarrollado para la **Facultad Virtual de Tandil**, demostrando manejo avanzado de React, arquitectura de aplicaciones reales, autenticación, roles y flujos de usuario.