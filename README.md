# 🎸 MinisWorship - Gestión para Ministerio de Alabanza

MinisWorship es una aplicación web Full-Stack diseñada específicamente para simplificar la vida de los ministerios de alabanza. Permite gestionar repertorios de canciones, importar letras con sus acordes exactos mediante Web Scraping, transponer tonos en tiempo real, armar setlists (listas de reproducción para eventos) y brindar interfaces de usuario diferenciadas según el rol (Músico o Vocalista).

## ✨ Características Principales

*   🔒 **Rol y Autenticación Segura**: 
    *   **Autenticación**: Inicio de sesión y registro seguros utilizando contraseñas encriptadas con `bcryptjs`.
    *   **Control de Acceso basado en Roles (RBAC)**: Diferenciación dinámica entre `ADMIN` (acceso y control total), `MUSICIAN` (vista de acordes activada y edición básica) y `VOCAL` (letra sin distracciones musicales).
    *   **Panel Administrativo**: Los administradores pueden promover a otros usuarios a roles superiores o inferiores mediante un panel en tiempo real.
*   🤖 **Importador Inteligente (Scraper)**: 
    *   Ingresa una URL de **CifraClub** y la app hará el resto. 
    *   Extrae el título, nombre del artista (parseando HTML o infiriéndolo desde la URL), e identifica de forma dinámica la "Tonalidad Principal" incluso si está oculta en menús dinámicos de la web de origen.
    *   Limpia la estructura y elimina el tono residual del texto garantizando un guardado limpio en la base de datos.
*   🎹 **Visor Profesional y Transposición**:
    *   La herramienta no solo guarda el texto, sino que retiene a la perfección los espacios reales (`[Intro] B  E  B`) utilizando tipografía monoespaciada (`font-mono`).
    *   Transposición inteligente y en vivo: Capacidad matemática para subir o bajar el tono original, recalculando de forma dinámica la posición de cualquier nota de toda la canción sin desordenar la letra.
*   📝 **Setlists de Eventos**: 
    *   Creación de listas organizadas de cara a los cultos, ensayos o eventos.
    *   Añade canciones a la lista y ajusta la tonalidad de destino individualmente según quién cantará.
*   🎨 **Experiencia Premium (UI/UX)**:
    *   Interfaz "Dark Mode" con diseño en TailwindCSS que resulta suave para ver bajo entornos de baja luminosidad propios de escenarios y detrás de cámara.
    *   Modales de confirmación con retardo animado y efecto *Glassmorphism* (fusión de cristales/blur).

## 🛠️ Stack Tecnológico (Tech Stack)

### Fron-end (Client-Side)
- **Framework**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Routing**: `react-router-dom`

### Back-end (Server-Side)
- **Runtime**: [Node.js](https://nodejs.org/en)
- **Framework**: [Express.js](https://expressjs.com/)
- **Seguridad**: `bcryptjs`
- **ORM / Base de Datos**: [Prisma](https://www.prisma.io/) + **PostgreSQL** (Puppet en puerto 5433)

---

> Desplegado e iterado como una herramienta escalable, rápida y diseñada sin sobreingeniería para un contexto real. 
