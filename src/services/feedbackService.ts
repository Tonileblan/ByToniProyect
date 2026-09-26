import { Task, TaskPriority, TaskStatus } from '../types/project';

export interface AppFeedbackPayload {
  id?: string;
  projectId: string; // e.g. 'proj_bytoni', 'com_bicicletas', 'proj_vita', 'proj_flowgirl'
  type: 'idea' | 'mejora' | 'error' | 'duda';
  title: string;
  description: string;
  authorName?: string;
  authorContact?: string;
  deviceInfo?: string;
  imageUrl?: string;
  audioUrl?: string;
}

const FEEDBACK_STORAGE_KEY = 'bytoni_feedback_queue_v1';

export const feedbackService = {
  createTaskFromFeedback(payload: AppFeedbackPayload, sectionId: string): Task {
    const isError = payload.type === 'error';
    const status: TaskStatus = isError ? 'bugs_errors' : 'ideas_proposals';
    const priority: TaskPriority = isError ? 'Alta' : 'Media';
    
    const newTask: Task = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      projectId: payload.projectId,
      sectionId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      status,
      priority,
      assignedTo: 'Toni',
      assignedAvatar: '👨‍💻',
      dueDate: new Date(Date.now() + (isError ? 2 : 7) * 24 * 3600 * 1000).toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      estimatedHours: isError ? 2 : 3,
      subtasks: isError ? [
        { id: `st_err_1`, title: 'Reproducir y aislar el error', completed: false },
        { id: `st_err_2`, title: 'Aplicar fix con TypeScript y tests', completed: false },
        { id: `st_err_3`, title: 'Verificar en QA y desplegar a producción', completed: false }
      ] : [
        { id: `st_id_1`, title: 'Evaluar viabilidad y especificación', completed: false },
        { id: `st_id_2`, title: 'Diseñar interfaz visual (Glassmorphism)', completed: false }
      ],
      tags: [isError ? 'Bug' : 'Mejora', 'Chat Ayuda', 'Roadmap'],
      directivesChecked: {
        supabaseSchema: true,
        rlsStrict: true,
        securityAuth: true,
        aiStreaming: false,
        rgpdLegal: true,
        driveSync: true
      },
      attachments: payload.imageUrl ? [
        {
          id: `att_img_${Date.now()}`,
          name: 'Captura de pantalla reportada.png',
          type: 'image',
          url: payload.imageUrl,
          uploadedAt: new Date().toISOString()
        }
      ] : [],
      comments: [
        {
          id: `comm_${Date.now()}`,
          author: payload.authorName || 'Usuario de la App',
          avatar: isError ? '🐛' : '💡',
          content: `Enviado desde el Chat de Ayuda y Soporte (${payload.deviceInfo ? `Dispositivo: ${payload.deviceInfo.slice(0, 40)}...` : 'Web'}).`,
          createdAt: new Date().toISOString()
        }
      ],
      activities: [
        {
          id: `act_${Date.now()}`,
          user: payload.authorName || 'Usuario App',
          action: isError ? 'Notificó un error desde el Chat de Ayuda' : 'Propuso una nueva mejora en la Hoja de Ruta',
          timestamp: new Date().toISOString()
        }
      ],
      origin: 'chat_help',
      reportedBy: payload.authorName || 'Cliente / Usuario App',
      reportType: payload.type,
      deviceInfo: payload.deviceInfo || navigator.userAgent,
      createdAt: new Date().toISOString()
    };

    return newTask;
  },

  // Broadcast feedback across tabs and applications
  broadcastFeedback(payload: AppFeedbackPayload): void {
    try {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify({
        ...payload,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error('Error broadcasting feedback:', e);
    }
  }
};
