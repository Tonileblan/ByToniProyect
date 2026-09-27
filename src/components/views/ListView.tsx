import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Plus, CheckCircle2, Circle, 
  Clock, Tag, User, Sparkles, Calendar, 
  CheckSquare, ArrowUpRight, Paperclip, Layers, Flame, Filter
} from 'lucide-react';
import { Task, Section, TaskPriority, TaskStatus } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface ListViewProps {
  sections: Section[];
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onAddTaskToSection: (sectionId: string, title: string) => void;
  onUpdateTaskPriority: (taskId: string, priority: TaskPriority) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  sections,
  tasks,
  onSelectTask,
  onToggleTaskStatus,
  onAddTaskToSection,
  onUpdateTaskPriority
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [addingTaskSectionId, setAddingTaskSectionId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleQuickAdd = (sectionId: string) => {
    if (!newTaskTitle.trim()) return;
    onAddTaskToSection(sectionId, newTaskTitle.trim());
    setNewTaskTitle('');
    setAddingTaskSectionId(null);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgente': return 'badge-rose';
      case 'Alta': return 'badge-amber';
      case 'Media': return 'badge-indigo';
      case 'Baja': return 'badge-cyan';
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'ideas_proposals':
        return { label: '💡 Idea / Propuesta', color: '#C4B5FD', bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)' };
      case 'bugs_errors':
        return { label: '🐛 Error / Bug', color: '#FCA5A5', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' };
      case 'approved':
        return { label: '✨ Aprobada', color: '#F472B6', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)' };
      case 'specification':
        return { label: '📐 Especificación', color: '#A5B4FC', bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.3)' };
      case 'in_development':
        return { label: '⚡ En Desarrollo', color: '#7DD3FC', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.35)' };
      case 'review_qa':
        return { label: '🔍 Revisión QA', color: '#FCD34D', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' };
      case 'completed':
        return { label: '✅ Listo / Prod', color: '#6EE7B7', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' };
      default:
        return { label: status, color: '#CBD5E1', bg: 'rgba(100, 116, 139, 0.15)', border: 'rgba(100, 116, 139, 0.3)' };
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inDevTasks = tasks.filter(t => t.status === 'in_development' || t.status === 'specification').length;

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Metrics Cards (Matching Timeline & Dashboard) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px'
      }}>
        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={18} color="#818CF8" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Requisitos
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {totalTasks} tareas
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={18} color="#06B6D4" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              En Desarrollo Activo
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8', fontFamily: 'var(--font-display)' }}>
              {inDevTasks} tareas
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
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
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Completadas
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-display)' }}>
              {completedTasks} / {totalTasks}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 14px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={13} color="var(--text-muted)" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Filtros de Vista:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '4px 10px', fontSize: '12px', height: '30px' }}
          >
            <option value="all">Todas las Etapas</option>
            <option value="in_development">⚡ En Desarrollo</option>
            <option value="specification">📐 Especificación</option>
            <option value="review_qa">🔍 Revisión QA</option>
            <option value="ideas_proposals">💡 Ideas</option>
            <option value="bugs_errors">🐛 Bugs</option>
            <option value="completed">✅ Completadas</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '4px 10px', fontSize: '12px', height: '30px' }}
          >
            <option value="all">Todas las Prioridades</option>
            <option value="Urgente">🔥 Urgente</option>
            <option value="Alta">⚡ Alta</option>
            <option value="Media">🔷 Media</option>
            <option value="Baja">🟢 Baja</option>
          </select>
        </div>
      </div>

      {/* Sections Accordion List */}
      {sections.map(section => {
        const sectionTasks = filteredTasks.filter(t => t.sectionId === section.id);
        const isCollapsed = collapsedSections[section.id];
        const sectionCompletedCount = sectionTasks.filter(t => t.status === 'completed').length;

        return (
          <div 
            key={section.id}
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all var(--transition-fast)'
            }}
          >
            {/* Section Header */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: isCollapsed ? 'none' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={() => toggleSection(section.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </div>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {section.title}
                </h3>
                <span className="badge badge-indigo" style={{ fontSize: '10px' }}>
                  {sectionCompletedCount}/{sectionTasks.length} listas
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAddingTaskSectionId(section.id);
                }}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px', height: '26px' }}
              >
                <Plus size={12} />
                <span>Añadir Tarea</span>
              </button>
            </div>

            {/* Tasks Table */}
            {!isCollapsed && (
              <div>
                {/* Table Column Headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '36px minmax(260px, 2fr) 150px 110px 110px 140px 40px',
                  padding: '9px 18px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}>
                  <div></div>
                  <div>Tarea / Requisito</div>
                  <div>Estado</div>
                  <div>Prioridad</div>
                  <div>Fecha Límite</div>
                  <div>Progreso & Dir.</div>
                  <div></div>
                </div>

                {/* Task Rows */}
                {sectionTasks.map(task => {
                  const isCompleted = task.status === 'completed';
                  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                  const totalSubtasks = task.subtasks.length;
                  const directivesCount = Object.values(task.directivesChecked).filter(Boolean).length;
                  const sBadge = getStatusBadge(task.status);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '36px minmax(260px, 2fr) 150px 110px 110px 140px 40px',
                        alignItems: 'center',
                        padding: '10px 18px',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-card-hover)';
                        e.currentTarget.style.transform = 'translateX(2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'transparent';
                        e.currentTarget.style.transform = 'none';
                      }}
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

                      {/* Title & Tags */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '12px' }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>{task.assignedAvatar || '👤'} {task.assignedTo}</span>
                          {task.estimatedHours && <span>· {task.estimatedHours}h</span>}
                        </div>
                      </div>

                      {/* Status Pill Badge */}
                      <div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: sBadge.bg,
                          color: sBadge.color,
                          border: `1px solid ${sBadge.border}`,
                          whiteSpace: 'nowrap'
                        }}>
                          {sBadge.label}
                        </span>
                      </div>

                      {/* Priority */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <span className={`badge ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Calendar size={12} color="var(--text-muted)" />
                        <span>{task.dueDate || 'Sin fecha'}</span>
                      </div>

                      {/* Subtasks & Directives indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {totalSubtasks > 0 && (
                          <span style={{
                            fontSize: '11px',
                            color: completedSubtasks === totalSubtasks ? '#10B981' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <CheckSquare size={12} />
                            {completedSubtasks}/{totalSubtasks}
                          </span>
                        )}
                        <span style={{
                          fontSize: '11px',
                          color: '#818CF8',
                          background: 'rgba(99, 102, 241, 0.1)',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {directivesCount} dir
                        </span>
                        {task.attachments && task.attachments.length > 0 && (
                          <span style={{
                            fontSize: '11px',
                            color: '#38BDF8',
                            background: 'rgba(56, 189, 248, 0.1)',
                            padding: '1px 5px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <Paperclip size={11} />
                            {task.attachments.length}
                          </span>
                        )}
                      </div>

                      {/* Details Arrow */}
                      <div style={{ textAlign: 'right' }}>
                        <ArrowUpRight size={14} color="var(--text-muted)" />
                      </div>
                    </div>
                  );
                })}

                {/* Quick Add Row */}
                {addingTaskSectionId === section.id ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 18px',
                    background: 'rgba(0, 0, 0, 0.3)'
                  }}>
                    <Circle size={16} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="Escribe el título de la tarea y pulsa Enter..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleQuickAdd(section.id);
                        if (e.key === 'Escape') setAddingTaskSectionId(null);
                      }}
                      autoFocus
                      className="form-input"
                      style={{ height: '30px', fontSize: '12px' }}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleQuickAdd(section.id)}
                      style={{ padding: '4px 12px', fontSize: '11px', height: '30px' }}
                    >
                      Añadir
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setAddingTaskSectionId(null)}
                      style={{ padding: '4px 12px', fontSize: '11px', height: '30px' }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTaskSectionId(section.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Plus size={14} />
                    <span>Añadir tarea a esta sección...</span>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
