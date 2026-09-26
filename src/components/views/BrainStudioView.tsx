import React, { useState } from 'react';
import { 
  FileText, Link as LinkIcon, Video, FileUp, 
  Trash2, Plus, RefreshCw, BarChart2, MessageSquare, 
  Download, Sparkles, BrainCircuit, Globe, Target,
  Database, Search, Lightbulb, Save, CheckCircle2, Cloud, Zap,
  X, Mic, Presentation, FileCode2, BookOpen, ExternalLink, Eye,
  AlertTriangle, Palette, Map, ShieldCheck, Compass
} from 'lucide-react';
import { Project } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';
import { generateReportFromSources, chatWithBrain, searchSourcesWithAI } from '../../services/aiService';
import { storageService } from '../../services/storageService';

interface BrainStudioViewProps {
  projects: Project[];
  activeProject: Project;
  onUpdateProject?: (updatedProject: Project) => void;
}

interface SourceItem {
  id: string;
  type: 'pdf' | 'url' | 'youtube' | 'text' | 'drive';
  name: string;
  url?: string;
  status: 'indexed' | 'indexing' | 'error';
}

interface WebSearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const BrainStudioView: React.FC<BrainStudioViewProps> = ({ projects, activeProject }) => {
  const [isAddingSources, setIsAddingSources] = useState(false);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [activeBrainSources, setActiveBrainSources] = useState<Set<string>>(new Set());
  
  // --- Gestor de Fuentes State ---
  const [searchTab, setSearchTab] = useState<'queries' | 'sources'>('queries');
  const [webSearchQuery, setWebSearchQuery] = useState('');
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webSearchResults, setWebSearchResults] = useState<WebSearchResult[]>([]);
  const [selectedWebResults, setSelectedWebResults] = useState<Set<string>>(new Set());

  // --- Estudio y Consultas State ---
  const [activeStudyType, setActiveStudyType] = useState<'benchmark' | 'quejas' | 'necesidades' | null>(null);
  const [studySourcesFound, setStudySourcesFound] = useState<WebSearchResult[]>([]);
  const [selectedStudySources, setSelectedStudySources] = useState<Set<string>>(new Set());
  const [isSearchingStudy, setIsSearchingStudy] = useState(false);
  
  // --- Studio Results State ---
  const [studioResults, setStudioResults] = useState<{id: string, type: string, date: string, content: string}[]>([]);
  const [isGeneratingStudio, setIsGeneratingStudio] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{id: string, type: string, content: string} | null>(null);

  // --- Chat State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ---- Funciones Gestor de Fuentes ----
  const handleSimulateWebSearch = async () => {
    if (!webSearchQuery.trim()) return;
    setIsSearchingWeb(true);
    setWebSearchResults([]);

    try {
      const results = await searchSourcesWithAI(webSearchQuery);
      setWebSearchResults(results);
    } catch (error) {
      console.error(error);
      showToast('Hubo un error en la búsqueda web.', 'error');
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const handleToggleWebResult = (id: string) => {
    setSelectedWebResults(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSelectedWebSources = () => {
    const newSources: SourceItem[] = Array.from(selectedWebResults).map(id => {
      const res = webSearchResults.find(r => r.id === id)!;
      return {
        id: `source_${Date.now()}_${Math.random()}`,
        type: res.title.includes('YouTube') ? 'youtube' : 'url',
        name: res.title,
        url: res.url,
        status: 'indexed'
      };
    });
    setSources(prev => [...prev, ...newSources]);
    const newSourceIds = newSources.map(s => s.id);
    setActiveBrainSources(prev => new Set([...prev, ...newSourceIds]));
    
    setWebSearchResults([]);
    setSelectedWebResults(new Set());
    setWebSearchQuery('');
    triggerCelebration();
    setIsAddingSources(false);
  };

  const handleAddLocalOrDrive = (type: 'pdf' | 'drive') => {
    const newSource: SourceItem = {
      id: `source_${Date.now()}`,
      type,
      name: type === 'pdf' ? 'Documento_Local.pdf' : 'Documento_Google_Drive.gdoc',
      status: 'indexed'
    };
    setSources(prev => [...prev, newSource]);
    setActiveBrainSources(prev => new Set([...prev, newSource.id]));
    triggerCelebration();
    setIsAddingSources(false);
  };

  // ---- Funciones Estudio y Consultas ----
  const handleStartStudy = async (type: 'benchmark' | 'quejas' | 'necesidades') => {
    setActiveStudyType(type);
    setIsSearchingStudy(true);
    setStudySourcesFound([]);
    setSelectedStudySources(new Set());

    try {
      const query = type === 'benchmark' ? 'mejores practicas y patrones modernos de diseño UI/UX web y apps' :
                    type === 'quejas' ? 'peores practicas de diseño UI/UX, quejas comunes en apps de productividad reddit' :
                    'que necesitan los usuarios en software web moderno, estudios de necesidades reales';
      
      const results = await searchSourcesWithAI(query);
      setStudySourcesFound(results);
    } catch (error) {
      console.error(error);
      showToast('Hubo un error al buscar las fuentes. Mostrando catálogo recomendado.', 'error');
    } finally {
      setIsSearchingStudy(false);
    }
  };

  const handleToggleStudySource = (id: string) => {
    setSelectedStudySources(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAllStudySources = () => {
    if (selectedStudySources.size === studySourcesFound.length && studySourcesFound.length > 0) {
      setSelectedStudySources(new Set());
    } else {
      setSelectedStudySources(new Set(studySourcesFound.map(s => s.id)));
    }
  };

  const handleToggleSelectAllWebResults = () => {
    if (selectedWebResults.size === webSearchResults.length && webSearchResults.length > 0) {
      setSelectedWebResults(new Set());
    } else {
      setSelectedWebResults(new Set(webSearchResults.map(s => s.id)));
    }
  };

  const handleSendToBrain = () => {
    const newSources: SourceItem[] = Array.from(selectedStudySources).map(id => {
      const res = studySourcesFound.find(r => r.id === id)!;
      return {
        id: `study_source_${Date.now()}_${Math.random()}`,
        type: 'url',
        name: res.title,
        url: res.url,
        status: 'indexed'
      };
    });
    
    setSources(prev => [...prev, ...newSources]);
    const newSourceIds = newSources.map(s => s.id);
    setActiveBrainSources(prev => new Set([...prev, ...newSourceIds]));
    
    setSelectedStudySources(new Set());
    triggerCelebration();
    setIsAddingSources(false);
  };

  // ---- Funciones Cerebro (Chat) ----
  const handleToggleBrainSource = (id: string) => {
    setActiveBrainSources(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  
  const handleToggleAllSources = () => {
    if (activeBrainSources.size === sources.length) {
      setActiveBrainSources(new Set());
    } else {
      setActiveBrainSources(new Set(sources.map(s => s.id)));
    }
  };

  const getSourcesContextString = () => {
    return Array.from(activeBrainSources)
      .map(id => {
        const s = sources.find(x => x.id === id);
        return s ? `- Título: ${s.name} | URL: ${s.url || 'Local'}` : '';
      })
      .filter(Boolean)
      .join('\n');
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isProcessingChat) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput.trim() };
    const currentHistory = [...chatMessages];
    
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsProcessingChat(true);

    try {
      const context = getSourcesContextString();
      const responseText = await chatWithBrain(userMsg.content, currentHistory, context);
      
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
      }]);
    } catch (error: any) {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**Error:** ${error.message}`
      }]);
    } finally {
      setIsProcessingChat(false);
    }
  };

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingStudio(reportType);
    
    try {
      const sourcesCtx = getSourcesContextString();
      const allDirectives = storageService.getDirectives();
      const directivesCtx = allDirectives.map((d, idx) => `### Directriz #${idx + 1}: ${d.title}\n${d.fullMarkdownContent || d.summary}`).join('\n\n');
      
      const content = await generateReportFromSources(reportType, sourcesCtx, directivesCtx);
      
      setStudioResults(prev => [{
        id: Date.now().toString(),
        type: reportType,
        content: content,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev]);
      
      triggerCelebration();
      showToast(`✨ ${reportType} generado con éxito`, 'success');
    } catch (error: any) {
      showToast(`No se pudo generar el reporte: ${error.message}`, 'error');
    } finally {
      setIsGeneratingStudio(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '16px', height: '100%', overflow: 'hidden', paddingBottom: '16px' }}>
      
      {/* ---------------- LEFT PANEL: FUENTES ---------------- */}
      <div style={{ 
        width: '320px', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'var(--bg-glass-heavy)', 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--border-medium)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-medium)', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Fuentes</h3>
          <button 
            onClick={() => setIsAddingSources(!isAddingSources)}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '10px', justifyContent: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)' }}
          >
            {isAddingSources ? <X size={16} /> : <Plus size={16} />}
            <span>{isAddingSources ? 'Cerrar Buscador' : 'Añadir fuentes'}</span>
          </button>
        </div>

        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
           <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Seleccionar todo</span>
           <input 
             type="checkbox" 
             checked={sources.length > 0 && activeBrainSources.size === sources.length}
             onChange={handleToggleAllSources}
             style={{ accentColor: 'var(--text-primary)', transform: 'scale(1.1)' }}
           />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {sources.map(s => (
            <label key={s.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', 
              padding: '12px', borderRadius: 'var(--radius-md)', 
              background: activeBrainSources.has(s.id) ? 'var(--bg-card-hover)' : 'transparent',
              transition: 'background 0.2s'
            }}>
              <div style={{ 
                width: '24px', height: '24px', borderRadius: '50%', 
                background: s.type === 'youtube' ? '#EF4444' : s.type === 'drive' ? '#10B981' : '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {s.type === 'youtube' ? <Video size={12} color="#FFF" /> : 
                 s.type === 'drive' ? <Cloud size={12} color="#FFF" /> : 
                 <Globe size={12} color="#FFF" />}
              </div>
              
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {s.name}
                </div>
              </div>

              <input 
                type="checkbox" 
                checked={activeBrainSources.has(s.id)}
                onChange={() => handleToggleBrainSource(s.id)}
                style={{ accentColor: 'var(--text-primary)', transform: 'scale(1.1)' }}
              />
            </label>
          ))}
          {sources.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No hay fuentes añadidas.<br/>Haz clic en "Añadir fuentes".
            </div>
          )}
        </div>
      </div>

      {/* ---------------- CENTER PANEL: CHAT / ADD SOURCES / VIEW DOC ---------------- */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'var(--bg-card)', 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {viewingDocument ? (
          /* ----- DOCUMENT VIEWER UI ----- */
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-card)', zIndex: 20, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={24} color="var(--accent-primary)" />
                <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>{viewingDocument.type}</h3>
              </div>
              <button 
                onClick={() => setViewingDocument(null)} 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px' }}
              >
                <X size={16} /> Cerrar
              </button>
            </div>
            <div style={{ padding: '40px', overflowY: 'auto', flex: 1, fontSize: '15px', lineHeight: 1.8, color: 'var(--text-primary)', background: 'var(--bg-glass)' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto', whiteSpace: 'pre-wrap' }}>
                {viewingDocument.content}
              </div>
            </div>
          </div>
        ) : isAddingSources ? (
          /* ----- SEARCH / ADD SOURCES UI ----- */
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-card)', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-medium)' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <button onClick={() => setSearchTab('queries')} className="btn" style={{ background: searchTab === 'queries' ? 'var(--bg-card-hover)' : 'transparent', color: searchTab === 'queries' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>1. Estudio de Mercado (Masivo)</button>
                <button onClick={() => setSearchTab('sources')} className="btn" style={{ background: searchTab === 'sources' ? 'var(--bg-card-hover)' : 'transparent', color: searchTab === 'sources' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>2. Búsqueda Manual / Local</button>
              </div>

              {searchTab === 'queries' && (
                <div>
                  <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: 'var(--text-secondary)' }}>Selecciona el enfoque de tu estudio:</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleStartStudy('benchmark')} className="btn btn-secondary" style={{ flex: 1, padding: '12px', border: activeStudyType === 'benchmark' ? '1px solid #8B5CF6' : '1px solid var(--border-subtle)' }}><Target size={16} color="#8B5CF6" /> Benchmark UI/UX</button>
                    <button onClick={() => handleStartStudy('quejas')} className="btn btn-secondary" style={{ flex: 1, padding: '12px', border: activeStudyType === 'quejas' ? '1px solid #EF4444' : '1px solid var(--border-subtle)' }}><MessageSquare size={16} color="#EF4444" /> Quejas y Fallos</button>
                    <button onClick={() => handleStartStudy('necesidades')} className="btn btn-secondary" style={{ flex: 1, padding: '12px', border: activeStudyType === 'necesidades' ? '1px solid #F59E0B' : '1px solid var(--border-subtle)' }}><Lightbulb size={16} color="#F59E0B" /> Necesidades Reales</button>
                  </div>
                </div>
              )}

              {searchTab === 'sources' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px' }}>
                    <Search size={20} color="var(--text-muted)" style={{ margin: 'auto 12px' }} />
                    <input type="text" value={webSearchQuery} onChange={e => setWebSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSimulateWebSearch()} placeholder="Busca artículos, documentación..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
                    <button onClick={handleSimulateWebSearch} className="btn btn-primary" style={{ padding: '0 24px', borderRadius: 'var(--radius-sm)' }}>Buscar</button>
                  </div>
                  <button onClick={() => handleAddLocalOrDrive('drive')} className="btn btn-secondary"><Cloud size={16} /> Drive</button>
                  <button onClick={() => handleAddLocalOrDrive('pdf')} className="btn btn-secondary"><FileUp size={16} /> PC</button>
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* Results for queries */}
              {searchTab === 'queries' && activeStudyType && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Fuentes Encontradas</h4>
                      {studySourcesFound.length > 0 && !isSearchingStudy && (
                        <button 
                          type="button"
                          onClick={handleToggleSelectAllStudySources}
                          className="btn btn-secondary"
                          style={{ 
                            fontSize: '12px', 
                            padding: '4px 12px', 
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-medium)',
                            background: selectedStudySources.size === studySourcesFound.length ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                            color: selectedStudySources.size === studySourcesFound.length ? '#38BDF8' : 'var(--text-secondary)'
                          }}
                        >
                          {selectedStudySources.size === studySourcesFound.length && studySourcesFound.length > 0 
                            ? 'Deseleccionar todo' 
                            : 'Seleccionar todo'}
                        </button>
                      )}
                    </div>
                    {selectedStudySources.size > 0 && <button onClick={handleSendToBrain} className="btn btn-primary">Añadir {selectedStudySources.size} fuentes</button>}
                  </div>
                  {isSearchingStudy ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {studySourcesFound.map(res => {
                        const domain = res.url.split('/')[2] || 'example.com';
                        return (
                          <div 
                            key={res.id} 
                            onClick={() => handleToggleStudySource(res.id)} 
                            style={{ 
                              display: 'flex', 
                              gap: '16px', 
                              padding: '16px', 
                              background: selectedStudySources.has(res.id) ? 'var(--bg-card-hover)' : 'var(--bg-secondary)', 
                              border: selectedStudySources.has(res.id) ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)', 
                              borderRadius: 'var(--radius-md)', 
                              cursor: 'pointer',
                              alignItems: 'flex-start'
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={selectedStudySources.has(res.id)} 
                              readOnly 
                              style={{ accentColor: 'var(--accent-cyan)', transform: 'scale(1.2)', marginTop: '4px' }} 
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="favicon" style={{ width: '16px', height: '16px', borderRadius: '2px' }} />
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{res.title}</div>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '8px' }}>{res.snippet}</div>
                              <a 
                                href={res.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                onClick={e => e.stopPropagation()} 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#38BDF8', textDecoration: 'none' }}
                              >
                                <ExternalLink size={12} /> Visitar fuente original
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Results for manual sources */}
              {searchTab === 'sources' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {isSearchingWeb ? (
                     <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>
                  ) : webSearchResults.length > 0 ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Resultados de Búsqueda</h4>
                          <button 
                            type="button"
                            onClick={handleToggleSelectAllWebResults}
                            className="btn btn-secondary"
                            style={{ 
                              fontSize: '12px', 
                              padding: '4px 12px', 
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-medium)',
                              background: selectedWebResults.size === webSearchResults.length ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                              color: selectedWebResults.size === webSearchResults.length ? '#10B981' : 'var(--text-secondary)'
                            }}
                          >
                            {selectedWebResults.size === webSearchResults.length && webSearchResults.length > 0 
                              ? 'Deseleccionar todo' 
                              : 'Seleccionar todo'}
                          </button>
                        </div>
                        {selectedWebResults.size > 0 && <button onClick={handleAddSelectedWebSources} className="btn btn-primary">Añadir {selectedWebResults.size} fuentes</button>}
                      </div>
                      {webSearchResults.map(res => {
                        const domain = res.url.split('/')[2] || 'example.com';
                        return (
                          <div 
                            key={res.id} 
                            onClick={() => handleToggleWebResult(res.id)} 
                            style={{ 
                              display: 'flex', 
                              gap: '16px', 
                              padding: '16px', 
                              background: selectedWebResults.has(res.id) ? 'var(--bg-card-hover)' : 'var(--bg-secondary)', 
                              border: selectedWebResults.has(res.id) ? '1px solid #10B981' : '1px solid var(--border-subtle)', 
                              borderRadius: 'var(--radius-md)', 
                              cursor: 'pointer',
                              alignItems: 'flex-start'
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={selectedWebResults.has(res.id)} 
                              readOnly 
                              style={{ accentColor: '#10B981', transform: 'scale(1.2)', marginTop: '4px' }} 
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="favicon" style={{ width: '16px', height: '16px', borderRadius: '2px' }} />
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#3B82F6' }}>{res.title}</div>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '8px' }}>{res.snippet}</div>
                              <a 
                                href={res.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                onClick={e => e.stopPropagation()} 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10B981', textDecoration: 'none' }}
                              >
                                <ExternalLink size={12} /> Visitar fuente original
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Busca arriba para ver resultados.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ----- CHAT UI ----- */
          <>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-medium)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Chat Inteligente</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Consultando sobre las {activeBrainSources.size} fuentes seleccionadas.
              </div>
            </div>

            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {chatMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <BrainCircuit size={64} style={{ opacity: 0.1, margin: '0 auto 16px auto', color: 'var(--text-primary)' }} />
                  <p style={{ maxWidth: '340px', margin: '0 auto', fontSize: '14px' }}>
                    Selecciona fuentes a la izquierda y pregúntame lo que necesites, o usa el Studio de la derecha para generar documentos.
                  </p>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ 
                      maxWidth: '85%', padding: '16px', borderRadius: 'var(--radius-xl)', 
                      background: msg.role === 'user' ? 'var(--bg-glass-heavy)' : 'transparent', 
                      color: 'var(--text-primary)', 
                      border: msg.role === 'user' ? '1px solid var(--border-medium)' : 'none',
                      fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isProcessingChat && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', padding: '16px' }}>
                  <RefreshCw size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Procesando...</span>
                </div>
              )}
            </div>

            <div style={{ padding: '20px', background: 'transparent' }}>
              <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-glass-heavy)', padding: '8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)' }}>
                <input 
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Haz una pregunta o crea algo..."
                  className="form-input"
                  style={{ flex: 1, background: 'transparent', border: 'none', padding: '0 16px', outline: 'none' }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendChatMessage(); }}
                />
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500, borderLeft: '1px solid var(--border-medium)' }}>
                  {activeBrainSources.size} fuentes
                </div>
                <button 
                  onClick={handleSendChatMessage} 
                  disabled={!chatInput.trim() || isProcessingChat}
                  className="btn btn-primary" 
                  style={{ borderRadius: 'var(--radius-full)', padding: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ↑
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---------------- RIGHT PANEL: STUDIO ---------------- */}
      <div style={{ 
        width: '320px', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'var(--bg-glass-heavy)', 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--border-medium)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-medium)', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Studio</h3>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto' }}>
          
          {/* Highlighted Master Report Hero Box */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.16) 0%, rgba(99, 102, 241, 0.1) 100%)', 
            border: '1px solid rgba(139, 92, 246, 0.3)', 
            padding: '16px', 
            borderRadius: 'var(--radius-lg)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCode2 size={22} color="#A78BFA" />
              <div>
                <div style={{ fontSize: '13px', color: '#C4B5FD', fontWeight: 700 }}>Informe Maestro</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Documento base para crear la App</div>
              </div>
            </div>
            <button 
              onClick={() => handleGenerateReport('Informe Maestro')} 
              disabled={!!isGeneratingStudio}
              className="btn btn-primary" 
              style={{ 
                padding: '6px 14px', 
                fontSize: '11px', 
                fontWeight: 600, 
                height: 'auto',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)'
              }}
            >
              {isGeneratingStudio === 'Informe Maestro' ? 'Generando...' : 'Generar'}
            </button>
          </div>

          {/* 4 Predefined Specialized Reports Requested by Toni */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            
            {/* 1. Interfaz UI y Paleta */}
            <button 
              onClick={() => handleGenerateReport('Informe de Interfaz (UI) y Paleta de Colores')} 
              disabled={!!isGeneratingStudio}
              className="btn btn-secondary" 
              style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', background: 'var(--bg-card)' }}
            >
              <Palette size={20} color="#A855F7" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  1. Interfaz (UI) y Paleta
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Diseño visual e identidad cromática
                </div>
              </div>
            </button>

            {/* 2. Estructura y Sitemap */}
            <button 
              onClick={() => handleGenerateReport('Informe de Estructura y Mapa del Sitio (Sitemap)')} 
              disabled={!!isGeneratingStudio}
              className="btn btn-secondary" 
              style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', background: 'var(--bg-card)' }}
            >
              <Map size={20} color="#38BDF8" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  2. Estructura y Sitemap
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Arquitectura y flujos de usuario
                </div>
              </div>
            </button>
            
            {/* 3. Usabilidad UX y Accesibilidad */}
            <button 
              onClick={() => handleGenerateReport('Informe de Usabilidad (UX) y Accesibilidad')} 
              disabled={!!isGeneratingStudio}
              className="btn btn-secondary" 
              style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', background: 'var(--bg-card)' }}
            >
              <ShieldCheck size={20} color="#10B981" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  3. Usabilidad (UX) y Accesibilidad
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Interacción, WCAG 2.1 y ergonomía
                </div>
              </div>
            </button>

            {/* 4. Tono, Voz y Orientación */}
            <button 
              onClick={() => handleGenerateReport('Informe de Tono, Voz y Orientación del Producto')} 
              disabled={!!isGeneratingStudio}
              className="btn btn-secondary" 
              style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', background: 'var(--bg-card)' }}
            >
              <MessageSquare size={20} color="#F59E0B" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  4. Tono, Voz y Orientación
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Copywriting y personalidad de marca
                </div>
              </div>
            </button>

          </div>

          <div style={{ marginTop: '32px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              Resultados de Studio
            </h4>
            
            {isGeneratingStudio && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <RefreshCw size={16} style={{ animation: 'spin 1.5s linear infinite', color: '#8B5CF6' }} />
                <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 500 }}>Generando {isGeneratingStudio}...</span>
              </div>
            )}

            {studioResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {studioResults.map(res => (
                  <div key={res.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={16} color="#38BDF8" />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{res.type}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hoy a las {res.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={() => setViewingDocument(res)}
                        className="btn-icon" 
                        title="Ver Documento"
                        style={{ padding: '6px' }}
                      >
                        <Eye size={16} color="var(--text-primary)" />
                      </button>
                      <button className="btn-icon" title="Descargar" style={{ padding: '6px' }}>
                        <Download size={16} color="var(--text-muted)" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isGeneratingStudio && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.5, padding: '20px 0' }}>
                  <Sparkles size={20} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                  Los resultados generados aparecerán aquí.<br/><br/>
                  Añade fuentes y haz clic arriba para empezar.
                </div>
              )
            )}
          </div>

        </div>
      </div>

      {/* Floating Toast Notification in DOM */}
      {toast && (
        <div 
          role="alert"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 500,
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✨'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
