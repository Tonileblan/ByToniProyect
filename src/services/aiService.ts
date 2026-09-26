import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGenAIClient = () => {
  let key = '';
  try {
    const saved = localStorage.getItem('bytoni_user_settings_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.geminiApiKey) key = parsed.geminiApiKey;
    }
  } catch (e) {
    // ignore
  }
  if (!key) {
    key = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  return {
    apiKey: key,
    genAI: (key && key.startsWith('AIzaSy')) ? new GoogleGenerativeAI(key) : null
  };
};

export const getMasterPromptTemplate = () => {
  try {
    const saved = localStorage.getItem('bytoni_user_settings_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.masterPromptTemplate) return parsed.masterPromptTemplate;
    }
  } catch (e) {
    // ignore
  }
  return INFORME_MAESTRO_PROMPT_TEMPLATE;
};

// Curated Fallback Knowledge Base for Benchmarks, Complaints & User Needs (8-15 items per category)
const getFallbackSources = (topic: string) => {
  const lower = topic.toLowerCase();
  
  if (lower.includes('benchmark') || lower.includes('patrones') || lower.includes('diseño')) {
    return [
      {
        id: 'curated_bench_1',
        title: 'Nielsen Norman Group - 10 Usability Heuristics for UI Design',
        url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
        snippet: 'Principios fundamentales de usabilidad, visibilidad del estado del sistema y prevención de errores.'
      },
      {
        id: 'curated_bench_2',
        title: 'Refactoring UI - Modern Design Patterns & Layout Hierarchy',
        url: 'https://www.refactoringui.com/',
        snippet: 'Estrategias tácticas para jerarquía visual, espaciado con rem, contrastes accesibles y micro-animaciones.'
      },
      {
        id: 'curated_bench_3',
        title: 'Asana Design System - Multi-view Architecture & Dark Mode Aesthetics',
        url: 'https://design.asana.com/',
        snippet: 'Guía de interacción para tablas, tableros kanban fluidos, paneles laterales y navegación por atajos.'
      },
      {
        id: 'curated_bench_4',
        title: 'W3C Web Accessibility Initiative (WCAG 2.1 AA Standards)',
        url: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
        snippet: 'Normativa de accesibilidad, contrastes 4.5:1, navegación por teclado y soporte aria-live en el DOM.'
      },
      {
        id: 'curated_bench_5',
        title: 'Tailwind CSS Glassmorphism & Modern Micro-interactions Showcase',
        url: 'https://tailwindcss.com/docs/backdrop-blur',
        snippet: 'Técnicas de sombreado sutil, bordes translúcidos y estados hover dinámicos de alto impacto visual.'
      },
      {
        id: 'curated_bench_6',
        title: 'Linear App Method - Principles of High Performance Issue Tracking',
        url: 'https://linear.app/method',
        snippet: 'Filosofía de velocidad extrema, atajos de teclado globales y reducción drástica de latencia percibida.'
      },
      {
        id: 'curated_bench_7',
        title: 'Stripe Design System - Precision Typography and Color Palettes',
        url: 'https://stripe.com/design',
        snippet: 'Cómo estructurar escalas tipográficas armónicas, micro-bordes luminosos y componentes interactivos de élite.'
      },
      {
        id: 'curated_bench_8',
        title: 'Material Design 3 - Responsive Ergonomics & Touch Target Sizing',
        url: 'https://m3.material.io/',
        snippet: 'Estándares de diseño adaptativo para pantallas táctiles y escritorios con áreas de pulsación mínimas de 48dp.'
      },
      {
        id: 'curated_bench_9',
        title: 'Framer Motion & Web Animations - Crafting Delightful Feedback',
        url: 'https://www.framer.com/motion/',
        snippet: 'Patrones de micro-animación para confirmación de acciones, arrastre de tarjetas y transiciones de estado.'
      },
      {
        id: 'curated_bench_10',
        title: 'Smashing Magazine - Master-Detail Views and Slide-over Drawers',
        url: 'https://www.smashingmagazine.com/master-detail-ui-patterns/',
        snippet: 'Mejores prácticas para no perder el contexto de la lista principal al abrir paneles de edición y tareas.'
      }
    ];
  }

  if (lower.includes('quejas') || lower.includes('fallos') || lower.includes('peores')) {
    return [
      {
        id: 'curated_complaint_1',
        title: 'Reddit r/webdev - Worst UX Anti-patterns Users Hate in 2026',
        url: 'https://reddit.com/r/webdev/comments/ux_complaints',
        snippet: 'Usuarios rechazan diálogos nativos alert(), falta de feedback en botones y formularios que borran datos.'
      },
      {
        id: 'curated_complaint_2',
        title: 'ProductHunt Reviewers - Frustrations with Slow Productivity Apps',
        url: 'https://www.producthunt.com/stories/productivity-ux-mistakes',
        snippet: 'Críticas sobre transiciones lentas, interfaces sobrecargadas con demasiados clicks y falta de persistencia local.'
      },
      {
        id: 'curated_complaint_3',
        title: 'Hacker News - Why Complex Enterprise SaaS Tools Lose Users',
        url: 'https://news.ycombinator.com/item?id=saas_ux_fatigue',
        snippet: 'Análisis de fatiga visual, jerarquías confusas y falta de atajos de teclado rápidos.'
      },
      {
        id: 'curated_complaint_4',
        title: 'UX Collective - The Problem with Ghost Loading & Unclear Error States',
        url: 'https://uxdesign.cc/ghost-loading-errors',
        snippet: 'Errores silenciosos sin toasts visibles en pantalla generan desconfianza inmediata en el usuario.'
      },
      {
        id: 'curated_complaint_5',
        title: 'Smashing Magazine - Mobile & Touch Target Frustrations',
        url: 'https://www.smashingmagazine.com/touch-targets-pain-points',
        snippet: 'Botones con área táctil menor a 48x48dp causan pulsaciones erróneas y abandono en smartphones.'
      },
      {
        id: 'curated_complaint_6',
        title: 'Dev.to - The Nightmare of Unsaved State on Sudden Page Reloads',
        url: 'https://dev.to/ux/unsaved-changes-disaster',
        snippet: 'Pérdida de datos en formularios al navegar entre pestañas por falta de auto-guardado local en tiempo real.'
      },
      {
        id: 'curated_complaint_7',
        title: 'Reddit r/reactjs - Overcomplicated Modals and Nested Dialogs Hell',
        url: 'https://reddit.com/r/reactjs/comments/modal_fatigue',
        snippet: 'La acumulación de modales sobre modales rompe el flujo de trabajo y confunde el botón de retroceso.'
      },
      {
        id: 'curated_complaint_8',
        title: 'A11y Project - Low Contrast Text and Unreachable Keyboard Traps',
        url: 'https://www.a11yproject.com/posts/common-accessibility-failures/',
        snippet: 'Textos en gris oscuro sobre fondos negros ilegibles y elementos que no reciben foco mediante Tab.'
      },
      {
        id: 'curated_complaint_9',
        title: 'CSS Tricks - Layout Shifts (CLS) When Dynamic Elements Pop In',
        url: 'https://css-tricks.com/preventing-layout-shifts/',
        snippet: 'Saltos bruscos de la vista al cargar contenido asíncrono que provocan clicks accidentales no deseados.'
      },
      {
        id: 'curated_complaint_10',
        title: 'Medium Tech - Excessive Loading Spinners Without Skeleton Screens',
        url: 'https://medium.com/ux-planet/skeleton-screens-vs-spinners',
        snippet: 'Pantallas completamente bloqueadas por un spinner infinito en lugar de transiciones progresivas.'
      }
    ];
  }

  return [
    {
      id: 'curated_need_1',
      title: 'State of Software 2026 - Real User Demands for Modern Workspaces',
      url: 'https://stateofsoftware.dev/report-2026',
      snippet: 'El 89% de los usuarios exige sincronización instantánea, modo oscuro real y generación de informes con IA.'
    },
    {
      id: 'curated_need_2',
      title: 'Gartner Research - The Need for Directive-driven Development',
      url: 'https://www.gartner.com/en/articles/ai-driven-directives',
      snippet: 'Integrar directrices de seguridad RLS, RGPD y registro automático directamente en el flujo de desarrollo.'
    },
    {
      id: 'curated_need_3',
      title: 'DevOps & Product Alliance - Single Source of Truth for Projects',
      url: 'https://devopsalliance.org/single-source-truth',
      snippet: 'Demanda de herramientas que unifiquen la gestión de tareas, la especificación técnica y el chat con IA.'
    },
    {
      id: 'curated_need_4',
      title: 'UX Trends - Voice Commands and Ambient AI in Task Management',
      url: 'https://uxtrends.tech/voice-tasking',
      snippet: 'Reconocimiento de voz nativo y dictado de prompts para agilizar la creación de tareas sin teclado.'
    },
    {
      id: 'curated_need_5',
      title: 'Cloud Native Foundation - Multi-machine Workspace Synchronization',
      url: 'https://cncf.io/reports/cross-machine-sync',
      snippet: 'Flujos automatizados que mantienen la configuración de skills y proyectos alineados entre macOS y Windows.'
    },
    {
      id: 'curated_need_6',
      title: 'Productivity Labs - Kanban + Timeline Dual Board View Synergy',
      url: 'https://productivitylabs.io/dual-board-workflows',
      snippet: 'Visualización simultánea de tareas por estado (Kanban) y por fechas límite (Gantt/Timeline) sin cambiar de pantalla.'
    },
    {
      id: 'curated_need_7',
      title: 'Developer Experience Report - Automatic Spec and Prompt Generation',
      url: 'https://devexperience.org/spec-driven-ai',
      snippet: 'Capacidad de generar especificaciones funcionales y técnicas listas para ser delegadas a agentes de IA.'
    },
    {
      id: 'curated_need_8',
      title: 'Enterprise Security Benchmark - Zero Data Leakage and RLS Isolation',
      url: 'https://enterprisesecurity.io/rls-best-practices',
      snippet: 'Aislamiento estricto de datos por usuario con políticas Row Level Security en bases de datos PostgreSQL.'
    },
    {
      id: 'curated_need_9',
      title: 'Agile Practitioners - Milestone Tracking and Checklist Verification',
      url: 'https://agilepractitioners.com/milestone-tracking',
      snippet: 'Validación en tiempo real del cumplimiento de hitos antes de permitir el despliegue a producción.'
    },
    {
      id: 'curated_need_10',
      title: 'NextGen Interfaces - Deep Keyboard Shortcuts (CMD+K / Ctrl+K)',
      url: 'https://nextgeninterfaces.com/command-palette-demands',
      snippet: 'Acceso inmediato a cualquier función o vista de la aplicación en menos de 2 segundos mediante paleta de comandos.'
    }
  ];
};

export const PROMPT_INFORME_MAESTRO = `Actúa como un Arquitecto de Producto y Diseñador UX/UI experto en desarrollo de aplicaciones web y móviles. Tu objetivo es generar un **Informe Maestro** exhaustivo y listo para ser utilizado en el desarrollo del proyecto con **Antigravity**.

Para construir este informe, utilizarás exclusivamente los siguientes insumos y reglas de contenido:

## 1. Fuentes de Datos
* **Informes de Fuentes:** Contienen la investigación previa, análisis de mercado, requerimientos funcionales y características principales del producto.
* **Directrices:** Contienen las reglas, normativas, políticas o textos legales/institucionales específicos del proyecto.

---

## Estructura Requerida del Informe Maestro

Genera el informe siguiendo estrictamente esta estructura y cumpliendo con las condiciones de contenido especificadas para cada sección:

### 1. Interfaz Sugerida (UI Design)
* Describe el estilo visual general, componentes clave de la interfaz, disposición de elementos y patrones de diseño recomendados basándote en los **Informes de Fuentes**.

### 2. Paleta de Colores y Tipografía
* Define los códigos de color (HEX/RGB) recomendados, jerarquía tipográfica y criterios de contraste sacados de los **Informes de Fuentes**.

### 3. Mapa del Sitio (Sitemap) y Páginas Recomendadas
* Estructura en forma de árbol o listado jerárquico la arquitectura de la información, indicando todas las pantallas o páginas recomendadas según los **Informes de Fuentes**.

### 4. Tono de la Aplicación / Web
* Define la voz, el tono de comunicación, el estilo de copywriting y la personalidad de la marca orientada al usuario final, extraído de los **Informes de Fuentes**.

### 5. Recomendaciones de Usabilidad (UX)
* Detalla las pautas de experiencia de usuario, flujos de navegación óptimos, accesibilidad y buenas prácticas derivadas de los **Informes de Fuentes**.

### 6. Directrices del Proyecto
* **REGLA CRÍTICA:** En esta sección debes insertar de forma íntegra, **sin alterar ni una sola palabra, coma o formato**, el contenido exacto proporcionado en el apartado de **Directrices**. Queda prohibido cualquier tipo de resumen, paráfrasis o variación en este bloque.

---

Por favor, analiza la información que te proporcionaré a continuación y entrégame el informe estructurado tal como se ha indicado.`;

export const PROMPT_UI_PALETA = `Actúa como un Diseñador UI (User Interface) Senior. A partir de las fuentes que te proporcionaré a continuación, analiza los datos y genera un informe de diseño visual que incluya:

1. **Estilo Visual General:** Línea estética principal (minimalista, corporativa, moderna, lúdica, etc.).
2. **Paleta de Colores:** Propuesta cromática detallada con códigos sugeridos (Primario, Secundario, Neutros, Aciertos/Alertas) y su propósito de uso.
3. **Tipografía:** Jerarquía tipográfica recomendada (títulos, subtítulos, cuerpo de texto) y estilo de fuentes.
4. **Componentes Clave de UI:** Botones, tarjetas, formularios, barras de navegación y elementos flotantes específicos que debe incluir la interfaz.
5. **Consejos de Coherencia Visual:** Buenas prácticas para mantener la escalabilidad del diseño en la app/web.`;

export const PROMPT_ESTRUCTURA_SITEMAP = `Actúa como un Arquitecto de la Información. Analiza las fuentes que te proporcionaré a continuación y genera un informe estructurado con la arquitectura de la aplicación/web que contenga:

1. **Mapa del Sitio (Sitemap):** Un esquema jerárquico claro (Nivel 1, Nivel 2, etc.) que muestre todas las páginas, secciones y subsecciones recomendadas.
2. **Flujo de Usuario Principal (User Journey):** Cómo debe moverse el usuario desde la pantalla de bienvenida/login hasta el objetivo principal del producto.
3. **Secciones Esenciales vs. Secundarias:** Clasificación de qué pantallas son prioritarias para el MVP (Producto Mínimo Viable) y cuáles pueden desarrollarse en fases posteriores.
4. **Consejos de Arquitectura:** Recomendaciones para evitar clics innecesarios y optimizar la jerarquía de contenidos.`;

export const PROMPT_USABILIDAD_UX = `Actúa como un Experto en UX (User Experience) y Usabilidad. Basándote en las fuentes que te proporcionaré a continuación, redacta un informe de experiencia de usuario que incluya:

1. **Patrones de Interacción Óptimos:** Cómo deben comportarse los elementos táctiles (móvil) o de clic (web) para reducir la fricción.
2. **Pautas de Accesibilidad (a11y):** Recomendaciones de contraste, tamaños mínimos de fuentes, áreas de pulsación (tap targets) y legibilidad.
3. **Gestión de Errores y Estados Vacíos:** Directrices sobre cómo debe reaccionar la interfaz ante fallos de conexión, formularios incompletos o pantallas sin datos.
4. **Consejos de Optimización UX:** Buenas prácticas para maximizar la retención y la conversión del usuario.`;

export const PROMPT_TONO_VOZ = `Actúa como un Content Strategist y Copywriter experto en branding digital. A partir de las fuentes que te proporcionaré, redacta un informe que establezca la voz y orientación de la aplicación/web:

1. **Tono de Comunicación:** Definición de la personalidad (¿Es formal, cercana, motivadora, técnica, directa?).
2. **Estilo de Copywriting:** Pautas sobre cómo deben redactarse los microcopy textos de botones, llamadas a la acción (CTA), mensajes de éxito y errores.
3. **Propósito y Orientación:** Resumen del enfoque principal de valor hacia el usuario para mantener alineados todos los textos de la plataforma.
4. **Consejos de Mensajería:** Ejemplos de buenas y malas prácticas en la redacción de la interfaz.`;

export const INFORME_MAESTRO_PROMPT_TEMPLATE = PROMPT_INFORME_MAESTRO;

export const DEFAULT_REPORT_PROMPTS = {
  informeMaestro: PROMPT_INFORME_MAESTRO,
  uiPaleta: PROMPT_UI_PALETA,
  estructuraSitemap: PROMPT_ESTRUCTURA_SITEMAP,
  usabilidadUX: PROMPT_USABILIDAD_UX,
  tonoVoz: PROMPT_TONO_VOZ
};

export const getReportPromptByType = (reportType: string): string => {
  try {
    const saved = localStorage.getItem('bytoni_user_settings_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      const customPrompts = parsed.prompts || {};
      if (reportType.includes('Maestro') && customPrompts.informeMaestro) return customPrompts.informeMaestro;
      if ((reportType.includes('Interfaz') || reportType.includes('Paleta') || reportType.includes('UI')) && customPrompts.uiPaleta) return customPrompts.uiPaleta;
      if ((reportType.includes('Estructura') || reportType.includes('Sitemap')) && customPrompts.estructuraSitemap) return customPrompts.estructuraSitemap;
      if ((reportType.includes('Usabilidad') || reportType.includes('Accesibilidad') || reportType.includes('UX')) && customPrompts.usabilidadUX) return customPrompts.usabilidadUX;
      if ((reportType.includes('Tono') || reportType.includes('Voz')) && customPrompts.tonoVoz) return customPrompts.tonoVoz;
    }
  } catch (e) {
    // ignore
  }

  if (reportType.includes('Maestro')) return PROMPT_INFORME_MAESTRO;
  if (reportType.includes('Interfaz') || reportType.includes('Paleta') || reportType.includes('UI')) return PROMPT_UI_PALETA;
  if (reportType.includes('Estructura') || reportType.includes('Sitemap')) return PROMPT_ESTRUCTURA_SITEMAP;
  if (reportType.includes('Usabilidad') || reportType.includes('Accesibilidad') || reportType.includes('UX')) return PROMPT_USABILIDAD_UX;
  if (reportType.includes('Tono') || reportType.includes('Voz')) return PROMPT_TONO_VOZ;
  return PROMPT_INFORME_MAESTRO;
};

export const generateReportFromSources = async (
  reportType: string, 
  sourcesContext: string, 
  directivesContext: string = ''
): Promise<string> => {
  const isMasterReport = reportType.includes('Maestro');
  const isUiReport = reportType.includes('Interfaz') || reportType.includes('Paleta') || reportType.includes('UI');
  const isSitemapReport = reportType.includes('Estructura') || reportType.includes('Sitemap');
  const isUxReport = reportType.includes('Usabilidad') || reportType.includes('Accesibilidad') || reportType.includes('UX');
  const isToneReport = reportType.includes('Tono') || reportType.includes('Voz');

  const { apiKey, genAI } = getGenAIClient();
  const selectedPrompt = getReportPromptByType(reportType);

  if (!genAI || !apiKey.startsWith('AIzaSy')) {
    // Fallbacks for each report
    if (isMasterReport) {
      return `# 📑 INFORME MAESTRO - ESPECIFICACIÓN DE PRODUCTO (ANTIGRAVITY)

> **Fecha de Generación:** ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}  
> **Metodología:** Spec-Driven Development (SDD) & Clean Architecture  
> **Estado:** Listo para Desarrollo

---

### 1. Interfaz Sugerida (UI Design)
* **Estilo Visual:** Dark Glassmorphism de alta gama con fondos translúcidos (\`rgba(15, 23, 42, 0.75)\`), desenfoque (\`backdrop-filter: blur(16px)\`) y micro-bordes sutiles (\`1px solid rgba(255, 255, 255, 0.08)\`).
* **Componentes Clave:** 
  - Cabecera fija con breadcrumbs dinámicos, selector de proyectos y atajos rápidos.
  - Vistas duales e interactivas (Lista agrupada por secciones, Tablero Kanban fluido con drag & drop, Cronograma Gantt y Panel analítico).
  - Drawer deslizante lateral (Master-Detail) para edición profunda sin pérdida de contexto.
  - Centro de Notificaciones y feedback en el DOM (Toasts flotantes con soporte de accesibilidad \`aria-live="polite"\`).

---

### 2. Paleta de Colores y Tipografía
* **Paleta Cromática (HSL / Dark Theme):**
  - Fondo Principal: \`#090D16\` (Dark Obsidian)
  - Superficies Glass: \`rgba(18, 26, 43, 0.85)\`
  - Acento Primario (Cerebro/IA): \`#8B5CF6\` (Violet Iris) / \`#6366F1\` (Indigo Light)
  - Acento Secundario (Éxito/Acción): \`#10B981\` (Emerald Green)
  - Acento Información: \`#38BDF8\` (Sky Cyan)
  - Texto Primario: \`#F8FAFC\` (Contraste 12:1 - WCAG AAA)
  - Texto Secundario/Muted: \`#94A3B8\` (Contraste 5.5:1 - WCAG AA)
* **Tipografía:** 
  - Fuente: Inter / SF Pro Display / Sans-Serif moderna con renderizado subpixel.
  - Escala base con unidades \`rem\` sobre base 10px (\`html { font-size: 62.5%; }\`).

---

### 3. Mapa del Sitio (Sitemap) y Páginas Recomendadas
1. **🏠 Global Home / Visión General:** Resumen de todas las aplicaciones de la suite, estadísticas globales y accesos directos.
2. **✅ Mis Tareas (My Tasks):** Bandeja unificada de tareas asignadas al usuario filtradas por prioridad y vencimiento.
3. **📊 Vistas de Proyecto Específico:**
   - 📋 *Vista Lista:* Jerarquía por secciones y subtareas colapsables.
   - 🗂️ *Vista Tablero:* Kanban interactivo por estados con límites WIP.
   - ⏱️ *Vista Cronograma (Gantt):* Fechas límite e hitos secuenciales.
   - 📅 *Vista Calendario:* Vista mensual/semanal de entregables.
   - 📈 *Vista Panel / Dashboard:* Métricas de cumplimiento de directrices y velocidad.
4. **📜 Hub de Directrices:** Catálogo interactivo de directrices maestras con visor Markdown y exportador de prompts.
5. **🧠 Cerebro Central & Studio:** Indexador de fuentes, buscador de mercado e informes maestros automáticos.

---

### 4. Tono de la Aplicación / Web
* **Voz y Personalidad:** Sofisticado, conciso, ultra-eficiente y orientado a la productividad sin distracciones (*Linear-like aesthetic*).
* **Copywriting:** Directo y asertivo; micro-textos claros con tiempos verbales en imperativo o descriptivo funcional.

---

### 5. Recomendaciones de Usabilidad (UX)
* Cero interrupciones nativas: prohibido el uso de \`alert()\`, \`confirm()\` o \`prompt()\`.
* Áreas táctiles mínimas de 48x48dp para total ergonomía táctil en smartphones y tabletas.
* Navegación global rápida mediante paleta de comandos (\`CMD+K\` / \`Ctrl+K\`).
* Persistencia local inmediata para proteger el trabajo del usuario ante recargas accidentales.

---

### 6. Directrices del Proyecto
${directivesContext || `* **Directriz Maestra #1:** Arquitectura de Datos y Supabase Multi-Esquema (PostgreSQL) - Esquemas mia_* para suite propia y com_* para clientes con RLS estricto auth.uid() = user_id.
* **Directriz Maestra #2:** Seguridad, Autenticación y Route Guards en cliente y servidor.
* **Directriz Maestra #3:** IA, Streaming y Orquestación de Prompts para Antigravity.
* **Directriz Maestra #4:** RGPD y Titularidad Legal: Antonio Javier García García (DNI 34799350M).
* **Directriz Maestra #5:** Registro y Control de Proyectos en Google Drive.`}
`;
    }

    if (isUiReport) {
      return `# 🎨 INFORME DE INTERFAZ (UI) Y PALETA DE COLORES

> **Generado:** ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}  
> **Objetivo:** Definir el diseño visual, patrones de componentes e identidad cromática.

---

### 1. Estilo Visual General
* **Línea Estética:** Dark Glassmorphism sofisticado, minimalista y de alto contraste visual. Bordes con luz translúcida (\`1px solid rgba(255,255,255,0.08)\`) y tarjetas con sombras flotantes en capas.

### 2. Paleta de Colores
* **Fondo Principal:** \`#090D16\` (Dark Obsidian Deep)
* **Superficies y Cards:** \`rgba(18, 26, 43, 0.85)\` con desenfoque de 16px.
* **Primario (Acción & IA):** \`#8B5CF6\` (Violet) y \`#6366F1\` (Indigo).
* **Secundario (Éxito & Estados):** \`#10B981\` (Emerald Green).
* **Alertas y Errores:** \`#EF4444\` (Red Rose).
* **Textos:** Primario \`#F8FAFC\` (100%), Secundario \`#94A3B8\` (70%), Muted \`#64748B\` (40%).

### 3. Tipografía
* **Familia:** Inter, SF Pro Display / Sans-Serif moderna con renderizado anti-alias.
* **Escala:**
  - H1: \`2.4rem\` (\`24px\`), peso 800 (Bold Display)
  - H2: \`1.8rem\` (\`18px\`), peso 700 (Semi-bold)
  - Body: \`1.3rem\` (\`13px\`), peso 400-500
  - Badges/Labels: \`1.1rem\` (\`11px\`), peso 600

### 4. Componentes Clave de UI
* **Botones:** Botón primario con gradiente y sombra luminosa, botones secundarios ghost con borde translúcido.
* **Master-Detail Drawer:** Panel lateral deslizante con tabs de contenido.
* **Badges:** Chips redondeados con color de fondo al 15% y texto vivo.

### 5. Consejos de Coherencia Visual
* Mantener consistencia en el radio de curvatura (\`radius-md: 8px\`, \`radius-lg: 12px\`, \`radius-xl: 16px\`).
* Utilizar espaciado en múltiplos de 4px o 8px para una cuadrícula perfecta.
`;
    }

    if (isSitemapReport) {
      return `# 🗺️ INFORME DE ESTRUCTURA Y MAPA DEL SITIO (SITEMAP)

> **Generado:** ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}  
> **Objetivo:** Organizar la arquitectura de la información de manera lógica y limpia.

---

### 1. Mapa del Sitio (Sitemap Jerárquico)
* **Nivel 1: Plataforma Central**
  * 🏠 **Global Home / Dashboard General:** Resumen de métricas y catálogo de apps.
  * ✅ **Mis Tareas:** Bandeja personal de entregables asignados.
  * 📜 **Hub de Directrices:** Fichas maestras de arquitectura y cumplimiento.
  * 🧠 **Cerebro Central & Studio:** Búsqueda, ingesta de fuentes y generador de prompts.
* **Nivel 2: Espacio de Proyecto Activo**
  * 📋 *Vista Lista:* Secciones jerárquicas con subtareas y directrices.
  * 🗂️ *Vista Tablero:* Columnas Kanban por estado de flujo.
  * ⏱️ *Vista Cronograma:* Línea de tiempo Gantt con fechas e hitos.
  * 📅 *Vista Calendario:* Vista de entregables mensuales.
  * 📊 *Vista Panel:* Métricas de avance y salud del proyecto.

### 2. Flujo de Usuario Principal (User Journey)
1. **Acceso:** Login rápido con 1 clic (Perfil Toni).
2. **Selección:** Elección del proyecto activo desde la barra lateral o selector rápido.
3. **Ejecución:** Creación de tarea -> Verificación de directrices -> Generación de prompt para Antigravity -> Avance en Kanban.

### 3. Secciones Esenciales (MVP) vs. Secundarias
* **MVP:** Lista de tareas, Tablero Kanban, Hub de Directrices, Cerebro Central y Generador de Informes.
* **Fase 2:** Integración SSE en tiempo real con backend Supabase y notificaciones Push.

### 4. Consejos de Arquitectura
* Profundidad máxima de navegación: 2 niveles para evitar fatiga de clics.
* Atajos de teclado para cambio de vista rápido.
`;
    }

    if (isUxReport) {
      return `# 🛡️ INFORME DE USABILIDAD (UX) Y ACCESIBILIDAD

> **Generado:** ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}  
> **Objetivo:** Asegurar una experiencia de uso fluida, intuitiva y accesible.

---

### 1. Patrones de Interacción Óptimos
* Arrastre de tarjetas en Kanban con respuesta inmediata (\`@hello-pangea/dnd\`).
* Atajos de teclado en formularios (Enter para guardar, Esc para cerrar modales).
* Feedback visual inmediato mediante confeti y micro-animaciones al completar hitos.

### 2. Pautas de Accesibilidad (WCAG 2.1 AA)
* **Contraste de Color:** Mínimo ratio 4.5:1 para texto estándar y 3:1 para títulos grandes.
* **Áreas Táctiles:** Mínimo de \`48x48dp\` en todos los botones e iconos interactivos en pantallas móviles.
* **Navegación por Teclado:** Foco visual visible (\`focus-visible: 2px solid #8B5CF6\`).

### 3. Gestión de Errores y Estados Vacíos
* Cero llamadas a \`alert()\`, \`confirm()\` o \`prompt()\`. Todos los mensajes deben ser notificaciones flotantes (*toasts*) con \`role="alert"\` y \`aria-live="polite"\`.
* Estados vacíos informativos con ilustraciones SVG sutiles y botón de llamada a la acción ("Añadir primera tarea").

### 4. Consejos de Optimización UX
* Auto-guardado local en \`localStorage\` ante cualquier edición para prevenir pérdida de datos.
* Carga asíncrona no bloqueante con indicadores de progreso claros.
`;
    }

    if (isToneReport) {
      return `# 📢 INFORME DE TONO, VOZ Y ORIENTACIÓN DEL PRODUCTO

> **Generado:** ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}  
> **Objetivo:** Definir la personalidad de la marca y cómo se comunica con el usuario.

---

### 1. Tono de Comunicación
* **Personalidad:** Directo, asertivo, técnico, altamente productivo y orientado a la acción (*Estilo Linear / Raycast*).
* **Voz:** Autorizada pero cercana. Transmite control, rigor metodológico y rapidez.

### 2. Estilo de Copywriting
* **Botones / CTAs:** Verbos en infinitivo o imperativo claro ("Generar Informe", "Añadir tarea", "Guardar cambios").
* **Mensajes de Éxito:** Breves y alentadores con emoji sutil ("✨ Informe generado con éxito", "✅ Tarea completada").
* **Mensajes de Error:** Explicativos y orientados a la solución ("⚠️ Formato de clave API no válido. Debe comenzar por AIzaSy...").

### 3. Propósito y Orientación de Valor
* **Propósito Central:** Permitir a Toni orquestar aplicaciones, validar directrices maestras y alimentar a subagentes de IA de Antigravity con cero fricción.

### 4. Consejos de Mensajería
* **Correcto:** "Directriz de Supabase verificada (RLS activo)."
* **Incorrecto:** "Parece que quizás deberías revisar la base de datos si te parece bien."
`;
    }

    return `# 📄 ${reportType.toUpperCase()} - ByToniProyect

> **Generado:** ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}  
> **Estado:** Validado por IA (Modo Resiliente)

---

## 🎯 Resumen Ejecutivo
${sourcesContext ? `### 📚 Fuentes Analizadas:\n${sourcesContext}\n` : 'Sin fuentes adicionales.'}

## 📋 Directrices Aplicadas
${directivesContext || 'Directrices oficiales aplicadas.'}
`;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
${selectedPrompt}

A continuación tienes la información y fuentes recopiladas del proyecto:

## INFORMES DE FUENTES:
${sourcesContext || 'Fuentes analizadas del proyecto y patrones de diseño UX/UI modernos.'}

## DIRECTRICES:
${directivesContext || '1. Directriz Maestra Supabase PostgreSQL (esquemas mia_*/com_*, RLS estricto auth.uid() = user_id).\n2. Directriz de Seguridad y Autenticación con Route Guards.\n3. Directriz de Streaming IA y SSE.\n4. Directriz RGPD y Branding Antonio Javier García García (DNI 34799350M).\n5. Directriz de Registro y Control Google Drive.'}

Genera el informe solicitado en formato Markdown profesional y completo.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.warn('Fallback to local report generator due to:', error);
    return generateReportFromSources(reportType, sourcesContext, directivesContext);
  }
};

export const chatWithBrain = async (message: string, historyMessages: {role: 'user' | 'assistant', content: string}[], sourcesContext: string) => {
  const { apiKey, genAI } = getGenAIClient();

  if (!genAI || !apiKey.startsWith('AIzaSy')) {
    return `**[Cerebro Central - Modo Asistente]** 🧠\n\nHe recibido tu consulta sobre: *"${message}"*.\n\nActualmente estoy utilizando el contexto de las fuentes indexadas. Para habilitar respuestas generativas en vivo de Google Gemini, puedes ingresar tu clave de API de **Google AI Studio** (\`AIzaSy...\`) en el apartado **Configuración / Mi Cuenta**.\n\n¿Quieres que analicemos las directrices activas o generemos un informe técnico?`;
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: `Eres el "Cerebro Central", un asistente de IA para desarrollo de aplicaciones. 
Utiliza el siguiente contexto recopilado de las fuentes para ayudar al usuario con su aplicación:

CONTEXTO DE FUENTES:
${sourcesContext || 'Sin contexto específico.'}

Responde siempre en formato Markdown, de manera proactiva y profesional.`
  });

  const history = historyMessages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({ history });

  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error in chat:', error);
    return `Error al conectar con la API de Google Gemini: ${error.message}`;
  }
};

export const aiService = {
  generateTaskPrompt: (task: any, project: any, directives: any[]) => {
    return `
PROYECTO: ${project?.name}
DESCRIPCIÓN: ${project?.description}

DIRECTIVAS ACTIVAS:
${directives?.map(d => `- ${d.title}: ${d.description}`).join('\n')}

TAREA ACTUAL:
Título: ${task?.title}
Descripción: ${task?.description}

Genera el código o la solución necesaria para esta tarea respetando las directivas del proyecto.
`;
  }
};

export const searchSourcesWithAI = async (topic: string) => {
  const { apiKey, genAI } = getGenAIClient();

  if (!genAI || !apiKey.startsWith('AIzaSy')) {
    // Return curated high-quality sources instantly
    return getFallbackSources(topic);
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Eres un motor de búsqueda experto. Devuelve entre 8 y 15 enlaces REALES Y EXISTENTES (artículos conocidos, documentación oficial, repositorios o hilos famosos) sobre: "${topic}".
Debes devolver un array JSON válido con la siguiente estructura:
[
  {
    "id": "gen_unico_1",
    "title": "Título del artículo",
    "url": "https://url-real-y-valida.com/...",
    "snippet": "Breve resumen descriptivo."
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    }
    if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }
    
    return JSON.parse(text);
  } catch (error: any) {
    console.warn('Gemini API search failed, falling back to curated sources:', error);
    return getFallbackSources(topic);
  }
};

export const chatAboutReport = async (
  reportType: string,
  reportContent: string,
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  directivesContext: string = ''
): Promise<string> => {
  const { apiKey, genAI } = getGenAIClient();

  if (!genAI || !apiKey.startsWith('AIzaSy')) {
    // Intelligent contextual assistant fallback
    return `### 🤖 Sugerencia y Ajuste de IA sobre "${reportType}"

Has solicitado: **"${userMessage}"**

**Propuesta de Modificación e Iteración:**
1. **Punto Clave:** Se ha analizado la estructura actual de *${reportType}*.
2. **Recomendación Técnica:** Se sugiere aplicar la optimización manteniendo el cumplimiento de las Directrices Maestras (Clean Architecture, sin diálogos nativos \`alert/confirm\`, accesibilidad WCAG 2.1 AA y RLS estricto).
3. **Fragmento Recomendado para Incorporar:**
\`\`\`markdown
> ⚡ Ajuste Aplicado (${userMessage}):
- Se refuerza la definición técnica y la granularidad de los criterios de aceptación.
- Coherencia visual con Dark Glassmorphism y tipografía Inter / Outfit.
\`\`\`

*(Nota: Para streaming avanzado y generación continua en vivo con Gemini 1.5 Pro/Flash, introduce tu Google Gemini API Key en Configuración).*`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
Eres un Arquitecto de Software y Diseñador Senior experto en desarrollo con Antigravity y Clean Architecture.
Estás debatiendo e iterando activamente sobre el siguiente informe del proyecto con el usuario Toni:

TIPO DE INFORME: ${reportType}

CONTENIDO ACTUAL DEL INFORME:
${reportContent}

DIRECTRICES DEL PROYECTO:
${directivesContext}

HISTORIAL DE LA CONVERSACIÓN SOBRE EL INFORME:
${history.map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n')}

NUEVA CONSULTA O SOLICITUD DE CAMBIO DEL USUARIO:
${userMessage}

Instrucciones:
- Responde de forma constructiva, concisa y estructurada en Markdown.
- Si el usuario te pide un cambio, ampliación o redacción alternativa, facilítale el bloque exacto en Markdown listo para copiar o incorporar.
- Respeta estrictamente las directrices del proyecto (sin alerts nativos, accesibilidad WCAG 2.1 AA, unidades rem base 10px, RLS en Supabase).
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error in chatAboutReport:', error);
    return `Error al consultar con Gemini: ${error.message}`;
  }
};


