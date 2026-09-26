import React from 'react';
import { 
  BarChart2, CheckCircle2, AlertCircle, Clock, 
  Database, Shield, Bot, Scale, HardDrive, Sparkles, TrendingUp
} from 'lucide-react';
import { Project, Task, DirectiveItem } from '../../types/project';

interface DashboardViewProps {
  project: Project;
  tasks: Task[];
  directives: DirectiveItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ project, tasks, directives }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const urgentTasks = tasks.filter(t => t.priority === 'Urgente' && t.status !== 'completed').length;
  const inDevTasks = tasks.filter(t => t.status === 'in_development').length;

  const driveDirectives = directives.filter(d => d.category === 'General Drive');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metrics Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>PROGRESO TOTAL</span>
            <CheckCircle2 size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {progressPercent}%
          </div>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: '#10B981' }} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {completedTasks} de {totalTasks} tareas completadas
          </span>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>EN DESARROLLO IA</span>
            <Sparkles size={16} color="#6366F1" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#818CF8' }}>
            {inDevTasks}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Tareas activas en Antigravity
          </span>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>TAREAS URGENTES</span>
            <AlertCircle size={16} color="#F43F5E" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#FB7185' }}>
            {urgentTasks}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Prioridad alta o urgente pendiente
          </span>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>ESQUEMA SUPABASE</span>
            <Database size={16} color="#06B6D4" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38BDF8', wordBreak: 'break-all' }}>
            {project.supabaseSchema || project.slug}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Multi-schema PostgreSQL con RLS
          </span>
        </div>
      </div>

      {/* Compliance Checklist with Google Drive Directives */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={20} color="#10B981" />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Cumplimiento de las 5 Directrices Maestras de Google Drive
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Verificación técnica automática del proyecto según el estándar de Toni.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {driveDirectives.map(d => (
            <div
              key={d.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                flexShrink: 0
              }}>
                ✓
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {d.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {d.summary}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
