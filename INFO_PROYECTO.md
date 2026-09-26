# ⚡ INFO_PROYECTO: ByToniProyect (By Toni)

> **Ubicación Google Drive:** `Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > ByToniProyect`  
> **Slug / Código:** `mia_bytoniproyect`  
> **Categoría:** Suite Toni (Propio / I+D)  
> **Estado:** En Desarrollo  
> **Base de Datos:** Supabase PostgreSQL (`mia_bytoniproyect`)  
> **Directrices Maestras Drive:** [Carpeta de Directrices](https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW)

---

## 🎯 1. Propuesta de Valor y Objetivo

**ByToniProyect** es un clon de Asana adaptado y optimizado específicamente para el desarrollo ágil de aplicaciones con IA siguiendo la metodología de Toni. Centraliza el catálogo de aplicaciones, orquesta directrices maestras y genera prompts estructurados para Antigravity y subagentes de desarrollo.

### 💡 Problema Principal que Resuelve
Orquestar de forma centralizada todas las apps del ecosistema, garantizar que cada nuevo desarrollo hereda automáticamente las directrices maestras de Google Drive (Supabase RLS, Seguridad, IA SSE, RGPD y Registro) y eliminar la fricción al redactar prompts de especificación.

### 👥 Público Objetivo
- Toni (gestión centralizada de apps propias y de clientes).
- Subagentes de Inteligencia Artificial (Antigravity) que ejecutan tareas guiadas por directrices.

---

## 🛠️ 2. Arquitectura y Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Vite + Lucide Icons.
- **Estilos:** Dark Glassmorphism con paleta Tailwind HSL y micro-animaciones.
- **Vistas Asana:** Lista agrupada por secciones, Tablero Kanban interactivo, Cronograma (Gantt), Calendario y Panel de analíticas.
- **Drawer de Detalle:** Panel lateral deslizante (Master-Detail) con checklist de cumplimiento de directrices y generador de prompts de tarea.
- **Persistencia:** LocalStorage sincronizado + Modelo de base de datos Supabase multi-esquema listo (`mia_bytoniproyect`).

---

## 📜 3. Cumplimiento de las 5 Directrices Maestras de Google Drive

| # | Directriz | Estado en ByToniProyect |
|---|---|---|
| **1** | **🗄️ Supabase PostgreSQL** | Esquema aislado `mia_bytoniproyect` con RLS estricto y clave `user_id` vinculada a `auth.users(id)`. |
| **2** | **🛡️ Seguridad & Auth** | Preparado para Supabase Auth con middleware de Route Guards. |
| **3** | **🤖 IA & Streaming** | Orquestador de prompts maestros con reemplazo dinámico de variables para Antigravity. |
| **4** | **⚖️ RGPD & Branding** | Titular legal Antonio Javier García García (DNI 34799350M, Madrid) y sello "By Toni" en cabecera y footer. |
| **5** | **📂 Registro Drive** | Ficha `INFO_PROYECTO.md` creada y entrada registrada en `Registro_Proyectos_Toni.csv`. |

---

## 🚀 4. Comandos de Ejecución Local

```bash
cd /Users/toni/Proyectos/ByToniProyect
npm install
npm run dev
```

---
*Ficha generada automáticamente según la Directriz de Registro y Control de Google Drive (By Toni).*
