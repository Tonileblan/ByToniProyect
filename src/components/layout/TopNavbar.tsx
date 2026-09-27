import React, { useState } from 'react';
import { 
  Search, Plus, Sparkles, Moon, Sun,
  FolderPlus, CheckSquare, BookOpen, ExternalLink,
  HelpCircle, Menu, Settings, LogOut, ChevronDown,
  Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Project, UserProfile } from '../../types/project';
import { SyncStatus } from '../../services/supabaseService';

interface TopNavbarProps {
  currentProject: Project | null;
  projects?: Project[];
  onSelectProject?: (projectId: string) => void;
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
  syncStatus?: SyncStatus;
  syncMessage?: string;
  lastSynced?: Date | null;
  onManualSync?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentProject,
  projects = [],
  onSelectProject,
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
  onToggleSidebar,
  syncStatus = 'synced',
  syncMessage,
  lastSynced,
  onManualSync
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showSyncTooltip, setShowSyncTooltip] = useState(false);

  // Status visual configurations
  const getSyncBadge = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: <RefreshCw size={13} className="spin-animation" color="#60A5FA" />,
          label: 'Sincronizando...',
          color: '#60A5FA',
          bg: 'rgba(59, 130, 246, 0.12)',
          border: 'rgba(59, 130, 246, 0.3)'
        };
      case 'synced':
        return {
          icon: <CheckCircle2 size={13} color="#10B981" />,
          label: 'Supabase Online',
          color: '#10B981',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)'
        };
      case 'pending_schema':
        return {
          icon: <AlertCircle size={13} color="#F59E0B" />,
          label: 'Esquema Pendiente',
          color: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)'
        };
      case 'error':
      case 'offline':
      default:
        return {
          icon: <CloudOff size={13} color="#94A3B8" />,
          label: 'Modo Local (Offline)',
          color: '#94A3B8',
          bg: 'rgba(148, 163, 184, 0.12)',
          border: 'rgba(148, 163, 184, 0.3)'
        };
    }
  };

  const syncBadge = getSyncBadge();

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
      {/* Left: Brand & Project Selector */}
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

        {/* Project Selector Dropdown */}
        {projects.length > 0 && onSelectProject && (
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              style={{ 
                padding: '5px 12px', 
                fontSize: '12px', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'var(--text-primary)'
              }}
              title="Cambiar de proyecto activo"
            >
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: currentProject?.color || '#6366f1' 
              }} />
              <span>{currentProject?.name || 'Seleccionar Proyecto'}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {showProjectMenu && (
              <div 
                className="glass-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '240px',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                <div style={{ padding: '4px 8px 6px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Proyectos Disponibles ({projects.length})
                </div>
                {projects.map(p => (
                  <button
                    key={p.id}
                    className="btn btn-secondary"
                    style={{ 
                      width: '100%', 
                      justifyContent: 'space-between', 
                      border: 'none', 
                      background: p.id === currentProject?.id ? 'var(--bg-card-hover)' : 'transparent', 
                      padding: '8px 10px',
                      fontSize: '12px'
                    }}
                    onClick={() => {
                      setShowProjectMenu(false);
                      onSelectProject(p.id);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color || '#6366f1', flexShrink: 0 }} />
                      <span style={{ fontWeight: p.id === currentProject?.id ? 700 : 400 }}>{p.name}</span>
                    </div>
                    <span className="badge badge-purple" style={{ fontSize: '9px', padding: '1px 5px' }}>{p.category.includes('Suite') ? 'Suite' : p.category.includes('Comercial') ? 'Cliente' : 'App'}</span>
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '4px', paddingTop: '4px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '6px 10px', fontSize: '11px', color: 'var(--accent-primary)' }}
                    onClick={() => {
                      setShowProjectMenu(false);
                      onOpenNewProject();
                    }}
                  >
                    <Plus size={13} />
                    <span>+ Crear Nuevo Proyecto</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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
        flex: '0 1 360px', 
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

      {/* Right: Cloud Sync Badge, Help Chat, AI Copilot, Theme & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Cloud Sync Status Badge */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              if (onManualSync) onManualSync();
              setShowSyncTooltip(!showSyncTooltip);
            }}
            onMouseEnter={() => setShowSyncTooltip(true)}
            onMouseLeave={() => setShowSyncTooltip(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              background: syncBadge.bg,
              border: `1px solid ${syncBadge.border}`,
              color: syncBadge.color,
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Estado de sincronización en la nube (Haz clic para sincronizar ahora)"
          >
            {syncBadge.icon}
            <span>{syncBadge.label}</span>
          </button>

          {/* Sync Tooltip */}
          {showSyncTooltip && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '260px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 110,
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cloud size={14} color="#6366F1" />
                <span>Sincronización Supabase</span>
              </div>
              <p style={{ margin: '0 0 6px 0', lineHeight: '1.4' }}>
                {syncMessage || (syncStatus === 'synced' ? 'Tus proyectos y tareas se respaldan en tiempo real en Supabase con esquema aislado.' : 'Trabajando en modo local (localStorage).')}
              </p>
              {lastSynced && (
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Última sincronización: {lastSynced.toLocaleTimeString()}
                </div>
              )}
              {onManualSync && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onManualSync();
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '4px 8px', fontSize: '11px', justifyContent: 'center', gap: '6px' }}
                >
                  <RefreshCw size={12} />
                  <span>Forzar Sincronización</span>
                </button>
              )}
            </div>
          )}
        </div>

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
