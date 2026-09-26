import React from 'react';
import { CheckCircle2, Circle, Calendar, Tag, CheckSquare, ArrowUpRight, Plus } from 'lucide-react';
import { Task, Project } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';
import { DualBoardView } from '../../presentation/views/DualBoardView';

interface MyTasksViewProps {
  tasks: Task[];
  projects: Project[];
  onSelectTask: (task: Task) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onOpenNewTask: () => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  tasks,
  projects,
  onSelectTask,
  onToggleTaskStatus,
  onOpenNewTask
}) => {
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        flexShrink: 0
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <CheckCircle2 size={22} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
              Mis Tareas Globales
            </h2>
            <span className="badge badge-emerald">
              {pendingTasks.length} pendientes
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Visión unificada y Tablero Kanban de todas las tareas y especificaciones asignadas en el ecosistema By Toni.
          </p>
        </div>

        <button onClick={onOpenNewTask} className="btn btn-primary">
          <Plus size={14} />
          <span>Añadir Tarea</span>
        </button>
      </div>

      {/* Global Kanban Board */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <DualBoardView 
          projectId={projects[0]?.id || 'global'} 
          tasks={tasks} 
        />
      </div>
    </div>
  );
};
