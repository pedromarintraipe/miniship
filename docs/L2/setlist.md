# Setlists Spec

## Objetivo
Facilitar la organización de las canciones para eventos específicos (cultos, ensayos, conciertos), permitiendo personalizar la configuración de cada canción sin alterar el catálogo maestro.

## Estructura del Módulo
Un Setlist actúa como un contenedor de evento, pero la inteligencia reside en la relación interna con las canciones.

### 1. El Contenedor (Setlist)
- **Metadatos**: Almacena nombre del evento, descripción y fecha.
- **Orden**: Por defecto, los setlists se listan cronológicamente (del más reciente al más antiguo).

### 2. Personalización por Canción (SetlistSong)
Cada vez que una canción se añade a una lista, se genera una instancia única que permite:
- **selectedKey**: Definir el tono específico para ese evento. El visor de canciones priorizará este valor sobre el tono original para realizar la transposición automática.
- **position**: Manejar el orden secuencial de la lista (1, 2, 3...).
- **notes**: Añadir instrucciones técnicas o espirituales para el equipo (ej: "Entrada suave", "Solo batería en el puente").

## Reglas de Negocio
- **Independencia**: Cambiar el tono en un setlist no afecta a otros setlists ni a la canción original en el catálogo.
- **Integridad**: Gracias a la configuración de Prisma, al eliminar un setlist se limpian automáticamente todas sus referencias de canciones sin dejar datos huérfanos.
- **Orden Dinámico**: El sistema permite reordenar las posiciones actualizando el valor de `position`.

## Interfaz de Usuario
- **Vista de Lista**: Muestra un resumen del evento y la cantidad de canciones.
- **Modo Presentador**: Permite pasar de una canción a otra siguiendo el orden establecido, manteniendo la configuración de tono y tamaño de letra del usuario actual.