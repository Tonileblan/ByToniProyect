import React, { useState } from 'react';
import { 
  Cloud, HardDrive, Plus, X, ArrowRight, 
  SkipForward, Check, ExternalLink, Globe, FileText
} from 'lucide-react';
import { Project } from '../../../types/project';

interface NewProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Project) => void;
}

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ isOpen, onClose, onSaveProject }) => {
  const [step, setStep] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState('');
  
  // Form State
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [directives, setDirectives] = useState({
    supabase: true,
    cleanArchitecture: true,
    rgpd: true,
  });
  const [sources, setSources] = useState<string[]>([]);
  const [newSource, setNewSource] = useState('');
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [showDriveOptions, setShowDriveOptions] = useState(false);

  if (!isOpen) return null;

  const handleSimulateExtraction = () => {
    setIsExtracting(true);
    setStep(4);
    setTimeout(() => {
      setIsExtracting(false);
      setExtractionResult(`
### Especificaciones Extraídas (IA MCP)
- **Casos de Uso Principales:**
  1. Autenticación y Autorización basada en Supabase.
  2. Panel de administración en React 19 + CSS3 Nativo.
- **Arquitectura Detectada:** Clean Architecture (Domain, Data, Presentation).
- **Directrices Aplicadas:** RGPD estricto, Base de datos Serverless, 5 Directrices Maestras Google Drive.
- **Fuentes Vinculadas:** ${sources.length > 0 ? sources.join(', ') : 'Directrices predeterminadas de la Suite'}.
      `);
    }, 2000);
  };

  const handleFinish = () => {
    const proj: Project = {
      id: `proj_${Date.now()}`,
      name: projectName.trim() || 'Nuevo Proyecto',
      slug: (projectName.trim() || 'nuevo-proyecto').toLowerCase().replace(/\s+/g, '-'),
      category: (projectType as any) || 'Web & Frontend',
      status: 'Idea / Planificación' as any,
      database: directives.supabase ? 'Supabase' : 'Custom',
      auth: directives.supabase ? 'Supabase Auth' : 'Custom',
      aiIntegration: 'Asistente MCP',
      aiProvider: 'Google Gemini',
      frontendStack: 'React 19 + Vanilla CSS',
      uiStyle: 'Dark Glassmorphism',
      businessModel: 'SaaS',
      tagline: description || 'Proyecto inicializado en la Suite By Toni',
      problem: 'Extraído automáticamente por la IA',
      targetAudience: 'Definido por la IA',
      coreFeatures: ['Feature 1', 'Feature 2'],
      appType: 'Web & Frontend',
      color: '#6366f1',
      icon: 'Folder',
      createdAt: new Date().toISOString()
    };
    onSaveProject(proj);
    setStep(1);
    setExtractionResult('');
    setSources([]);
    onClose();
  };

  const handleAddDriveSource = (driveItemName: string) => {
    if (!sources.includes(driveItemName)) {
      setSources(prev => [...prev, driveItemName]);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-tertiary)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-primary)' }}>✨</span> Asistente de Creación de Proyecto
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: '48px',
                height: '6px',
                borderRadius: 'var(--radius-full)',
                background: step >= i ? 'var(--accent-primary)' : 'var(--bg-card)',
                boxShadow: step >= i ? 'var(--shadow-glow)' : 'none',
                transition: 'var(--transition-normal)'
              }} />
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1, minHeight: '320px' }}>
          
          {/* STEP 1: IDEA BASE */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>1. La Idea Base</h3>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>
                  Nombre del Proyecto *
                </label>
                <input 
                  type="text" 
                  value={projectName} 
                  onChange={e => setProjectName(e.target.value)} 
                  className="form-input" 
                  placeholder="Ej: Control 61, Vita-Trading..." 
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>
                  Tipo de Aplicación
                </label>
                <select value={projectType} onChange={e => setProjectType(e.target.value)} className="form-input">
                  <option value="Web & Frontend">Web & Frontend (React / Vite)</option>
                  <option value="Mobile & PWA (Local-First)">Mobile & PWA (Local-First)</option>
                  <option value="SaaS Multi-tenant">SaaS Multi-tenant</option>
                  <option value="Trading & Algoritmos">Trading & Algoritmos</option>
                  <option value="Internal CLI & Backend">Internal CLI & Backend</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>
                  Describe la visión en crudo
                </label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows={3} 
                  className="form-input" 
                  placeholder="Quiero desarrollar una plataforma para gestionar proyectos con directrices maestras..." 
                />
              </div>
            </div>
          )}

          {/* STEP 2: DIRECTRICES MAESTRAS */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>2. Directrices Maestras</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
                  Selecciona las directrices arquitectónicas que deben gobernar este proyecto.
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(directives).map(([key, val]) => (
                  <label key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                  >
                    <input 
                      type="checkbox" 
                      checked={val} 
                      onChange={() => setDirectives({...directives, [key]: !val})}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                    />
                    <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize', fontSize: '13px', fontWeight: '500' }}>
                      {key === 'supabase' ? 'Esquema y Autenticación Supabase (RLS Estricto)' :
                       key === 'cleanArchitecture' ? 'Clean Architecture (Domain, Data, Presentation)' :
                       key === 'rgpd' ? 'Cumplimiento Legal y RGPD (Antonio Javier García García)' :
                       key}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: FUENTES DE CONOCIMIENTO & GOOGLE DRIVE */}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    3. Fuentes de Conocimiento & Drive (Opcional)
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
                    Añade enlaces web, archivos locales o enlaza carpetas/documentos de Google Drive. Puedes ignorar este paso si deseas empezar directamente.
                  </p>
                </div>
              </div>

              {/* Botón rápido para Enlazar Google Drive */}
              <div style={{ 
                padding: '14px 16px', 
                background: 'rgba(16, 185, 129, 0.08)', 
                border: '1px solid rgba(16, 185, 129, 0.25)', 
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cloud size={18} color="#10B981" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#34D399' }}>
                      Enlazar con Google Drive
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowDriveOptions(!showDriveOptions)}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                  >
                    {showDriveOptions ? 'Cerrar opciones Drive' : 'Elegir de Drive'}
                  </button>
                </div>

                {showDriveOptions && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Selecciona archivos recomendados de tu Drive:</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button 
                        type="button"
                        onClick={() => handleAddDriveSource('📁 Drive: Directrices_Maestras_ByToni.gdoc')}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '6px 10px', justifyContent: 'flex-start', gap: '6px' }}
                      >
                        <FileText size={13} color="#10B981" /> Directrices Maestras
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleAddDriveSource('📁 Drive: Especificaciones_Producto.gdoc')}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '6px 10px', justifyContent: 'flex-start', gap: '6px' }}
                      >
                        <FileText size={13} color="#10B981" /> Especificaciones Producto
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleAddDriveSource('📁 Drive: Carpeta_Proyectos_Drive/')}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '6px 10px', justifyContent: 'flex-start', gap: '6px' }}
                      >
                        <Cloud size={13} color="#10B981" /> Carpeta Raíz de Proyectos
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleAddDriveSource('📁 Drive: Manual_UI_UX_ByToni.gdoc')}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '6px 10px', justifyContent: 'flex-start', gap: '6px' }}
                      >
                        <FileText size={13} color="#10B981" /> Manual UI/UX By Toni
                      </button>
                    </div>

                    {/* Input para enlace personalizado de Google Drive */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input 
                        type="text" 
                        value={driveFolderUrl}
                        onChange={e => setDriveFolderUrl(e.target.value)}
                        placeholder="O pega una URL de Drive: https://drive.google.com/drive/folders/..."
                        className="form-input"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (driveFolderUrl.trim()) {
                            handleAddDriveSource(`📁 Drive: ${driveFolderUrl.trim()}`);
                            setDriveFolderUrl('');
                          }
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '11px', padding: '4px 12px', background: '#10B981' }}
                      >
                        Enlazar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input manual de enlaces o archivos */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  O introduce una URL o ruta web externa:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={newSource} 
                    onChange={e => setNewSource(e.target.value)} 
                    className="form-input" 
                    placeholder="Ej: https://docs.supabase.com o ./documentacion.pdf" 
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newSource.trim()) {
                        e.preventDefault();
                        setSources([...sources, newSource.trim()]);
                        setNewSource('');
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => { if(newSource.trim()) { setSources([...sources, newSource.trim()]); setNewSource(''); } }}
                    className="btn btn-secondary"
                    style={{ padding: '0 16px', fontSize: '12px' }}
                  >
                    Añadir
                  </button>
                </div>
              </div>

              {/* Lista de fuentes añadidas */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {sources.map((src, i) => (
                  <div key={i} style={{
                    padding: '4px 10px',
                    background: src.includes('Drive') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    border: src.includes('Drive') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                    color: src.includes('Drive') ? '#34D399' : '#818CF8',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{src}</span>
                    <button 
                      type="button"
                      onClick={() => setSources(sources.filter((_, idx) => idx !== i))} 
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {sources.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', padding: '8px 0' }}>
                    Sin fuentes adicionales (se aplicarán las directrices maestras estándar).
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: RESULTADO DE EXTRACCIÓN O FINALIZACIÓN */}
          {step === 4 && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
              {isExtracting ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      border: '4px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '50%'
                    }}></div>
                    <div style={{
                      position: 'absolute', inset: 0,
                      border: '4px solid var(--accent-primary)',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🧠</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>Procesando Fuentes con MCP</h3>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '12px', margin: 0 }}>Cruzando la idea con directrices y fuentes de Drive...</p>
                  </div>
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <h3 style={{ fontSize: '16px', color: '#34D399', fontWeight: '600', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✅</span> Especificaciones Extraídas & Directrices Vinculadas
                  </h3>
                  <pre style={{
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    lineHeight: 1.6
                  }}>
                    {extractionResult}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-tertiary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: '12px' }}>
            Cancelar
          </button>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {step > 1 && !isExtracting && (
              <button type="button" onClick={() => setStep(step - 1)} className="btn btn-secondary" style={{ fontSize: '12px' }}>
                Atrás
              </button>
            )}
            
            {step < 3 && (
              <button type="button" onClick={() => setStep(step + 1)} className="btn btn-primary" style={{ fontSize: '12px' }}>
                Siguiente
              </button>
            )}
            
            {step === 3 && (
              <>
                {/* BOTÓN PARA IGNORAR / OMITIR ESTE PASO */}
                <button 
                  type="button" 
                  onClick={handleFinish} 
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
                  title="Omitir fuentes y crear el proyecto inmediatamente"
                >
                  <SkipForward size={14} />
                  <span>Ignorar paso y crear</span>
                </button>

                <button 
                  type="button" 
                  onClick={handleSimulateExtraction} 
                  className="btn btn-primary"
                  style={{ fontSize: '12px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}
                >
                  Extraer Requisitos (MCP)
                </button>
              </>
            )}

            {step === 4 && !isExtracting && (
              <button type="button" onClick={handleFinish} className="btn btn-primary" style={{ fontSize: '12px' }}>
                Crear Proyecto Definitivo
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
