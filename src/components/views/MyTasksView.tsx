import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, Calendar, Tag, CheckSquare, 
  ArrowUpRight, Plus, LayoutGrid, List, Sparkles, Filter
} from 'lucide-react';
import { Task, Project, TaskStatus, TaskPriority } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';
import { BoardView } from './BoardView';

interface MyTasksViewProps {
  tasks: Task[];
  projects: Project[];
  onSelectTask: (task: Task) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onOpenNewTask: () => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
  onAddTaskToStatus?: (status: TaskStatus, title: string) => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  tasks,
  projects,
  onSelectTask,
  onToggleTaskStatus,
  onOpenNewTask,
  onUpdateTaskStatus,
  onAddTaskToStatus
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_development' | 'urgent' | 'completed'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const filteredTasks = tasks.filter(t => {
    if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) return false;
    if (statusFilter === 'pending' && t.status === 'completed') return false;
    if (statusFilter === 'in_development' && t.status !== 'in_development') return false;
    if (statusFilter === 'urgent' && (t.priority !== 'Urgente' || t.status === 'completed')) return false;
    if (statusFilter === 'completed' && t.status !== 'completed') return false;
    return true;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgente': return 'badge-rose';
      case 'Alta': return 'badge-amber';
      case 'Media': return 'badge-indigo';
      case 'Baja': return 'badge-cyan';
    }
  };

  const getProjectName = (projId: string) => {
    return projects.find(p => p.id === projId)?.name || 'Proyecto Global';
  };

  const getProjectColor = (projId: string) => {
    return projects.find(p => p.id === projId)?.color || '#6366F1';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                Mis Tareas Globales
              </h2>
              <span className="badge badge-emerald" style={{ fontSize: '10px' }}>
                {pendingTasks.length} pendientes
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Gestión unificada de tareas y entregables en todo el ecosistema By Toni.
            </p>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* List / Board Switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'list' ? 'var(--bg-card-hover)' : 'transparent',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <List size={13} />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'board' ? 'var(--bg-card-hover)' : 'transparent',
                color: viewMode === 'board' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LayoutGrid size={13} />
              <span>Tablero</span>
            </button>
          </div>

          <button onClick={onOpenNewTask} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
            <Plus size={14} />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Toolbar (when in list mode) */}
      {viewMode === 'list' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `Todas (${tasks.length})` },
              { id: 'pending', label: `Pendientes (${pendingTasks.length})` },
              { id: 'in_development', label: `En Desarrollo (${tasks.filter(t => t.status === 'in_development').length})` },
              { id: 'urgent', label: `Urgentes (${tasks.filter(t => t.priority === 'Urgente' && t.status !== 'completed').length})` },
              { id: 'completed', label: `Completadas (${completedTasks.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`btn ${statusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '5px 11px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Project Selector */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '4px 10px', fontSize: '12px', height: '30px' }}
          >
            <option value="all">Todos los Proyectos</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Main View Area */}
      {viewMode === 'list' ? (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xs)'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '36px minmax(260px, 2fr) 140px 100px 110px 120px 40px',
            padding: '10px 16px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-tertiary)'
          }}>
            <div></div>
            <div>Tarea / Requisito</div>
            <div>Proyecto</div>
            <div>Prioridad</div>
            <div>Fecha Límite</div>
            <div>Progreso</div>
            <div></div>
          </div>

          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredTasks.map(task => {
              const isCompleted = task.status === 'completed';
              const completedSubtasks = task.subtasks.filter(st => st.completed).length;
              const totalSubtasks = task.subtasks.length;
              const directivesCount = Object.values(task.directivesChecked).filter(Boolean).length;

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '36px minmax(260px, 2fr) 140px 100px 110px 120px 40px',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'transparent'}
                >
                  {/* Status Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isCompleted) triggerCelebration();
                      onToggleTaskStatus(task.id);
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} color="#10B981" />
                    ) : (
                      <Circle size={18} color="var(--text-muted)" />
                    )}
                  </div>

                  {/* Title */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '12px' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: isCompleted ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </span>
                  </div>

                  {/* Project Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getProjectColor(task.projectId) }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {getProjectName(task.projectId)}
                    </span>
                  </div>

                  {/* Priority Badge */}
                  <div>
                    <span className={`badge ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Calendar size={12} color="var(--text-muted)" />
                    <span>{task.dueDate || 'Sin fecha'}</span>
                  </div>

                  {/* Subtasks / Directives */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {totalSubtasks > 0 && (
                      <span style={{
                        fontSize: '10px',
                        color: completedSubtasks === totalSubtasks ? '#10B981' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <CheckSquare size={11} />
                        {completedSubtasks}/{totalSubtasks}
                      </span>
                    )}
                    {directivesCount > 0 && (
                      <span style={{
                        fontSize: '10px',
                        color: '#818CF8',
                        background: 'rgba(99, 102, 241, 0.1)',
                        padding: '1px 5px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {directivesCount} dir
                      </span>
                    )}
                  </div>

                  {/* Arrow */}
                  <div style={{ textAlign: 'right' }}>
                    <ArrowUpRight size={14} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '13px' }}>
                No hay tareas pendientes en este filtro.
              </div>
            )}
          </div>
        </div>
      ) : (
        <BoardView
          tasks={filteredTasks}
          onSelectTask={onSelectTask}
          onUpdateTaskStatus={onUpdateTaskStatus || ((id, status) => onToggleTaskStatus(id))}
          onAddTaskToStatus={onAddTaskToStatus || (() => onOpenNewTask())}
          isAdminMode={true}
        />
      )}
    </div>
  );
};
