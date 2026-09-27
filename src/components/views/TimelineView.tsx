import React, { useState } from 'react';
import { 
  Clock, Calendar, CheckCircle2, Circle, Sparkles, 
  ChevronLeft, ChevronRight, Filter, Layers, CheckSquare,
  Shield, User, ArrowUpRight, Flame, AlertCircle
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../../types/project';

interface TimelineViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks, onSelectTask }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [timelineZoom, setTimelineZoom] = useState<'days' | 'weeks'>('days');

  // Generate 14-day timeline window around current date (2026-09-27)
  const baseDate = new Date(2026, 8, 22); // 22 Sep 2026
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dayNum = d.getDate();
    const monthStr = d.toLocaleDateString('es-ES', { month: 'short' });
    const isToday = dayNum === 27 && d.getMonth() === 8;
    const weekday = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const isoDate = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    return {
      label: `${dayNum} ${monthStr}`,
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1, 3),
      isToday,
      isoDate,
      dayNum
    };
  });

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
    return true;
  });

  // Stats calculation
  const totalHours = filteredTasks.reduce((acc, t) => acc + (t.estimatedHours || 3), 0);
  const completedTasksCount = filteredTasks.filter(t => t.status === 'completed').length;
  const inProgressTasksCount = filteredTasks.filter(t => t.status === 'in_development' || t.status === 'specification' || t.status === 'review_qa').length;

  const getStatusGradient = (status: TaskStatus) => {
    switch (status) {
      case 'ideas_proposals':
        return {
          bg: 'linear-gradient(90deg, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.85) 100%)',
          border: 'rgba(139, 92, 246, 0.6)',
          color: '#C4B5FD',
          glow: '0 0 14px -3px rgba(139, 92, 246, 0.4)'
        };
      case 'bugs_errors':
        return {
          bg: 'linear-gradient(90deg, rgba(239, 68, 68, 0.45) 0%, rgba(239, 68, 68, 0.85) 100%)',
          border: 'rgba(239, 68, 68, 0.6)',
          color: '#FCA5A5',
          glow: '0 0 14px -3px rgba(239, 68, 68, 0.4)'
        };
      case 'approved':
        return {
          bg: 'linear-gradient(90deg, rgba(236, 72, 153, 0.4) 0%, rgba(236, 72, 153, 0.85) 100%)',
          border: 'rgba(236, 72, 153, 0.6)',
          color: '#F472B6',
          glow: '0 0 14px -3px rgba(236, 72, 153, 0.4)'
        };
      case 'specification':
        return {
          bg: 'linear-gradient(90deg, rgba(99, 102, 241, 0.45) 0%, rgba(99, 102, 241, 0.85) 100%)',
          border: 'rgba(99, 102, 241, 0.6)',
          color: '#A5B4FC',
          glow: '0 0 14px -3px rgba(99, 102, 241, 0.4)'
        };
      case 'in_development':
        return {
          bg: 'linear-gradient(90deg, rgba(6, 182, 212, 0.45) 0%, rgba(56, 189, 248, 0.85) 100%)',
          border: 'rgba(6, 182, 212, 0.6)',
          color: '#7DD3FC',
          glow: '0 0 16px -3px rgba(6, 182, 212, 0.5)'
        };
      case 'review_qa':
        return {
          bg: 'linear-gradient(90deg, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0.85) 100%)',
          border: 'rgba(245, 158, 11, 0.6)',
          color: '#FCD34D',
          glow: '0 0 14px -3px rgba(245, 158, 11, 0.4)'
        };
      case 'completed':
        return {
          bg: 'linear-gradient(90deg, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0.8) 100%)',
          border: 'rgba(16, 185, 129, 0.55)',
          color: '#6EE7B7',
          glow: '0 0 12px -3px rgba(16, 185, 129, 0.35)'
        };
      default:
        return {
          bg: 'linear-gradient(90deg, rgba(100, 116, 139, 0.4) 0%, rgba(100, 116, 139, 0.8) 100%)',
          border: 'rgba(100, 116, 139, 0.5)',
          color: '#CBD5E1',
          glow: 'none'
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner & Metric Cards */}
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
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={18} color="#38BDF8" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Estimación Total
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {totalHours} horas
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
              {inProgressTasksCount} tareas
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
              Hitos Desplegados
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-display)' }}>
              {completedTasksCount} / {filteredTasks.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Gantt Canvas Container */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Controls Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px'
        }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏱️ Cronograma de Hitos & Roadmap Temporal</span>
              <span className="badge badge-indigo" style={{ fontSize: '10px' }}>Septiembre - Octubre 2026</span>
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Vista temporal sincronizada con estimaciones, directrices y estado de desarrollo en tiempo real.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '12px', height: '32px' }}
            >
              <option value="all">Todas las Etapas</option>
              <option value="in_development">⚡ En Desarrollo</option>
              <option value="specification">📐 Especificación</option>
              <option value="review_qa">🔍 Revisión & QA</option>
              <option value="ideas_proposals">💡 Ideas & Mejoras</option>
              <option value="bugs_errors">🐛 Errores</option>
              <option value="completed">✅ Listo / Producción</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '12px', height: '32px' }}
            >
              <option value="all">Todas las Prioridades</option>
              <option value="Urgente">🔥 Urgente</option>
              <option value="Alta">⚡ Alta</option>
              <option value="Media">🔷 Media</option>
              <option value="Baja">🟢 Baja</option>
            </select>
          </div>
        </div>

        {/* Scrollable Timeline Grid */}
        <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          <div style={{ minWidth: '1100px' }}>
            {/* Grid Header Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '260px repeat(14, minmax(60px, 1fr))',
              borderBottom: '1px solid var(--border-medium)',
              paddingBottom: '8px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              <div style={{ textAlign: 'left', paddingLeft: '10px', color: 'var(--text-secondary)' }}>
                Requisito / Hito
              </div>
              {days.map((day, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 2px',
                    borderRadius: 'var(--radius-sm)',
                    background: day.isToday ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    border: day.isToday ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                    color: day.isToday ? '#38BDF8' : 'inherit',
                    fontWeight: day.isToday ? 700 : 500
                  }}
                >
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.8 }}>{day.weekday}</span>
                  <span style={{ fontSize: '11px' }}>{day.label}</span>
                  {day.isToday && (
                    <span style={{ fontSize: '8px', background: '#0284C7', color: '#FFFFFF', padding: '0 4px', borderRadius: '4px', marginTop: '1px' }}>
                      HOY
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Timeline Rows with Gantt Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px' }}>
              {filteredTasks.map((task, idx) => {
                const isCompleted = task.status === 'completed';
                const styleDef = getStatusGradient(task.status);
                const directivesCount = Object.values(task.directivesChecked).filter(Boolean).length;
                const totalSubtasks = task.subtasks.length;
                const completedSubtasks = task.subtasks.filter(st => st.completed).length;

                // Span calculation based on task parameters
                const startCol = 2 + (idx % 6);
                const spanLen = Math.min(14 - startCol + 1, Math.max(2, (idx % 4) + 2));

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '260px repeat(14, minmax(60px, 1fr))',
                      alignItems: 'center',
                      padding: '7px 0',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-card-hover)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateX(2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {/* Left Column: Task Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      paddingLeft: '10px',
                      paddingRight: '12px',
                      overflow: 'hidden'
                    }}>
                      {isCompleted ? (
                        <CheckCircle2 size={16} color="#10B981" />
                      ) : (
                        <Circle size={16} color={styleDef.color} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {task.assignedAvatar || '👤'} {task.assignedTo}
                          </span>
                          {directivesCount > 0 && (
                            <span style={{ fontSize: '9px', color: '#818CF8', background: 'rgba(99, 102, 241, 0.15)', padding: '0 4px', borderRadius: '3px' }}>
                              {directivesCount} dir
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gantt Bar positioned on Timeline Grid */}
                    <div
                      style={{
                        gridColumn: `${startCol} / span ${spanLen}`,
                        height: '28px',
                        borderRadius: 'var(--radius-md)',
                        background: styleDef.bg,
                        border: `1px solid ${styleDef.border}`,
                        boxShadow: isCompleted ? 'none' : styleDef.glow,
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        transition: 'all var(--transition-fast)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.15)';
                        e.currentTarget.style.transform = 'scaleY(1.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'none';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
                        <span style={{ fontSize: '10px', opacity: 0.9 }}>{task.priority}</span>
                        {totalSubtasks > 0 && (
                          <span style={{ fontSize: '9px', background: 'rgba(0, 0, 0, 0.25)', padding: '1px 5px', borderRadius: '4px' }}>
                            {completedSubtasks}/{totalSubtasks}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{isCompleted ? '✓ Listo' : `${task.estimatedHours || 3}h`}</span>
                        <ArrowUpRight size={11} style={{ opacity: 0.7 }} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No hay tareas que coincidan con los filtros seleccionados.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
