import React, { useState, useEffect } from 'react';
import { 
  FileText, Video, FileUp, 
  Trash2, Plus, RefreshCw, MessageSquare, 
  Download, Sparkles, BrainCircuit, Globe, Target,
  Search, Lightbulb, Cloud, 
  X, FileCode2, ExternalLink, Eye,
  Palette, Map, ShieldCheck, Copy, Check, Send
} from 'lucide-react';
import { Project } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';
import { generateReportFromSources, chatWithBrain, searchSourcesWithAI, chatAboutReport } from '../../services/aiService';
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

interface GeneratedReport {
  id: string;
  type: string;
  date: string;
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
  const [studioResults, setStudioResults] = useState<GeneratedReport[]>([]);
  const [isGeneratingStudio, setIsGeneratingStudio] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<GeneratedReport | null>(null);

  // --- Document Chat State (Interactive discussion per report) ---
  const [docChatMessages, setDocChatMessages] = useState<ChatMessage[]>([]);
  const [docChatInput, setDocChatInput] = useState('');
  const [isProcessingDocChat, setIsProcessingDocChat] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);

  // --- General Brain Chat State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Cargar reportes guardados del proyecto al cambiar de proyecto activo
  useEffect(() => {
    if (activeProject?.id) {
      const savedReports = storageService.getProjectReports(activeProject.id);
      setStudioResults(savedReports);
    }
  }, [activeProject?.id]);

  // Al abrir un documento, inicializar el chat limpio
  useEffect(() => {
    if (viewingDocument) {
      setDocChatMessages([]);
      setDocChatInput('');
      setCopiedDoc(false);
    }
  }, [viewingDocument?.id]);

  // ---- Sugerencias Dinámicas de 3 Cambios según el tipo de informe ----
  const getReportSuggestions = (reportType: string): string[] => {
    if (reportType.includes('Maestro')) {
      return [
        '⚡ Profundizar en arquitectura de datos y esquema Supabase',
        '🎯 Añadir más criterios de aceptación funcionales',
        '🛡️ Auditar alineación con directrices y seguridad RLS'
      ];
    }
    if (reportType.includes('Interfaz') || reportType.includes('Paleta') || reportType.includes('UI')) {
      return [
        '🎨 Proponer paleta alternativa de alto contraste con códigos HEX',
        '🧩 Especificar microinteracciones y estados hover/focus',
        '📱 Adaptar componentes UI a pantallas móviles compactas'
      ];
    }
    if (reportType.includes('Estructura') || reportType.includes('Sitemap')) {
      return [
        '🗺️ Simplificar jerarquía del sitemap para el MVP inicial',
        '🚀 Optimizar User Journey principal a 3 pasos directos',
        '🔄 Añadir navegación para estados vacíos y feedback visual'
      ];
    }
    if (reportType.includes('Usabilidad') || reportType.includes('Accesibilidad') || reportType.includes('UX')) {
      return [
        '♿ Verificar conformidad con WCAG 2.1 AA y áreas táctiles (48x48dp)',
        '⚠️ Sustituir alertas nativas con toasts en el DOM',
        '⚡ Reducir clics innecesarios y optimizar flujos críticos'
      ];
    }
    if (reportType.includes('Tono') || reportType.includes('Voz')) {
      return [
        '✍️ Hacer el tono más directo, conciso y profesional',
        '🏷️ Crear ejemplos de microcopy para botones y mensajes de error',
        '💡 Diseñar llamadas a la acción (CTA) de alta conversión'
      ];
    }
    return [
      '🔍 Ampliar detalles técnicos y arquitectura',
      '⚡ Simplificar y resumir puntos clave',
      '🛡️ Verificar coherencia con directrices del proyecto'
    ];
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

    try {
      const query = type === 'benchmark' 
        ? `${activeProject.name} UI UX architecture best practices modern design`
        : type === 'quejas'
        ? `${activeProject.name} common bugs errors user complaints issues`
        : `${activeProject.name} core user needs business requirements workflows`;

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

  // ---- Funciones Cerebro (Chat General) ----
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

  // ---- Generación de Informes en Studio ----
  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingStudio(reportType);
    
    try {
      const sourcesCtx = getSourcesContextString();
      const allDirectives = storageService.getDirectives();
      const directivesCtx = allDirectives.map((d, idx) => `### Directriz #${idx + 1}: ${d.title}\n${d.fullMarkdownContent || d.summary}`).join('\n\n');
      
      const content = await generateReportFromSources(reportType, sourcesCtx, directivesCtx);
      
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        type: reportType,
        content: content,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedReports = [newReport, ...studioResults];
      setStudioResults(updatedReports);
      
      if (activeProject?.id) {
        storageService.saveProjectReports(activeProject.id, updatedReports);
      }
      
      setViewingDocument(newReport);
      triggerCelebration();
      showToast(`✨ ${reportType} generado con éxito`, 'success');
    } catch (error: any) {
      showToast(`No se pudo generar el reporte: ${error.message}`, 'error');
    } finally {
      setIsGeneratingStudio(null);
    }
  };

  // ---- Eliminar Informe ----
  const handleDeleteReport = (reportId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = studioResults.filter(r => r.id !== reportId);
    setStudioResults(updated);
    if (activeProject?.id) {
      storageService.saveProjectReports(activeProject.id, updated);
    }
    if (viewingDocument?.id === reportId) {
      setViewingDocument(null);
    }
    showToast('🗑️ Informe eliminado con éxito', 'info');
  };

  // ---- Descargar Informe (.md) ----
  const handleDownloadReport = (report: { type: string, content: string }, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const blob = new Blob([report.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = report.type.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `${sanitizedTitle}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('⬇️ Informe descargado como Markdown (.md)', 'success');
  };

  // ---- Copiar Informe ----
  const handleCopyReport = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2500);
    showToast('📋 Contenido del informe copiado al portapapeles', 'success');
  };

  // ---- Chat Específico sobre el Informe Abierto ----
  const handleSendDocChatMessage = async (promptToSend?: string) => {
    const text = promptToSend || docChatInput;
    if (!text.trim() || isProcessingDocChat || !viewingDocument) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text.trim() };
    const history = [...docChatMessages];

    setDocChatMessages(prev => [...prev, userMsg]);
    if (!promptToSend) setDocChatInput('');
    setIsProcessingDocChat(true);

    try {
      const allDirectives = storageService.getDirectives();
      const directivesCtx = allDirectives.map((d, idx) => `### Directriz #${idx + 1}: ${d.title}\n${d.fullMarkdownContent || d.summary}`).join('\n\n');
      
      const response = await chatAboutReport(
        viewingDocument.type,
        viewingDocument.content,
        userMsg.content,
        history,
        directivesCtx
      );

      setDocChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      }]);
    } catch (error: any) {
      setDocChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**Error:** ${error.message}`
      }]);
    } finally {
      setIsProcessingDocChat(false);
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
          /* ----- DOCUMENT VIEWER & REPORT CHAT UI ----- */
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-card)', zIndex: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ 
              padding: '16px 24px', 
              borderBottom: '1px solid var(--border-medium)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'rgba(255,255,255,0.02)',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: 'var(--radius-md)', 
                  background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <FileText size={20} color="#A78BFA" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {viewingDocument.type}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {viewingDocument.date ? `Generado a las ${viewingDocument.date}` : 'Informe Activo'} • {viewingDocument.content.split(/\s+/).length} palabras
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button 
                  onClick={() => handleCopyReport(viewingDocument.content)}
                  className="btn btn-secondary" 
                  style={{ padding: '7px 12px', fontSize: '12px', gap: '6px' }}
                  title="Copiar contenido Markdown"
                >
                  {copiedDoc ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copiedDoc ? 'Copiado' : 'Copiar'}</span>
                </button>

                <button 
                  onClick={(e) => handleDownloadReport(viewingDocument, e)}
                  className="btn btn-secondary" 
                  style={{ padding: '7px 12px', fontSize: '12px', gap: '6px' }}
                  title="Descargar como archivo Markdown (.md)"
                >
                  <Download size={14} />
                  <span>Descargar .md</span>
                </button>

                <button 
                  onClick={(e) => handleDeleteReport(viewingDocument.id, e)}
                  className="btn btn-secondary" 
                  style={{ 
                    padding: '7px 12px', 
                    fontSize: '12px', 
                    gap: '6px',
                    color: '#EF4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.08)'
                  }}
                  title="Eliminar este informe permanentemente"
                >
                  <Trash2 size={14} />
                  <span>Eliminar</span>
                </button>

                <button 
                  onClick={() => setViewingDocument(null)} 
                  className="btn btn-secondary" 
                  style={{ padding: '7px 12px', fontSize: '12px', gap: '6px' }}
                  title="Cerrar visor de documento"
                >
                  <X size={14} />
                  <span>Cerrar</span>
                </button>
              </div>
            </div>

            {/* Split Content Body: Upper = Document Content, Lower = Interactive AI Chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* UPPER SECTION: DOCUMENT VIEWER */}
              <div style={{ 
                flex: 1, 
                minHeight: '220px',
                overflowY: 'auto', 
                padding: '24px 32px', 
                fontSize: '14px', 
                lineHeight: 1.7, 
                color: 'var(--text-primary)', 
                background: 'rgba(0, 0, 0, 0.15)',
                borderBottom: '1px solid var(--border-medium)'
              }}>
                <div style={{ maxWidth: '850px', margin: '0 auto', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {viewingDocument.content}
                </div>
              </div>

              {/* LOWER SECTION: INTERACTIVE AI CHAT SPECIFICALLY ABOUT THIS REPORT */}
              <div style={{ 
                height: '340px', 
                minHeight: '280px',
                display: 'flex', 
                flexDirection: 'column', 
                background: 'var(--bg-glass-heavy)',
                overflow: 'hidden'
              }}>
                {/* Chat Section Header */}
                <div style={{ 
                  padding: '10px 20px', 
                  borderBottom: '1px solid var(--border-subtle)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.01)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BrainCircuit size={16} color="var(--accent-primary)" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Chat e Iteración sobre este Informe
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                      Gemini 1.5
                    </span>
                  </div>
                  {docChatMessages.length > 0 && (
                    <button 
                      onClick={() => setDocChatMessages([])}
                      className="btn-icon" 
                      title="Reiniciar chat de este informe"
                      style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <RefreshCw size={12} /> Limpiar conversación
                    </button>
                  )}
                </div>

                {/* 3 SUGGESTED CHANGES PILLS (ENCIMA DEL CHAT) */}
                <div style={{ 
                  padding: '8px 20px', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={13} color="#F59E0B" /> Sugerencias de cambio:
                  </span>
                  {getReportSuggestions(viewingDocument.type).map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendDocChatMessage(sug)}
                      disabled={isProcessingDocChat}
                      className="btn btn-secondary"
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-primary)',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                        e.currentTarget.style.background = 'var(--bg-card)';
                      }}
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                {/* Document Chat Messages Stream */}
                <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {docChatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        gap: '4px'
                      }}
                    >
                      <div style={{ 
                        maxWidth: '85%', 
                        padding: '12px 16px', 
                        borderRadius: 'var(--radius-lg)', 
                        background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)', 
                        color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)', 
                        border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                        fontSize: '13px', 
                        lineHeight: 1.6, 
                        whiteSpace: 'pre-wrap',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isProcessingDocChat && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A78BFA', padding: '8px 12px' }}>
                      <RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
                      <span style={{ fontSize: '12px', fontWeight: 500 }}>Analizando e iterando informe con Gemini...</span>
                    </div>
                  )}
                </div>

                {/* Document Chat Input Bar */}
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.01)' }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    background: 'var(--bg-card)', 
                    padding: '6px 12px', 
                    borderRadius: 'var(--radius-full)', 
                    border: '1px solid var(--border-medium)',
                    alignItems: 'center'
                  }}>
                    <input 
                      type="text"
                      value={docChatInput}
                      onChange={e => setDocChatInput(e.target.value)}
                      placeholder="Escribe qué cambio, ajuste o ampliación necesitas sobre este informe..."
                      className="form-input"
                      style={{ flex: 1, background: 'transparent', border: 'none', padding: '4px 8px', outline: 'none', fontSize: '13px', color: 'var(--text-primary)' }}
                      onKeyDown={e => { if (e.key === 'Enter') handleSendDocChatMessage(); }}
                    />
                    <button 
                      onClick={() => handleSendDocChatMessage()} 
                      disabled={!docChatInput.trim() || isProcessingDocChat}
                      className="btn btn-primary" 
                      style={{ 
                        borderRadius: 'var(--radius-full)', 
                        padding: '8px 14px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '12px',
                        gap: '6px'
                      }}
                    >
                      <Send size={13} />
                      <span>Enviar</span>
                    </button>
                  </div>
                </div>

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
                          <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Resultados Web</h4>
                          {webSearchResults.length > 0 && !isSearchingWeb && (
                            <button 
                              type="button"
                              onClick={handleToggleSelectAllWebResults}
                              className="btn btn-secondary"
                              style={{ 
                                fontSize: '12px', 
                                padding: '4px 12px', 
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-medium)',
                                background: selectedWebResults.size === webSearchResults.length ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                color: selectedWebResults.size === webSearchResults.length ? '#38BDF8' : 'var(--text-secondary)'
                              }}
                            >
                              {selectedWebResults.size === webSearchResults.length && webSearchResults.length > 0 
                                ? 'Deseleccionar todo' 
                                : 'Seleccionar todo'}
                            </button>
                          )}
                        </div>
                        {selectedWebResults.size > 0 && <button onClick={handleAddSelectedWebSources} className="btn btn-primary">Añadir {selectedWebResults.size} fuentes</button>}
                      </div>
                      {webSearchResults.map(res => {
                        const domain = res.url.split('/')[2] || 'google.com';
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
          /* ----- GENERAL CHAT UI ----- */
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={16} color="#38BDF8" />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {res.type}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hoy a las {res.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button 
                        onClick={() => setViewingDocument(res)}
                        className="btn-icon" 
                        title="Ver y debatir informe"
                        style={{ padding: '6px' }}
                      >
                        <Eye size={16} color="var(--text-primary)" />
                      </button>
                      <button 
                        onClick={(e) => handleDownloadReport(res, e)}
                        className="btn-icon" 
                        title="Descargar .md" 
                        style={{ padding: '6px' }}
                      >
                        <Download size={16} color="var(--text-muted)" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteReport(res.id, e)}
                        className="btn-icon" 
                        title="Eliminar informe" 
                        style={{ padding: '6px' }}
                      >
                        <Trash2 size={16} color="#EF4444" />
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
            background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
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
