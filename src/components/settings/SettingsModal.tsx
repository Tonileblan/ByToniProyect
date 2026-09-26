import React, { useState, useEffect } from 'react';
import { 
  X, Key, Sparkles, User, FileCode2, Save, RotateCcw, 
  Check, CheckCircle2, Shield, Download, RefreshCw, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { UserProfile, UserSettings } from '../../types/project';
import { storageService, DEFAULT_USER, DEFAULT_SETTINGS } from '../../services/storageService';
import { INFORME_MAESTRO_PROMPT_TEMPLATE } from '../../services/aiService';
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
  const [activeTab, setActiveTab] = useState<'ia' | 'prompt' | 'profile' | 'backup'>('ia');
  
  // Settings state
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [masterPrompt, setMasterPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
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
      setGeminiApiKey(settings.geminiApiKey);
      setMasterPrompt(settings.masterPromptTemplate || INFORME_MAESTRO_PROMPT_TEMPLATE);
      setSelectedModel(settings.selectedModel || 'gemini-1.5-flash');
      
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
      masterPromptTemplate: masterPrompt,
      selectedModel
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
    showToast('✅ Configuración guardada correctamente');
  };

  const handleResetPrompt = () => {
    setMasterPrompt(INFORME_MAESTRO_PROMPT_TEMPLATE);
    storageService.saveMasterPrompt(INFORME_MAESTRO_PROMPT_TEMPLATE);
    showToast('🔄 Prompt restaurado a la plantilla maestra oficial');
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
        maxWidth: '850px',
        maxHeight: '90vh',
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
          padding: '20px 24px',
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
                Personaliza la IA de Gemini, edita el Prompt Maestro y gestiona tu perfil
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Navigation Tabs + Content */}
        <div style={{ display: 'flex', flex: 1, minHeight: '480px', overflow: 'hidden' }}>
          
          {/* Left Navigation Sidebar */}
          <div style={{
            width: '220px',
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
              onClick={() => setActiveTab('prompt')}
              className={`nav-item ${activeTab === 'prompt' ? 'active' : ''}`}
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
                background: activeTab === 'prompt' ? 'var(--bg-card-hover)' : 'transparent',
                color: activeTab === 'prompt' ? '#8B5CF6' : 'var(--text-secondary)'
              }}
            >
              <FileCode2 size={16} color={activeTab === 'prompt' ? '#8B5CF6' : 'var(--text-muted)'} />
              <span>Prompt Maestro</span>
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
                    <strong>Modo Resiliente Activo:</strong> Si no tienes conexión o la clave no está configurada, ByToniProyect utilizará la base de conocimiento curada de UX/UI y generará los reportes y fuentes sin interrupciones.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROMPT MAESTRO */}
            {activeTab === 'prompt' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                      Editor de Prompt Maestro (Informe Maestro)
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      Este prompt es utilizado por la IA para generar el Informe Maestro y estructurar las 6 secciones oficiales.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleResetPrompt}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '6px 10px', gap: '6px' }}
                    title="Restaurar a la versión original de Toni"
                  >
                    <RotateCcw size={12} />
                    <span>Restaurar Oficial</span>
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea
                    value={masterPrompt}
                    onChange={e => setMasterPrompt(e.target.value)}
                    rows={15}
                    style={{
                      width: '100%',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
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
                    {masterPrompt.length} caracteres · {masterPrompt.split(/\s+/).length} palabras
                  </div>
                </div>
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
                    Exportación y Respaldo
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Descarga una copia completa en formato JSON de todos tus proyectos, tareas, directrices y configuraciones.
                  </p>
                </div>

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
                      Copia de Seguridad Completa (.json)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Incluye proyectos, tareas, secciones, directrices y prompts personalizados.
                    </div>
                  </div>

                  <button 
                    onClick={handleDownloadBackup}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '12px', gap: '8px' }}
                  >
                    <Download size={14} />
                    <span>Exportar JSON</span>
                  </button>
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
