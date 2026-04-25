# Database Spec

## Stack
- **Engine**: PostgreSQL
- **ORM**: Prisma
- **Puerto**: 5433 (según entorno local)

## Modelo de Entidad-Relación

```mermaid
erDiagram
    SONG ||--o{ SETLIST_SONG : included_in
    SETLIST ||--o{ SETLIST_SONG : contains

    USER {
        string id PK
        string name
        string email UK
        string password
        enum role
        int fontSize
        boolean showChords
    }

    SONG {
        string id PK
        string title
        string artist
        string originalKey
        json structure
    }

    SETLIST {
        string id PK
        string name
        string description
        datetime date
    }

    SETLIST_SONG {
        string id PK
        string setlistId FK
        string songId FK
        int position
        string selectedKey
        string notes
    }
```

## Entidades

### 1. User
Almacena la información de los integrantes del ministerio y sus preferencias de lectura.
- **Roles**: `VOCAL`, `MUSICIAN`, `ADMIN`.
- **Preferencias**: `fontSize` y `showChords` permiten persistir la experiencia de usuario entre dispositivos (omitiendo la necesidad de reconfigurar en cada uso).

### 2. Song
El catálogo maestro de canciones.
- **Structure**: Campo JSON que guarda el parseo de letras y acordes. Esta es la fuente de verdad para el algoritmo de transposición.

### 3. Setlist
Representa un evento, ensayo o culto. Agrupa un conjunto ordenado de canciones.

### 4. SetlistSong (Tabla Intermedia)
Crucial para la flexibilidad del app. Permite que una misma canción sea usada en diferentes eventos con configuraciones distintas.
- **selectedKey**: Define el tono específico para ese evento (el músico verá la transposición calculada automáticamente basada en este campo).
- **position**: Determina el orden de la lista.

## Decisiones Técnicas
- **UUID**: Se utilizan strings UUID para los IDs para garantizar unicidad y facilitar futuras sincronizaciones.
- **Integridad Referencial**: Se utiliza `onDelete: Cascade` en la relación de `SetlistSong`, asegurando que no queden registros huérfanos si se elimina una canción o un setlist.
