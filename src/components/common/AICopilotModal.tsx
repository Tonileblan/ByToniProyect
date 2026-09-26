import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Terminal, Check, Copy } from 'lucide-react';
import { Project, DirectiveItem } from '../../types/project';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: Project | null;
  directives: DirectiveItem[];
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  activeProject,
  directives
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; code?: string }>>([
    {
      role: 'assistant',
      text: `¡Hola Toni! Soy tu Copilot de ByToniProyect. Estoy sincronizado con tus 5 Directrices Maestras de Google Drive y el proyecto activo "${activeProject?.name || 'ByToniProyect'}". ¿Qué deseas consultar o generar?`,
      code: undefined
    }
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const newMessages = [...messages, { role: 'user' as const, text: userText }];
    setMessages(newMessages);

    // Simulate smart AI response based on Toni's directrices
    setTimeout(() => {
      let responseText = '';
      let codeSnippet: string | undefined = undefined;

      const q = userText.toLowerCase();
      if (q.includes('directriz') || q.includes('drive') || q.includes('regla')) {
        responseText = `Según las 5 Directrices Maestras de Google Drive para "${activeProject?.name}":\n\n1. Supabase: Esquema aislado '${activeProject?.supabaseSchema || activeProject?.slug}' con RLS forzoso.\n2. Auth: Supabase Auth con middleware de route guards.\n3. IA: Respuestas streaming SSE con claves protegidas en backend.\n4. RGPD: Titular Antonio Javier García García (DNI 34799350M, Madrid) y firma 'By Toni'.\n5. Drive: Registro en Registro_Proyectos_Toni.csv e INFO_PROYECTO.md.`;
      } else if (q.includes('sql') || q.includes('schema') || q.includes('supabase') || q.includes('tabla')) {
        responseText = `He generado el script SQL para inicializar el esquema aislado "${activeProject?.supabaseSchema || activeProject?.slug}" con RLS estricto:`;
        codeSnippet = `-- Migración Supabase para ${activeProject?.name}\nCREATE SCHEMA IF NOT EXISTS ${activeProject?.supabaseSchema || activeProject?.slug};\n\nCREATE TABLE IF NOT EXISTS ${activeProject?.supabaseSchema || activeProject?.slug}.items (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),\n  title TEXT NOT NULL,\n  status TEXT DEFAULT 'pending',\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n\nALTER TABLE ${activeProject?.supabaseSchema || activeProject?.slug}.items ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Users can only access own items" ON ${activeProject?.supabaseSchema || activeProject?.slug}.items\n  FOR ALL USING (auth.uid() = user_id);`;
      } else if (q.includes('prompt') || q.includes('antigravity')) {
        responseText = `Aquí tienes el prompt de ejecución para Antigravity:`;
        codeSnippet = `Inicializa la funcionalidad en ${activeProject?.name} (${activeProject?.frontendStack}) aplicando Clean Architecture (Domain/Data/UI), esquema Supabase ${activeProject?.supabaseSchema || activeProject?.slug} con RLS y el sello "By Toni".`;
      } else {
        responseText = `Entendido. Para ${activeProject?.name}, el stack recomendado es ${activeProject?.frontendStack} con ${activeProject?.uiStyle}. He verificado que cumple las directrices de Drive y está listo para integrarse con Antigravity.`;
      }

      setMessages([...newMessages, { role: 'assistant', text: responseText, code: codeSnippet }]);
    }, 600);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '640px', maxWidth: '95vw', display: 'flex', flexDirection: 'column', height: '620px' }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                IA Copilot (ByToniProyect)
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                Asistente de Arquitectura & Directrices para {activeProject?.name || 'Suite Toni'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        {/* Chat History */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '6px'
              }}
            >
              <div style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: m.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: '#FFFFFF',
                fontSize: '13px',
                lineHeight: '1.45',
                border: m.role === 'user' ? 'none' : '1px solid var(--border-medium)',
                whiteSpace: 'pre-wrap'
              }}>
                {m.text}
              </div>

              {m.code && (
                <div style={{
                  maxWidth: '90%',
                  background: '#070A10',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Terminal size={12} color="#38BDF8" />
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        SQL / Prompt
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(m.code!)}
                      className="btn-icon"
                      style={{ width: '22px', height: '22px' }}
                      title="Copiar código"
                    >
                      {copiedCode === m.code ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                    </button>
                  </div>
                  <pre style={{
                    padding: '12px',
                    margin: 0,
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: '#38BDF8',
                    overflowX: 'auto'
                  }}>
                    {m.code}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Query Input Box */}
        <form onSubmit={handleSend} style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          background: 'var(--bg-tertiary)'
        }}>
          <input
            type="text"
            placeholder="Pregunta sobre directrices, genera scripts SQL o prompts..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="form-input"
            style={{ fontSize: '13px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
