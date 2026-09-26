import { Project, Task, DirectiveItem } from '../types/project';

export const aiService = {
  generateProjectPrompt(project: Project, directives: DirectiveItem[]): string {
    const relevantDirectives = directives.filter(
      d => d.category === 'General Drive' || 
      (project.appType.includes('Web') && d.category === 'Web') ||
      (project.appType.includes('Trading') && d.category === 'Trading') ||
      (project.appType.includes('Mobile') && d.category === 'Mobile') ||
      (project.appType.includes('SaaS') && d.category === 'SaaS')
    );

    const directivesSummary = relevantDirectives.map((d, index) => {
      return `### ${index + 1}. ${d.title}\n${d.summary}\n- **Reglas clave:**\n${d.rules.map(r => `  * ${r}`).join('\n')}`;
    }).join('\n\n');

    return `======================================================================
PROMPT MAESTRO DE INICIALIZACIÓN Y DESARROLLO (BY TONI)
======================================================================

Actúa como Antigravity / Subagente Experto Senior en Clean Architecture.
Vamos a desarrollar el proyecto "${project.name}" cumpliendo estrictamente nuestra metodología de trabajo y directrices maestras.

----------------------------------------------------------------------
1. BRIEFING Y DEFINICIÓN DEL PROYECTO
----------------------------------------------------------------------
- Nombre del Proyecto: ${project.name}
- Slug / Código Identificador: ${project.slug}
- Categoría: ${project.category}
- Estado Inicial: ${project.status}
- Tipo de Aplicación: ${project.appType}
- Tagline: ${project.tagline}
- Problema Principal a Resolver: ${project.problem}
- Público Objetivo (Target): ${project.targetAudience}

Funcionalidades Core (MVP):
${project.coreFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Módulos y Stack:
- Base de Datos: ${project.database} (Esquema: ${project.supabaseSchema || project.slug})
- Autenticación: ${project.auth}
- Integración de IA: ${project.aiIntegration} (Modelo: ${project.aiProvider})
- Modelo de Negocio: ${project.businessModel}
- Frontend Stack: ${project.frontendStack}
- Estilo y Sistema UI: ${project.uiStyle}

----------------------------------------------------------------------
2. DIRECTRICES MAESTRAS APLICABLES AL PROYECTO
----------------------------------------------------------------------
${directivesSummary}

----------------------------------------------------------------------
3. INSTRUCCIONES DE EJECUCIÓN PASO A PASO
----------------------------------------------------------------------
1. Inicializa la estructura del proyecto siguiendo Clean Architecture (Domain / Data / UI).
2. Genera los scripts SQL de Supabase con esquema aislado "${project.supabaseSchema || project.slug}" y RLS estricto.
3. Desarrolla los componentes UI con estética premium Dark Glassmorphism, micro-animaciones e iconos de Lucide.
4. Genera las vistas legales (/privacidad, /aviso-legal, /terminos) con los datos del titular Antonio Javier García García (DNI 34799350M, Madrid) y la firma "By Toni" en el pie de página.
5. Actualiza Registro_Proyectos_Toni.csv y crea la ficha INFO_PROYECTO.md en Google Drive.
`;
  },

  generateTaskPrompt(task: Task, project: Project, directives: DirectiveItem[]): string {
    const checkedList = [
      task.directivesChecked.supabaseSchema ? '✓ Esquema Supabase Aislado (' + (project.supabaseSchema || project.slug) + ') con RLS' : null,
      task.directivesChecked.securityAuth ? '✓ Seguridad y Auth (JWT / Middleware)' : null,
      task.directivesChecked.aiStreaming ? '✓ IA Streaming Server-Sent Events (SSE)' : null,
      task.directivesChecked.rgpdLegal ? '✓ Privacidad RGPD (Toni García) y Sello By Toni' : null,
      task.directivesChecked.driveSync ? '✓ Registro en Google Drive (CSV y INFO_PROYECTO.md)' : null
    ].filter(Boolean).join('\n- ');

    const subtasksList = task.subtasks.length > 0 
      ? `\nSubtareas a resolver:\n${task.subtasks.map((st, i) => `  [${st.completed ? 'x' : ' '}] ${i + 1}. ${st.title}`).join('\n')}`
      : '';

    return `### ⚡ PROMPT DE TAREA PARA ANTIGRAVITY: "${task.title}"

**Contexto del Proyecto:** ${project.name} (${project.category})
**Tipo:** ${project.appType} | **Stack:** ${project.frontendStack}

**Objetivo de la Tarea:**
${task.description}
${subtasksList}

**Directrices que DEBES cumplir en esta tarea:**
- ${checkedList || 'Aplica las directrices generales del proyecto.'}

**Instrucción para el Agente:**
Desarrolla el código necesario de forma modular, con tipado estricto en TypeScript, manejo limpio de errores, tests y diseño visual alineado con el sistema ${project.uiStyle}.`;
  }
};
