import React, { useState } from 'react';
import { 
  X, FolderPlus, Sparkles, ShieldCheck, Database, 
  Bot, Scale, HardDrive, Check, ArrowRight
} from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, AppTypeDirective } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onSaveProject }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Suite Toni (Propio / I+D)');
  const [status, setStatus] = useState<ProjectStatus>('En Desarrollo');
  const [appType, setAppType] = useState<AppTypeDirective>('Web & Frontend');
  const [tagline, setTagline] = useState('');
  const [problem, setProblem] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [feature1, setFeature1] = useState('');
  const [feature2, setFeature2] = useState('');
  const [feature3, setFeature3] = useState('');

  const [database, setDatabase] = useState('Sí - Supabase PostgreSQL (Esquema Aislado)');
  const [auth, setAuth] = useState('Sí - Supabase Auth (Email / Magic Link)');
  const [aiIntegration, setAiIntegration] = useState('Asistente Conversacional / Chatbot');
  const [aiProvider, setAiProvider] = useState('OpenAI (GPT-4o / GPT-4o-mini)');
  const [businessModel, setBusinessModel] = useState('Suscripción SaaS (Stripe Checkout)');
  const [frontendStack, setFrontendStack] = useState('React 19 + TypeScript + Vite');
  const [uiStyle, setUiStyle] = useState('Tailwind CSS + Glassmorphism Dark');

  const handleNameChange = (val: string) => {
    setName(val);
    const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefix = category.includes('Comercial') ? 'com_' : 'mia_';
    setSlug(`${prefix}${clean}`);
  };

  const handleCategoryChange = (val: ProjectCategory) => {
    setCategory(val);
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefix = val.includes('Comercial') ? 'com_' : 'mia_';
    setSlug(`${prefix}${clean}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const coreFeatures = [feature1, feature2, feature3].filter(f => f.trim().length > 0);

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || `mia_${Date.now()}`,
      category,
      status,
      appType,
      tagline: tagline.trim() || 'Nueva aplicación del ecosistema By Toni',
      problem: problem.trim() || 'Optimización de flujos y desarrollo asistido por IA',
      targetAudience: targetAudience.trim() || 'Usuarios finales y profesionales',
      coreFeatures: coreFeatures.length > 0 ? coreFeatures : ['Dashboard principal', 'Gestión de datos', 'Autenticación'],
      database,
      auth,
      aiIntegration,
      aiProvider,
      businessModel,
      frontendStack,
      uiStyle,
      color: '#6366F1',
      icon: 'FolderKanban',
      supabaseSchema: slug.trim(),
      createdAt: new Date().toISOString()
    };

    triggerCelebration();
    onSaveProject(newProject);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '740px', maxWidth: '95vw' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderPlus size={20} color="#818CF8" />
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                Inicializar Nuevo Proyecto (Briefing Ágil)
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Hereda automáticamente las 5 Directrices Maestras de Google Drive.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Section 1: Identificación */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#818CF8', marginBottom: '10px', textTransform: 'uppercase' }}>
              1. Identificación y Categoría
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  placeholder="ej. Clinica-Dental o Vita-Trading"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Slug / Esquema DB (Autocalculado)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as ProjectCategory)}
                  className="form-input"
                >
                  <option value="Suite Toni (Propio / I+D)">Suite Toni (Propio / I+D)</option>
                  <option value="Comercial / Clientes">Comercial / Clientes</option>
                  <option value="Prototipo Rápido / Demo">Prototipo Rápido / Demo</option>
                  <option value="Herramienta Interna / CLI">Herramienta Interna / CLI</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Tipo de Aplicación / Directriz
                </label>
                <select
                  value={appType}
                  onChange={(e) => setAppType(e.target.value as AppTypeDirective)}
                  className="form-input"
                >
                  <option value="Web & Frontend">🌐 Web & Frontend (React / Tailwind)</option>
                  <option value="Trading & Algoritmos">📈 Trading & Algoritmos (Financiero)</option>
                  <option value="Mobile & PWA (Local-First)">📱 Mobile & PWA (Local-First)</option>
                  <option value="SaaS Multi-tenant">☁️ SaaS Multi-tenant (Stripe / Auth)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Propuesta de Valor */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#38BDF8', marginBottom: '10px', textTransform: 'uppercase' }}>
              2. Propuesta de Valor y Alcance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Tagline / Resumen en 1 frase *
                </label>
                <input
                  type="text"
                  placeholder="ej. Gestor inteligente de citas y recordatorios para clínicas"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Problema Principal que Resuelve
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Reducir cancelaciones y automatizar reservas"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Público Objetivo (Target)
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Clínicas con 2 a 10 profesionales"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Funcionalidades Core (Top 3 del MVP)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="1. ej. Calendario interactivo de citas"
                    value={feature1}
                    onChange={(e) => setFeature1(e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="2. ej. Confirmación automática vía WhatsApp y Email"
                    value={feature2}
                    onChange={(e) => setFeature2(e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="3. ej. Historial clínico y ficha de pacientes"
                    value={feature3}
                    onChange={(e) => setFeature3(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Módulos Específicos */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#10B981', marginBottom: '10px', textTransform: 'uppercase' }}>
              3. Capacidades y Módulos Específicos (Desplegables)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Base de Datos / Persistencia
                </label>
                <select value={database} onChange={(e) => setDatabase(e.target.value)} className="form-input">
                  <option value="Sí - Supabase PostgreSQL (Esquema Aislado)">Sí - Supabase PostgreSQL (Esquema Aislado)</option>
                  <option value="No - Sin Base de Datos / Local Storage">No - Sin Base de Datos / Local Storage</option>
                  <option value="SQLite / DuckDB Local">SQLite / DuckDB Local</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Autenticación de Usuarios
                </label>
                <select value={auth} onChange={(e) => setAuth(e.target.value)} className="form-input">
                  <option value="Sí - Supabase Auth (Email / Magic Link)">Sí - Supabase Auth (Email / Magic Link)</option>
                  <option value="Sí - OAuth (Google / GitHub)">Sí - OAuth (Google / GitHub)</option>
                  <option value="Sí - Email + Contraseña + OAuth">Sí - Email + Contraseña + OAuth</option>
                  <option value="No - Acceso Público / Libre">No - Acceso Público / Libre</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Integración de IA
                </label>
                <select value={aiIntegration} onChange={(e) => setAiIntegration(e.target.value)} className="form-input">
                  <option value="No Requiere IA">No Requiere IA</option>
                  <option value="Asistente Conversacional / Chatbot">Asistente Conversacional / Chatbot</option>
                  <option value="Análisis & Procesamiento de Datos">Análisis & Procesamiento de Datos</option>
                  <option value="RAG / Búsqueda Semántica & Docs">RAG / Búsqueda Semántica & Docs</option>
                  <option value="Agente Autónomo / Tool Calling">Agente Autónomo / Tool Calling</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Proveedor de IA
                </label>
                <select value={aiProvider} onChange={(e) => setAiProvider(e.target.value)} className="form-input">
                  <option value="OpenAI (GPT-4o / GPT-4o-mini)">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="Anthropic (Claude 3.5 Sonnet)">Anthropic (Claude 3.5 Sonnet)</option>
                  <option value="Google Gemini (Gemini 2.0 / Flash)">Google Gemini (Gemini 2.0 / Flash)</option>
                  <option value="Groq / Llama 3 (Ultra Baja Latencia)">Groq / Llama 3 (Ultra Baja Latencia)</option>
                  <option value="No Aplica">No Aplica</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Modelo de Negocio / Monetización
                </label>
                <select value={businessModel} onChange={(e) => setBusinessModel(e.target.value)} className="form-input">
                  <option value="Gratuito / Libre">Gratuito / Libre</option>
                  <option value="Suscripción SaaS (Stripe Checkout)">Suscripción SaaS (Stripe Checkout)</option>
                  <option value="Pago Único (Licencia / Stripe)">Pago Único (Licencia / Stripe)</option>
                  <option value="Freemium (Plan Free + Pro)">Freemium (Plan Free + Pro)</option>
                  <option value="No Aplica / Uso Interno">No Aplica / Uso Interno</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Frontend Stack
                </label>
                <select value={frontendStack} onChange={(e) => setFrontendStack(e.target.value)} className="form-input">
                  <option value="React 19 + TypeScript + Vite">React 19 + TypeScript + Vite (Recomendado)</option>
                  <option value="Next.js (App Router)">Next.js (App Router)</option>
                  <option value="HTML / JS Vanilla + Tailwind">HTML / JS Vanilla + Tailwind</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Automatic Inheritance Callout */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}>
            <ShieldCheck size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#34D399', marginBottom: '2px' }}>
                Herencia Automática de las 5 Directrices Maestras:
              </div>
              <div>
                Este proyecto se registrará automáticamente en <code>Registro_Proyectos_Toni.csv</code>, aplicará RLS estricto en Supabase con el esquema <code>{slug || 'mia_*'}</code>, generará las páginas RGPD de Toni García y añadirá el sello "By Toni" en el pie de página.
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px' }}>
              <Sparkles size={14} />
              <span>Inicializar Proyecto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
