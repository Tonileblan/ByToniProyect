import React from 'react';
import { 
  Home, CheckCircle2, Inbox, FolderKanban, Plus, 
  BookOpen, Sparkles, Database, ExternalLink, HardDrive, 
  Layers, Shield, TrendingUp, Smartphone, Globe
} from 'lucide-react';
import { Project } from '../../types/project';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  activeMainView: 'dashboard' | 'my_tasks' | 'project' | 'directives' | 'ai_studio';
  onSelectProject: (projectId: string) => void;
  onSelectMainView: (view: 'dashboard' | 'my_tasks' | 'directives' | 'ai_studio') => void;
  onOpenNewProject: () => void;
  totalPendingTasks: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  activeMainView,
  onSelectProject,
  onSelectMainView,
  onOpenNewProject,
  totalPendingTasks
}) => {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100%',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 12px',
      overflowY: 'auto',
      userSelect: 'none'
    }}>
      {/* Upper Navigation */}
      <div>
        {/* Main Nav Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '20px' }}>
          <button
            onClick={() => onSelectMainView('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: activeMainView === 'dashboard' ? 'var(--bg-card-hover)' : 'transparent',
              color: activeMainView === 'dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activeMainView === 'dashboard' ? '1px solid var(--border-medium)' : '1px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 500,
              width: '100%',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Home size={16} color={activeMainView === 'dashboard' ? '#6366F1' : 'currentColor'} />
              <span>Inicio / Visión General</span>
            </div>
          </button>

          <button
            onClick={() => onSelectMainView('my_tasks')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: activeMainView === 'my_tasks' ? 'var(--bg-card-hover)' : 'transparent',
              color: activeMainView === 'my_tasks' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activeMainView === 'my_tasks' ? '1px solid var(--border-medium)' : '1px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 500,
              width: '100%',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color={activeMainView === 'my_tasks' ? '#10B981' : 'currentColor'} />
              <span>Mis Tareas</span>
            </div>
            {totalPendingTasks > 0 && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818CF8',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)'
              }}>
                {totalPendingTasks}
              </span>
            )}
          </button>
        </div>

        {/* Projects Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px 8px 8px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)'
          }}>
            <span>Proyectos ({projects.length})</span>
            <button
              onClick={onOpenNewProject}
              className="btn-icon"
              style={{ width: '20px', height: '20px' }}
              title="Nuevo Proyecto (Briefing Ágil)"
            >
              <Plus size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {projects.map(p => {
              const isActive = activeMainView === 'project' && activeProjectId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--bg-card-hover)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: p.color || '#6366F1',
                      flexShrink: 0
                    }} />
                    <span style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {p.name}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {p.category.includes('Comercial') ? 'com' : 'mia'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metodología & Directrices */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            padding: '0 8px 8px 8px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)'
          }}>
            Metodología & IA
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button
              onClick={() => onSelectMainView('directives')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: activeMainView === 'directives' ? 'var(--bg-card-hover)' : 'transparent',
                color: activeMainView === 'directives' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: activeMainView === 'directives' ? '1px solid var(--border-medium)' : '1px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                width: '100%',
                textAlign: 'left'
              }}
            >
              <BookOpen size={16} color="#F59E0B" />
              <span>Directrices Maestras</span>
            </button>

            <button
              onClick={() => onSelectMainView('ai_studio')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: activeMainView === 'ai_studio' ? 'var(--bg-card-hover)' : 'transparent',
                color: activeMainView === 'ai_studio' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: activeMainView === 'ai_studio' ? '1px solid var(--border-medium)' : '1px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                width: '100%',
                textAlign: 'left'
              }}
            >
              <Sparkles size={16} color="#06B6D4" />
              <span>Blueprint Antigravity & Notebook</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Drive Status Footer */}
      <div style={{
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <HardDrive size={14} color="#10B981" />
            <span>Google Drive Sync</span>
          </div>
          <span className="badge badge-emerald" style={{ fontSize: '9px', padding: '1px 5px' }}>
            Activo
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.3 }}>
          Registro_Proyectos_Toni.csv sincronizado
        </div>
        <a
          href="https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: '#818CF8',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          <span>Abrir Carpeta Drive</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </aside>
  );
};
