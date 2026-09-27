import { supabase, SUPABASE_SCHEMA } from '../integrations/supabase/client';
import { Project, Section, Task, DirectiveItem } from '../types/project';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error' | 'pending_schema';

export interface ConnectionInfo {
  isConnected: boolean;
  schemaFound: boolean;
  status: SyncStatus;
  message: string;
  lastSynced?: Date;
}

// =========================================================================
// MAPPERS: Frontend (camelCase) <--> Database (snake_case / JSONB)
// =========================================================================

export const mapProjectToDB = (p: Project) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category,
  status: p.status,
  app_type: p.appType,
  tagline: p.tagline || '',
  problem: p.problem || '',
  target_audience: p.targetAudience || '',
  core_features: p.coreFeatures || [],
  database: p.database || '',
  auth: p.auth || '',
  ai_integration: p.aiIntegration || '',
  ai_provider: p.aiProvider || '',
  business_model: p.businessModel || '',
  frontend_stack: p.frontendStack || '',
  ui_style: p.uiStyle || '',
  color: p.color || '#6366F1',
  icon: p.icon || 'FolderKanban',
  supabase_schema: p.supabaseSchema || '',
  drive_folder_url: p.driveFolderUrl || '',
  google_notebook_url: p.googleNotebookUrl || '',
  research_insights: p.researchInsights || {},
  created_at: p.createdAt || new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export const mapProjectFromDB = (row: any): Project => ({
  id: String(row.id),
  name: String(row.name || 'Proyecto sin título'),
  slug: String(row.slug || ''),
  category: row.category || 'Suite Toni (Propio / I+D)',
  status: row.status || 'Idea / Planificación',
  appType: row.app_type || 'Web & Frontend',
  tagline: String(row.tagline || ''),
  problem: String(row.problem || ''),
  targetAudience: String(row.target_audience || ''),
  coreFeatures: Array.isArray(row.core_features) ? row.core_features : [],
  database: String(row.database || 'Supabase PostgreSQL'),
  auth: String(row.auth || 'Supabase Auth'),
  aiIntegration: String(row.ai_integration || ''),
  aiProvider: String(row.ai_provider || 'Google Gemini 2.5 Flash'),
  businessModel: String(row.business_model || ''),
  frontendStack: String(row.frontend_stack || 'React + Vite'),
  uiStyle: String(row.ui_style || 'Dark Glassmorphism'),
  color: String(row.color || '#6366F1'),
  icon: String(row.icon || 'FolderKanban'),
  supabaseSchema: row.supabase_schema || undefined,
  driveFolderUrl: row.drive_folder_url || undefined,
  googleNotebookUrl: row.google_notebook_url || undefined,
  researchInsights: row.research_insights || undefined,
  createdAt: String(row.created_at || new Date().toISOString())
});

export const mapSectionToDB = (s: Section) => ({
  id: s.id,
  project_id: s.projectId,
  title: s.title,
  order_index: s.order || 0
});

export const mapSectionFromDB = (row: any): Section => ({
  id: String(row.id),
  projectId: String(row.project_id),
  title: String(row.title || ''),
  order: Number(row.order_index ?? row.order ?? 0)
});

export const mapTaskToDB = (t: Task) => ({
  id: t.id,
  project_id: t.projectId,
  section_id: t.sectionId || null,
  title: t.title,
  description: t.description || '',
  status: t.status,
  priority: t.priority,
  assigned_to: t.assignedTo || 'Toni',
  assigned_avatar: t.assignedAvatar || '👨‍💻',
  due_date: t.dueDate || null,
  start_date: t.startDate || null,
  estimated_hours: t.estimatedHours || 0,
  subtasks: t.subtasks || [],
  tags: t.tags || [],
  directives_checked: t.directivesChecked || {},
  attachments: t.attachments || [],
  comments: t.comments || [],
  activities: t.activities || [],
  custom_fields: t.customFields || {},
  ai_prompt_snippet: t.aiPromptSnippet || '',
  origin: t.origin || 'manual_admin',
  reported_by: t.reportedBy || '',
  report_type: t.reportType || '',
  device_info: t.deviceInfo || '',
  created_at: t.createdAt || new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export const mapTaskFromDB = (row: any): Task => ({
  id: String(row.id),
  projectId: String(row.project_id),
  sectionId: String(row.section_id || ''),
  title: String(row.title || 'Tarea'),
  description: String(row.description || ''),
  status: row.status || 'ideas_proposals',
  priority: row.priority || 'Media',
  assignedTo: String(row.assigned_to || 'Toni'),
  assignedAvatar: String(row.assigned_avatar || '👨‍💻'),
  dueDate: String(row.due_date || ''),
  startDate: row.start_date || undefined,
  estimatedHours: Number(row.estimated_hours || 0),
  subtasks: Array.isArray(row.subtasks) ? row.subtasks : [],
  tags: Array.isArray(row.tags) ? row.tags : [],
  directivesChecked: row.directives_checked || {
    supabaseSchema: false,
    rlsStrict: false,
    securityAuth: false,
    aiStreaming: false,
    rgpdLegal: false,
    driveSync: false
  },
  attachments: Array.isArray(row.attachments) ? row.attachments : [],
  comments: Array.isArray(row.comments) ? row.comments : [],
  activities: Array.isArray(row.activities) ? row.activities : [],
  customFields: row.custom_fields || {},
  aiPromptSnippet: row.ai_prompt_snippet || undefined,
  origin: row.origin || 'manual_admin',
  reportedBy: row.reported_by || undefined,
  reportType: row.report_type || undefined,
  deviceInfo: row.device_info || undefined,
  createdAt: String(row.created_at || new Date().toISOString())
});

export const mapDirectiveToDB = (d: DirectiveItem) => ({
  id: d.id,
  title: d.title,
  category: d.category,
  app_types: d.appTypes || [],
  icon: d.icon || '📜',
  summary: d.summary || '',
  full_markdown_content: d.fullMarkdownContent || '',
  rules: d.rules || [],
  prompt_template: d.promptTemplate || '',
  drive_url: d.driveUrl || '',
  is_official_master: d.isOfficialMaster ?? false,
  updated_at: new Date().toISOString()
});

export const mapDirectiveFromDB = (row: any): DirectiveItem => ({
  id: String(row.id),
  title: String(row.title || ''),
  category: String(row.category || 'General Drive'),
  appTypes: Array.isArray(row.app_types) ? row.app_types : [],
  icon: String(row.icon || '📜'),
  summary: String(row.summary || ''),
  fullMarkdownContent: String(row.full_markdown_content || ''),
  rules: Array.isArray(row.rules) ? row.rules : [],
  promptTemplate: String(row.prompt_template || ''),
  driveUrl: row.drive_url || undefined,
  isOfficialMaster: Boolean(row.is_official_master),
  updatedAt: String(row.updated_at || new Date().toISOString())
});

// =========================================================================
// SERVICE: Operaciones Remotas con Supabase
// =========================================================================

export const supabaseService = {
  // Probar conectividad y estado del esquema
  async testConnection(): Promise<ConnectionInfo> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .limit(1);

      if (error) {
        if (error.message?.includes('Invalid schema') || error.code === 'PGRST106') {
          return {
            isConnected: true,
            schemaFound: false,
            status: 'pending_schema',
            message: `El esquema '${SUPABASE_SCHEMA}' no está expuesto o falta ejecutar la migración SQL en Supabase.`
          };
        }
        return {
          isConnected: false,
          schemaFound: false,
          status: 'error',
          message: error.message || 'Error al conectar con Supabase'
        };
      }

      return {
        isConnected: true,
        schemaFound: true,
        status: 'synced',
        message: `Conectado y sincronizado con Supabase (${SUPABASE_SCHEMA}).`,
        lastSynced: new Date()
      };
    } catch (e: any) {
      return {
        isConnected: false,
        schemaFound: false,
        status: 'offline',
        message: e?.message || 'Sin conexión de red a Supabase'
      };
    }
  },

  // --- Projects ---
  async fetchProjects(): Promise<Project[] | null> {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase fetchProjects error:', error.message);
        return null;
      }
      return (data || []).map(mapProjectFromDB);
    } catch (e) {
      console.warn('Supabase fetchProjects exception:', e);
      return null;
    }
  },

  async upsertProject(project: Project): Promise<boolean> {
    try {
      const dbRow = mapProjectToDB(project);
      const { error } = await supabase.from('projects').upsert(dbRow);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertProject error:', e);
      return false;
    }
  },

  async upsertProjects(projects: Project[]): Promise<boolean> {
    try {
      if (projects.length === 0) return true;
      const dbRows = projects.map(mapProjectToDB);
      const { error } = await supabase.from('projects').upsert(dbRows);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertProjects error:', e);
      return false;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteProject error:', e);
      return false;
    }
  },

  // --- Sections ---
  async fetchSections(): Promise<Section[] | null> {
    try {
      const { data, error } = await supabase.from('sections').select('*').order('order_index', { ascending: true });
      if (error) {
        console.warn('Supabase fetchSections error:', error.message);
        return null;
      }
      return (data || []).map(mapSectionFromDB);
    } catch (e) {
      console.warn('Supabase fetchSections exception:', e);
      return null;
    }
  },

  async upsertSections(sections: Section[]): Promise<boolean> {
    try {
      if (sections.length === 0) return true;
      const dbRows = sections.map(mapSectionToDB);
      const { error } = await supabase.from('sections').upsert(dbRows);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertSections error:', e);
      return false;
    }
  },

  async deleteSection(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('sections').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteSection error:', e);
      return false;
    }
  },

  // --- Tasks ---
  async fetchTasks(): Promise<Task[] | null> {
    try {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase fetchTasks error:', error.message);
        return null;
      }
      return (data || []).map(mapTaskFromDB);
    } catch (e) {
      console.warn('Supabase fetchTasks exception:', e);
      return null;
    }
  },

  async upsertTask(task: Task): Promise<boolean> {
    try {
      const dbRow = mapTaskToDB(task);
      const { error } = await supabase.from('tasks').upsert(dbRow);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertTask error:', e);
      return false;
    }
  },

  async upsertTasks(tasks: Task[]): Promise<boolean> {
    try {
      if (tasks.length === 0) return true;
      const dbRows = tasks.map(mapTaskToDB);
      const { error } = await supabase.from('tasks').upsert(dbRows);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertTasks error:', e);
      return false;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteTask error:', e);
      return false;
    }
  },

  // --- Directives ---
  async fetchDirectives(): Promise<DirectiveItem[] | null> {
    try {
      const { data, error } = await supabase.from('directives').select('*');
      if (error) {
        console.warn('Supabase fetchDirectives error:', error.message);
        return null;
      }
      return (data || []).map(mapDirectiveFromDB);
    } catch (e) {
      console.warn('Supabase fetchDirectives exception:', e);
      return null;
    }
  },

  async upsertDirectives(directives: DirectiveItem[]): Promise<boolean> {
    try {
      if (directives.length === 0) return true;
      const dbRows = directives.map(mapDirectiveToDB);
      const { error } = await supabase.from('directives').upsert(dbRows);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertDirectives error:', e);
      return false;
    }
  },

  // --- Sincronización Completa Bidireccional / Hidratación ---
  async syncAll(localData: {
    projects: Project[];
    sections: Section[];
    tasks: Task[];
    directives: DirectiveItem[];
  }): Promise<{
    success: boolean;
    data?: {
      projects: Project[];
      sections: Section[];
      tasks: Task[];
      directives: DirectiveItem[];
    };
    source: 'remote' | 'seeded_to_remote' | 'local_fallback';
    message: string;
  }> {
    const conn = await this.testConnection();
    if (!conn.isConnected || !conn.schemaFound) {
      return {
        success: false,
        source: 'local_fallback',
        message: conn.message
      };
    }

    try {
      // 1. Obtener proyectos remotos
      const remoteProjects = await this.fetchProjects();
      
      // Si la base de datos remota está vacía pero tenemos datos locales, subimos la semilla local a Supabase
      if (remoteProjects && remoteProjects.length === 0 && localData.projects.length > 0) {
        await this.upsertProjects(localData.projects);
        await this.upsertSections(localData.sections);
        await this.upsertTasks(localData.tasks);
        await this.upsertDirectives(localData.directives);

        return {
          success: true,
          source: 'seeded_to_remote',
          data: localData,
          message: 'Base de datos remota inicializada con los datos locales.'
        };
      }

      // Si hay datos remotos, descargamos todo para sincronizar
      if (remoteProjects && remoteProjects.length > 0) {
        const [remoteSections, remoteTasks, remoteDirectives] = await Promise.all([
          this.fetchSections(),
          this.fetchTasks(),
          this.fetchDirectives()
        ]);

        return {
          success: true,
          source: 'remote',
          data: {
            projects: remoteProjects,
            sections: remoteSections && remoteSections.length > 0 ? remoteSections : localData.sections,
            tasks: remoteTasks && remoteTasks.length > 0 ? remoteTasks : localData.tasks,
            directives: remoteDirectives && remoteDirectives.length > 0 ? remoteDirectives : localData.directives
          },
          message: 'Datos sincronizados exitosamente desde Supabase.'
        };
      }

      return {
        success: true,
        source: 'local_fallback',
        data: localData,
        message: 'Conectado a Supabase (sin datos adicionales).'
      };
    } catch (e: any) {
      return {
        success: false,
        source: 'local_fallback',
        message: e?.message || 'Error en sincronización con Supabase'
      };
    }
  },

  // --- Realtime Suscription ---
  subscribeToChanges(onRemoteUpdate: () => void) {
    try {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: SUPABASE_SCHEMA },
          () => {
            onRemoteUpdate();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime subscription error:', e);
      return () => {};
    }
  }
};
