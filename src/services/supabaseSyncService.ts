import { supabase } from './supabaseClient';
import { Project, Section, Task, DirectiveItem } from '../types/project';
import { storageService } from './storageService';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

export const supabaseSyncService = {
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    try {
      const { error } = await supabase.from('projects').select('id').limit(1);
      if (error) {
        if (error.code === 'PGRST106' || error.message.includes('Invalid schema')) {
          return {
            ok: false,
            message: 'El esquema "mia_bytoniproyect" aún no está expuesto en la configuración de API de Supabase.'
          };
        }
        return { ok: false, message: error.message };
      }
      return { ok: true, message: 'Conexión con Supabase establecida correctamente' };
    } catch (e: any) {
      return { ok: false, message: e.message || 'Error de conexión' };
    }
  },

  async syncAllFromCloud(): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Projects
      const { data: projects, error: pError } = await supabase
        .from('projects')
        .select('*');
      
      if (pError) throw pError;
      
      if (projects && projects.length > 0) {
        const formattedProjects: Project[] = projects.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          status: p.status,
          appType: p.app_type,
          tagline: p.tagline || '',
          problem: p.problem || '',
          targetAudience: p.target_audience || '',
          coreFeatures: p.core_features || [],
          database: p.database || 'Supabase PostgreSQL',
          auth: p.auth || 'Supabase Auth',
          aiIntegration: p.ai_integration || '',
          aiProvider: p.ai_provider || 'Google Gemini 2.5 Flash',
          businessModel: p.business_model || '',
          frontendStack: p.frontend_stack || 'React + Vite',
          uiStyle: p.ui_style || 'Dark Glassmorphism',
          color: p.color || '#6366F1',
          icon: p.icon || 'FolderKanban',
          supabaseSchema: p.supabase_schema,
          driveFolderUrl: p.drive_folder_url,
          googleNotebookUrl: p.google_notebook_url,
          researchInsights: p.research_insights,
          createdAt: p.created_at || new Date().toISOString()
        }));
        storageService.saveProjects(formattedProjects, false);
      }

      // 2. Sections
      const { data: sections, error: sError } = await supabase
        .from('sections')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (sError) throw sError;
      if (sections && sections.length > 0) {
        const formattedSections: Section[] = sections.map(s => ({
          id: s.id,
          projectId: s.project_id,
          title: s.title,
          order: s.order_index
        }));
        storageService.saveSections(formattedSections, false);
      }

      // 3. Tasks
      const { data: tasks, error: tError } = await supabase
        .from('tasks')
        .select('*');
      
      if (tError) throw tError;
      if (tasks && tasks.length > 0) {
        const formattedTasks: Task[] = tasks.map(t => ({
          id: t.id,
          projectId: t.project_id,
          sectionId: t.section_id || '',
          title: t.title,
          description: t.description || '',
          status: t.status || 'ideas_proposals',
          priority: t.priority || 'Media',
          assignedTo: t.assigned_to || 'Toni',
          assignedAvatar: t.assigned_avatar || '👨‍💻',
          dueDate: t.due_date || '',
          startDate: t.start_date,
          estimatedHours: t.estimated_hours || 0,
          subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
          tags: Array.isArray(t.tags) ? t.tags : [],
          directivesChecked: t.directives_checked || {
            supabaseSchema: false,
            rlsStrict: false,
            securityAuth: false,
            aiStreaming: false,
            rgpdLegal: false,
            driveSync: false
          },
          attachments: Array.isArray(t.attachments) ? t.attachments : [],
          comments: Array.isArray(t.comments) ? t.comments : [],
          activities: Array.isArray(t.activities) ? t.activities : [],
          customFields: t.custom_fields || {},
          aiPromptSnippet: t.ai_prompt_snippet,
          origin: t.origin || 'manual_admin',
          reportedBy: t.reported_by,
          reportType: t.report_type,
          deviceInfo: t.device_info,
          createdAt: t.created_at || new Date().toISOString()
        }));
        storageService.saveTasks(formattedTasks, false);
      }

      return { success: true };
    } catch (e: any) {
      console.error('Error syncing from Supabase:', e);
      return { success: false, error: e.message };
    }
  },

  async pushAllToCloud(): Promise<{ success: boolean; error?: string }> {
    try {
      const projects = storageService.getProjects();
      const sections = storageService.getSections();
      const tasks = storageService.getTasks();

      // Upsert projects
      if (projects.length > 0) {
        const rows = projects.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          status: p.status,
          app_type: p.appType,
          tagline: p.tagline,
          problem: p.problem,
          target_audience: p.targetAudience,
          core_features: p.coreFeatures,
          database: p.database,
          auth: p.auth,
          ai_integration: p.aiIntegration,
          ai_provider: p.aiProvider,
          business_model: p.businessModel,
          frontend_stack: p.frontendStack,
          ui_style: p.uiStyle,
          color: p.color,
          icon: p.icon,
          supabase_schema: p.supabaseSchema,
          drive_folder_url: p.driveFolderUrl,
          google_notebook_url: p.googleNotebookUrl,
          research_insights: p.researchInsights
        }));
        const { error } = await supabase.from('projects').upsert(rows);
        if (error) throw error;
      }

      // Upsert sections
      if (sections.length > 0) {
        const sRows = sections.map(s => ({
          id: s.id,
          project_id: s.projectId,
          title: s.title,
          order_index: s.order
        }));
        const { error } = await supabase.from('sections').upsert(sRows);
        if (error) throw error;
      }

      // Upsert tasks
      if (tasks.length > 0) {
        const tRows = tasks.map(t => ({
          id: t.id,
          project_id: t.projectId,
          section_id: t.sectionId,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          assigned_to: t.assignedTo,
          assigned_avatar: t.assignedAvatar,
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
          ai_prompt_snippet: t.aiPromptSnippet,
          origin: t.origin,
          reported_by: t.reportedBy,
          report_type: t.reportType,
          device_info: t.deviceInfo
        }));
        const { error } = await supabase.from('tasks').upsert(tRows);
        if (error) throw error;
      }

      return { success: true };
    } catch (e: any) {
      console.error('Error pushing to Supabase:', e);
      return { success: false, error: e.message };
    }
  }
};
