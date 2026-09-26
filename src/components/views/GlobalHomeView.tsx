import React from 'react';
import { 
  FolderKanban, Plus, Sparkles, CheckCircle2, TrendingUp, 
  ExternalLink, Layers, Database, Shield, Smartphone, Globe
} from 'lucide-react';
import { Project, Task } from '../../types/project';

interface GlobalHomeViewProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (projectId: string) => void;
  onOpenNewProject: () => void;
  onOpenCerebro?: () => void;
}

export const GlobalHomeView: React.FC<GlobalHomeViewProps> = ({
  projects,
  tasks,
  onSelectProject,
  onOpenNewProject,
  onOpenCerebro
}) => {
  const suiteProjects = projects.filter(p => p.category.includes('Suite Toni') || p.category.includes('Herramienta'));
  const commercialProjects = projects.filter(p => p.category.includes('Comercial') || p.category.includes('Cliente') || p.category.includes('Prototipo'));
  const customProjects = projects.filter(p => !suiteProjects.some(s => s.id === p.id) && !commercialProjects.some(c => c.id === p.id));

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = tasks.filter(t => t.status === 'in_development').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>👋</span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Bienvenido a ByToniProyect
            </h1>
            <span className="badge badge-indigo">
              Hub de Desarrollo IA
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '680px', margin: 0, lineHeight: 1.5 }}>
            Gestión ágil de proyectos basada en las 5 Directrices Maestras de Google Drive. Orquesta aplicaciones de la Suite Propia y Clientes Comerciales con prompts de IA listos para Antigravity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {onOpenCerebro && (
            <button onClick={onOpenCerebro} className="btn btn-ai">
              <Sparkles size={15} />
              <span>Consultar Cerebro</span>
            </button>
          )}
          <button onClick={onOpenNewProject} className="btn btn-primary">
            <Plus size={15} />
            <span>Nuevo Proyecto (Briefing)</span>
          </button>
        </div>
      </div>

      {/* Global Quick Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            PROYECTOS ACTIVOS
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {projects.length} Apps
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {suiteProjects.length} Suite Propia · {commercialProjects.length} Comerciales
          </span>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            TAREAS EN CURSO
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#818CF8' }}>
            {activeTasks} Tareas
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Desarrollo activo en Antigravity
          </span>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            TAREAS COMPLETADAS
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#10B981' }}>
            {completedTasks} / {totalTasks}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% de avance global
          </span>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            DIRECTRICES DRIVE
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#F59E0B' }}>
            5 Maestras
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Supabase, Auth, IA, RGPD, Drive
          </span>
        </div>
      </div>

      {/* Suite Toni Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            🚀 Suite Propia de Toni ({suiteProjects.length})
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Esquemas <code>mia_*</code></span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {suiteProjects.map(proj => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-highlight)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: proj.color }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {proj.name}
                    </h3>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                    {proj.appType}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  {proj.tagline}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{proj.slug}</span>
                <span className={`badge ${
                  proj.status === 'En Producción' ? 'badge-emerald' :
                  proj.status === 'En Desarrollo' ? 'badge-cyan' : 'badge-amber'
                }`}>
                  {proj.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Projects Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            💼 Aplicaciones Comerciales & Clientes ({commercialProjects.length})
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Esquemas <code>com_*</code></span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {commercialProjects.map(proj => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-highlight)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: proj.color }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {proj.name}
                    </h3>
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: '10px' }}>
                    {proj.appType}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  {proj.tagline}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{proj.slug}</span>
                <span className={`badge ${
                  proj.status === 'En Producción' ? 'badge-emerald' :
                  proj.status === 'En Desarrollo' ? 'badge-cyan' : 'badge-amber'
                }`}>
                  {proj.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom & New Projects Section */}
      {customProjects.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              ✨ Nuevos Proyectos & Aplicaciones ({customProjects.length})
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Proyectos registrados</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {customProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-highlight)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: proj.color || '#6366f1' }} />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {proj.name}
                      </h3>
                    </div>
                    <span className="badge badge-indigo" style={{ fontSize: '10px' }}>
                      {proj.category || proj.appType}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                    {proj.tagline || 'Proyecto creado en la Suite By Toni'}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  color: 'var(--text-muted)'
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{proj.slug}</span>
                  <span className={`badge ${
                    proj.status === 'En Producción' ? 'badge-emerald' :
                    proj.status === 'En Desarrollo' ? 'badge-cyan' : 'badge-amber'
                  }`}>
                    {proj.status || 'Idea / Planificación'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
