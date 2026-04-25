# Songs Spec

## Objetivo

Gestionar canciones con acordes y letra, optimizado para visualización en vivo y transposición dinámica.

## Estructura de Datos (JSON Schema)

La aplicación almacena las canciones en un formato JSON estructurado que permite la transposición rápida sin necesidad de procesar texto plano en el frontend.

```json
{
  "sections": [
    {
      "type": "INTRO | VERSE | CHORUS | BRIDGE | etc",
      "lines": [
        {
          "lyrics": "Letra de la línea",
          "chords": ["Array", "de", "Acordes"],
          "chordLine": "Acordes espaciados (mantiene alineación original)"
        }
      ]
    }
  ]
}
```

## Reglas de Procesamiento

- **Línea de Acordes**: Se identifica si más del 40% de los tokens son acordes válidos.
- **Vinculación**: Una línea de acordes se vincula automáticamente con la línea de letra inmediatamente inferior.
- **Tipografía**: Es obligatorio el uso de fuentes monoespaciadas (`font-mono`) en el visor para que el `chordLine` mantenga la alineación correcta sobre las palabras.
- **Tono Original**: Se almacena siempre el `originalKey` detectado durante la importación.

## Funcionalidad

- **Visualización Inteligente**: El visor puede ocultar o mostrar acordes según el rol del usuario (VOCAL vs MUSICIAN).
- **Transposición en Vivo**: Cálculo matemático de semitonos aplicado al array de `chords` y a la cadena `chordLine`.
- **Búsqueda**: Soporta búsqueda por título o artista (Case Insensitive).