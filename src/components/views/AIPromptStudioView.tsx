import React, { useState } from 'react';
import { 
  Sparkles, Copy, Check, Download, Terminal, 
  BookOpen, Search, Lightbulb, Shield, Database, 
  ExternalLink, Layers, CheckCircle2, ArrowRight,
  FileText, Save, Info, Bot, Zap, Compass, RefreshCw, Globe
} from 'lucide-react';
import { Project, DirectiveItem, Task, ProjectResearchInsights } from '../../types/project';
import { blueprintService } from '../../services/blueprintService';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface AIPromptStudioViewProps {
  projects: Project[];
  activeProject: Project;
  directives: DirectiveItem[];
  tasks?: Task[];
  onSelectProject: (projectId: string) => void;
  onUpdateProject?: (updatedProject: Project) => void;
}

export const AIPromptStudioView: React.FC<AIPromptStudioViewProps> = ({
  projects,
  activeProject,
  directives,
  tasks = [],
  onSelectProject,
  onUpdateProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(activeProject.id);
  const [activeStep, setActiveStep] = useState<'notebook_research' | 'notebook_ingest' | 'antigravity_blueprint'>('antigravity_blueprint');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentProj = projects.find(p => p.id === selectedProjectId) || activeProject;
  const projectTasks = tasks.filter(t => t.projectId === currentProj.id);

  // Research insights form state
  const [competitorWeaknesses, setCompetitorWeaknesses] = useState(currentProj.researchInsights?.competitorWeaknesses || '');
  const [unmetNeeds, setUnmetNeeds] = useState(currentProj.researchInsights?.unmetNeeds || '');
  const [uiUxBenchmark, setUiUxBenchmark] = useState(currentProj.researchInsights?.uiUxBenchmark || '');
  const [designSystemTheme, setDesignSystemTheme] = useState(currentProj.researchInsights?.designSystemTheme || '');
  const [notebookUrl, setNotebookUrl] = useState(currentProj.googleNotebookUrl || currentProj.researchInsights?.notebookUrl || '');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Sync state when project changes
  const handleProjectSwitch = (newProjId: string) => {
    setSelectedProjectId(newProjId);
    onSelectProject(newProjId);
    const p = projects.find(proj => proj.id === newProjId);
    if (p) {
      setCompetitorWeaknesses(p.researchInsights?.competitorWeaknesses || '');
      setUnmetNeeds(p.researchInsights?.unmetNeeds || '');
      setUiUxBenchmark(p.researchInsights?.uiUxBenchmark || '');
      setDesignSystemTheme(p.researchInsights?.designSystemTheme || '');
      setNotebookUrl(p.googleNotebookUrl || p.researchInsights?.notebookUrl || '');
    }
  };

  const researchDoc = blueprintService.generateNotebookResearchDossier(currentProj);
  const masterBlueprint = blueprintService.generateMasterAntigravityBlueprint(
    currentProj, 
    directives, 
    projectTasks, 
    currentProj.researchInsights
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAutoFillInsights = () => {
    const baseline = blueprintService.generateAIBaselineInsights(currentProj);
    setCompetitorWeaknesses(baseline.competitorWeaknesses || '');
    setUnmetNeeds(baseline.unmetNeeds || '');
    setUiUxBenchmark(baseline.uiUxBenchmark || '');
    setDesignSystemTheme(baseline.designSystemTheme || '');
    if (!notebookUrl) setNotebookUrl(baseline.notebookUrl || '');
    triggerCelebration();
  };

  const handleSaveInsights = () => {
    const updatedInsights: ProjectResearchInsights = {
      competitorWeaknesses: competitorWeaknesses.trim(),
      unmetNeeds: unmetNeeds.trim(),
      uiUxBenchmark: uiUxBenchmark.trim(),
      designSystemTheme: designSystemTheme.trim(),
      notebookUrl: notebookUrl.trim()
    };

    const updatedProj: Project = {
      ...currentProj,
      researchInsights: updatedInsights,
      googleNotebookUrl: notebookUrl.trim() || currentProj.googleNotebookUrl
    };

    if (onUpdateProject) {
      onUpdateProject(updatedProj);
    }

    setIsSavedSuccess(true);
    triggerCelebration();
    setTimeout(() => setIsSavedSuccess(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Studio Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
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
            <Zap size={24} color="#818CF8" />
            <h2 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
              Generador Maestro de Proyectos para Antigravity & Google Notebook
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '780px', margin: 0, lineHeight: 1.5 }}>
            El objetivo de ByToniProyect es construir el <strong>Archivo Maestro estructurado y completo</strong> para que Antigravity desarrolle la web o app sin fricciones. Utiliza <strong>Google NotebookLM</strong> para investigar benchmarks, críticas de la competencia y necesidades no cubiertas.
          </p>
        </div>

        {/* Project Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Proyecto Activo:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectSwitch(e.target.value)}
            className="form-input"
            style={{ width: '220px', height: '36px', fontSize: '12px' }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-Step Pipeline Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '8px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }}>
        <button
          onClick={() => setActiveStep('notebook_research')}
          className={`btn ${activeStep === 'notebook_research' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, fontSize: '12px', padding: '8px 12px' }}
        >
          <Compass size={14} color="#38BDF8" />
          <span>1. Búsqueda & NotebookLM</span>
        </button>

        <button
          onClick={() => setActiveStep('notebook_ingest')}
          className={`btn ${activeStep === 'notebook_ingest' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, fontSize: '12px', padding: '8px 12px' }}
        >
          <Lightbulb size={14} color="#F59E0B" />
          <span>2. Ingesta de Hallazgos</span>
        </button>

        <button
          onClick={() => setActiveStep('antigravity_blueprint')}
          className={`btn ${activeStep === 'antigravity_blueprint' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1.2, fontSize: '12px', padding: '8px 12px', background: activeStep === 'antigravity_blueprint' ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : undefined }}
        >
          <Sparkles size={14} color="#FFFFFF" />
          <span>3. Archivo Maestro Antigravity (BLUEPRINT)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: NOTEBOOK RESEARCH & INQUIRY DOSSIER                                */}
      {/* ========================================================================= */}
      {activeStep === 'notebook_research' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                🔬 Guía de Investigación y Solicitudes de Búsqueda para Google NotebookLM
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Copia estas consultas y ejecútalas para recopilar fuentes de alta calidad sobre {currentProj.name} antes de generar la app.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={currentProj.googleNotebookUrl || 'https://notebooklm.google.com'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ textDecoration: 'none', fontSize: '12px' }}
              >
                <span>Abrir Google NotebookLM</span>
                <ExternalLink size={13} />
              </a>

              <button
                onClick={() => handleDownloadFile(researchDoc, `INVESTIGACION_NOTEBOOK_${currentProj.slug.toUpperCase()}.md`)}
                className="btn btn-secondary"
                style={{ fontSize: '12px' }}
              >
                <Download size={13} />
                <span>Descargar .md</span>
              </button>

              <button
                onClick={() => handleCopy(researchDoc, 'research_doc')}
                className="btn btn-primary"
                style={{ fontSize: '12px' }}
              >
                {copiedId === 'research_doc' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedId === 'research_doc' ? '¡Copiado!' : 'Copiar Guía'}</span>
              </button>
            </div>
          </div>

          {/* 1-Click Fast Search Launchers */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={14} color="#6366F1" />
                <span>Accesos Rápidos de Búsqueda de Fuentes (1 Clic)</span>
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Abre las consultas preformuladas en nuevas pestañas para añadir enlaces a tu cuaderno
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`Mejores aplicaciones de ${currentProj.appType} para ${currentProj.targetAudience} diseño UI UX 2026`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '6px 10px', textDecoration: 'none' }}
              >
                <Globe size={12} color="#4285F4" />
                <span>1. Benchmark UI/UX (Google)</span>
                <ExternalLink size={10} />
              </a>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`site:reddit.com quejas problemas opiniones apps ${currentProj.name} ${currentProj.appType}`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '6px 10px', textDecoration: 'none' }}
              >
                <Search size={12} color="#FF4500" />
                <span>2. Quejas & Fallos Competencia (Reddit)</span>
                <ExternalLink size={10} />
              </a>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`peores problemas y necesidades no cubiertas en software ${currentProj.targetAudience}`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '6px 10px', textDecoration: 'none' }}
              >
                <Lightbulb size={12} color="#F59E0B" />
                <span>3. Necesidades No Cubiertas</span>
                <ExternalLink size={10} />
              </a>

              <a
                href={`https://www.perplexity.ai/search?q=${encodeURIComponent(`Análisis de mercado, criticas de competidores, killer features y diseño UI UX para ${currentProj.name} (${currentProj.appType})`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '6px 10px', textDecoration: 'none' }}
              >
                <Bot size={12} color="#06B6D4" />
                <span>4. Perplexity AI Research</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          <pre style={{
            background: '#070A10',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            maxHeight: '480px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            lineHeight: 1.6,
            color: '#E2E8F0',
            whiteSpace: 'pre-wrap'
          }}>
            {researchDoc}
          </pre>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: INGEST RESEARCH FINDINGS & DESIGN DECISIONS                        */}
      {/* ========================================================================= */}
      {activeStep === 'notebook_ingest' && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                🧠 Ingesta de Hallazgos de Google NotebookLM para {currentProj.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Pega aquí las conclusiones, benchmarks y decisiones que generaste en NotebookLM o pulsa en <strong>Auto-Diagnóstico IA</strong> para una propuesta inmediata.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleAutoFillInsights}
                className="btn btn-secondary"
                style={{ fontSize: '12px', borderColor: 'rgba(99, 102, 241, 0.4)', color: '#818CF8' }}
                title="Genera un diagnóstico contextual automático según el tipo de aplicación"
              >
                <Zap size={14} color="#818CF8" />
                <span>⚡ Auto-Diagnóstico IA</span>
              </button>

              {isSavedSuccess && (
                <span className="badge badge-emerald" style={{ fontSize: '12px', padding: '4px 10px' }}>
                  ✓ ¡Hallazgos Guardados!
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Competitor Weaknesses */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#F87171', marginBottom: '6px' }}>
                ⚠️ Críticas y Puntos Débiles de Apps Similares (A Evitar):
              </label>
              <textarea
                rows={4}
                value={competitorWeaknesses}
                onChange={(e) => setCompetitorWeaknesses(e.target.value)}
                placeholder="ej. Los usuarios se quejan de interfaces lentas, demasiados clics para guardar una entrada, falta de modo offline..."
                className="form-input"
                style={{ fontSize: '12px', lineHeight: 1.5 }}
              />
            </div>

            {/* Unmet Needs */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#A78BFA', marginBottom: '6px' }}>
                💡 Necesidades No Cubiertas & "Killer Features" Demandadas:
              </label>
              <textarea
                rows={4}
                value={unmetNeeds}
                onChange={(e) => setUnmetNeeds(e.target.value)}
                placeholder="ej. Exportación instantánea en PDF, integración directa por WhatsApp, atajos rápidos de teclado..."
                className="form-input"
                style={{ fontSize: '12px', lineHeight: 1.5 }}
              />
            </div>

            {/* UI/UX Benchmark */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#38BDF8', marginBottom: '6px' }}>
                🎨 Benchmark de Interfaz & Patrones Recomendados:
              </label>
              <textarea
                rows={4}
                value={uiUxBenchmark}
                onChange={(e) => setUiUxBenchmark(e.target.value)}
                placeholder="ej. Panel lateral deslizante (Master-Detail), gráficos interactivos en tiempo real, navegación táctil en zona del pulgar..."
                className="form-input"
                style={{ fontSize: '12px', lineHeight: 1.5 }}
              />
            </div>

            {/* Design System & Visual Theme */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#10B981', marginBottom: '6px' }}>
                💎 Estilo Visual, Paleta de Color & Tipografías:
              </label>
              <textarea
                rows={4}
                value={designSystemTheme}
                onChange={(e) => setDesignSystemTheme(e.target.value)}
                placeholder="ej. Dark Glassmorphism con acento Violeta/Indigo, fuentes Outfit e Inter, tarjetas con bordes translúcidos..."
                className="form-input"
                style={{ fontSize: '12px', lineHeight: 1.5 }}
              />
            </div>
          </div>

          {/* Notebook URL */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              🔗 Enlace a la Libreta en Google NotebookLM:
            </label>
            <input
              type="text"
              value={notebookUrl}
              onChange={(e) => setNotebookUrl(e.target.value)}
              placeholder="https://notebooklm.google.com/notebook/..."
              className="form-input"
              style={{ fontSize: '12px' }}
            />
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px' }}>
            <button
              onClick={handleSaveInsights}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              <Save size={15} />
              <span>Guardar Hallazgos y Actualizar Blueprint</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: MASTER ANTIGRAVITY BLUEPRINT FILE (THE SACRED SPEC)               */}
      {/* ========================================================================= */}
      {activeStep === 'antigravity_blueprint' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Action Toolbar */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal size={20} color="#6366F1" />
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  BLUEPRINT_PROYECTO_{currentProj.slug.toUpperCase()}.md
                </h3>
                <span style={{ fontSize: '11px', color: '#10B981' }}>
                  ✓ 100% Estructurado con Directrices Drive + Esquema Supabase + Roadmap
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleDownloadFile(masterBlueprint, `BLUEPRINT_${currentProj.slug.toUpperCase()}.md`)}
                className="btn btn-secondary"
                style={{ fontSize: '12px' }}
              >
                <Download size={14} />
                <span>Descargar Archivo .md</span>
              </button>

              <button
                onClick={() => handleCopy(masterBlueprint, 'master_blueprint')}
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '8px 18px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
              >
                {copiedId === 'master_blueprint' ? (
                  <>
                    <Check size={15} color="#FFFFFF" />
                    <span>¡Archivo Maestro Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    <span>⚡ Copiar Archivo para Antigravity</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Master Blueprint Code View */}
          <div style={{
            background: '#070A10',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 18px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} color="#38BDF8" />
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  Listo para pegar en Antigravity para generar la app completa
                </span>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '10px' }}>
                {currentProj.frontendStack}
              </span>
            </div>

            <div style={{
              padding: '24px',
              maxHeight: '580px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: 1.6,
              color: '#E2E8F0',
              whiteSpace: 'pre-wrap',
              background: '#070A10'
            }}>
              {masterBlueprint}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
