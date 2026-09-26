import React, { useState } from 'react';
import { 
  Search, Plus, Sparkles, Moon, Sun, Bell, 
  FolderPlus, CheckSquare, BookOpen, ExternalLink,
  HelpCircle, MessageSquare
} from 'lucide-react';
import { Project } from '../../types/project';

interface TopNavbarProps {
  currentProject: Project | null;
  onOpenNewTask: () => void;
  onOpenNewProject: () => void;
  onOpenAICopilot: () => void;
  onOpenHelpChat?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentProject,
  onOpenNewTask,
  onOpenNewProject,
  onOpenAICopilot,
  onOpenHelpChat,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 50,
      position: 'relative'
    }}>
      {/* Left: Brand & Project Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '16px',
            color: '#FFFFFF',
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)'
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontWeight: 700, 
                fontSize: '16px', 
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}>
                ByToniProyect
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '9px', padding: '2px 6px' }}>
                By Toni
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Metodología Directrices & IA · Roadmap
            </div>
          </div>
        </div>

        {/* Global Create Button Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <Plus size={15} />
            <span>Crear</span>
          </button>

          {showCreateMenu && (
            <div 
              className="glass-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: '220px',
                borderRadius: 'var(--radius-md)',
                padding: '6px',
                zIndex: 100
              }}
            >
              <button 
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '8px 10px' }}
                onClick={() => { setShowCreateMenu(false); onOpenNewTask(); }}
              >
                <CheckSquare size={14} color="#6366F1" />
                <span>Nueva Tarea (Roadmap)</span>
              </button>
              <button 
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '8px 10px' }}
                onClick={() => { setShowCreateMenu(false); onOpenNewProject(); }}
              >
                <FolderPlus size={14} color="#10B981" />
                <span>Nuevo Proyecto</span>
              </button>
              {onOpenHelpChat && (
                <button 
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '8px 10px' }}
                  onClick={() => { setShowCreateMenu(false); onOpenHelpChat(); }}
                >
                  <HelpCircle size={14} color="#8B5CF6" />
                  <span>💬 Enviar Idea o Error</span>
                </button>
              )}
              <a 
                href="https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '8px 10px', textDecoration: 'none' }}
                onClick={() => setShowCreateMenu(false)}
              >
                <BookOpen size={14} color="#F59E0B" />
                <span>Ver Directrices Drive</span>
                <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.6 }} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div style={{ 
        flex: '0 1 400px', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
        <input 
          type="text"
          placeholder="Buscar tareas, proyectos, directrices... (⌘K)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input"
          style={{
            paddingLeft: '36px',
            paddingRight: '12px',
            height: '34px',
            fontSize: '12px',
            background: 'var(--bg-tertiary)',
            borderColor: 'var(--border-subtle)'
          }}
        />
      </div>

      {/* Right: Actions, Help Chat, AI Copilot, Theme & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Help Chat & Feedback Button */}
        {onOpenHelpChat && (
          <button 
            className="btn btn-secondary"
            onClick={onOpenHelpChat}
            style={{ padding: '6px 12px', fontSize: '12px', height: '34px', color: '#C4B5FD', borderColor: 'rgba(139, 92, 246, 0.4)' }}
            title="Abrir Chat de Ayuda y Soporte para enviar ideas y reportar errores"
          >
            <HelpCircle size={14} color="#8B5CF6" />
            <span>Ayuda & Feedback</span>
          </button>
        )}

        {/* AI Copilot Trigger */}
        <button 
          className="btn btn-ai"
          onClick={onOpenAICopilot}
          style={{ padding: '6px 12px', fontSize: '12px', height: '34px' }}
        >
          <Sparkles size={14} />
          <span>IA Copilot</span>
        </button>

        {/* Theme Toggle */}
        <button 
          className="btn btn-icon"
          onClick={onToggleTheme}
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Profile Chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#FFFFFF'
          }}>
            TG
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Toni
          </span>
        </div>
      </div>
    </header>
  );
};
