import React from 'react';
import { Clock, Calendar, CheckCircle2, Circle, Sparkles, ChevronRight } from 'lucide-react';
import { Task } from '../../types/project';

interface TimelineViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks, onSelectTask }) => {
  const days = [
    '22 Sep', '23 Sep', '24 Sep', '25 Sep (Hoy)', '26 Sep', '27 Sep', '28 Sep', '29 Sep', '30 Sep', '01 Oct'
  ];

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      overflowX: 'auto'
    }}>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            ⏱️ Cronograma & Hitos de Desarrollo
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Planificación temporal y dependencias de tareas sincronizadas con las Directrices de Drive.
          </p>
        </div>
      </div>

      {/* Timeline Grid Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px repeat(10, minmax(80px, 1fr))',
        borderBottom: '1px solid var(--border-medium)',
        paddingBottom: '10px',
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        <div style={{ textAlign: 'left', paddingLeft: '8px' }}>Tarea / Hito</div>
        {days.map((day, idx) => (
          <div 
            key={idx} 
            style={{ 
              color: day.includes('Hoy') ? '#818CF8' : 'inherit',
              fontWeight: day.includes('Hoy') ? 700 : 500
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Timeline Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px' }}>
        {tasks.map((task, idx) => {
          const isCompleted = task.status === 'completed';
          // Calculate arbitrary visual span based on task ID or dates
          const startCol = 3 + (idx % 3);
          const spanLen = 2 + (idx % 4);

          return (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              style={{
                display: 'grid',
                gridTemplateColumns: '240px repeat(10, minmax(80px, 1fr))',
                alignItems: 'center',
                padding: '6px 0',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* Task Title */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '8px',
                paddingRight: '12px',
                overflow: 'hidden'
              }}>
                {isCompleted ? (
                  <CheckCircle2 size={15} color="#10B981" />
                ) : (
                  <Circle size={15} color="#6366F1" />
                )}
                <span style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {task.title}
                </span>
              </div>

              {/* Gantt Bar positioned on grid */}
              <div style={{
                gridColumn: `${startCol} / span ${spanLen}`,
                height: '24px',
                borderRadius: 'var(--radius-md)',
                background: isCompleted 
                  ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.8) 100%)'
                  : 'linear-gradient(90deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.9) 100%)',
                border: isCompleted ? '1px solid #10B981' : '1px solid #6366F1',
                boxShadow: isCompleted ? 'none' : '0 0 10px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px',
                fontSize: '10px',
                fontWeight: 600,
                color: '#FFFFFF'
              }}>
                <span>{task.assignedAvatar} {task.assignedTo}</span>
                <span>{isCompleted ? 'Listo' : `${task.estimatedHours || 3}h`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
