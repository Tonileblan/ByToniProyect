import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Mic, MicOff, MessageSquare, Lightbulb, 
  Bug, HelpCircle, CheckCircle2, Sparkles, AlertTriangle, 
  ArrowRight, Check, Image as ImageIcon, ExternalLink,
  Bot, User, Info, MapPin, ListFilter
} from 'lucide-react';
import { Project, Task } from '../../types/project';
import { feedbackService } from '../../services/feedbackService';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface AppHelpChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: Project;
  onNewFeedbackTask: (task: Task) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  detectedType?: 'idea' | 'error';
  suggestedAction?: {
    label: string;
    action: () => void;
  };
}

export const AppHelpChatModal: React.FC<AppHelpChatModalProps> = ({
  isOpen,
  onClose,
  activeProject,
  onNewFeedbackTask
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'chat' | 'idea' | 'error' | 'roadmap_status'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `¡Hola! Soy el asistente de ayuda de **${activeProject.name}** (${activeProject.category}).\n\nPuedes consultarme dudas sobre el uso de la aplicación, **proponer nuevas ideas y mejoras** para la Hoja de Ruta, o **notificar errores y fallos técnicos** que detectes. Todo lo que envíes se registrará en el tablero Kanban de desarrollo.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Idea Form State
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaAuthor, setIdeaAuthor] = useState('');
  const [ideaImage, setIdeaImage] = useState<string | null>(null);

  // Error Form State
  const [errorTitle, setErrorTitle] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [errorAuthor, setErrorAuthor] = useState('');
  const [errorImage, setErrorImage] = useState<string | null>(null);

  // Success notifications
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'es-ES';
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setChatInput(prev => `${prev} ${transcript}`.trim());
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento por voz nativo.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Check for error or improvement in text
    const lower = userText.toLowerCase();
    const isError = lower.includes('error') || lower.includes('bug') || lower.includes('falla') || lower.includes('no funciona') || lower.includes('problema');
    const isIdea = lower.includes('idea') || lower.includes('mejora') || lower.includes('sugerencia') || lower.includes('propongo') || lower.includes('añadir');

    setTimeout(() => {
      let botResponse: ChatMessage;

      if (isError) {
        // Auto create or offer creation in Kanban
        const createdTask = feedbackService.createTaskFromFeedback({
          projectId: activeProject.id,
          type: 'error',
          title: `[Error Reportado] ${userText.slice(0, 45)}...`,
          description: userText,
          authorName: 'Usuario del Chat'
        }, 'sec_1');
        onNewFeedbackTask(createdTask);
        triggerCelebration();

        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `🚨 **¡He registrado tu incidencia de error en el Tablero Kanban!**\n\n📌 **Columna:** 🐛 *Errores & Bugs Notificados*\n📝 **Detalle:** "${userText}"\n\nToni y el equipo de desarrollo han recibido la notificación y lo abordarán en la próxima iteración de QA.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          detectedType: 'error'
        };
      } else if (isIdea) {
        const createdTask = feedbackService.createTaskFromFeedback({
          projectId: activeProject.id,
          type: 'idea',
          title: `[Mejora] ${userText.slice(0, 45)}...`,
          description: userText,
          authorName: 'Usuario del Chat'
        }, 'sec_1');
        onNewFeedbackTask(createdTask);
        triggerCelebration();

        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `💡 **¡Excelente propuesta! Ha sido agregada a la Hoja de Ruta.**\n\n📌 **Columna:** 💡 *Ideas & Mejoras Propuestas*\n📝 **Propuesta:** "${userText}"\n\nEstá visible en el Tablero Kanban de **${activeProject.name}** para su análisis y especificación.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          detectedType: 'idea'
        };
      } else {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: `Comprendido. Esta aplicación está desarrollada con **${activeProject.frontendStack}** bajo las **Directrices de Google Drive** de Toni.\n\nSi deseas reportar un fallo técnico concreto o proponer una funcionalidad para la siguiente versión, puedes escribirlo aquí o usar las pestañas **💡 Proponer Idea** o **🐛 Notificar Error**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'idea' | 'error') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (target === 'idea') setIdeaImage(url);
      else setErrorImage(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaDescription.trim()) return;

    const createdTask = feedbackService.createTaskFromFeedback({
      projectId: activeProject.id,
      type: 'idea',
      title: ideaTitle.trim(),
      description: ideaDescription.trim(),
      authorName: ideaAuthor.trim() || 'Usuario / Cliente',
      imageUrl: ideaImage || undefined
    }, 'sec_1');

    onNewFeedbackTask(createdTask);
    triggerCelebration();

    setSubmittedMessage(`¡Tu idea "${ideaTitle}" ha sido añadida a la columna "💡 Ideas & Mejoras Propuestas" del tablero!`);
    setIdeaTitle('');
    setIdeaDescription('');
    setIdeaAuthor('');
    setIdeaImage(null);

    setTimeout(() => {
      setSubmittedMessage(null);
      setActiveTab('chat');
    }, 3000);
  };

  const handleSubmitError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorTitle.trim() || !errorDescription.trim()) return;

    const createdTask = feedbackService.createTaskFromFeedback({
      projectId: activeProject.id,
      type: 'error',
      title: errorTitle.trim(),
      description: errorDescription.trim(),
      authorName: errorAuthor.trim() || 'Usuario / Cliente',
      imageUrl: errorImage || undefined
    }, 'sec_1');

    onNewFeedbackTask(createdTask);
    triggerCelebration();

    setSubmittedMessage(`¡Incidencia de error "${errorTitle}" registrada en la columna "🐛 Errores & Bugs Notificados" del tablero!`);
    setErrorTitle('');
    setErrorDescription('');
    setErrorAuthor('');
    setErrorImage(null);

    setTimeout(() => {
      setSubmittedMessage(null);
      setActiveTab('chat');
    }, 3000);
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '740px',
        height: '85vh',
        maxHeight: '750px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: activeProject.color || '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <HelpCircle size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Zona de Ayuda & Feedback: {activeProject.name}
                </h3>
                <span className="badge badge-indigo" style={{ fontSize: '9px' }}>
                  Roadmap Sync
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                Las propuestas de mejoras y errores enviados aquí se actualizan directamente en la Hoja de Ruta.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ width: '28px', height: '28px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '8px 16px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('chat')}
            className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            <MessageSquare size={13} />
            <span>💬 Chat de Ayuda IA</span>
          </button>

          <button
            onClick={() => setActiveTab('idea')}
            className={`btn ${activeTab === 'idea' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            <Lightbulb size={13} color="#8B5CF6" />
            <span>💡 Proponer Idea / Mejora</span>
          </button>

          <button
            onClick={() => setActiveTab('error')}
            className={`btn ${activeTab === 'error' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            <Bug size={13} color="#EF4444" />
            <span>🐛 Notificar Error / Bug</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {submittedMessage && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            borderBottom: '1px solid #10B981',
            padding: '10px 18px',
            color: '#A7F3D0',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* TAB 1: INTERACTIVE CHAT */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px' }}>
              {/* Message List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingRight: '6px'
              }}>
                {messages.map(m => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexDirection: isUser ? 'row-reverse' : 'row',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isUser ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isUser ? <User size={14} color="#FFFFFF" /> : <Bot size={14} color="#38BDF8" />}
                      </div>

                      <div style={{
                        maxWidth: '75%',
                        background: isUser ? 'var(--accent-primary)' : 'var(--bg-card)',
                        color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: isUser ? 'none' : '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {m.text}
                        <div style={{
                          fontSize: '9px',
                          color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                          marginTop: '4px',
                          textAlign: isUser ? 'right' : 'left'
                        }}>
                          {m.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Box */}
              <div style={{
                display: 'flex',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                alignItems: 'center'
              }}>
                <button
                  onClick={toggleVoice}
                  className="btn-icon"
                  style={{
                    color: isListening ? '#EF4444' : 'var(--text-muted)',
                    background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-card)'
                  }}
                  title={isListening ? 'Detener dictado' : 'Hablar por micrófono'}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                <input
                  type="text"
                  placeholder="Escribe tu consulta, error o idea (ej. 'Falla el botón de cobro en iOS')..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage();
                  }}
                  className="form-input"
                  style={{ flex: 1, height: '36px', fontSize: '12px' }}
                />

                <button
                  onClick={handleSendChatMessage}
                  className="btn btn-primary"
                  style={{ height: '36px', padding: '0 14px' }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROPOSE IDEA / IMPROVEMENT */}
          {activeTab === 'idea' && (
            <form onSubmit={handleSubmitIdea} style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '12px',
                color: '#C4B5FD',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <Lightbulb size={18} color="#8B5CF6" />
                <span>Esta propuesta se insertará en tiempo real en la columna <strong>💡 Ideas & Mejoras Propuestas</strong> del tablero Kanban de {activeProject.name}.</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Título de la Idea / Mejora:
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Añadir exportación de informe en PDF con 1 clic"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Descripción detallada y propuesta de valor:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explica qué beneficio aportaría a los usuarios y cómo debería funcionar..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '12px', lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Tu Nombre o Empresa (opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Juan / Cliente Taller"
                    value={ideaAuthor}
                    onChange={(e) => setIdeaAuthor(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Captura o Mockup (opcional):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'idea')}
                    className="form-input"
                    style={{ fontSize: '11px' }}
                  />
                </div>
              </div>

              {ideaImage && (
                <div style={{ width: '100px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <img src={ideaImage} alt="Idea Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px' }}>
                <button type="button" onClick={() => setActiveTab('chat')} className="btn btn-secondary">
                  Volver al Chat
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#8B5CF6' }}>
                  <Lightbulb size={14} />
                  <span>Enviar Propuesta a la Hoja de Ruta</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: REPORT ERROR / BUG */}
          {activeTab === 'error' && (
            <form onSubmit={handleSubmitError} style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '12px',
                color: '#FCA5A5',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <Bug size={18} color="#EF4444" />
                <span>Esta incidencia se insertará directamente en la columna <strong>🐛 Errores & Bugs Notificados</strong> con prioridad de revisión.</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Resumen del Error:
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. No carga el croquis táctil al seleccionar patinete 48V"
                  value={errorTitle}
                  onChange={(e) => setErrorTitle(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Pasos para reproducir y comportamiento esperado:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="1. Pulso en el botón... 2. Aparece pantalla negra... Comportamiento esperado: ..."
                  value={errorDescription}
                  onChange={(e) => setErrorDescription(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '12px', lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Tu Nombre o Email de Contacto:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Toni / Administrador"
                    value={errorAuthor}
                    onChange={(e) => setErrorAuthor(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Captura del Error (opcional):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'error')}
                    className="form-input"
                    style={{ fontSize: '11px' }}
                  />
                </div>
              </div>

              {errorImage && (
                <div style={{ width: '100px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <img src={errorImage} alt="Error Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px' }}>
                <button type="button" onClick={() => setActiveTab('chat')} className="btn btn-secondary">
                  Volver al Chat
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#EF4444' }}>
                  <Bug size={14} />
                  <span>Notificar Error al Tablero</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
