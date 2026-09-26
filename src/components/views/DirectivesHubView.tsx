import React, { useState } from 'react';
import { 
  BookOpen, ExternalLink, Copy, Check, Plus, 
  ShieldCheck, Database, Bot, Scale, HardDrive, 
  LayoutTemplate, TrendingUp, Smartphone, CreditCard,
  Edit3, Trash2, Search, X, Download, Terminal, Tag,
  Eye, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';
import { DirectiveItem, AppTypeDirective } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface DirectivesHubViewProps {
  directives: DirectiveItem[];
  onAddDirective?: (newDirective: DirectiveItem) => void;
  onUpdateDirective?: (updatedDirective: DirectiveItem) => void;
  onDeleteDirective?: (directiveId: string) => void;
}

const ALL_APP_TYPES: AppTypeDirective[] = [
  'Todas las Apps',
  'Web & Frontend',
  'Trading & Algoritmos',
  'Mobile & PWA (Local-First)',
  'SaaS Multi-tenant',
  'Internal CLI & Backend'
];

export const DirectivesHubView: React.FC<DirectivesHubViewProps> = ({
  directives,
  onAddDirective,
  onUpdateDirective,
  onDeleteDirective
}) => {
  const [selectedAppType, setSelectedAppType] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFeedbackText, setCopyFeedbackText] = useState<string>('');
  
  // Modals state
  const [viewingDirective, setViewingDirective] = useState<DirectiveItem | null>(null);
  const [editingDirective, setEditingDirective] = useState<DirectiveItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State for Create/Edit
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Web');
  const [formAppTypes, setFormAppTypes] = useState<string[]>(['Web & Frontend']);
  const [formSummary, setFormSummary] = useState('');
  const [formFullMarkdown, setFormFullMarkdown] = useState('');
  const [formRules, setFormRules] = useState<string[]>(['']);
  const [formPromptTemplate, setFormPromptTemplate] = useState('');
  const [formDriveUrl, setFormDriveUrl] = useState('');

  // Active tab in viewer modal
  const [viewerActiveTab, setViewerActiveTab] = useState<'markdown' | 'rules' | 'prompt'>('markdown');

  // Filter directives
  const filtered = directives.filter(d => {
    // App Type filter
    if (selectedAppType !== 'Todas') {
      if (selectedAppType === '5 Directrices Drive') {
        if (!d.isOfficialMaster && d.category !== 'General Drive') return false;
      } else {
        const matchesType = d.appTypes?.some(t => t === selectedAppType || t === 'Todas las Apps') ||
          d.category.toLowerCase().includes(selectedAppType.toLowerCase());
        if (!matchesType) return false;
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchSummary = d.summary.toLowerCase().includes(q);
      const matchMarkdown = d.fullMarkdownContent?.toLowerCase().includes(q) || false;
      const matchRules = d.rules.some(r => r.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchMarkdown && !matchRules) return false;
    }

    return true;
  });

  const handleCopyText = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopyFeedbackText(label);
    setTimeout(() => {
      setCopiedId(null);
      setCopyFeedbackText('');
    }, 2200);
  };

  const handleCopyPrompt = (directive: DirectiveItem) => {
    const text = `### ${directive.title}\n\n**Resumen:** ${directive.summary}\n\n**Reglas Obligatorias:**\n${directive.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**Instrucción:** ${directive.promptTemplate}`;
    handleCopyText(text, directive.id, '¡Prompt Copiado!');
  };

  const handleCopyFullMarkdown = (directive: DirectiveItem) => {
    handleCopyText(directive.fullMarkdownContent || directive.summary, directive.id, '¡Markdown Copiado!');
  };

  const openCreateModal = () => {
    setFormTitle('');
    setFormCategory('Web');
    setFormAppTypes(['Web & Frontend']);
    setFormSummary('');
    setFormFullMarkdown('# Nueva Directriz de Desarrollo\n\n## 1. Principio y Alcance\nDescribe aquí el alcance detallado...');
    setFormRules(['Regla mandatoria 1', 'Regla mandatoria 2']);
    setFormPromptTemplate('Aplica la Directriz: Desarrolla siguiendo los estándares establecidos.');
    setFormDriveUrl('https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW');
    setIsCreatingNew(true);
    setEditingDirective(null);
  };

  const openEditModal = (dir: DirectiveItem) => {
    setFormTitle(dir.title);
    setFormCategory(dir.category);
    setFormAppTypes(dir.appTypes || ['Todas las Apps']);
    setFormSummary(dir.summary);
    setFormFullMarkdown(dir.fullMarkdownContent || dir.summary);
    setFormRules(dir.rules && dir.rules.length > 0 ? dir.rules : ['']);
    setFormPromptTemplate(dir.promptTemplate || '');
    setFormDriveUrl(dir.driveUrl || '');
    setEditingDirective(dir);
    setIsCreatingNew(false);
  };

  const handleSaveForm = () => {
    if (!formTitle.trim()) return;

    const cleanedRules = formRules.filter(r => r.trim().length > 0);

    if (isCreatingNew) {
      const newDir: DirectiveItem = {
        id: `dir_${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        appTypes: formAppTypes.length > 0 ? formAppTypes : ['Todas las Apps'],
        icon: getCategoryIconName(formCategory),
        summary: formSummary.trim(),
        fullMarkdownContent: formFullMarkdown.trim(),
        rules: cleanedRules.length > 0 ? cleanedRules : ['Seguir las especificaciones técnicas.'],
        promptTemplate: formPromptTemplate.trim() || 'Aplica la Directriz técnica.',
        driveUrl: formDriveUrl.trim() || 'https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW',
        isOfficialMaster: false,
        updatedAt: new Date().toISOString()
      };
      if (onAddDirective) onAddDirective(newDir);
      triggerCelebration();
    } else if (editingDirective) {
      const updatedDir: DirectiveItem = {
        ...editingDirective,
        title: formTitle.trim(),
        category: formCategory,
        appTypes: formAppTypes.length > 0 ? formAppTypes : ['Todas las Apps'],
        icon: getCategoryIconName(formCategory),
        summary: formSummary.trim(),
        fullMarkdownContent: formFullMarkdown.trim(),
        rules: cleanedRules,
        promptTemplate: formPromptTemplate.trim(),
        driveUrl: formDriveUrl.trim(),
        updatedAt: new Date().toISOString()
      };
      if (onUpdateDirective) onUpdateDirective(updatedDir);
    }

    setIsCreatingNew(false);
    setEditingDirective(null);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la directriz "${title}"?`)) {
      if (onDeleteDirective) onDeleteDirective(id);
    }
  };

  const toggleAppTypeTag = (type: string) => {
    if (formAppTypes.includes(type)) {
      setFormAppTypes(formAppTypes.filter(t => t !== type));
    } else {
      setFormAppTypes([...formAppTypes, type]);
    }
  };

  const getCategoryIconName = (cat: string) => {
    switch (cat) {
      case 'Web': return 'LayoutTemplate';
      case 'Trading': return 'TrendingUp';
      case 'Mobile': return 'Smartphone';
      case 'SaaS': return 'CreditCard';
      case 'Backend': return 'Terminal';
      default: return 'ShieldCheck';
    }
  };

  const renderIcon = (category: string) => {
    switch (category) {
      case 'Web': return <LayoutTemplate size={20} color="#38BDF8" />;
      case 'Trading': return <TrendingUp size={20} color="#10B981" />;
      case 'Mobile': return <Smartphone size={20} color="#EC4899" />;
      case 'SaaS': return <CreditCard size={20} color="#F59E0B" />;
      case 'Backend': return <Terminal size={20} color="#A78BFA" />;
      case 'General Drive': return <HardDrive size={20} color="#818CF8" />;
      default: return <ShieldCheck size={20} color="#6366F1" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.12) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <BookOpen size={24} color="#818CF8" />
            <h2 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
              Biblioteca de Directrices & Metodología de Toni
            </h2>
            <span className="badge badge-indigo" style={{ fontSize: '11px', padding: '2px 8px' }}>
              Drive Sync 100%
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '720px', margin: 0, lineHeight: 1.5 }}>
            Directrices completas sin resumir, sincronizadas directamente con Google Drive. Puedes copiarlas, editarlas, etiquetarlas para tipos específicos de aplicación (Web, Mobile, Trading, SaaS, Backend) o añadir nuevas normativas para tus proyectos.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={openCreateModal} className="btn btn-primary" style={{ padding: '8px 16px' }}>
            <Plus size={16} />
            <span>Nueva Directriz</span>
          </button>

          <a
            href="https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: 'none', padding: '8px 16px' }}
          >
            <span>Carpeta Drive</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--bg-secondary)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
            Filtrar por App:
          </span>
          {['Todas', '5 Directrices Drive', 'Web & Frontend', 'Trading & Algoritmos', 'Mobile & PWA (Local-First)', 'SaaS Multi-tenant', 'Internal CLI & Backend'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedAppType(cat)}
              className={`btn ${selectedAppType === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
            >
              {cat === '5 Directrices Drive' ? '🗄️ 5 Maestras Drive' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
          <input
            type="text"
            placeholder="Buscar directriz o regla..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '32px', height: '32px', fontSize: '12px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '8px', top: '7px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Directives Count Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>Mostrando <strong>{filtered.length}</strong> directrices técnicas aplicables</span>
        <span>Haz clic en <strong>Ver Documento Drive</strong> para leer el texto completo sin recortar</span>
      </div>

      {/* Directives Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '18px'
      }}>
        {filtered.map(dir => {
          const isCopied = copiedId === dir.id;

          return (
            <div
              key={dir.id}
              style={{
                background: 'var(--bg-secondary)',
                border: dir.isOfficialMaster ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'all var(--transition-fast)',
                boxShadow: dir.isOfficialMaster ? '0 4px 15px -3px rgba(99, 102, 241, 0.15)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-highlight)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = dir.isOfficialMaster ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-medium)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                {/* Header Top: Icon, Tags, Master Badge & Action Menu */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {renderIcon(dir.category)}
                    </div>
                    <div>
                      {dir.isOfficialMaster && (
                        <span className="badge badge-indigo" style={{ fontSize: '9px', padding: '1px 6px', marginBottom: '2px', display: 'inline-block' }}>
                          ⭐ Directriz Maestra Drive
                        </span>
                      )}
                      <span className="badge badge-cyan" style={{ fontSize: '9px', padding: '1px 6px', display: 'inline-block' }}>
                        {dir.category}
                      </span>
                    </div>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => openEditModal(dir)}
                      className="btn-icon"
                      title="Editar directriz y etiquetas"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(dir.id, dir.title)}
                      className="btn-icon"
                      title="Eliminar directriz"
                      style={{ width: '28px', height: '28px', color: '#FB7185' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  lineHeight: 1.35
                }}>
                  {dir.title}
                </h3>

                {/* Applicable App Types Badges */}
                {dir.appTypes && dir.appTypes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {dir.appTypes.map((type, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          color: '#A5B4FC',
                          background: 'rgba(99, 102, 241, 0.12)',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}
                      >
                        🏷️ {type}
                      </span>
                    ))}
                  </div>
                )}

                {/* Full Markdown Content (replaces short summary per user request) */}
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                  marginBottom: '14px',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {dir.fullMarkdownContent || dir.summary}
                </div>

                {/* Mandatory Rules snippet */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Reglas Mandatorias ({dir.rules?.length || 0}):
                    </span>
                    <span style={{ fontSize: '10px', color: '#10B981' }}>100% Requerido</span>
                  </div>
                  {dir.rules.slice(0, 3).map((rule, idx) => (
                    <div key={idx} style={{ fontSize: '11px', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.35 }}>
                      <span style={{ color: '#10B981', flexShrink: 0, fontWeight: 700 }}>✓</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                  {dir.rules.length > 3 && (
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', paddingTop: '2px' }}>
                      + {dir.rules.length - 3} reglas más en el documento completo...
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Bottom */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => {
                    setViewingDirective(dir);
                    setViewerActiveTab('markdown');
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '12px', padding: '7px 10px' }}
                >
                  <Eye size={14} color="#38BDF8" />
                  <span>Ver Documento Drive</span>
                </button>

                <button
                  onClick={() => handleCopyPrompt(dir)}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '7px 10px' }}
                  title="Copiar reglas y prompt para IA"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} color="#10B981" />
                      <span style={{ color: '#10B981' }}>{copyFeedbackText || '¡Copiado!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW FULL UNABRIDGED DIRECTIVE (DRIVE VERBATIM SPEC)             */}
      {/* ========================================================================= */}
      {viewingDirective && (
        <>
          <div className="drawer-backdrop" onClick={() => setViewingDirective(null)} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '850px',
            maxHeight: '90vh',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-tertiary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={20} color="#818CF8" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {viewingDirective.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleCopyFullMarkdown(viewingDirective)}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  {copiedId === viewingDirective.id ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copiedId === viewingDirective.id ? '¡Markdown Copiado!' : 'Copiar Markdown'}</span>
                </button>

                <button
                  onClick={() => setViewingDirective(null)}
                  className="btn-icon"
                  style={{ width: '28px', height: '28px' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Subheader Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              padding: '10px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)'
            }}>
              <button
                onClick={() => setViewerActiveTab('markdown')}
                className={`btn ${viewerActiveTab === 'markdown' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px', padding: '5px 12px' }}
              >
                <FileText size={14} />
                <span>Especificación Completa (Drive)</span>
              </button>

              <button
                onClick={() => setViewerActiveTab('rules')}
                className={`btn ${viewerActiveTab === 'rules' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px', padding: '5px 12px' }}
              >
                <CheckCircle2 size={14} />
                <span>Lista de Reglas ({viewingDirective.rules.length})</span>
              </button>

              <button
                onClick={() => setViewerActiveTab('prompt')}
                className={`btn ${viewerActiveTab === 'prompt' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px', padding: '5px 12px' }}
              >
                <Bot size={14} />
                <span>Prompt para Antigravity</span>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: 'calc(90vh - 160px)' }}>
              {viewerActiveTab === 'markdown' && (
                <div style={{
                  background: '#070A10',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#E2E8F0',
                  whiteSpace: 'pre-wrap'
                }}>
                  {viewingDirective.fullMarkdownContent || viewingDirective.summary}
                </div>
              )}

              {viewerActiveTab === 'rules' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Normas obligatorias a cumplir en la arquitectura y código:
                  </div>
                  {viewingDirective.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        background: 'var(--bg-card)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '13px',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '11px',
                        flexShrink: 0
                      }}>
                        #{idx + 1}
                      </span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              )}

              {viewerActiveTab === 'prompt' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Plantilla de Prompt Maestro para Agentes IA:
                  </div>
                  <pre style={{
                    background: '#070A10',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: '#E2E8F0',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.5
                  }}>
                    {viewingDirective.promptTemplate}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-tertiary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-indigo">{viewingDirective.category}</span>
                {viewingDirective.appTypes?.map((t, idx) => (
                  <span key={idx} className="badge badge-cyan" style={{ fontSize: '10px' }}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    openEditModal(viewingDirective);
                    setViewingDirective(null);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  <Edit3 size={14} />
                  <span>Editar Directriz</span>
                </button>
                <button
                  onClick={() => setViewingDirective(null)}
                  className="btn btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  Entendido / Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT DIRECTIVE WITH APP TAGGING & FULL MARKDOWN          */}
      {/* ========================================================================= */}
      {(isCreatingNew || editingDirective) && (
        <>
          <div className="drawer-backdrop" onClick={() => { setIsCreatingNew(false); setEditingDirective(null); }} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '780px',
            maxHeight: '92vh',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-tertiary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={18} color="#818CF8" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {isCreatingNew ? 'Crear Nueva Directriz de Desarrollo' : 'Editar Directriz & Etiquetas de App'}
                </h3>
              </div>

              <button
                onClick={() => { setIsCreatingNew(false); setEditingDirective(null); }}
                className="btn-icon"
                style={{ width: '28px', height: '28px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Título de la Directriz:
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="ej. 📱 Directriz Mobile & PWA (Local-First)"
                  className="form-input"
                  style={{ fontSize: '13px' }}
                />
              </div>

              {/* Category & Drive Link Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Categoría Principal:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '12px' }}
                  >
                    <option value="General Drive">General Drive (Maestra)</option>
                    <option value="Web">Web & Frontend</option>
                    <option value="Trading">Trading & Algoritmos</option>
                    <option value="Mobile">Mobile & PWA</option>
                    <option value="SaaS">SaaS & Monetización</option>
                    <option value="Backend">Backend & CLI</option>
                    <option value="Seguridad">Seguridad & Auth</option>
                    <option value="Base de Datos">Base de Datos / Supabase</option>
                    <option value="Personalizada">Personalizada</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Enlace Carpeta / Archivo Google Drive:
                  </label>
                  <input
                    type="text"
                    value={formDriveUrl}
                    onChange={(e) => setFormDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="form-input"
                    style={{ fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* Tagging for App Types (Multi-selection) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  🏷️ Etiquetar Tipos de Aplicación Aplicables (Cada tipo de app tendrá sus directrices):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  {ALL_APP_TYPES.map(type => {
                    const isChecked = formAppTypes.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => toggleAppTypeTag(type)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          fontWeight: isChecked ? 700 : 500,
                          cursor: 'pointer',
                          background: isChecked ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-tertiary)',
                          color: isChecked ? '#A5B4FC' : 'var(--text-secondary)',
                          border: isChecked ? '1px solid #6366F1' : '1px solid var(--border-subtle)'
                        }}
                      >
                        <span>{isChecked ? '✓' : '+'}</span>
                        <span>{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Resumen Ejecutivo (1-2 frases):
                </label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Resumen claro de la directriz..."
                  className="form-input"
                  style={{ fontSize: '12px', lineHeight: 1.4 }}
                />
              </div>

              {/* Full Markdown Content */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    📖 Especificación Markdown Completa (Idéntica a Drive):
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Soporta código SQL, tablas y mermaid</span>
                </div>
                <textarea
                  rows={8}
                  value={formFullMarkdown}
                  onChange={(e) => setFormFullMarkdown(e.target.value)}
                  placeholder="# Título de la Directriz..."
                  className="form-input"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}
                />
              </div>

              {/* Rules List Editor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ✅ Reglas Mandatorias (Paso a Paso):
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormRules([...formRules, ''])}
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                  >
                    <Plus size={12} />
                    <span>Añadir Regla</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formRules.map((rule, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>#{idx + 1}</span>
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => {
                          const updated = [...formRules];
                          updated[idx] = e.target.value;
                          setFormRules(updated);
                        }}
                        placeholder={`Regla número ${idx + 1}...`}
                        className="form-input"
                        style={{ height: '30px', fontSize: '12px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormRules(formRules.filter((_, i) => i !== idx))}
                        className="btn-icon"
                        style={{ width: '26px', height: '26px', color: '#FB7185' }}
                        title="Eliminar regla"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prompt Template */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  ⚡ Plantilla de Prompt para Antigravity:
                </label>
                <textarea
                  rows={2}
                  value={formPromptTemplate}
                  onChange={(e) => setFormPromptTemplate(e.target.value)}
                  placeholder="Aplica la directriz..."
                  className="form-input"
                  style={{ fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              background: 'var(--bg-tertiary)'
            }}>
              <button
                type="button"
                onClick={() => { setIsCreatingNew(false); setEditingDirective(null); }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveForm}
                className="btn btn-primary"
              >
                {isCreatingNew ? 'Guardar Directriz' : 'Actualizar Directriz'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
