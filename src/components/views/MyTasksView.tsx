import React from 'react';
import { CheckCircle2, Circle, Calendar, Tag, CheckSquare, ArrowUpRight, Plus } from 'lucide-react';
import { Task, Project } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <CheckCircle2 size={22} color="#10B981" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
              Mis Tareas Globales
            </h2>
            <span className="badge badge-emerald">
              {pendingTasks.length} pendientes
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Visión unificada de todas las tareas y especificaciones asignadas en el ecosistema By Toni.
          </p>
        </div>

        <button onClick={onOpenNewTask} className="btn btn-primary">
          <Plus size={14} />
          <span>Añadir Tarea</span>
        </button>
      </div>

      {/* Pending Tasks List */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '12px 18px',
          background: 'var(--bg-tertiary)',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          Tareas en Curso & Pendientes ({pendingTasks.length})
        </div>

        <div>
          {pendingTasks.map(task => {
            const proj = projects.find(p => p.id === task.projectId);

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerCelebration();
                      onToggleTaskStatus(task.id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Circle size={18} color="var(--text-muted)" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {task.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: proj?.color || '#6366F1' }} />
                        {proj?.name || 'Proyecto'}
                      </span>
                      <span>•</span>
                      <span>{task.dueDate || 'Sin fecha'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${
                    task.priority === 'Urgente' ? 'badge-rose' :
                    task.priority === 'Alta' ? 'badge-amber' : 'badge-indigo'
                  }`}>
                    {task.priority}
                  </span>
                  <ArrowUpRight size={15} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Tasks List */}
      {completedTasks.length > 0 && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          opacity: 0.85
        }}>
          <div style={{
            padding: '12px 18px',
            background: 'var(--bg-tertiary)',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            Completadas ({completedTasks.length})
          </div>

          <div>
            {completedTasks.map(task => {
              const proj = projects.find(p => p.id === task.projectId);

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 18px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: 'rgba(16, 185, 129, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTaskStatus(task.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <CheckCircle2 size={18} color="#10B981" />
                    </div>

                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {task.title}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {proj?.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
