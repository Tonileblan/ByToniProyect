import React from 'react';
import { 
  List, Kanban, Calendar, BarChart2, BookOpen, 
  Sparkles, Clock, Plus, Filter, Download, ExternalLink, 
  CheckCircle2, FolderGit2, HelpCircle
} from 'lucide-react';
import { Project, ViewTab, FilterOptions } from '../../types/project';

interface ProjectHeaderProps {
  project: Project;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenNewTask: () => void;
  onExportBriefing: () => void;
  onOpenHelpChat?: () => void;
  filterOptions: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  activeTab,
  onTabChange,
  onOpenNewTask,
  onExportBriefing,
  onOpenHelpChat,
  filterOptions,
  onFilterChange
}) => {
  const tabs = [
    { id: 'list', label: 'Lista', icon: List },
    { id: 'board', label: 'Tablero (Hoja de Ruta)', icon: Kanban },
    { id: 'timeline', label: 'Cronograma', icon: Clock },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'dashboard', label: 'Panel', icon: BarChart2 },
    { id: 'directives', label: 'Directrices', icon: BookOpen },
    { id: 'ai_studio', label: '🚀 Blueprint & Cerebro', icon: Sparkles }
  ];

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '20px 32px 0 32px'
    }}>
      {/* Top row: Project Info & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: project.color || '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '13px'
            }}>
              {project.name.charAt(0)}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {project.name}
            </h1>

            <span className="badge badge-indigo" style={{ fontFamily: 'var(--font-mono)' }}>
              {project.slug}
            </span>

            <span className="badge badge-purple">
              {project.appType}
            </span>

            <span className={`badge ${
              project.status === 'En Producción' ? 'badge-emerald' : 
              project.status === 'En Desarrollo' ? 'badge-cyan' : 'badge-amber'
            }`}>
              {project.status}
            </span>
          </div>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: 0
          }}>
            {project.tagline}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenHelpChat && (
            <button
              onClick={onOpenHelpChat}
              className="btn btn-secondary"
              title="Abrir Chat de Ayuda y Enviar Ideas/Errores"
              style={{ fontSize: '12px', color: '#C4B5FD', borderColor: 'rgba(139, 92, 246, 0.4)' }}
            >
              <HelpCircle size={14} color="#8B5CF6" />
              <span>Ayuda & Feedback</span>
            </button>
          )}

          <button
            onClick={onExportBriefing}
            className="btn btn-secondary"
            title="Descargar Ficha INFO_PROYECTO.md"
            style={{ fontSize: '12px' }}
          >
            <Download size={14} />
            <span>Exportar INFO_PROYECTO.md</span>
          </button>

          <button
            onClick={onOpenNewTask}
            className="btn btn-primary"
            style={{ fontSize: '12px' }}
          >
            <Plus size={14} />
            <span>Añadir Tarea</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Filters (We moved the view tabs to the sidebar) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '12px',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={filterOptions.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value as any })}
            className="form-input"
            style={{ width: 'auto', padding: '4px 8px', fontSize: '12px', height: '28px' }}
          >
            <option value="all">Todas las Prioridades</option>
            <option value="Urgente">Urgente</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <select
            value={filterOptions.status}
            onChange={(e) => onFilterChange({ status: e.target.value as any })}
            className="form-input"
            style={{ width: 'auto', padding: '4px 8px', fontSize: '12px', height: '28px' }}
          >
            <option value="all">Todos los Estados</option>
            <option value="ideas_proposals">💡 Ideas & Mejoras</option>
            <option value="bugs_errors">🐛 Errores & Bugs</option>
            <option value="approved">✨ Aprobadas</option>
            <option value="specification">📐 Especificación</option>
            <option value="in_development">⚡ En Desarrollo</option>
            <option value="review_qa">🔍 Revisión / QA</option>
            <option value="completed">✅ Listo / Producción</option>
          </select>
        </div>
      </div>
    </div>
  );
};
