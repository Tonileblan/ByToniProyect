import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../../types/project';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectTask }) => {
  const [currentMonth, setCurrentMonth] = useState('Septiembre 2026');

  // Days for a standard 30-day month grid starting on Monday
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - 0; // offset
    return dayNumber > 0 && dayNumber <= 30 ? dayNumber : null;
  });

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Month Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarIcon size={18} color="#6366F1" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {currentMonth}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            <ChevronLeft size={14} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            Hoy
          </button>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
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
                  minHeight: '100px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  opacity: 0.3
                }}
              />
            );
          }

          const isToday = day === 25;
          const dayDateStr = `2026-09-${day < 10 ? '0' + day : day}`;
          const dayTasks = tasks.filter(t => t.dueDate === dayDateStr);

          return (
            <div
              key={idx}
              style={{
                minHeight: '110px',
                background: isToday ? 'rgba(99, 102, 241, 0.06)' : 'var(--bg-card)',
                border: isToday ? '1px solid #6366F1' : '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
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
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: isToday ? '#6366F1' : 'transparent',
                  color: isToday ? '#FFFFFF' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {day}
                </span>

                {dayTasks.length > 0 && (
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {dayTasks.length} tareas
                  </span>
                )}
              </div>

              {/* Tasks Pills for this day */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '75px' }}>
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    style={{
                      fontSize: '11px',
                      padding: '3px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: task.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: task.status === 'completed' ? '#34D399' : '#C7D2FE',
                      border: task.status === 'completed' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
