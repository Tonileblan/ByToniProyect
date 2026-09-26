import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Plus, CheckCircle2, Circle, 
  Clock, Tag, User, Sparkles, MoreHorizontal, Calendar, 
  CheckSquare, ArrowUpRight, Paperclip
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {sections.map(section => {
        const sectionTasks = tasks.filter(t => t.sectionId === section.id);
        const isCollapsed = collapsedSections[section.id];
        const completedCount = sectionTasks.filter(t => t.status === 'completed').length;

        return (
          <div 
            key={section.id}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}
          >
            {/* Section Header */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-tertiary)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={() => toggleSection(section.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isCollapsed ? <ChevronRight size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {section.title}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  ({completedCount}/{sectionTasks.length} completadas)
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAddingTaskSectionId(section.id);
                }}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', height: '26px' }}
              >
                <Plus size={12} />
                <span>Añadir</span>
              </button>
            </div>

            {/* Tasks Table */}
            {!isCollapsed && (
              <div>
                {/* Table Column Headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '36px minmax(280px, 2fr) 130px 110px 110px 140px 40px',
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)'
                }}>
                  <div></div>
                  <div>Tarea / Requisito</div>
                  <div>Responsable</div>
                  <div>Prioridad</div>
                  <div>Fecha Límite</div>
                  <div>Subtareas / Directivas</div>
                  <div></div>
                </div>

                {/* Task Rows */}
                {sectionTasks.map(task => {
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
                        gridTemplateColumns: '36px minmax(280px, 2fr) 130px 110px 110px 140px 40px',
                        alignItems: 'center',
                        padding: '10px 16px',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.03)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = isCompleted ? 'rgba(16, 185, 129, 0.03)' : 'transparent'}
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
                        {task.tags && task.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {task.tags.map((tag, i) => (
                              <span key={i} style={{
                                fontSize: '10px',
                                color: 'var(--text-muted)',
                                background: 'var(--bg-tertiary)',
                                padding: '1px 5px',
                                borderRadius: 'var(--radius-sm)'
                              }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Assignee */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>{task.assignedAvatar || '👤'}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.assignedTo}
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
                    padding: '8px 16px',
                    background: 'var(--bg-tertiary)'
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
                      style={{ padding: '4px 10px', fontSize: '11px', height: '30px' }}
                    >
                      Añadir
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setAddingTaskSectionId(null)}
                      style={{ padding: '4px 10px', fontSize: '11px', height: '30px' }}
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
                      padding: '10px 16px',
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left'
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
