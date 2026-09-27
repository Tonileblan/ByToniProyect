import React, { useState, useEffect } from 'react';
import { 
  X, Key, Sparkles, User, FileCode2, Save, RotateCcw, 
  Check, CheckCircle2, Shield, Download, Upload, RefreshCw, AlertCircle, Eye, EyeOff,
  Palette, Map, ShieldCheck, MessageSquare, Layers
} from 'lucide-react';
import { UserProfile, UserSettings, ReportPromptsConfig } from '../../types/project';
import { storageService, DEFAULT_USER, DEFAULT_SETTINGS } from '../../services/storageService';
import { DEFAULT_REPORT_PROMPTS } from '../../services/aiService';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'ia' | 'prompts' | 'profile' | 'backup'>('ia');
  const [selectedPromptKey, setSelectedPromptKey] = useState<keyof ReportPromptsConfig>('informeMaestro');
  
  // Settings state
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [prompts, setPrompts] = useState<ReportPromptsConfig>(DEFAULT_REPORT_PROMPTS);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile state
  const [name, setName] = useState(currentUser.name);
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [email, setEmail] = useState(currentUser.email);
  const [dni, setDni] = useState(currentUser.dni);
  const [role, setRole] = useState(currentUser.role);

  useEffect(() => {
    if (isOpen) {
      const settings = storageService.getSettings();
      setGeminiApiKey(settings.geminiApiKey || '');
      setSelectedModel(settings.selectedModel || 'gemini-1.5-flash');
      setPrompts(storageService.getReportPrompts());
      
      setName(currentUser.name);
      setNickname(currentUser.nickname);
      setEmail(currentUser.email);
      setDni(currentUser.dni);
      setRole(currentUser.role);
      setKeyStatus('idle');
    }
  }, [isOpen, currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    storageService.saveSettings({
      geminiApiKey: geminiApiKey.trim(),
      selectedModel,
      prompts
    });

    const updatedUser: UserProfile = {
      ...currentUser,
      name,
      nickname,
      email,
      dni,
      role
    };
    storageService.saveUser(updatedUser);
    onUserUpdate(updatedUser);

    triggerCelebration();
    showToast('✅ Configuración y Prompts guardados correctamente');
  };

  const handleResetSinglePrompt = (key: keyof ReportPromptsConfig) => {
    setPrompts(prev => ({
      ...prev,
      [key]: DEFAULT_REPORT_PROMPTS[key]
    }));
    showToast(`🔄 Prompt restaurado a la plantilla original`);
  };

  const handleResetAllPrompts = () => {
    setPrompts(DEFAULT_REPORT_PROMPTS);
    storageService.resetReportPromptsToDefault();
    showToast('🔄 Todos los prompts han sido restaurados por defecto');
  };

  const handleTestApiKey = async () => {
    if (!geminiApiKey.trim()) {
      setKeyStatus('invalid');
      showToast('⚠️ Por favor ingresa una clave API antes de probar');
      return;
    }

    setIsTestingKey(true);
    setKeyStatus('idle');

    try {
      if (geminiApiKey.startsWith('AIzaSy')) {
        setKeyStatus('valid');
        showToast('✨ Clave API válida con formato correcto de Google AI Studio');
      } else {
        setKeyStatus('invalid');
        showToast('⚠️ La clave no parece ser de Google AI Studio (debe empezar por AIzaSy)');
      }
    } catch (e: any) {
      setKeyStatus('invalid');
      showToast(`Error al validar: ${e.message}`);
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleDownloadBackup = () => {
    const data = storageService.exportAllDataAsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ByToniProyect_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('📦 Respaldo descargado con éxito');
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.importAllDataFromJSON(content);
        if (success) {
          showToast('✅ Datos importados correctamente. Recargando...');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          showToast('❌ Error: El archivo JSON no tiene un formato válido');
        }
      }
    };
    reader.readAsText(file);
  };

  const promptOptions: { key: keyof ReportPromptsConfig; title: string; objective: string; icon: any; color: string }[] = [
    {
      key: 'informeMaestro',
      title: '📑 Informe Maestro (General)',
      objective: 'Orquesta las 6 secciones completas del producto + Directrices íntegras para Antigravity',
      icon: FileCode2,
      color: '#8B5CF6'
    },
    {
      key: 'uiPaleta',
      title: '🎨 1. Interfaz (UI) y Paleta',
      objective: 'Definir el diseño visual, patrones de componentes e identidad cromática',
      icon: Palette,
      color: '#A855F7'
    },
    {
      key: 'estructuraSitemap',
      title: '🗺️ 2. Estructura y Sitemap',
      objective: 'Organizar la arquitectura de la información, flujos y páginas de manera lógica',
      icon: Map,
      color: '#38BDF8'
    },
    {
      key: 'usabilidadUX',
      title: '🛡️ 3. Usabilidad (UX) y Accesibilidad',
      objective: 'Asegurar experiencia fluida, sin alerts nativos, táctil 48dp y WCAG 2.1 AA',
      icon: ShieldCheck,
      color: '#10B981'
    },
    {
      key: 'tonoVoz',
      title: '📢 4. Tono, Voz y Orientación',
      objective: 'Definir personalidad de marca, copywriting y valor al usuario final',
      icon: MessageSquare,
      color: '#F59E0B'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '92vh',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Key size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Configuración & Mi Cuenta
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Personaliza la IA de Gemini, edita los Prompts Informes y gestiona tu perfil
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Navigation Tabs + Content */}
        <div style={{ display: 'flex', flex: 1, minHeight: '520px', overflow: 'hidden' }}>
          
          {/* Left Navigation Sidebar */}
          <div style={{
            width: '210px',
            borderRight: '1px solid var(--border-subtle)',
            background: 'var(--bg-tertiary)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <button
              onClick={() => setActiveTab('ia')}
              className={`nav-item ${activeTab === 'ia' ? 'active' : ''}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'ia' ? 'var(--bg-card-hover)' : 'transparent',
                color: activeTab === 'ia' ? '#8B5CF6' : 'var(--text-secondary)'
              }}
            >
              <Sparkles size={16} color={activeTab === 'ia' ? '#8B5CF6' : 'var(--text-muted)'} />
              <span>IA & Claves API</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`nav-item ${activeTab === 'prompts' ? 'active' : ''}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'prompts' ? 'var(--bg-card-hover)' : 'transparent',
                color: activeTab === 'prompts' ? '#8B5CF6' : 'var(--text-secondary)'
              }}
            >
              <Layers size={16} color={activeTab === 'prompts' ? '#8B5CF6' : 'var(--text-muted)'} />
              <span>Prompt Informes</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'profile' ? 'var(--bg-card-hover)' : 'transparent',
                color: activeTab === 'profile' ? '#8B5CF6' : 'var(--text-secondary)'
              }}
            >
              <User size={16} color={activeTab === 'profile' ? '#8B5CF6' : 'var(--text-muted)'} />
              <span>Mi Perfil & Datos</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`nav-item ${activeTab === 'backup' ? 'active' : ''}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'backup' ? 'var(--bg-card-hover)' : 'transparent',
                color: activeTab === 'backup' ? '#8B5CF6' : 'var(--text-secondary)'
              }}
            >
              <Download size={16} color={activeTab === 'backup' ? '#8B5CF6' : 'var(--text-muted)'} />
              <span>Respaldo & Datos</span>
            </button>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  fontSize: '12px',
                  color: '#EF4444',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  padding: '8px'
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Right Tab Content */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            
            {/* TAB 1: IA & API KEYS */}
            {activeTab === 'ia' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    Configuración de Google Gemini API
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Ingresa tu clave de API de <strong>Google AI Studio</strong> para habilitar generación de contenido y chat en vivo con IA.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Google Gemini API Key (Google AI Studio)
                  </label>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-tertiary)',
                      border: `1px solid ${keyStatus === 'valid' ? '#10B981' : keyStatus === 'invalid' ? '#EF4444' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0 12px',
                      height: '40px'
                    }}>
                      <Key size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
                      <input 
                        type={showApiKey ? 'text' : 'password'}
                        value={geminiApiKey}
                        onChange={e => {
                          setGeminiApiKey(e.target.value);
                          setKeyStatus('idle');
                        }}
                        placeholder="AIzaSy..."
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          fontFamily: 'monospace'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button 
                      type="button"
                      onClick={handleTestApiKey}
                      disabled={isTestingKey}
                      className="btn btn-secondary"
                      style={{ height: '40px', padding: '0 14px', fontSize: '12px' }}
                    >
                      {isTestingKey ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Probar'}
                    </button>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {keyStatus === 'valid' && <span style={{ color: '#10B981' }}>✓ Formato de clave válido para Google AI Studio.</span>}
                    {keyStatus === 'invalid' && <span style={{ color: '#EF4444' }}>✕ La clave debe comenzar por <code>AIzaSy...</code> (obtenida en aistudio.google.com).</span>}
                    {keyStatus === 'idle' && <span>Puedes obtener tu clave gratuita en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#818CF8' }}>aistudio.google.com</a>.</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Modelo por Defecto
                  </label>
                  <select
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                    className="select-input"
                    style={{ height: '40px', background: 'var(--bg-tertiary)' }}
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Rápido y Eficiente - Recomendado)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Máximo Razonamiento y Contexto Largo)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Próxima Generación)</option>
                  </select>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Shield size={20} color="#10B981" />
                  <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: 1.4 }}>
                    <strong>Modo Resiliente Activo:</strong> Si no tienes conexión o la clave no está configurada, ByToniProyect utilizará la base de conocimiento curada de UX/UI y generará los 4 informes y el informe maestro sin interrupciones.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROMPT INFORMES (AGRUPADOS) */}
            {activeTab === 'prompts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                      Configuración de Prompt Informes
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      Edita las instrucciones y directrices de IA para cada tipo de informe generado en el Studio.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleResetAllPrompts}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '6px 10px', gap: '6px' }}
                    title="Restaurar todos los prompts oficiales"
                  >
                    <RotateCcw size={12} />
                    <span>Restaurar Todos</span>
                  </button>
                </div>

                {/* Sub-selector Chips */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {promptOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedPromptKey(opt.key)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: selectedPromptKey === opt.key ? `1px solid ${opt.color}` : '1px solid var(--border-subtle)',
                        background: selectedPromptKey === opt.key ? 'var(--bg-card-hover)' : 'var(--bg-tertiary)',
                        color: selectedPromptKey === opt.key ? opt.color : 'var(--text-secondary)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {opt.title}
                    </button>
                  ))}
                </div>

                {/* Active Prompt Box */}
                {(() => {
                  const currentOpt = promptOptions.find(o => o.key === selectedPromptKey)!;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <strong>Objetivo:</strong> {currentOpt.objective}
                        </div>
                        <button
                          onClick={() => handleResetSinglePrompt(selectedPromptKey)}
                          className="btn-icon"
                          title="Restaurar este prompt específico"
                          style={{ padding: '4px', color: 'var(--text-muted)' }}
                        >
                          <RotateCcw size={13} />
                        </button>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <textarea
                          value={prompts[selectedPromptKey]}
                          onChange={e => setPrompts({ ...prompts, [selectedPromptKey]: e.target.value })}
                          rows={14}
                          style={{
                            width: '100%',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-md)',
                            padding: '14px',
                            color: '#E2E8F0',
                            fontSize: '12px',
                            lineHeight: '1.6',
                            fontFamily: 'monospace',
                            resize: 'vertical',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          textAlign: 'right',
                          marginTop: '4px'
                        }}>
                          {prompts[selectedPromptKey].length} caracteres · {prompts[selectedPromptKey].split(/\s+/).length} palabras
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 3: PERFIL & DATOS */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    Perfil de Titular y Autor
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Datos del titular legal que se insertan automáticamente en las directrices de RGPD y firmas By Toni.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Nombre Completo
                    </label>
                    <input 
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="text-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Nombre Corto / Alias
                    </label>
                    <input 
                      type="text"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      className="text-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      DNI / Identificador Legal
                    </label>
                    <input 
                      type="text"
                      value={dni}
                      onChange={e => setDni(e.target.value)}
                      className="text-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Email de Contacto
                    </label>
                    <input 
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Rol / Cargo en Proyectos
                  </label>
                  <input 
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: BACKUP & DATA */}
            {activeTab === 'backup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    Exportación e Importación de Datos
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Transfiere fácilmente todos tus proyectos, tareas, directrices y configuraciones entre tu PC con Windows y tu Mac.
                  </p>
                </div>

                {/* Export Card */}
                <div style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Exportar Copia de Seguridad (.json)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Descarga un archivo con todos los proyectos (incluido Pájaros y otros nuevos), tareas y ajustes.
                    </div>
                  </div>

                  <button 
                    onClick={handleDownloadBackup}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '12px', gap: '8px', flexShrink: 0 }}
                  >
                    <Download size={14} />
                    <span>Exportar JSON</span>
                  </button>
                </div>

                {/* Import Card */}
                <div style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Importar Copia de Seguridad (.json)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Carga un archivo JSON exportado desde tu otra máquina para sincronizar al instante.
                    </div>
                  </div>

                  <label 
                    className="btn btn-secondary"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '12px', 
                      gap: '8px', 
                      cursor: 'pointer', 
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <Upload size={14} />
                    <span>Importar JSON</span>
                    <input 
                      type="file" 
                      accept=".json,application/json" 
                      onChange={handleUploadBackup}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {toastMessage && <span style={{ color: '#10B981', fontWeight: 600 }}>{toastMessage}</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button 
              onClick={handleSaveSettings}
              className="btn btn-primary"
              style={{ padding: '8px 20px', gap: '8px' }}
            >
              <Save size={14} />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
