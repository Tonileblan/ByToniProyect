import React, { useState } from 'react';
import { 
  Search, Plus, Sparkles, Moon, Sun, Bell, 
  FolderPlus, CheckSquare, BookOpen, ExternalLink,
  HelpCircle, MessageSquare, Menu, Settings, LogOut, ChevronDown, User
} from 'lucide-react';
import { Project, UserProfile } from '../../types/project';

interface TopNavbarProps {
  currentProject: Project | null;
  currentUser?: UserProfile;
  onOpenNewTask: () => void;
  onOpenNewProject: () => void;
  onOpenHelpChat?: () => void;
  onOpenCerebro?: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentProject,
  currentUser,
  onOpenNewTask,
  onOpenNewProject,
  onOpenHelpChat,
  onOpenCerebro,
  onOpenSettings,
  onLogout,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  isSidebarOpen,
  onToggleSidebar
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
        {onToggleSidebar && (
          <button onClick={onToggleSidebar} className="btn-icon" style={{ marginLeft: '-12px', color: 'var(--text-secondary)' }} title="Toggle Sidebar">
            <Menu size={20} />
          </button>
        )}
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

        {/* Cerebro Trigger */}
        {onOpenCerebro && (
          <button 
            className="btn btn-ai"
            onClick={onOpenCerebro}
            style={{ padding: '6px 12px', fontSize: '12px', height: '34px' }}
          >
            <Sparkles size={14} />
            <span>Cerebro</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button 
          className="btn btn-icon"
          onClick={onToggleTheme}
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Account & Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              color: 'inherit'
            }}
            title="Mi Cuenta y Configuración"
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFFFFF',
              boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)'
            }}>
              {currentUser?.avatar || 'TG'}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentUser?.nickname || 'Toni'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 100,
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              {/* User summary header */}
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentUser?.name || 'Antonio Javier García García'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {currentUser?.email || 'tonileblan@gmail.com'}
                </div>
                <div style={{ fontSize: '10px', color: '#8B5CF6', marginTop: '4px', fontWeight: 600 }}>
                  {currentUser?.role || 'Lead System Architect'}
                </div>
              </div>

              {/* Settings Action */}
              {onOpenSettings && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenSettings();
                  }}
                  className="dropdown-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Settings size={15} color="#8B5CF6" />
                  <span>Configuración & IA</span>
                </button>
              )}

              {/* Logout Action */}
              {onLogout && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="dropdown-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginTop: '4px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <LogOut size={15} color="#EF4444" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
