import React, { useState } from 'react';
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

  if (!isOpen) return null;

  const handleSimulateExtraction = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setExtractionResult(`
### Especificaciones Extraídas (IA MCP)
- **Casos de Uso Principales:**
  1. Autenticación y Autorización basada en Supabase.
  2. Panel de administración en React.
- **Arquitectura Detectada:** Clean Architecture (Domain, Data, Presentation).
- **Directrices Aplicadas:** RGPD estricto, Base de datos Serverless.
      `);
      setStep(4);
    }, 2500);
  };

  const handleFinish = () => {
    const proj: Project = {
      id: `proj_${Date.now()}`,
      name: projectName || 'Nuevo Proyecto',
      slug: (projectName || 'Nuevo Proyecto').toLowerCase().replace(/\s+/g, '-'),
      category: (projectType as any) || 'Web App',
      status: 'Idea' as any,
      database: directives.supabase ? 'Supabase' : 'Custom',
      auth: directives.supabase ? 'Supabase Auth' : 'Custom',
      aiIntegration: 'Asistente MCP',
      aiProvider: 'Google Gemini',
      frontendStack: 'React 19 + Vanilla CSS',
      uiStyle: 'Dark Glassmorphism',
      businessModel: 'SaaS',
      tagline: description,
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
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-primary)' }}>✨</span> Asistente de Proyectos (MCP)
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
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1, minHeight: '300px' }}>
          
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>1. La Idea Base</h3>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Nombre del Proyecto</label>
                <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="form-input" placeholder="Ej: Control 61" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Tipo</label>
                <select value={projectType} onChange={e => setProjectType(e.target.value)} className="form-input">
                  <option value="">Selecciona...</option>
                  <option value="SaaS Web">SaaS Web</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Script/Bot">Script/Bot</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Describe la visión en crudo</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="form-input" placeholder="Quiero hacer un panel de gestión enfocado en agencias..." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>2. Directrices Maestras</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>Selecciona las reglas de oro que el MCP debe inyectar en este proyecto.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(directives).map(([key, val]) => (
                  <label key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
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
                    <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize', fontSize: '14px', fontWeight: '500' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>3. Fuentes de Conocimiento</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>Añade enlaces o rutas a documentos. El MCP los leerá para extraer la inteligencia.</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={newSource} 
                  onChange={e => setNewSource(e.target.value)} 
                  className="form-input" 
                  placeholder="Ej: https://docs.supabase.com o ./docs/reqs.pdf" 
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newSource) {
                      setSources([...sources, newSource]);
                      setNewSource('');
                    }
                  }}
                />
                <button 
                  onClick={() => { if(newSource) { setSources([...sources, newSource]); setNewSource(''); } }}
                  className="btn btn-secondary"
                >
                  Añadir
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                {sources.map((src, i) => (
                  <div key={i} style={{
                    padding: '6px 12px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#818CF8',
                    fontSize: '13px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {src}
                    <button onClick={() => setSources(sources.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
                  </div>
                ))}
                {sources.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', width: '100%', textAlign: 'center', padding: '20px' }}>No hay fuentes añadidas.</div>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              {isExtracting ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px' }}>
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
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🧠</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>MCP Analizando Fuentes</h3>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '13px', opacity: 0.8 }}>Cruzando la idea con las directrices y fuentes...</p>
                  </div>
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <h3 style={{ fontSize: '18px', color: '#34D399', fontWeight: '500', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✅</span> Extracción Completada
                  </h3>
                  <pre style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    lineHeight: 1.5
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
          padding: '20px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-tertiary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {step > 1 && !isExtracting && (
              <button onClick={() => setStep(step - 1)} className="btn btn-secondary">Atrás</button>
            )}
            
            {step < 3 && (
              <button onClick={() => setStep(step + 1)} className="btn btn-primary">Siguiente</button>
            )}
            
            {step === 3 && (
              <button onClick={handleSimulateExtraction} className="btn btn-ai">
                Extraer Requisitos (MCP)
              </button>
            )}

            {step === 4 && !isExtracting && (
              <button onClick={handleFinish} className="btn btn-primary">
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
