# Documentation Index - MinisWorship

Bienvenido a la documentación técnica de **MinisWorship**. Este documento sirve como punto de entrada para entender la arquitectura, las decisiones de diseño y las funcionalidades del proyecto.

---

## 🏛️ Nivel 1: Estratégico (High-Level)
Documentos que definen el "qué", el "por qué" y las bases técnicas del proyecto.

- [**Project Overview**](./L1/project.md): Visión general, objetivos y enfoque "Escenario-First".
- [**Development Rules**](./L1/rules.md): Convenciones de nombrado, arquitectura de responsabilidades y estándares de código.
- [**Database Design**](./L1/database.md): Modelado de datos (ER Diagram), relaciones en Prisma y persistencia.
- [**Software Design (SDD)**](./L1/sdd.md): Stack tecnológico, diagramas de flujo de datos y seguridad.

---

## ⚙️ Nivel 2: Funcional (Technical Specs)
Documentos detallados sobre el funcionamiento interno de cada módulo.

- [**Song Engine**](./L2/songs.md): El esquema JSON de las canciones y las reglas de transposición dinámica.
- [**Smart Importer**](./L2/importer.md): Lógica de scraping de CifraClub, limpieza de texto y parsing automático.
- [**Auth & RBAC**](./L2/auth.md): Matriz de permisos por rol, flujo de JWT y persistencia de preferencias.
- [**Setlist Management**](./L2/setlist.md): Gestión de eventos, orden dinámico de canciones y "Key Overrides".

---

## 🚀 Cómo empezar a desarrollar
1. **Contexto**: Lee el [Project Overview](./L1/project.md) para entender la necesidad del ministerio.
2. **Estándares**: Revisa las [Rules](./L1/rules.md) para mantener la consistencia del código.
3. **Flujo Crítico**: Si vas a modificar la lógica musical, estudia el [Song Engine](./L2/songs.md).

---
*Mantenido y actualizado automáticamente según la evolución de los módulos core.*
