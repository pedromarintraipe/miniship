# Auth Spec

## Objetivo
Gestionar la identidad de los usuarios y controlar el acceso a funciones críticas según su responsabilidad en el ministerio.

## Matriz de Permisos por Rol (RBAC)

| Función | ADMIN | MUSICIAN | VOCAL |
| :--- | :---: | :---: | :---: |
| Ver Catálogo / Canciones | ✅ | ✅ | ✅ |
| Visualizar Acordes | ✅ | ✅ | ❌ |
| Transponer Tonos | ✅ | ✅ | ❌ |
| Crear / Editar Canciones | ✅ | ✅ | ❌ |
| Gestionar Setlists | ✅ | ✅ | ❌ |
| Administrar Roles / Usuarios | ✅ | ❌ | ❌ |

## Reglas de Implementación
- **Contraseñas**: Hasheadas con `bcryptjs` (salt rounds: 10). Nunca se almacenan ni se transmiten en texto plano tras el registro.
- **Tokens**: Uso de **JWT** para mantener la sesión activa. El token debe incluir `id`, `name` y `role`.
- **Registro**: Por defecto, un usuario nuevo recibe el rol `VOCAL` para proteger la base de datos de modificaciones accidentales.

## Flujo de Trabajo
1. **Identificación**: Al hacer login, el sistema devuelve los datos del usuario y sus preferencias.
2. **Autorización**: El Frontend oculta elementos de la UI (como botones de transposición o edición) basándose en el rol del usuario almacenado en el contexto.
3. **Validación Backend**: Aunque el UI esté oculto, el Backend debe validar el rol en las rutas `POST`, `PUT` y `DELETE`.

## Preferencias de Perfil
El sistema de autenticación carga automáticamente las preferencias de lectura del usuario:
- **fontSize**: Tamaño de fuente base para el visor.
- **showChords**: Estado inicial de los acordes en el `SongViewer`.