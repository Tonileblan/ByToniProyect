import { Project, DirectiveItem, Task, ProjectResearchInsights } from '../types/project';

export const blueprintService = {
  /**
   * Genera el documento de investigación y solicitudes de búsqueda especializadas para Google NotebookLM
   */
  generateNotebookResearchDossier(project: Project): string {
    const isCommercial = project.category.includes('Comercial');
    const schemaPrefix = isCommercial ? 'com_' : 'mia_';

    return `# 🔬 DOSSIER DE INVESTIGACIÓN Y CONSULTAS PARA GOOGLE NOTEBOOKLM
## PROYECTO: ${project.name} (${project.slug})

> **Objetivo:** Recopilar fuentes de máxima calidad, benchmarks de interfaz, análisis de críticas de competidores y necesidades no cubiertas para fundamentar el Archivo Maestro de Desarrollo en Antigravity.
> **Herramienta:** Cargar en [Google NotebookLM](https://notebooklm.google.com) o ejecutar en agentes de búsqueda web.

---

### 📌 1. FICHA BASE DEL PROYECTO
- **Nombre:** ${project.name}
- **Slug / Esquema Supabase:** \`${project.supabaseSchema || project.slug}\`
- **Categoría:** ${project.category}
- **Tipo de Aplicación:** ${project.appType}
- **Propuesta de Valor:** ${project.tagline}
- **Problema Central que Resuelve:** ${project.problem}
- **Público Objetivo (Target):** ${project.targetAudience}
- **Stack Técnico Previsto:** ${project.frontendStack}
- **Estilo Base:** ${project.uiStyle}
- **Base de Datos:** ${project.database}
- **Motor de IA:** ${project.aiIntegration} (${project.aiProvider})

---

### 🔍 2. SOLICITUDES DE BÚSQUEDA WEB RECOMENDADAS (Search Queries)

Copia y busca estas consultas en Google / Perplexity / Reddit / App Store para recopilar fuentes en NotebookLM:

\`\`\`text
1. [BENCHMARK INTERFAZ] "Mejores aplicaciones de ${project.appType} para ${project.targetAudience} diseño UI UX 2026"
2. [CRÍTICAS Y QUEJAS] "Peores problemas quejas usuarios apps ${project.name.toLowerCase()} app store reddit trustpilot"
3. [NECESIDADES NO CUBIERTAS] "Funcionalidades más demandadas y no resueltas en software para ${project.targetAudience}"
4. [ERGONOMÍA Y ESTILO] "Design system modern dark glassmorphism color palette for ${project.appType} apps"
5. [ESTRUCTURA DE NAVEGACIÓN] "Sitemap ideal user flow onboarding and dashboard for ${project.appType}"
\`\`\`

---

### 🤖 3. PROMPT DE ANÁLISIS ESTRUCTURADO PARA EL CHAT DE NOTEBOOKLM

Pega este prompt directamente en el chat de tu libreta de Google NotebookLM una vez añadidas las fuentes o enlaces:

\`\`\`text
Actúa como un Diseñador de Producto y Arquitecto de Software Senior especializado en aplicaciones de alto impacto.
Analiza todas las fuentes añadidas sobre la temática "${project.name}" (${project.appType}) y responde estructuradamente a los siguientes 5 puntos clave:

1. MEJOR INTERFAZ Y BENCHMARKING:
¿Cuáles son los patrones de diseño, componentes y flujos de usuario líderes en este tipo de producto? ¿Qué hace que una interfaz sea intuitiva y atractiva para ${project.targetAudience}?

2. ANÁLISIS DE CRÍTICAS Y FALLOS DE LA COMPETENCIA (A EVITAR):
¿De qué se quejan habitualmente los usuarios de las apps y webs existentes similares a esta temática? Enumera los 5 puntos de fricción más graves que debemos solucionar.

3. NECESIDADES NO CUBIERTAS Y "KILLER FEATURES":
¿Qué funcionalidades o características demandan los usuarios que la mayoría de competidores ignoran o implementan mal?

4. ESTILO VISUAL, PALETA Y PSICOLOGÍA DEL COLOR:
Recomienda una paleta de colores moderna (Tailwind HSL Dark Mode / Glassmorphism), tipografías Google Fonts ideales (titulares y cuerpo) y micro-interacciones recomendadas para transmitir profesionalidad en ${project.name}.

5. ARQUITECTURA Y SITEMAP RECOMENDADO:
Propón la estructura de vistas, menús y navegación ideal para esta aplicación siguiendo Clean Architecture en frontend (Domain / Data / Presentation).
\`\`\`

---

### 📝 4. REGISTRO DE CONCLUSIONES Y DECISIONES
Una vez completado el análisis en NotebookLM, copia las conclusiones clave en la pestaña **"2. Ingesta de Hallazgos"** de ByToniProyect para enriquecer automáticamente el Archivo Maestro de Antigravity.
`;
  },

  /**
   * Genera el ARCHIVO MAESTRO COMPLETO Y DEFINITIVO para Antigravity (BLUEPRINT_ANTIGRAVITY.md)
   */
  generateMasterAntigravityBlueprint(
    project: Project, 
    directives: DirectiveItem[], 
    tasks: Task[], 
    research?: ProjectResearchInsights
  ): string {
    const relevantDirectives = directives.filter(
      d => d.isOfficialMaster || 
      d.category === 'General Drive' ||
      (d.appTypes && d.appTypes.some(t => t === 'Todas las Apps' || t === project.appType))
    );

    const approvedTasks = tasks.filter(t => t.status === 'approved' || t.status === 'in_development' || t.status === 'specification');
    const schema = project.supabaseSchema || project.slug;

    return `================================================================================
# ⚡ ARCHIVO MAESTRO DE ESPECIFICACIÓN Y DESARROLLO (BY TONI)
# PROYECTO: ${project.name.toUpperCase()} (${project.slug})
================================================================================

> **Metodología Oficial:** By Toni · Clean Architecture · 5 Directrices Maestras Google Drive
> **Destinatario de Ejecución:** Antigravity / Subagentes Expertos Senior en Frontend & Backend
> **Fecha de Generación:** ${new Date().toISOString().split('T')[0]}

---

## 🎯 1. BRIEFING EJECUTIVO Y PROPUESTA DE VALOR

- **Nombre Oficial del Proyecto:** ${project.name}
- **Slug / Código Identificador:** \`${project.slug}\`
- **Categoría:** ${project.category}
- **Tipo de Aplicación:** ${project.appType}
- **Estado Inicial:** ${project.status}
- **Propuesta de Valor (Tagline):** ${project.tagline}
- **Problema Principal que Resuelve:** ${project.problem}
- **Público Objetivo (Target):** ${project.targetAudience}

### 🌟 Funcionalidades Core (MVP de Alto Impacto):
${project.coreFeatures.map((f, i) => `${i + 1}. **${f}**`).join('\n')}

---

## 🧠 2. CONTEXTO DE MERCADO, COMPETENCIA Y DIFERENCIACIÓN (Google Notebook Research)

${research?.competitorWeaknesses ? `### ⚠️ Puntos Débiles de la Competencia a Evitar:\n${research.competitorWeaknesses}\n` : '### ⚠️ Principio Antifricción: Eliminar pasos redundantes, evitar interfaces sobrecargadas y garantizar velocidad instantánea.\n'}
${research?.unmetNeeds ? `### 💡 Necesidades No Cubiertas & Killer Features:\n${research.unmetNeeds}\n` : ''}
${research?.uiUxBenchmark ? `### 🎨 Benchmark de Interfaz Recomendado:\n${research.uiUxBenchmark}\n` : ''}

---

## 🎨 3. SISTEMA DE DISEÑO & ESTILO VISUAL (Dark Glassmorphism)

- **Frontend Framework:** ${project.frontendStack}
- **Sistema de Estilos:** ${project.uiStyle}
- **Color Principal de Marca:** \`${project.color || '#6366F1'}\`
${research?.designSystemTheme ? `### 💎 Pautas Estéticas Específicas:\n${research.designSystemTheme}\n` : `
### 💎 Tokens y Pautas de Diseño:
- **Fondo Principal:** \`#0A0E17\` | **Fondo Tarjetas:** \`#151F32\` (con desenfoque \`backdrop-blur-md\`).
- **Tipografía:** *Outfit* para titulares (\`font-display\`), *Inter* para textos generales, *JetBrains Mono* para datos y código.
- **Bordes:** Translúcidos \`rgba(255, 255, 255, 0.08)\` con efecto resplandor en foco \`var(--border-highlight)\`.
- **Micro-animaciones:** Transiciones suaves (cubic-bezier 0.16, 1, 0.3, 1), feedback activo táctil de escala (scale-95).
- **Cero Placeholders:** Todos los componentes deben renderizar datos de demostración funcionales y realistas.
`}

---

## 🗄️ 4. ARQUITECTURA DE DATOS Y SCRIPT SUPABASE (POSTGRESQL CON RLS)

- **Motor:** ${project.database}
- **Esquema Aislado Dedicado:** \`${schema}\`
- **Autenticación:** ${project.auth}

### 📜 Script SQL de Inicialización y Migración (\`supabase/migrations/20260925_init_schema.sql\`):
\`\`\`sql
-- ====================================================================
-- MIGRACIÓN SUPABASE: ESQUEMA AISLADO ${schema} (BY TONI)
-- ====================================================================

-- 1. Crear Esquema Aislado Dedicado
CREATE SCHEMA IF NOT EXISTS ${schema};

-- 2. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tabla Principal de Entidades del Proyecto
CREATE TABLE IF NOT EXISTS ${schema}.items (
  id TEXT PRIMARY KEY DEFAULT ('item_' || substr(md5(random()::text), 1, 10)),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_${schema}_items_user ON ${schema}.items(user_id);
CREATE INDEX IF NOT EXISTS idx_${schema}_items_status ON ${schema}.items(status);

-- 5. Activar Row Level Security (RLS) Estricto
ALTER TABLE ${schema}.items ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Seguridad RLS
CREATE POLICY "Users can manage own items in ${schema}" ON ${schema}.items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
\`\`\`

---

## 📜 5. LAS 5 DIRECTRICES MAESTRAS DE GOOGLE DRIVE Y NORMATIVAS APLICABLES

${relevantDirectives.map((d, i) => `### Directriz #${i + 1}: ${d.title}
- **Resumen:** ${d.summary}
- **Reglas Obligatorias:**
${d.rules.map(r => `  * ${r}`).join('\n')}
- **Plantilla de Prompt:** \`${d.promptTemplate}\`
`).join('\n')}

### ⚖️ Datos Legales RGPD Obligatorios (Directriz #4):
- **Titular del Tratamiento:** Antonio Javier García García
- **DNI:** 34799350M
- **Ubicación:** Madrid (España)
- **Firma en Pie de Página:** Sello distintivo *"By Toni"* con estilo refinado y enlace.
- **Rutas Legales Requeridas:** \`/privacidad\`, \`/aviso-legal\` y \`/terminos\`.

---

## 🗺️ 6. HOJA DE RUTA Y TAREAS CLAVE A DESARROLLAR

${approvedTasks.length > 0 ? approvedTasks.map((t, i) => `${i + 1}. **[${t.priority}] ${t.title}**\n   - *Descripción:* ${t.description}\n   - *Subtareas:* ${t.subtasks.map(s => s.title).join(' | ') || 'Desarrollo integral'}`).join('\n\n') : '1. Setup de arquitectura limpia (Domain, Data, UI)\n2. Implementación de componentes visuales Dark Glassmorphism\n3. Integración con Supabase y páginas legales RGPD'}

---

## 🚀 7. PLAN DE EJECUCIÓN AUTÓNOMA PASO A PASO PARA ANTIGRAVITY

Antigravity debe ejecutar la construcción del proyecto en el siguiente orden secuencial sin saltarse ningún paso:

1. **Capa de Dominio & Tipos:** Declarar interfaces completas en \`src/types/\` para todas las entidades del negocio.
2. **Capa de Datos & Supabase:** Configurar cliente de Supabase, repositorios con manejo optimista de estado y script SQL de migración en \`supabase/migrations/\`.
3. **Sistema de Diseño UI:** Implementar variables CSS, tokens de color, componentes Glassmorphism y navegación responsiva.
4. **Vistas Principales y Flujo de Usuario:** Construir cada pantalla de la aplicación conectada a la capa de datos con micro-animaciones fluidas.
5. **Cumplimiento Legal & Directrices:** Crear las vistas \`/privacidad\`, \`/aviso-legal\` y \`/terminos\` con los datos de Toni García y el sello "By Toni" en cabecera/footer.
6. **Ficha de Control Drive:** Generar el archivo \`INFO_PROYECTO.md\` con la arquitectura técnica y actualizar \`Registro_Proyectos_Toni.csv\`.

================================================================================
*FIN DEL ARCHIVO MAESTRO - LISTO PARA EJECUTAR EN ANTIGRAVITY*
================================================================================
`;
  },

  /**
   * Genera un diagnóstico contextual con IA para auto-completar los hallazgos de mercado
   */
  generateAIBaselineInsights(project: Project): ProjectResearchInsights {
    const isTrading = project.name.toLowerCase().includes('trading') || project.appType.includes('Trading') || project.tagline.toLowerCase().includes('trading');
    const isRetail = project.name.toLowerCase().includes('bici') || project.appType.includes('Retail') || project.tagline.toLowerCase().includes('taller') || project.tagline.toLowerCase().includes('tienda');
    const isHealth = project.name.toLowerCase().includes('girl') || project.name.toLowerCase().includes('flow') || project.appType.includes('Salud') || project.targetAudience.toLowerCase().includes('mujer');

    if (isTrading) {
      return {
        competitorWeaknesses: `1. Latencia y recargas manuales: La mayoría de herramientas requieren refrescar o tienen retrasos de más de 2 segundos.\n2. Sobrecarga cognitiva: Gráficos saturados con indicadores redundantes que provocan fatiga visual.\n3. Falta de modo antifricción: Demasiados clics para cambiar de temporalidad o activar filtros de ordenes.\n4. Alertas ruidosas sin contexto de riesgo real.`,
        unmetNeeds: `1. Visualización instantánea de desequilibrios de volumen y order flow en tiempo real con SSE.\n2. Modo centrado en ejecución rápida sin distracciones.\n3. Registro automático de operaciones con cálculo de ratio riesgo/beneficio dinámico.\n4. Exportación limpia de métricas de rendimiento y drawdown.`,
        uiUxBenchmark: `1. Layout Master-Detail con panel de órdenes lateral colapsable.\n2. Gráficos interactivos de alto rendimiento (TradingView / Lightweight Charts) con paleta Dark Glassmorphism.\n3. Micro-animaciones en ticks de precio y cambios de estado.\n4. Indicadores de conexión en tiempo real con ping milimétrico.`,
        designSystemTheme: `Dark Glassmorphism de alta precisión. Fondo: #080C14, Tarjetas: #0F172A con desenfoque 12px. Acentos: Verde Esmeralda (#10B981) para señales alcistas, Carmesí Neón (#EF4444) para bajistas, Violeta Eléctrico (#8B5CF6) para IA. Tipografía: JetBrains Mono para datos numéricos y Outfit para titulares.`,
        notebookUrl: project.googleNotebookUrl || 'https://notebooklm.google.com'
      };
    }

    if (isRetail) {
      return {
        competitorWeaknesses: `1. Software de TPV / ERP anticuado y lento que requiere formación compleja.\n2. Falta de comunicación transparente con el cliente sobre el estado de su reparación o pedido.\n3. Pérdida de tiempo redactando presupuestos o fichas de clientes manualmente.\n4. No adaptado a tablets ni smartphones para mecánicos en el taller.`,
        unmetNeeds: `1. Notificación automática por WhatsApp al cliente cuando su bicicleta o pedido esté listo.\n2. Entrada rápida por voz de notas mecánicas y piezas sustituidas.\n3. Generación instantánea de tickets y facturas PDF con firma digital.\n4. Tablero Kanban visual del taller para saber exactamente qué bicicleta está en qué potro.`,
        uiUxBenchmark: `1. Botones táctiles grandes y contraste alto para uso con guantes o en movimiento.\n2. Búsqueda predictiva ultrarrápida de clientes y números de bastidor/serie.\n3. Modales contextuales de 1 solo clic para cambiar estado (En Taller -> Listo para Entrega).\n4. Resumen financiero diario en cabecera siempre visible.`,
        designSystemTheme: `Estilo Modern Workshop Dark. Fondo: #0B0F19, Tarjetas: #131D2E con borde sutil ámbar/esmeralda. Acentos: Ámbar Neón (#F59E0B) para pedidos en curso, Esmeralda (#10B981) para entregas, Cian (#06B6D4) para repuestos. Tipografías: Outfit y Inter.`,
        notebookUrl: project.googleNotebookUrl || 'https://notebooklm.google.com'
      };
    }

    if (isHealth) {
      return {
        competitorWeaknesses: `1. Apps genéricas que no consideran variabilidad individual ni fases circadianas/hormonales.\n2. Interfaces infantiles o con colores estereotipados que no transmiten rigor médico.\n3. Formularios de registro de síntomas largos y tediosos que la usuaria abandona tras 3 días.\n4. Venta o compartición opaca de datos íntimos a terceros.`,
        unmetNeeds: `1. Registro rápido de síntomas en menos de 5 segundos con 1 toque.\n2. Informe clínico estructurado y exportable en PDF listo para entregar al médico/ginecólogo.\n3. Correlación inteligente entre ciclo circadiano, descanso y síntomas hormonales.\n4. Privacidad total con cifrado local y cumplimiento estricto RGPD.`,
        uiUxBenchmark: `1. Rueda o línea temporal interactiva del ciclo con degradados suaves.\n2. Bottom sheets táctiles en la zona inferior ergonómica para el pulgar.\n3. Micro-interacciones tranquilizadoras y modo noche ultra-cuidado para no alterar el sueño.\n4. Pestañas de fácil acceso: Diario Rápido, Ritmo Circadiano, Reporte Médico e Intervenciones.`,
        designSystemTheme: `Dark Glassmorphism Serena & Profesional. Fondo: #090B14, Tarjetas: #121626 con blur de 16px. Acentos: Lavanda Suave (#A78BFA), Rosa Coral (#FB7185) y Cian Médico (#38BDF8). Tipografías: Outfit y Plus Jakarta Sans.`,
        notebookUrl: project.googleNotebookUrl || 'https://notebooklm.google.com'
      };
    }

    // Default High-Impact SaaS Template
    return {
      competitorWeaknesses: `1. Interfaces sobrecargadas con menús de 4 niveles donde el usuario se pierde.\n2. Tiempos de carga lentos y peticiones que bloquean la interfaz.\n3. Falta de atajos de teclado y flujos de trabajo rápidos para usuarios frecuentes.\n4. Ausencia de integración con IA o implementación como simple 'chatbox' genérico sin contexto.`,
      unmetNeeds: `1. Automatización inteligente de tareas repetitivas mediante IA contextual.\n2. Actualizaciones en tiempo real sin recargas (SSE / WebSockets).\n3. Modo offline o sincronización optimista para nunca perder datos introducidos.\n4. Personalización modular de paneles según el rol del usuario.`,
      uiUxBenchmark: `1. Arquitectura de vistas limpia tipo Linear/Notion con navegación lateral colapsable.\n2. Búsqueda global (Command + K) para saltar a cualquier sección en milisegundos.\n3. Estados de carga elegantes (Skeleton loaders) y transiciones CSS fluidas.\n4. Vistas múltiples: Kanban, Lista detallada y Métricas ejecutivas.`,
      designSystemTheme: `Dark Glassmorphism de Vanguardia. Fondo: #0A0E17, Tarjetas: #151F32 con bordes traslúcidos rgba(255,255,255,0.08). Acentos: Índigo Eléctrico (#6366F1), Cian (#06B6D4) y Esmeralda (#10B981). Tipografías: Outfit para titulares, Inter para cuerpo, JetBrains Mono para código/datos.`,
      notebookUrl: project.googleNotebookUrl || 'https://notebooklm.google.com'
    };
  }
};

