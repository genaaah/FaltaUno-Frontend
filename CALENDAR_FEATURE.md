# 📅 Calendario - Nueva Característica

## Descripción
Se ha agregado un nuevo componente de **Calendario** reutilizable que se integra en dos lugares principales de la aplicación:

1. **Solapa "Calendario"** en el Navbar → Página completa de visualización de partidos con calendario
2. **Modal "Crear Partido"** → Selector de fechas visual e integrado

## 🎨 Características

### Componente Calendar
- **Localización en español** (nombres de meses y días)
- **Colores consistentes** con el diseño del proyecto (verdes: 500, 600, 950)
- **Indicadores visuales:**
  - 🟢 Verde fuerte: fecha de hoy
  - 🟢 Verde oscuro: fecha seleccionada
  - ⚪ Gris: fechas pasadas (deshabilitadas)
- **Navegación intuitiva** con botones de mes anterior/siguiente
- **Dos modos:** completo (con leyenda) y compacto (para modales)

### Página de Calendario
- **Calendario mensual** con vista completa
- **Panel lateral** mostrando partidos filtrados por fecha
- **Estadísticas** de partidos totales, confirmados y en espera
- **Diseño responsivo** (grid 2 columnas en desktop, 1 en mobile)

### Modal Mejorado
- **Calendario visual** al lado del formulario
- **Selección interactiva** de fechas desde el calendario
- **Input tradicional** de fecha también disponible
- **Layout flexible** que se adapta a diferentes tamaños de pantalla

## 📂 Estructura de Archivos

```
src/
├── components/
│   ├── Calendar/
│   │   └── Calendar.jsx          ← Componente reutilizable
│   ├── Game/
│   │   └── CreateMatchModal.jsx  ← Mejorado con calendario
│   └── Layout/
│       └── Navbar.jsx            ← Actualizado: ruta a /calendarios
├── pages/
│   ├── Calendar.jsx              ← Nueva página de calendario
│   └── ...
├── App.jsx                         ← Nueva ruta: /calendarios
└── ...
```

## 🚀 Uso

### En la Aplicación
1. **Ver calendario**: Haz clic en "Calendario" en el Navbar
2. **Crear partido con calendario**: 
   - Ve a "Jugar" → botón "Crear Partido"
   - Usa el calendario a la derecha para seleccionar fecha
   - Completa el resto del formulario

### En el Código
```jsx
import Calendar from "../components/Calendar/Calendar";

// Uso básico
<Calendar 
  onDateSelect={(date) => console.log(date)} 
  selectedDate="2025-11-30"
  compact={false}
/>

// Props disponibles:
// - onDateSelect: función callback cuando se selecciona una fecha
// - selectedDate: fecha seleccionada (formato YYYY-MM-DD)
// - compact: boolean para modo compacto (default: false)
```

## 🎨 Colores Utilizados
- **Fondo**: `bg-green-50` / `bg-white`
- **Texto principal**: `text-green-600` / `text-green-900`
- **Botones/Hover**: `bg-green-600` / `hover:bg-green-700`
- **Sidebar dark**: `bg-green-950`
- **Acento hoy**: `bg-green-500`
- **Acento seleccionado**: `bg-green-600` con ring-2

## ✅ Características Implementadas
- ✅ Calendario visual interactivo
- ✅ Integración en Navbar con ruta `/calendarios`
- ✅ Página completa de visualización
- ✅ Integración en modal de crear partido
- ✅ Diseño responsivo
- ✅ Colores consistentes con el proyecto
- ✅ Indicadores visuales claros
- ✅ Deshabilitación de fechas pasadas
- ✅ Localización en español

## 📱 Responsividad
- **Desktop**: Calendario (2 columnas) + Panel lateral
- **Tablet**: Layout adaptado con calendario más pequeño
- **Mobile**: Stack vertical con calendario compacto

## 🔧 Próximas Mejoras (Sugerencias)
- [ ] Filtrar partidos por equipo en la página de calendario
- [ ] Mostrar partidos con diferentes colores según estado (confirmado, en espera)
- [ ] Exportar calendario a `.ics` o Google Calendar
- [ ] Notificaciones de partidos próximos
- [ ] Historial de partidos jugados

---

**Hecho con ❤️ usando React + Tailwind CSS + Vite**
