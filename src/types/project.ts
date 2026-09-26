export type ProjectCategory = 
  | 'Suite Toni (Propio / I+D)'
  | 'Comercial / Clientes'
  | 'Prototipo Rápido / Demo'
  | 'Herramienta Interna / CLI';

export type ProjectStatus = 
  | 'Idea / Planificación'
  | 'En Desarrollo'
  | 'Prototipo / MVP'
  | 'En Producción';

export type TaskStatus = 
  | 'ideas_proposals'    // 💡 Ideas & Mejoras Propuestas (desde el chat de ayuda o roadmap)
  | 'bugs_errors'        // 🐛 Errores & Bugs Notificados (desde el chat de ayuda)
  | 'approved'           // ✨ Aprobadas (ideas y bugs validados listos para desarrollo)
  | 'specification'      // 📐 Especificación & Directrices Drive
  | 'in_development'     // ⚡ En Desarrollo
  | 'review_qa'          // 🔍 Revisión & QA
  | 'completed';         // ✅ Listo / En Producción

export type TaskPriority = 'Baja' | 'Media' | 'Alta' | 'Urgente';

export type AppTypeDirective = 
  | 'Todas las Apps'
  | 'Web & Frontend'
  | 'Trading & Algoritmos'
  | 'Mobile & PWA (Local-First)'
  | 'SaaS Multi-tenant'
  | 'Internal CLI & Backend';

export type AttachmentType = 'image' | 'audio' | 'document' | 'file' | 'link';

export interface TaskAttachment {
  id: string;
  name: string;
  type: AttachmentType;
  size?: number | string;
  url: string; // Base64 data URI or external link
  uploadedAt: string;
  mimeType?: string;
  duration?: number; // seconds for audio
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
}

export interface TaskComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface TaskActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface Task {
  id: string;
  projectId: string;
  sectionId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedAvatar?: string;
  dueDate: string;
  startDate?: string;
  estimatedHours?: number;
  subtasks: Subtask[];
  tags: string[];
  directivesChecked: {
    supabaseSchema: boolean;
    rlsStrict: boolean;
    securityAuth: boolean;
    aiStreaming: boolean;
    rgpdLegal: boolean;
    driveSync: boolean;
  };
  attachments?: TaskAttachment[];
  aiPromptSnippet?: string;
  comments: TaskComment[];
  activities: TaskActivity[];
  customFields?: Record<string, string>;
  createdAt: string;
  
  // Feedback & Help Chat Linkage
  origin?: 'chat_help' | 'manual_admin' | 'app_feedback' | 'roadmap';
  reportedBy?: string;
  reportType?: 'idea' | 'error' | 'mejora' | 'duda' | 'pregunta';
  deviceInfo?: string;
}

export interface Section {
  id: string;
  projectId: string;
  title: string;
  order: number;
}

export type DirectiveCategory = 
  | 'General Drive'
  | 'Web'
  | 'Trading'
  | 'Mobile'
  | 'SaaS'
  | 'Backend'
  | 'Seguridad'
  | 'Base de Datos'
  | 'IA'
  | 'Personalizada';

export interface DirectiveItem {
  id: string;
  title: string;
  category: DirectiveCategory | string;
  appTypes: string[]; // List of applicable app types
  icon: string;
  summary: string;
  fullMarkdownContent: string;
  rules: string[];
  promptTemplate: string;
  driveUrl?: string;
  isOfficialMaster?: boolean;
  updatedAt?: string;
}

export interface ProjectResearchInsights {
  competitorWeaknesses?: string; // Críticas y puntos débiles de apps de la competencia a evitar
  unmetNeeds?: string;           // Necesidades no cubiertas más demandadas por los usuarios
  uiUxBenchmark?: string;        // Mejor interfaz, ergonomía y flujos líderes
  designSystemTheme?: string;    // Estilo visual, psicología de colores, tipografías y estética
  sitemapStructure?: string;     // Estructura ideal de navegación y vistas
  notebookSourcesSummary?: string; // Fuentes de calidad cargadas en NotebookLM
  notebookUrl?: string;          // Enlace directo a la libreta de Google NotebookLM
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  category: ProjectCategory;
  status: ProjectStatus;
  appType: AppTypeDirective;
  tagline: string;
  problem: string;
  targetAudience: string;
  coreFeatures: string[];
  database: string;
  auth: string;
  aiIntegration: string;
  aiProvider: string;
  businessModel: string;
  frontendStack: string;
  uiStyle: string;
  color: string;
  icon: string;
  driveFolderUrl?: string;
  googleNotebookUrl?: string;
  supabaseSchema?: string;
  researchInsights?: ProjectResearchInsights;
  createdAt: string;
}

export type ViewTab = 'list' | 'board' | 'timeline' | 'calendar' | 'dashboard' | 'directives' | 'ai_studio';

export interface FilterOptions {
  searchQuery: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  assignedTo: string | 'all';
  tag: string | 'all';
  appTypeFilter?: string | 'all';
}

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  email: string;
  dni: string;
  role: string;
  avatar: string;
  bio?: string;
  isAuthenticated: boolean;
}

export interface ReportPromptsConfig {
  informeMaestro: string;
  uiPaleta: string;
  estructuraSitemap: string;
  usabilidadUX: string;
  tonoVoz: string;
}

export interface UserSettings {
  geminiApiKey: string;
  selectedModel: string;
  theme: 'dark' | 'light';
  prompts: ReportPromptsConfig;
  masterPromptTemplate?: string; // backwards compatibility
}


