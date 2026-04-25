# Importer Spec (Smart Scraper)

## Objetivo
Automatizar la captura de canciones desde **CifraClub**, transformando el HTML desordenado en una estructura JSON limpia y lista para la transposición.

## Componentes Técnicos
- **Backend Scraper**: `backend/utils/scraper.js` (Fetch y Regex).
- **Backend Parser**: `backend/utils/parser.js` (Lógica de secciones y líneas).
- **Frontend**: `frontend/src/pages/SongImporter.jsx` (Interfaz de usuario).

## Flujo de Trabajo (Paso a Paso)

### 1. Ingesta (Fetch)
El Backend recibe la URL y realiza una petición HTTP. Se extrae exclusivamente el bloque `<pre>` que contiene la tablatura original.

### 2. Extracción de Metadatos
Se aplican expresiones regulares específicas para obtener:
- **Título & Artista**: Parseo de headers `<h1>` y `<h2>`.
- **Tonalidad (Key)**: Identificación del ID dinámico `cifra_tom` en el HTML original. Si no existe, se busca por coincidencia de texto ("Tom:").

### 3. Sanitización y Limpieza
- Decodificación de caracteres especiales (`&amp;`, `&quot;`, etc.).
- Eliminación de etiquetas HTML residuales.
- **Eliminación de Tono Residual**: Se borra la línea de texto que indica el tono dentro de la letra para evitar duplicidad visual.

### 4. Estructuración (Parsing)
Se recorre el texto línea por línea:
- **Secciones**: Se crean nuevos bloques si se detectan palabras clave como `Intro`, `Coro`, `Bridge` o etiquetas entre corchetes `[...]`.
- **Detección de Acordes**: Una línea se marca como `chords` si más del 40% de sus palabras coinciden con el diccionario musical (A-G + variaciones).
- **Vinculación**: Los acordes detectados se asocian con la letra de la línea siguiente para formar un objeto único en el JSON.

## Interfaz de Usuario e Interacción
El importador no guarda directamente en la base de datos.
1. El usuario pega la URL.
2. El sistema muestra una **Previsualización** (`preview-import`).
3. El usuario valida el título, artista y tono original.
4. Tras el visto bueno, se ejecuta el `POST` final a la colección de canciones.