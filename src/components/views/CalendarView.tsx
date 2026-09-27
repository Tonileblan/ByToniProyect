import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Task } from '../../types/project';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectTask }) => {
  const [currentMonth, setCurrentMonth] = useState('Septiembre 2026');

  // Days for a standard 30-day month grid starting on Tuesday (1 Sep 2026 was Tuesday)
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i; // offset for Tuesday start
    return dayNumber > 0 && dayNumber <= 30 ? dayNumber : null;
  });

  const getTaskStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#6EE7B7',
          border: '1px solid rgba(16, 185, 129, 0.35)'
        };
      case 'in_development':
        return {
          bg: 'rgba(6, 182, 212, 0.15)',
          color: '#7DD3FC',
          border: '1px solid rgba(6, 182, 212, 0.35)'
        };
      case 'bugs_errors':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#FCA5A5',
          border: '1px solid rgba(239, 68, 68, 0.35)'
        };
      default:
        return {
          bg: 'rgba(139, 92, 246, 0.15)',
          color: '#C4B5FD',
          border: '1px solid rgba(139, 92, 246, 0.35)'
        };
    }
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Month Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarIcon size={16} color="#818CF8" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {currentMonth}
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Calendario de entregas y compromisos del proyecto
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button className="btn btn-secondary" style={{ padding: '5px 9px' }}>
            <ChevronLeft size={14} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '12px' }}>
            Hoy
          </button>
          <button className="btn btn-secondary" style={{ padding: '5px 9px' }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px'
      }}>
        {/* Days of week */}
        {daysOfWeek.map(d => (
          <div 
            key={d}
            style={{
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              padding: '6px 0',
              textTransform: 'uppercase'
            }}
          >
            {d}
          </div>
        ))}

        {/* Day Cells */}
        {calendarDays.map((day, idx) => {
          if (!day) {
            return (
              <div 
                key={idx}
                style={{
                  minHeight: '105px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  opacity: 0.25
                }}
              />
            );
          }

          const isToday = day === 27;
          const dayDateStr = `2026-09-${day < 10 ? '0' + day : day}`;
          const dayTasks = tasks.filter(t => t.dueDate === dayDateStr);

          return (
            <div
              key={idx}
              style={{
                minHeight: '110px',
                background: isToday ? 'rgba(56, 189, 248, 0.07)' : 'var(--bg-card)',
                backdropFilter: 'blur(10px)',
                border: isToday ? '1px solid #38BDF8' : '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                boxShadow: isToday ? 'var(--shadow-glow)' : 'var(--shadow-xs)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isToday) e.currentTarget.style.borderColor = 'var(--border-highlight)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                if (!isToday) e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: isToday ? 800 : 500,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isToday ? '#0284C7' : 'transparent',
                  color: isToday ? '#FFFFFF' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {day}
                </span>

                {dayTasks.length > 0 && (
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {dayTasks.length} {dayTasks.length === 1 ? 'tarea' : 'tareas'}
                  </span>
                )}
              </div>

              {/* Tasks Pills for this day */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '75px' }}>
                {dayTasks.map(task => {
                  const s = getTaskStatusStyle(task.status);
                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '3px 7px',
                        borderRadius: 'var(--radius-sm)',
                        background: s.bg,
                        color: s.color,
                        border: s.border,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'none';
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
