import { Project, Section, Task, DirectiveItem } from '../types/project';

export const INITIAL_DIRECTIVES: DirectiveItem[] = [
  {
    id: 'dir_supabase',
    title: '🗄️ Directriz Maestra #1: Arquitectura de Datos y Supabase Multi-Esquema (PostgreSQL)',
    category: 'General Drive',
    appTypes: ['Todas las Apps', 'Web & Frontend', 'Trading & Algoritmos', 'Mobile & PWA (Local-First)', 'SaaS Multi-tenant', 'Internal CLI & Backend'],
    icon: 'Database',
    isOfficialMaster: true,
    summary: 'Aislamiento estricto multi-esquema (mia_* para suite propia, com_* para clientes), RLS (Row Level Security) obligatorio en el 100% de las tablas y clave user_id vinculada a auth.users(id).',
    fullMarkdownContent: `# 🗄️ Directriz Maestra #1: Arquitectura de Datos y Supabase Multi-Esquema (PostgreSQL)

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > 01_Arquitectura_Supabase.md\`  
> **Estado:** Obligatoria en todos los proyectos con persistencia  
> **Responsable Metodológico:** Toni (Antonio Javier García García)

---

## 🎯 1. Principio Fundamental de Aislamiento
Todo desarrollo dentro del ecosistema de Toni que requiera almacenamiento relacional utilizará una única instancia centralizada de Supabase PostgreSQL, estructurada mediante **esquemas lógicos aislados** para prevenir colisiones y garantizar multi-tenancy seguro:

1. **Suite Propia (I+D Toni):** Prefijo obligatorio \`mia_\` (ej. \`mia_bytoniproyect\`, \`mia_vitatrading\`, \`mia_flowmind\`).
2. **Proyectos Comerciales (Clientes):** Prefijo obligatorio \`com_\` (ej. \`com_bicicletas\`, \`com_clinicadental\`).
3. **Prohibición:** Queda estrictamente prohibido alojar tablas del proyecto en el esquema \`public\`.

---

## 🛡️ 2. Reglas de Row Level Security (RLS)
- **100% de Cobertura:** Toda tabla creada debe tener ejecutada la sentencia \`ALTER TABLE <esquema>.<tabla> ENABLE ROW LEVEL SECURITY;\`.
- **Identificador de Usuario:** Toda tabla con pertenencia a usuario debe incluir la columna:
  \`\`\`sql
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid()
  \`\`\`
- **Políticas Estándar:** Cada tabla dispondrá de políticas granulares para \`SELECT\`, \`INSERT\`, \`UPDATE\` y \`DELETE\` basadas en \`auth.uid() = user_id\`.

---

## 📜 3. Estándar de Migraciones y Scripts SQL
- Todo proyecto debe incluir en su repositorio el directorio \`/supabase/migrations/\`.
- Script inicial estandarizado: \`20260925_init_schema.sql\` con creación de esquema, tablas, índices en claves foráneas y políticas RLS completas.`,
    rules: [
      'Crear siempre el esquema dedicado (ej. mia_bytoniproyect o com_bicicletas) mediante CREATE SCHEMA IF NOT EXISTS.',
      'Activar Row Level Security (RLS) en el 100% de las tablas sin excepción.',
      'Cada tabla con datos de usuario DEBE contener user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid().',
      'Crear políticas RLS estándar: SELECT, INSERT, UPDATE, DELETE restringidas a auth.uid() = user_id.',
      'Generar índices B-Tree en todas las claves foráneas (user_id, project_id, section_id) para optimizar consultas.',
      'Generar script reproducible 00_init_schema.sql en supabase/migrations.'
    ],
    promptTemplate: 'Aplica la Directriz de Supabase: Crea el esquema dedicado {SCHEMA}, activa RLS estricto en todas las tablas, asocia la clave user_id a auth.users(id), añade índices en claves foráneas y genera el script de migración SQL completo.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_security',
    title: '🛡️ Directriz Maestra #2: Seguridad, Autenticación y Route Guards',
    category: 'General Drive',
    appTypes: ['Todas las Apps', 'Web & Frontend', 'Trading & Algoritmos', 'Mobile & PWA (Local-First)', 'SaaS Multi-tenant', 'Internal CLI & Backend'],
    icon: 'ShieldCheck',
    isOfficialMaster: true,
    summary: 'Manejo seguro de sesiones JWT con Supabase Auth, middleware de protección de rutas privadas, validación exhaustiva con Zod/TypeScript y principio de mínimo privilegio.',
    fullMarkdownContent: `# 🛡️ Directriz Maestra #2: Seguridad, Autenticación y Route Guards

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > 02_Seguridad_Autenticacion.md\`  
> **Estado:** Obligatoria en todos los proyectos con login o áreas privadas

---

## 🔒 1. Gestión de Identidad y Sesión
- **Motor de Autenticación:** Supabase Auth (Email con Magic Link o Contraseña segura, más OAuth opcional con Google/GitHub).
- **Almacenamiento de Tokens:** Almacenar tokens JWT exclusivamente en \`localStorage\` con rotación automática mediante el SDK de Supabase o cookies HTTP-Only en entornos SSR.
- **Protección de Rutas (Route Guards):** Ningún componente privado puede renderizarse sin previa verificación de sesión en el middleware o componente \`<ProtectedRoute />\`.

---

## 🛡️ 2. Validación de Entradas y Zero Trust
- Validación estricta de esquemas de datos con Zod o TypeScript en todas las fronteras de entrada de datos (formularios, query params, webhooks).
- Sanitización de contenido HTML o Markdown para prevenir ataques Cross-Site Scripting (XSS).
- Cero secretos en cliente: Ninguna API Key con privilegios elevados (service_role, claves secretas de Stripe o LLMs) puede exponerse en el bundle de Vite.`,
    rules: [
      'Utilizar Supabase Auth con Email/Magic Link y OAuth gestionado.',
      'Proteger todas las rutas privadas mediante Middleware / Route Guards en React Router.',
      'Validar todas las entradas del usuario con esquemas de validación (Zod / TypeScript types).',
      'No almacenar nunca tokens o secretos de API en el cliente; usar Edge Functions para endpoints sensibles.',
      'Sanitizar cualquier renderizado de HTML o markdown para evitar XSS.'
    ],
    promptTemplate: 'Aplica la Directriz de Seguridad: Configura Supabase Auth, envuelve las vistas privadas con Route Guards, valida parámetros con Zod y asegura que no se expongan tokens sensibles en el cliente.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_ai',
    title: '🤖 Directriz Maestra #3: Inteligencia Artificial, Streaming SSE y Agentes',
    category: 'General Drive',
    appTypes: ['Todas las Apps', 'Web & Frontend', 'Trading & Algoritmos', 'Mobile & PWA (Local-First)', 'SaaS Multi-tenant'],
    icon: 'Bot',
    isOfficialMaster: true,
    summary: 'Consumo optimizado de LLMs (OpenAI, Claude, Gemini, DeepSeek), respuestas fluidas en streaming Server-Sent Events (SSE) y desacoplamiento absoluto de prompts.',
    fullMarkdownContent: `# 🤖 Directriz Maestra #3: Inteligencia Artificial, Streaming SSE y Agentes

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > 03_Inteligencia_Artificial_Streaming.md\`  
> **Estado:** Obligatoria en proyectos con integración de IA

---

## ⚡ 1. Experiencia de Usuario en Streaming
- **Server-Sent Events (SSE):** Toda interacción de generación de texto o asistente conversacional debe transmitirse en tiempo real carácter a carácter para maximizar la velocidad percibida.
- **Feedback Visual:** Mostrar estados de carga progresivos ("Pensando...", "Generando código...") y cursores animados durante la recepción del stream.

---

## 🧩 2. Desacoplamiento de Prompts y Capa de Dominio
- Los prompts del sistema (System Prompts) nunca se incrustan directamente en componentes visuales.
- Se organizan en servicios de dominio (\`src/services/aiService.ts\`) con plantillas parametrizadas y tipadas.
- Soportar conmutación transparente entre modelos: OpenAI (GPT-4o), Anthropic (Claude 3.5 Sonnet), Google (Gemini 2.0 Flash) y modelos Open Source (DeepSeek / Groq Llama 3).`,
    rules: [
      'Implementar streaming en tiempo real (Server-Sent Events) para asistentes conversacionales y generación de código.',
      'Aislar los prompts del sistema en capas de dominio independientes para facilitar su iteración.',
      'Gestionar de forma resiliente los límites de tasa (rate limits) con reintentos exponenciales con jitter.',
      'Soportar selección dinámica de modelos según la complejidad de la tarea.',
      'Guardar historial contextual en Supabase con esquema de tokens optimizado.'
    ],
    promptTemplate: 'Aplica la Directriz de IA: Implementa el cliente de IA con soporte de Streaming Server-Sent Events (SSE), desacopla el prompt del sistema y maneja fallos de conexión con feedback visual fluido.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_rgpd',
    title: '⚖️ Directriz Maestra #4: Privacidad, RGPD y Branding "By Toni"',
    category: 'General Drive',
    appTypes: ['Todas las Apps', 'Web & Frontend', 'Trading & Algoritmos', 'Mobile & PWA (Local-First)', 'SaaS Multi-tenant'],
    icon: 'Scale',
    isOfficialMaster: true,
    summary: 'Cumplimiento legal obligatorio bajo la titularidad de Antonio Javier García García (DNI 34799350M, Madrid), páginas legales pregeneradas y sello de autoría By Toni.',
    fullMarkdownContent: `# ⚖️ Directriz Maestra #4: Privacidad, RGPD y Branding "By Toni"

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > 04_Privacidad_RGPD_Branding.md\`  
> **Estado:** Obligatoria en el 100% de las aplicaciones públicas y comerciales

---

## 🏛️ 1. Datos Identificativos del Titular Legal
En todas las aplicaciones que traten datos de carácter personal o requieran aviso legal, el titular es:
- **Nombre Completo:** Antonio Javier García García
- **DNI:** 34799350M
- **Domicilio Legal:** Madrid (España)
- **Email de Contacto:** contacto@bytoni.dev (o el correo específico del proyecto)

---

## 📄 2. Rutas Legales Obligatorias
Cada aplicación web o PWA debe contar con 3 páginas accesibles:
1. \`/privacidad\`: Política de Privacidad adaptada al RGPD y LOPD-GDD.
2. \`/aviso-legal\`: Aviso Legal con datos del titular y propiedad intelectual.
3. \`/terminos\`: Términos y Condiciones de Uso del servicio.

---

## ✨ 3. Sello de Marca y Autoría "By Toni"
- Todo pie de página (footer) y cabecera de documentación técnica debe lucir el sello distintivo **"By Toni"** con tipografía refinada, badge y enlace a la suite central.`,
    rules: [
      'Titular del tratamiento obligatorio: Antonio Javier García García, DNI 34799350M, Madrid (España).',
      'Generar automáticamente las 3 rutas legales: /privacidad, /aviso-legal y /terminos.',
      'Incluir banner de consentimiento de cookies y almacenamiento local conforme a directrices de la AEPD.',
      'Incluir siempre el sello de autor "By Toni" con enlace y estilo refinado en el pie de página.',
      'Garantizar el ejercicio de derechos ARCO (Acceso, Rectificación, Cancelación y Oposición).'
    ],
    promptTemplate: 'Aplica la Directriz RGPD & Branding: Genera las páginas /privacidad, /aviso-legal y /terminos con los datos de Antonio Javier García García (DNI 34799350M, Madrid) y añade el footer "By Toni".',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_drive',
    title: '📂 Directriz Maestra #5: Registro Central y Control Documental en Google Drive',
    category: 'General Drive',
    appTypes: ['Todas las Apps', 'Web & Frontend', 'Trading & Algoritmos', 'Mobile & PWA (Local-First)', 'SaaS Multi-tenant', 'Internal CLI & Backend'],
    icon: 'HardDrive',
    isOfficialMaster: true,
    summary: 'Sincronización del catálogo maestro en Registro_Proyectos_Toni.csv y creación de la ficha técnica INFO_PROYECTO.md en la carpeta dedicada de Google Drive.',
    fullMarkdownContent: `# 📂 Directriz Maestra #5: Registro Central y Control Documental en Google Drive

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > 05_Registro_Control_Drive.md\`  
> **Estado:** Obligatoria al inicio y finalización de cada proyecto

---

## 🗂️ 1. Estructura Jerárquica de Carpetas en Drive
La organización en Google Drive debe seguir la estructura:
\`\`\`text
Google Drive
 └── Mi unidad
      └── 1-Proyectos
           └── Apps-Desarrollo
                ├── Registro_Proyectos_Toni.csv
                ├── Plantilla_Definicion_Proyecto_Toni.xlsx
                ├── Directrices/
                └── [Nombre-Proyecto]/
                     ├── INFO_PROYECTO.md
                     ├── Briefing/
                     └── Documentacion/
\`\`\`

---

## 📊 2. Registro Maestro en CSV
Cada proyecto debe registrarse en \`Registro_Proyectos_Toni.csv\` con las columnas:
\`ID, Nombre, Slug, Categoría, Estado, TipoApp, EsquemaSupabase, URL_Produccion, Repositorio, FechaCreacion\`

---

## 📝 3. Ficha Técnica Obligatoria INFO_PROYECTO.md
Todo proyecto debe incluir una ficha técnica que detalle:
- Propuesta de valor, problema que resuelve y público objetivo.
- Arquitectura y Stack (Frontend, Backend, DB, IA).
- Tabla de cumplimiento de las 5 Directrices Maestras.
- Guía rápida de comandos de instalación y arranque local.`,
    rules: [
      'Registrar cada nuevo proyecto en Apps-Desarrollo/Registro_Proyectos_Toni.csv con su slug, categoría, estado y esquema DB.',
      'Crear la carpeta dedicada en Google Drive: Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo/<Nombre-App>.',
      'Generar la ficha técnica INFO_PROYECTO.md con arquitectura, variables de entorno requeridas y enlaces de producción.',
      'Mantener actualizado el README.md central del Hub de Proyectos de Toni.'
    ],
    promptTemplate: 'Aplica la Directriz de Google Drive: Actualiza Registro_Proyectos_Toni.csv y crea la ficha INFO_PROYECTO.md en Apps-Desarrollo/{PROYECTO}/ con la arquitectura y detalles técnicos.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_definicion',
    title: '📐 Directriz de Definición de Proyecto y Briefing Ágil (By Toni)',
    category: 'General Drive',
    appTypes: ['Todas las Apps', 'Web & Frontend', 'Trading & Algoritmos', 'Mobile & PWA (Local-First)', 'SaaS Multi-tenant', 'Internal CLI & Backend'],
    icon: 'BookOpen',
    isOfficialMaster: true,
    summary: 'Protocolo simplificado para inicializar cualquier nuevo proyecto de software sin duplicidades, con listas desplegables estandarizadas y generación en 1 clic.',
    fullMarkdownContent: `# 📐 Directriz de Definición de Proyecto y Briefing Ágil (By Toni)

Esta directriz establece el protocolo simplificado para inicializar cualquier nuevo proyecto de software dentro del ecosistema de Toni.

Al basarse en las **5 Directrices Maestras de Google Drive**, elimina la duplicidad y las preguntas redundantes sobre aspectos técnicos fijos (RGPD, arquitectura multi-esquema en Supabase, branding o registro central), permitiendo definir un nuevo proyecto en pocos minutos.

---

## 🔗 1. Las 5 Directrices Maestras Heredadas (Google Drive)

Cualquier proyecto inicializado en el ecosistema hereda y aplica de forma **100% automática** las normas definidas en:
📁 [Carpeta de Directrices en Google Drive](https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW?usp=drive_link)

| # | Directriz Maestra | Aspectos Estandarizados (Automáticos - No se piden en el briefing) |
|---|---|---|
| **1** | **🗄️ Arquitectura de Datos y Supabase** | Esquema PostgreSQL aislado (\`mia_*\` para suite propia, \`com_*\` para clientes), RLS (Row Level Security) estricto y clave foránea \`user_id\` vinculada a \`auth.users(id)\`. |
| **2** | **🛡️ Seguridad y Autenticación** | Supabase Auth (JWT), protección de rutas mediante Middleware/Guards y jerarquía estándar de perfiles. |
| **3** | **🤖 Implementación de IA** | Streaming en tiempo real vía Server-Sent Events (SSE), ejecución segura de modelos en Edge Functions / Backend y protección total de API Keys. |
| **4** | **⚖️ Privacidad, RGPD y Branding** | Titular legal obligatorio (**Antonio Javier García García**, DNI **34799350M**, Madrid), páginas legales automáticas (\`/privacidad\`, \`/aviso-legal\`, \`/terminos\`), cookies y sello **"By Toni"** en el footer. |
| **5** | **📂 Registro y Control en Google Drive** | Registro automático en \`Apps-Desarrollo/Registro_Proyectos_Toni.csv\` y creación de carpeta de documentación \`Apps-Desarrollo/<App>/INFO_PROYECTO.md\`. |

---

## 📊 2. Plantillas de Definición Disponibles

1. **Plantilla Excel Interactiva (Con Listas Desplegables / Data Validation):**
   - **Local:** \`/Users/toni/Proyectos/Plantilla_Definicion_Proyecto_Toni.xlsx\`
   - **Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Plantilla_Definicion_Proyecto_Toni.xlsx\`
2. **Plantilla Markdown Ágil (Para copiar y pegar en Chat / IDE):**
   - **Local:** \`/Users/toni/Proyectos/Plantilla-Definicion-Proyecto.md\`
   - **Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Plantilla-Definicion-Proyecto.md\``,
    rules: [
      'Utilizar el formulario estandarizado de briefing sin duplicar campos técnicos fijos.',
      'Definir siempre el slug con prefijo estricto mia_* o com_*.',
      'Asignar una categoría clara: Suite Toni (Propio / I+D), Comercial / Clientes, Prototipo Rápido o Herramienta Interna.',
      'Generar el Prompt Maestro de inicialización rápida para ejecutarlo en Antigravity.'
    ],
    promptTemplate: 'Inicializa un nuevo proyecto aplicando las 5 Directrices Maestras de Drive con la configuración: Nombre: {NOMBRE}, Slug: {SLUG}, Categoría: {CATEGORIA}, Tagline: {TAGLINE}, Frontend: React 19 + TypeScript + Vite, Estilo: Tailwind CSS + Glassmorphism Dark.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_web',
    title: '🌐 Directriz de Aplicaciones Web & Frontend',
    category: 'Web',
    appTypes: ['Web & Frontend', 'SaaS Multi-tenant', 'Comercial / Clientes'],
    icon: 'LayoutTemplate',
    isOfficialMaster: false,
    summary: 'Estándares para desarrollo de aplicaciones web de alto impacto: React 19 + TypeScript + Vite, estética premium Dark Glassmorphism, SEO y accesibilidad WCAG AA.',
    fullMarkdownContent: `# 🌐 Directriz de Aplicaciones Web & Frontend (By Toni)

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > Web_Frontend.md\`

---

## 🎨 1. Estética Visual y Diseño de Alto Impacto
- **Impresión WOW:** Todo proyecto web debe causar impacto visual desde el primer segundo. Usar gradientes fluidos, efectos de desenfoque \`backdrop-blur\`, bordes translúcidos y modo oscuro refinado.
- **Tipografía Moderna:** Cargar fuentes de alta legibilidad como *Outfit* para titulares y *Inter* para cuerpo de texto.
- **Micro-interacciones:** Botones con feedback de escala táctil, transiciones suaves y estados hover evidentes.
- **Cero Placeholders:** Nunca usar marcadores de posición ("Lorem Ipsum" o cajas vacías); generar demostraciones funcionales o activos reales.

---

## 🏗️ 2. Clean Architecture en el Frontend
- **Domain:** Entidades puras, interfaces de modelos y casos de uso sin acoplamiento a frameworks.
- **Data / Services:** Repositorios, clientes HTTP, SDK de Supabase y adaptadores de API.
- **Presentation / UI:** Componentes visuales, vistas, hooks personalizados y gestión de estado reactivo.`,
    rules: [
      'Stack principal: React 19 + TypeScript + Vite + Lucide Icons.',
      'Diseño visual WOW: Modo oscuro premium, glassmorphism con backdrop-blur, paleta curada y micro-animaciones.',
      'Clean Architecture en frontend: Domain (entidades/interfaces), Data (repositorios/APIs) y UI (componentes/vistas).',
      'SEO técnico: Título descriptivo, meta-etiquetas OpenGraph y encabezados semánticos (h1, h2, h3).',
      'Diseño 100% responsivo adaptable a escritorio, tablet y smartphone con touch ergonomics.'
    ],
    promptTemplate: 'Aplica la Directriz Web: Desarrolla la aplicación usando React 19 + TypeScript + Vite, aplicando Clean Architecture (Domain/Data/UI), Dark Glassmorphism de alta gama y micro-interacciones suaves.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_trading',
    title: '📈 Directriz de Apps de Trading & Algoritmos',
    category: 'Trading',
    appTypes: ['Trading & Algoritmos'],
    icon: 'TrendingUp',
    isOfficialMaster: false,
    summary: 'Patrones para software financiero: gestión de riesgos estricta, backtesting robusto, webhooks de Binance/TradingView y ejecución a baja latencia.',
    fullMarkdownContent: `# 📈 Directriz de Apps de Trading & Algoritmos (By Toni)

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > Trading_Algoritmos.md\`

---

## ⚖️ 1. Regla Inmutable de Gestión de Riesgo
- **Stop Loss Obligatorio:** Ninguna orden puede enviarse al mercado sin un Stop Loss predefinido en la lógica de entrada.
- **Cálculo de Tamaño de Posición:** El tamaño de lotaje se calcula matemáticamente en función del porcentaje máximo de riesgo por operación (ej. 1% del capital de la cuenta).
- **Control de Drawdown:** Implementación de freno de emergencia que desactiva la ejecución algorítmica si las pérdidas acumuladas alcanzan el umbral límite diario o semanal.

---

## ⚡ 2. Conectividad y Telemetría
- Conexión vía WebSocket en tiempo real con Binance / TradingView para feeds de ticks a baja latencia.
- Logging determinista de cada tick, señal calculada y orden ejecutada con marca de tiempo precisa en microsegundos.
- Dashboard de métricas analíticas: Win Rate, Profit Factor, Expectancy, Sharpe Ratio y Curva de Equidad interactiva.`,
    rules: [
      'Regla de Oro: Gestión de riesgo inmutable (Stop Loss obligatorio y cálculo de tamaño de posición pre-orden).',
      'Aislamiento de claves de API de exchanges en variables de entorno seguras (sin permisos de retiro habilitados).',
      'Conexión en tiempo real con WebSockets para feeds de precios y libros de órdenes.',
      'Logging detallado y determinista de cada señal generada y operación ejecutada.',
      'Panel de control con métricas clave: Win Rate, Profit Factor, Max Drawdown y Curva de Equidad.'
    ],
    promptTemplate: 'Aplica la Directriz de Trading: Implementa la estrategia algorítmica con gestión estricta de riesgo (SL/TP), cálculo automático de lotaje, conexión WebSockets a baja latencia y panel de métricas de rendimiento.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_mobile',
    title: '📱 Directriz Mobile & PWA (Local-First)',
    category: 'Mobile',
    appTypes: ['Mobile & PWA (Local-First)'],
    icon: 'Smartphone',
    isOfficialMaster: false,
    summary: 'Diseño para smartphones y apps móviles: Zero-Knowledge Local-First, persistencia IndexedDB, ergonomía táctil en la zona del pulgar y soporte offline total.',
    fullMarkdownContent: `# 📱 Directriz Mobile & PWA (Local-First) (By Toni)

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > Mobile_LocalFirst.md\`

---

## 📵 1. Filosofía Local-First
- La aplicación debe ser 100% operativa sin requerir conexión a internet.
- Los datos se almacenan en el dispositivo mediante IndexedDB o SQLite WASM.
- Si existe sincronización en la nube, se realiza en segundo plano con resolución determinista de conflictos (CRDTs o Last-Write-Wins con marcas de tiempo lógicas).

---

## 👆 2. Ergonomía Táctil y Zona del Pulgar
- Las acciones principales, botones flotantes y barras de navegación deben situarse en la mitad inferior de la pantalla (Natural Thumb Zone).
- Las áreas táctiles mínimas deben cumplir con al menos 48x48px para evitar pulsaciones erróneas.
- Soporte PWA completo con archivo \`manifest.json\`, iconos adaptativos y Service Worker de caché inteligente.`,
    rules: [
      'Arquitectura Local-First: La app funciona al 100% sin conexión a internet usando IndexedDB/SQLite.',
      'Diseño centrado en la zona del pulgar: Acciones clave en la mitad inferior de la pantalla con touch targets de al menos 48x48px.',
      'Zero-Knowledge Privacy: Cifrado en cliente antes de cualquier sincronización en nube.',
      'Soporte PWA: Manifest con iconos adaptativos, Service Worker para caché offline y soporte de instalación.',
      'Animaciones nativas de 60fps con transiciones de pantalla suaves.'
    ],
    promptTemplate: 'Aplica la Directriz Mobile Local-First: Implementa persistencia offline con IndexedDB, diseño táctil adaptado a la zona del pulgar, soporte PWA y cifrado en cliente.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_saas',
    title: '☁️ Directriz SaaS Multi-tenant & Monetización',
    category: 'SaaS',
    appTypes: ['SaaS Multi-tenant'],
    icon: 'CreditCard',
    isOfficialMaster: false,
    summary: 'Patrones para productos de suscripción: integración con Stripe Billing, verificación de webhooks, portales de cliente y control de límites por plan.',
    fullMarkdownContent: `# ☁️ Directriz SaaS Multi-tenant & Monetización (By Toni)

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > SaaS_Monetizacion.md\`

---

## 💳 1. Pasarela de Pago y Facturación
- Integración con Stripe Checkout para cobro recurrente de suscripciones y Customer Portal para autogestión de planes, facturas y tarjetas.
- Verificación estricta de firma criptográfica en todos los Webhooks de Stripe en endpoints de backend / Edge Functions para evitar manipulaciones.

---

## 👥 2. Control de Acceso por Nivel (Tiers)
- Middleware de autorización que evalúa el plan activo del usuario (Free, Pro, Enterprise) antes de permitir acceso a funcionalidades avanzadas.
- Tablas sincronizadas en Supabase con \`stripe_customer_id\`, \`subscription_status\` y \`current_period_end\`.`,
    rules: [
      'Integrar Stripe Checkout y Customer Portal para gestión de planes y tarjetas.',
      'Manejar webhooks de Stripe de forma idempotente con verificación de firma cryptographic.',
      'Middleware de control de acceso por nivel de suscripción (Free vs Pro vs Enterprise).',
      'Tablas de suscripciones sincronizadas en Supabase (stripe_customer_id, subscription_status).',
      'Flujo de onboarding con onboarding tour guiado y métricas de activación.'
    ],
    promptTemplate: 'Aplica la Directriz SaaS: Integra Stripe Checkout y Webhooks con verificación de firma, gestiona estados de suscripción en Supabase y añade control de acceso por plan de usuario.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  },
  {
    id: 'dir_backend_cli',
    title: '⚙️ Directriz de Internal CLI & Backend Services',
    category: 'Backend',
    appTypes: ['Internal CLI & Backend'],
    icon: 'Terminal',
    isOfficialMaster: false,
    summary: 'Estándares para herramientas de línea de comandos y servicios backend: flags semánticos, salida JSON opcional, logging estructurado y manejo limpio de señales POSIX.',
    fullMarkdownContent: `# ⚙️ Directriz de Internal CLI & Backend Services (By Toni)

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > Directrices > Internal_CLI_Backend.md\`

---

## 💻 1. Interfaz de Línea de Comandos
- Soporte universal de \`--help\` y \`--version\` con formato coloreado y ejemplos claros de uso.
- Flag opcional \`--json\` para permitir que la salida del script sea consumida por agentes o pipelines automatizados.
- Manejo determinista de códigos de salida (\`exit code 0\` en éxito, códigos mayores que 0 en fallos específicos).

---

## 📋 2. Logging y Resiliencia
- Registro estructurado de eventos con niveles \`INFO\`, \`WARN\`, \`ERROR\` y \`DEBUG\`.
- Captura de señales del sistema (\`SIGINT\`, \`SIGTERM\`) para limpieza ordenada de recursos antes del cierre.`,
    rules: [
      'Proporcionar siempre flag --help interactivo con ejemplos claros de invocación.',
      'Soportar salida en formato JSON con flag --json para interoperabilidad.',
      'Manejar señales del sistema (SIGINT/SIGTERM) para cierre limpio sin corrupción de datos.',
      'Logging estructurado con timestamp ISO y niveles de severidad claros.'
    ],
    promptTemplate: 'Aplica la Directriz CLI/Backend: Desarrolla el script o servicio backend con soporte de flags estándar (--help, --json), logging estructurado y manejo limpio de errores y señales del sistema.',
    driveUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_bytoni',
    name: 'ByToniProyect',
    slug: 'mia_bytoniproyect',
    category: 'Suite Toni (Propio / I+D)',
    status: 'En Desarrollo',
    appType: 'Web & Frontend',
    tagline: 'Centro de mando y clon de Asana para desarrollo ágil de apps asistido por IA',
    problem: 'Orquestar de forma centralizada todas las apps de Toni, sincronizar directrices maestras y acelerar la creación con prompts de IA listos para ejecutar.',
    targetAudience: 'Toni (desarrollo propio) y subagentes de IA de Antigravity',
    coreFeatures: [
      'Multi-vistas tipo Asana (Lista, Tablero Kanban con Drag & Drop, Cronograma, Calendario, Panel)',
      'Drawer lateral de detalle de tareas con checklist de directrices de Drive y adjuntos de archivos/audio/imágenes',
      'Gestor integral de directrices de Drive (editar, copiar, etiquetar por tipo de app, eliminar)',
      'Generador interactivo de Prompts Maestros para Antigravity',
      'Sincronización bidireccional con Google Drive y Supabase'
    ],
    database: 'Sí - Supabase PostgreSQL (Esquema Aislado)',
    auth: 'Sí - Supabase Auth (Email / Magic Link)',
    aiIntegration: 'Agente Autónomo / Tool Calling & Copilot',
    aiProvider: 'OpenAI (GPT-4o / GPT-4o-mini)',
    businessModel: 'No Aplica / Uso Interno',
    frontendStack: 'React 19 + TypeScript + Vite',
    uiStyle: 'Tailwind CSS + Glassmorphism Dark',
    color: '#6366F1',
    icon: 'LayoutGrid',
    supabaseSchema: 'mia_bytoniproyect',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW',
    createdAt: '2026-09-25T17:00:00Z'
  },
  {
    id: 'proj_vita',
    name: 'Vita-Trading',
    slug: 'mia_vitatrading',
    category: 'Suite Toni (Propio / I+D)',
    status: 'En Desarrollo',
    appType: 'Trading & Algoritmos',
    tagline: 'Plataforma algorítmica y diario de trading cuantitativo para criptomonedas y Forex',
    problem: 'Controlar el riesgo, registrar operaciones automáticamente y ejecutar estrategias sistemáticas sin sesgos emocionales.',
    targetAudience: 'Traders sistemáticos y análisis de mercados',
    coreFeatures: [
      'Diario de operaciones y registro automático de trades',
      'Conexión WebSocket con Binance para cálculo de SL dinámico',
      'Cálculo de tamaño de posición según porcentaje de riesgo fijo',
      'Dashboard de métricas avanzadas (Win Rate, Profit Factor, Expectancy)',
      'Backtesting de estrategias con datos históricos'
    ],
    database: 'Sí - Supabase PostgreSQL (Esquema Aislado)',
    auth: 'Sí - Supabase Auth (Email / Magic Link)',
    aiIntegration: 'Análisis & Procesamiento de Datos',
    aiProvider: 'Anthropic (Claude 3.5 Sonnet)',
    businessModel: 'Suscripción SaaS (Stripe Checkout)',
    frontendStack: 'React 19 + TypeScript + Vite',
    uiStyle: 'Tailwind CSS + Glassmorphism Dark',
    color: '#10B981',
    icon: 'TrendingUp',
    supabaseSchema: 'mia_vitatrading',
    createdAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'proj_bici',
    name: 'Bicicletas-Puertanueva',
    slug: 'com_bicicletas',
    category: 'Comercial / Clientes',
    status: 'En Producción',
    appType: 'Web & Frontend',
    tagline: 'Catálogo digital y taller online para tienda de ciclismo especializada',
    problem: 'Digitalizar el catálogo de bicicletas, permitir citas previas de taller y captar clientes locales en Ciudad Real.',
    targetAudience: 'Ciclistas aficionados, deportistas y clientes del taller',
    coreFeatures: [
      'Catálogo interactivo con filtros por marca, tipo y precio',
      'Reserva online de cita de taller con selección de servicio',
      'Páginas legales completas RGPD con titularidad de cliente',
      'Integración con WhatsApp Business para contacto directo',
      'Panel de administración para actualizar stock y precios'
    ],
    database: 'Sí - Supabase PostgreSQL (Esquema Aislado)',
    auth: 'Sí - Supabase Auth (Email / Magic Link)',
    aiIntegration: 'Asistente Conversacional / Chatbot',
    aiProvider: 'OpenAI (GPT-4o / GPT-4o-mini)',
    businessModel: 'Pago Único (Licencia / Stripe)',
    frontendStack: 'React 19 + TypeScript + Vite',
    uiStyle: 'Tailwind CSS Modern Clean',
    color: '#F59E0B',
    icon: 'Bike',
    supabaseSchema: 'com_bicicletas',
    createdAt: '2026-09-15T09:00:00Z'
  },
  {
    id: 'proj_flowgirl',
    name: 'Flow-Girl',
    slug: 'mia_flowgirl',
    category: 'Suite Toni (Propio / I+D)',
    status: 'En Desarrollo',
    appType: 'Mobile & PWA (Local-First)',
    tagline: 'Seguimiento de salud femenina, ciclo hormonal y bienestar con privacidad absoluta Zero-Knowledge',
    problem: 'Proporcionar una alternativa 100% privada y segura a las apps comerciales de ciclo que venden datos médicos.',
    targetAudience: 'Mujeres que buscan control de ciclo sin comprometer su privacidad',
    coreFeatures: [
      'Arquitectura Local-First con base de datos en dispositivo (IndexedDB)',
      'Predicción matemática del ciclo basada en el método STRAW+10',
      'Cifrado en cliente AES-256 de todas las notas y síntomas',
      'Diseño táctil Bio-Minimalista optimizado para smartphone (WCAG AAA)',
      'Exportación en formato PDF para visitas médicas'
    ],
    database: 'No - Sin Base de Datos / Local Storage',
    auth: 'No - Acceso Público / Libre',
    aiIntegration: 'No Requiere IA',
    aiProvider: 'No Aplica',
    businessModel: 'Gratuito / Libre',
    frontendStack: 'React 19 + TypeScript + Vite',
    uiStyle: 'Tailwind CSS Modern Clean',
    color: '#EC4899',
    icon: 'HeartHandshake',
    supabaseSchema: 'mia_flowgirl',
    createdAt: '2026-09-10T08:00:00Z'
  }
];

export const INITIAL_SECTIONS: Section[] = [
  { id: 'sec_1', projectId: 'proj_bytoni', title: '🚀 Fase 1: Inicialización & Especificación', order: 1 },
  { id: 'sec_2', projectId: 'proj_bytoni', title: '🗄️ Fase 2: Backend Supabase & RLS', order: 2 },
  { id: 'sec_3', projectId: 'proj_bytoni', title: '💻 Fase 3: Frontend Asana Views & Kanban Drag & Drop', order: 3 },
  { id: 'sec_4', projectId: 'proj_bytoni', title: '🤖 Fase 4: Orquestador Directrices Drive & Prompts', order: 4 },
  { id: 'sec_5', projectId: 'proj_bytoni', title: '📂 Fase 5: Documentación Drive & Lanzamiento', order: 5 }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    projectId: 'proj_bytoni',
    sectionId: 'sec_1',
    title: 'Definir especificación de ByToniProyect con la plantilla simplificada de Drive',
    description: 'Completar el briefing ágil heredando las 5 directrices maestras de Google Drive sin redundancias.',
    status: 'completed',
    priority: 'Alta',
    assignedTo: 'Toni',
    assignedAvatar: '👨‍💻',
    dueDate: '2026-09-25',
    startDate: '2026-09-25',
    estimatedHours: 2,
    subtasks: [
      { id: 'sub_1', title: 'Crear slug mia_bytoniproyect', completed: true },
      { id: 'sub_2', title: 'Comprobar carpeta Apps-Desarrollo/ByToniProyect en Google Drive', completed: true },
      { id: 'sub_3', title: 'Definir vistas clave (Lista, Kanban Drag & Drop, Cronograma, Hub Directrices)', completed: true }
    ],
    tags: ['Especificación', 'Drive'],
    directivesChecked: {
      supabaseSchema: true,
      rlsStrict: true,
      securityAuth: true,
      aiStreaming: true,
      rgpdLegal: true,
      driveSync: true
    },
    attachments: [
      {
        id: 'att_1',
        name: 'Directriz-Definicion-Proyecto.md',
        type: 'document',
        size: '7.2 KB',
        url: 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW',
        uploadedAt: '2026-09-25T17:30:00Z',
        mimeType: 'text/markdown'
      }
    ],
    comments: [
      {
        id: 'comm_1',
        author: 'Toni',
        avatar: '👨‍💻',
        content: 'Briefing completado con éxito según la directriz simplificada.',
        createdAt: '2026-09-25T17:45:00Z'
      }
    ],
    activities: [
      { id: 'act_1', user: 'Toni', action: 'Completó la especificación del proyecto', timestamp: '2026-09-25T17:45:00Z' }
    ],
    createdAt: '2026-09-25T17:00:00Z'
  },
  {
    id: 'task_2',
    projectId: 'proj_bytoni',
    sectionId: 'sec_2',
    title: 'Crear script de base de datos Supabase (esquema mia_bytoniproyect con RLS)',
    description: 'Generar la migración SQL 20260925_init_schema.sql con aislamiento de esquema y políticas estrictas vinculadas a auth.users(id).',
    status: 'completed',
    priority: 'Urgente',
    assignedTo: 'Toni',
    assignedAvatar: '👨‍💻',
    dueDate: '2026-09-25',
    startDate: '2026-09-25',
    estimatedHours: 3,
    subtasks: [
      { id: 'sub_4', title: 'Declarar CREATE SCHEMA IF NOT EXISTS mia_bytoniproyect', completed: true },
      { id: 'sub_5', title: 'Crear tablas projects, sections, tasks, subtasks, directives', completed: true },
      { id: 'sub_6', title: 'Activar ALTER TABLE ENABLE ROW LEVEL SECURITY en todas las tablas', completed: true },
      { id: 'sub_7', title: 'Crear políticas RLS para auth.uid() = user_id', completed: true }
    ],
    tags: ['Supabase', 'SQL', 'RLS'],
    directivesChecked: {
      supabaseSchema: true,
      rlsStrict: true,
      securityAuth: true,
      aiStreaming: false,
      rgpdLegal: true,
      driveSync: true
    },
    comments: [],
    activities: [
      { id: 'act_2', user: 'Toni', action: 'Generó la migración SQL de Supabase', timestamp: '2026-09-25T18:00:00Z' }
    ],
    createdAt: '2026-09-25T17:15:00Z'
  },
  {
    id: 'task_3',
    projectId: 'proj_bytoni',
    sectionId: 'sec_3',
    title: 'Implementar Tablero Kanban interactivo con Arrastrar y Soltar (Drag & Drop)',
    description: 'Permitir mover tarjetas de tareas entre columnas (Backlog, Especificación, En Desarrollo IA, Revisión QA, Listo) arrastrando fluidamente con el ratón o táctil.',
    status: 'in_development',
    priority: 'Alta',
    assignedTo: 'Toni',
    assignedAvatar: '👨‍💻',
    dueDate: '2026-09-26',
    startDate: '2026-09-25',
    estimatedHours: 4,
    subtasks: [
      { id: 'sub_8', title: 'Añadir eventos HTML5 onDragStart, onDragOver y onDrop en columnas Kanban', completed: true },
      { id: 'sub_9', title: 'Efectos visuales de arrastre y zonas de soltar iluminadas', completed: true },
      { id: 'sub_10', title: 'Disparar confeti al soltar en columna Listo / Producción', completed: true }
    ],
    tags: ['UI/UX', 'Kanban', 'DragDrop'],
    directivesChecked: {
      supabaseSchema: true,
      rlsStrict: true,
      securityAuth: true,
      aiStreaming: false,
      rgpdLegal: true,
      driveSync: true
    },
    comments: [],
    activities: [
      { id: 'act_3', user: 'Toni', action: 'Inició el desarrollo del drag and drop', timestamp: '2026-09-25T18:15:00Z' }
    ],
    createdAt: '2026-09-25T17:30:00Z'
  },
  {
    id: 'task_4',
    projectId: 'proj_bytoni',
    sectionId: 'sec_3',
    title: 'Soporte de Adjuntos en Tarjetas: Archivos, Imágenes, Notas de Audio y Enlaces',
    description: 'Añadir al Drawer de detalle y a las tarjetas la capacidad de subir archivos, visualizar imágenes, grabar audio con el micrófono y reproducirlo directamente.',
    status: 'in_development',
    priority: 'Alta',
    assignedTo: 'Toni',
    assignedAvatar: '👨‍💻',
    dueDate: '2026-09-26',
    startDate: '2026-09-25',
    estimatedHours: 3,
    subtasks: [
      { id: 'sub_11', title: 'Subida de archivos e imágenes con preview instantáneo', completed: true },
      { id: 'sub_12', title: 'Grabadora de audio y notas de voz integrada en tarjeta', completed: true },
      { id: 'sub_13', title: 'Incrustación de enlaces de Google Drive y Figma', completed: true }
    ],
    tags: ['Multimedia', 'Audio', 'Archivos'],
    directivesChecked: {
      supabaseSchema: true,
      rlsStrict: true,
      securityAuth: true,
      aiStreaming: false,
      rgpdLegal: true,
      driveSync: true
    },
    comments: [],
    activities: [],
    createdAt: '2026-09-25T17:40:00Z'
  },
  {
    id: 'task_5',
    projectId: 'proj_bytoni',
    sectionId: 'sec_4',
    title: 'Hub de Directrices Maestras con Editor Completo, Etiquetas por App y Copiado',
    description: 'Mostrar las directrices completas sin recortar tal como están en Google Drive, permitiendo editarlas, etiquetarlas para tipos específicos de apps, copiarlas o eliminarlas.',
    status: 'in_development',
    priority: 'Alta',
    assignedTo: 'Toni',
    assignedAvatar: '👨‍💻',
    dueDate: '2026-09-26',
    startDate: '2026-09-25',
    estimatedHours: 4,
    subtasks: [
      { id: 'sub_14', title: 'Filtro dinámico de directrices por tipo de app', completed: true },
      { id: 'sub_15', title: 'Modal de edición y creación de directrices personalizadas', completed: true },
      { id: 'sub_16', title: 'Visor de Markdown completo idéntico a Drive', completed: true }
    ],
    tags: ['Directrices', 'Drive', 'Editor'],
    directivesChecked: {
      supabaseSchema: true,
      rlsStrict: true,
      securityAuth: true,
      aiStreaming: true,
      rgpdLegal: true,
      driveSync: true
    },
    comments: [],
    activities: [],
    createdAt: '2026-09-25T17:50:00Z'
  },
  {
    id: 'task_idea_1',
    projectId: 'proj_bytoni',
    sectionId: 'sec_1',
    title: '💡 Permitir exportación de la Hoja de Ruta en formato PDF y Markdown',
    description: 'Propuesta recibida desde el Chat de Ayuda: Añadir un botón para descargar el estado actual de todas las columnas del roadmap para reuniones de clientes.',
    status: 'ideas_proposals',
    priority: 'Media',
    assignedTo: 'Toni',
    assignedAvatar: '👨‍💻',
    dueDate: '2026-09-30',
    startDate: '2026-09-25',
    estimatedHours: 2,
    subtasks: [
      { id: 'sub_id_1', title: 'Generar componente de renderizado PDF con estilos print', completed: false }
    ],
    tags: ['Mejora', 'Chat Ayuda', 'Roadmap'],
    directivesChecked: {
      supabaseSchema: true,
      rlsStrict: true,
      securityAuth: true,
      aiStreaming: false,
      rgpdLegal: true,
      driveSync: true
    },
    comments: [
      {
        id: 'comm_fb_1',
        author: 'Usuario del Chat',
        avatar: '💡',
        content: 'Propuesta enviada desde la zona de ayuda de la aplicación.',
        createdAt: '2026-09-25T20:30:00Z'
      }
    ],
    activities: [],
    origin: 'chat_help',
    reportType: 'idea',
    createdAt: '2026-09-25T20:30:00Z'
  },
  {
    id: 'task_bug_1',
    projectId: 'proj_bytoni',
    sectionId: 'sec_3',
    title: '🐛 Revisar auto-scroll en el visor de audio tras grabación larga',
    description: 'Incidencia notificada desde el Chat de Ayuda: En notas de voz superiores a 2 minutos, el contenedor del reproductor de audio no hacía scroll automático.',
    status: 'bugs_errors',
    priority: 'Alta',
    assignedTo: 'Toni',
    assignedAvatar: '👨‍💻',
    dueDate: '2026-09-27',
    startDate: '2026-09-25',
    estimatedHours: 1,
    subtasks: [
      { id: 'sub_bug_1', title: 'Añadir ref con scrollIntoView en audio player', completed: false }
    ],
    tags: ['Bug', 'Chat Ayuda', 'Audio'],
    directivesChecked: {
      supabaseSchema: true,
      rlsStrict: true,
      securityAuth: true,
      aiStreaming: false,
      rgpdLegal: true,
      driveSync: true
    },
    comments: [
      {
        id: 'comm_fb_2',
        author: 'QA Tester',
        avatar: '🐛',
        content: 'Reporte registrado desde la zona de soporte.',
        createdAt: '2026-09-25T21:00:00Z'
      }
    ],
    activities: [],
    origin: 'chat_help',
    reportType: 'error',
    createdAt: '2026-09-25T21:00:00Z'
  },
  {
    id: 'task_bici_fb_1',
    projectId: 'proj_bici',
    sectionId: 'sec_1',
    title: '💡 Notificación SMS / WhatsApp automática cuando una bicicleta esté reparada',
    description: 'Sugerencia de cliente enviada desde el Chat de Asistencia de Bicicletas Puertanueva para avisar automáticamente al terminar en el taller SAT.',
    status: 'ideas_proposals',
    priority: 'Alta',
    assignedTo: 'Toni',
    assignedAvatar: '👨‍💻',
    dueDate: '2026-09-28',
    startDate: '2026-09-25',
    estimatedHours: 3,
    subtasks: [
      { id: 'st_bici_1', title: 'Conectar webhook de WhatsApp Business Cloud API', completed: false }
    ],
    tags: ['Mejora', 'Bicicletas Puertanueva', 'WhatsApp'],
    directivesChecked: {
      supabaseSchema: true,
      rlsStrict: true,
      securityAuth: true,
      aiStreaming: false,
      rgpdLegal: true,
      driveSync: true
    },
    comments: [],
    activities: [],
    origin: 'chat_help',
    reportType: 'mejora',
    createdAt: '2026-09-25T19:00:00Z'
  }
];
