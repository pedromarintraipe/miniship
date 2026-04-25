# Rules

## Principios del Proyecto
- **Priorizar simplicidad**: Evitar sobreingeniería. El código debe ser directo y fácil de mantener.
- **Optimizado para uso en vivo**: Interfaz de alto contraste (Dark Mode) y tipografía optimizada para lectura rápida en escenarios.
- **Integridad de Datos**: No modificar nunca los datos base de una canción (como el `originalKey`). Cualquier cambio de tono debe ser un "override" (`selectedKey`) dentro de un setlist.

## Convenciones de Código (Estilo detectado)

### 1. Nombramiento (Naming)
- **Componentes React**: Siempre en `PascalCase` (ej: `SongViewer.jsx`, `ConfirmModal.jsx`).
- **Funciones y Variables**: Siempre en `camelCase` (ej: `parseRawSongText`, `showChords`).
- **Rutas de API**: Nombres en plural para recursos (ej: `/songs`, `/setlists`).

### 2. Arquitectura de Responsabilidades
- **Lógica de Negocio**: Separar la lógica pesada (parsing, transposición, scraping) en archivos dentro de `utils/`.
- **Componentes**: Deben ser lo más "ligeros" posible, delegando los cálculos a las utilidades.
- **Estilos**: Uso exclusivo de **TailwindCSS**. El CSS plano se reserva solo para efectos globales como gradientes ambientales (`ambient-bg`) o decoraciones de texto (`ruby`).

### 3. Base de Datos y API
- **Prisma**: Uso obligatorio de Prisma para cualquier interacción con PostgreSQL.
- **JSON**: Las estructuras complejas (como las canciones) se manejan como objetos JSON para evitar múltiples peticiones y facilitar la transposición en el cliente.

### 4. Interfaz de Usuario (UI)
- **Modos de Usuario**: Diferenciar claramente la vista entre `VOCAL` (letra limpia) y `MUSICIAN` (acordes visibles) mediante lógica de roles.
- **Persistencia**: Preferencias como el tamaño de fuente o visibilidad de acordes deben guardarse en la base de datos para que el músico tenga la misma configuración en cualquier dispositivo.