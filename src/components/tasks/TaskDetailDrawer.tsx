import React, { useState, useRef } from 'react';
import { 
  X, CheckCircle2, Circle, Calendar, User, Tag, 
  Sparkles, CheckSquare, Plus, Trash2, Copy, Check, 
  MessageSquare, Clock, ShieldCheck, Database, Scale, Send,
  Paperclip, Image as ImageIcon, Mic, Square, Download, 
  ExternalLink, FileText, Play, Music, Volume2, Link as LinkIcon
} from 'lucide-react';
import { Task, Project, DirectiveItem, TaskPriority, TaskStatus, TaskAttachment, AttachmentType } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';
import { aiService } from '../../services/aiService';

interface TaskDetailDrawerProps {
  task: Task | null;
  project: Project;
  directives: DirectiveItem[];
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  project,
  directives,
  onClose,
  onUpdateTask,
  onDeleteTask
}) => {
  if (!task) return null;

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  // Attachment states
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  // Refs for media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isCompleted = task.status === 'completed';
  const attachments = task.attachments || [];

  const handleToggleComplete = () => {
    const nextStatus: TaskStatus = isCompleted ? 'in_development' : 'completed';
    if (!isCompleted) triggerCelebration();
    onUpdateTask({
      ...task,
      status: nextStatus,
      activities: [
        ...task.activities,
        {
          id: `act_${Date.now()}`,
          user: 'Toni',
          action: isCompleted ? 'Reabrió la tarea' : 'Completó la tarea',
          timestamp: new Date().toISOString()
        }
      ]
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const updatedSubtasks = [
      ...task.subtasks,
      { id: `sub_${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ];
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updated = task.subtasks.map(st => {
      if (st.id === subtaskId) {
        const nextState = !st.completed;
        if (nextState) triggerCelebration();
        return { ...st, completed: nextState };
      }
      return st;
    });
    onUpdateTask({ ...task, subtasks: updated });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updated = task.subtasks.filter(st => st.id !== subtaskId);
    onUpdateTask({ ...task, subtasks: updated });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: `comm_${Date.now()}`,
      author: 'Toni',
      avatar: '👨‍💻',
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    };
    onUpdateTask({
      ...task,
      comments: [...task.comments, comment]
    });
    setNewComment('');
  };

  const handleToggleDirectiveCheck = (key: keyof Task['directivesChecked']) => {
    onUpdateTask({
      ...task,
      directivesChecked: {
        ...task.directivesChecked,
        [key]: !task.directivesChecked[key]
      }
    });
  };

  // ==========================================
  // ATTACHMENT HANDLERS (FILES & IMAGES)
  // ==========================================
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');
      const isAudio = file.type.startsWith('audio/');
      
      let type: AttachmentType = 'file';
      if (isImage) type = 'image';
      else if (isAudio) type = 'audio';
      else if (file.type.includes('pdf') || file.type.includes('text') || file.name.endsWith('.md')) type = 'document';

      const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      };

      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (!resultUrl) return;

        const newAttachment: TaskAttachment = {
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          type,
          size: formatSize(file.size),
          url: resultUrl,
          mimeType: file.type,
          uploadedAt: new Date().toISOString()
        };

        const updated = [...(task.attachments || []), newAttachment];
        onUpdateTask({ ...task, attachments: updated });
      };

      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ==========================================
  // AUDIO RECORDING HANDLERS
  // ==========================================
  const handleStartAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const audioUrl = reader.result as string;
          const newAudioAttachment: TaskAttachment = {
            id: `audio_${Date.now()}`,
            name: `Nota de Voz (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            type: 'audio',
            size: `${(audioBlob.size / 1024).toFixed(1)} KB`,
            url: audioUrl,
            mimeType: 'audio/webm',
            duration: recordingDuration,
            uploadedAt: new Date().toISOString()
          };

          const updated = [...(task.attachments || []), newAudioAttachment];
          onUpdateTask({ ...task, attachments: updated });
          triggerCelebration();
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingDuration(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('No se pudo acceder al micrófono. Por favor, verifica los permisos del navegador.');
    }
  };

  const handleStopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const handleCancelAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  // ==========================================
  // LINK ATTACHMENT HANDLER
  // ==========================================
  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    const newLinkAttachment: TaskAttachment = {
      id: `link_${Date.now()}`,
      name: newLinkTitle.trim() || newLinkUrl.trim(),
      type: 'link',
      url: newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`,
      uploadedAt: new Date().toISOString()
    };

    const updated = [...(task.attachments || []), newLinkAttachment];
    onUpdateTask({ ...task, attachments: updated });
    setNewLinkUrl('');
    setNewLinkTitle('');
    setShowAddLinkForm(false);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    const updated = (task.attachments || []).filter(a => a.id !== attachmentId);
    onUpdateTask({ ...task, attachments: updated });
  };

  const taskPrompt = aiService.generateTaskPrompt(task, project, directives);

  const handleCopyTaskPrompt = () => {
    navigator.clipboard.writeText(taskPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Slide Over Panel */}
      <div className="drawer-panel" style={{ width: '600px', maxWidth: '95vw' }}>
        {/* Drawer Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-tertiary)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          {/* Mark Complete Button */}
          <button
            onClick={handleToggleComplete}
            className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={15} color="#10B981" />
                <span>Completada</span>
              </>
            ) : (
              <>
                <Circle size={15} />
                <span>Marcar como Completada</span>
              </>
            )}
          </button>

          {/* Action buttons on right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="btn-icon"
              title="Eliminar tarea"
              style={{ color: '#FB7185' }}
            >
              <Trash2 size={16} />
            </button>

            <button onClick={onClose} className="btn-icon" title="Cerrar panel">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Title input */}
          <input
            type="text"
            value={task.title}
            onChange={(e) => onUpdateTask({ ...task, title: e.target.value })}
            className="form-input"
            style={{
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              background: 'transparent',
              borderColor: 'transparent',
              padding: '4px 0',
              color: 'var(--text-primary)'
            }}
          />

          {/* Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '130px 1fr',
            gap: '12px',
            alignItems: 'center',
            background: 'var(--bg-card)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Responsable</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={task.assignedTo}
                onChange={(e) => onUpdateTask({ ...task, assignedTo: e.target.value })}
                className="form-input"
                style={{ height: '28px', fontSize: '12px', width: '180px' }}
              />
            </div>

            <span style={{ color: 'var(--text-muted)' }}>Fecha Límite</span>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => onUpdateTask({ ...task, dueDate: e.target.value })}
              className="form-input"
              style={{ height: '28px', fontSize: '12px', width: '180px' }}
            />

            <span style={{ color: 'var(--text-muted)' }}>Prioridad</span>
            <select
              value={task.priority}
              onChange={(e) => onUpdateTask({ ...task, priority: e.target.value as TaskPriority })}
              className="form-input"
              style={{ height: '28px', fontSize: '12px', width: '180px' }}
            >
              <option value="Urgente">Urgente</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>

            <span style={{ color: 'var(--text-muted)' }}>Proyecto</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: project.color }} />
              <span>{project.name}</span>
              <span className="badge badge-indigo" style={{ fontSize: '9px', padding: '1px 5px' }}>
                {project.supabaseSchema || project.slug}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Descripción / Requisitos de la Tarea:
            </label>
            <textarea
              rows={4}
              value={task.description}
              onChange={(e) => onUpdateTask({ ...task, description: e.target.value })}
              placeholder="Escribe los requisitos técnicos o instrucciones..."
              className="form-input"
              style={{ fontSize: '13px', lineHeight: 1.5 }}
            />
          </div>

          {/* ========================================================================= */}
          {/* SECTION: ATTACHMENTS, IMAGES, VOICE AUDIO NOTES & LINKS                   */}
          {/* ========================================================================= */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Paperclip size={16} color="#38BDF8" />
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Adjuntos & Archivos Multimedia ({attachments.length})
                </label>
              </div>

              {/* Action Buttons: Add File, Record Voice, Add Link */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  style={{ display: 'none' }}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  title="Subir archivos o imágenes"
                >
                  <Plus size={12} />
                  <span>Subir Archivo / Foto</span>
                </button>

                {isRecordingAudio ? (
                  <button
                    onClick={handleStopAudioRecording}
                    className="btn btn-primary"
                    style={{ padding: '4px 10px', fontSize: '11px', background: '#EF4444', animation: 'pulse 1.5s infinite' }}
                  >
                    <Square size={12} />
                    <span>Parar ({formatTimer(recordingDuration)})</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartAudioRecording}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    title="Grabar nota de audio"
                  >
                    <Mic size={12} color="#EC4899" />
                    <span>Grabar Audio</span>
                  </button>
                )}

                <button
                  onClick={() => setShowAddLinkForm(!showAddLinkForm)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  title="Añadir enlace web / Drive"
                >
                  <LinkIcon size={12} />
                  <span>Enlace</span>
                </button>
              </div>
            </div>

            {/* Audio Recording Active Banner */}
            {isRecordingAudio && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FCA5A5'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', animation: 'ping 1s infinite' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Grabando audio en directo: {formatTimer(recordingDuration)}</span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={handleCancelAudioRecording} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>
                    Cancelar
                  </button>
                  <button onClick={handleStopAudioRecording} className="btn btn-primary" style={{ padding: '2px 8px', fontSize: '11px', background: '#EF4444' }}>
                    Guardar Nota
                  </button>
                </div>
              </div>
            )}

            {/* Add Link Form */}
            {showAddLinkForm && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <input
                  type="text"
                  placeholder="URL del enlace (ej. https://drive.google.com/...)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="form-input"
                  style={{ height: '30px', fontSize: '12px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Título descriptivo (ej. Carpeta de Especificación)"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="form-input"
                    style={{ height: '30px', fontSize: '12px', flex: 1 }}
                  />
                  <button onClick={handleAddLink} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>
                    Añadir Enlace
                  </button>
                  <button onClick={() => setShowAddLinkForm(false)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Attachments List */}
            {attachments.length === 0 ? (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '12px'
              }}>
                No hay archivos ni notas de audio adjuntas. Haz clic en <strong>Subir Archivo</strong> o <strong>Grabar Audio</strong> para añadir material de referencia a la tarjeta.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {attachments.map(att => {
                  return (
                    <div
                      key={att.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          {att.type === 'image' && <ImageIcon size={16} color="#38BDF8" />}
                          {att.type === 'audio' && <Mic size={16} color="#EC4899" />}
                          {att.type === 'document' && <FileText size={16} color="#A78BFA" />}
                          {att.type === 'link' && <ExternalLink size={16} color="#10B981" />}
                          {att.type === 'file' && <Paperclip size={16} color="#F59E0B" />}

                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {att.name}
                          </span>
                          {att.size && (
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({att.size})</span>
                          )}
                        </div>

                        {/* Action buttons per attachment */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {att.type === 'link' ? (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-icon"
                              style={{ width: '24px', height: '24px', color: '#38BDF8' }}
                              title="Abrir enlace"
                            >
                              <ExternalLink size={13} />
                            </a>
                          ) : (
                            <a
                              href={att.url}
                              download={att.name}
                              className="btn-icon"
                              style={{ width: '24px', height: '24px', color: '#38BDF8' }}
                              title="Descargar archivo"
                            >
                              <Download size={13} />
                            </a>
                          )}

                          <button
                            onClick={() => handleDeleteAttachment(att.id)}
                            className="btn-icon"
                            style={{ width: '24px', height: '24px', color: '#FB7185' }}
                            title="Eliminar adjunto"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Image Preview Thumbnail */}
                      {att.type === 'image' && (
                        <div
                          onClick={() => setPreviewImageModal(att.url)}
                          style={{
                            maxWidth: '100%',
                            height: '140px',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: '#070A10',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          <img src={att.url} alt={att.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}

                      {/* Audio Player */}
                      {att.type === 'audio' && (
                        <div style={{
                          background: 'rgba(236, 72, 153, 0.08)',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <audio controls src={att.url} style={{ width: '100%', height: '32px' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Code Prompt Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#38BDF8" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Prompt de Tarea para Antigravity
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setShowAIPrompt(!showAIPrompt)}
                  className="btn btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '11px' }}
                >
                  {showAIPrompt ? 'Ocultar' : 'Ver Prompt'}
                </button>
                <button
                  onClick={handleCopyTaskPrompt}
                  className="btn btn-primary"
                  style={{ padding: '3px 8px', fontSize: '11px' }}
                >
                  {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedPrompt ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {showAIPrompt && (
              <pre style={{
                background: '#070A10',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#E2E8F0',
                whiteSpace: 'pre-wrap',
                maxHeight: '180px',
                overflowY: 'auto'
              }}>
                {taskPrompt}
              </pre>
            )}
          </div>

          {/* Directives Checklist */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <ShieldCheck size={15} color="#10B981" />
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Checklist de Directrices Drive para esta Tarea:
              </label>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={task.directivesChecked.supabaseSchema}
                  onChange={() => handleToggleDirectiveCheck('supabaseSchema')}
                />
                <span>🗄️ Esquema Supabase <code>{project.supabaseSchema || project.slug}</code> & RLS Estricto</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={task.directivesChecked.securityAuth}
                  onChange={() => handleToggleDirectiveCheck('securityAuth')}
                />
                <span>🛡️ Seguridad y Route Guards (JWT / Validación Zod)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={task.directivesChecked.aiStreaming}
                  onChange={() => handleToggleDirectiveCheck('aiStreaming')}
                />
                <span>🤖 IA Streaming SSE y claves en Edge/Backend</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={task.directivesChecked.rgpdLegal}
                  onChange={() => handleToggleDirectiveCheck('rgpdLegal')}
                />
                <span>⚖️ RGPD Toni (DNI 34799350M) y Sello "By Toni"</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={task.directivesChecked.driveSync}
                  onChange={() => handleToggleDirectiveCheck('driveSync')}
                />
                <span>📂 Sincronizado en Registro_Proyectos_Toni.csv</span>
              </label>
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={15} color="#6366F1" />
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Subtareas ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
              {task.subtasks.map(st => (
                <div
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                    />
                    <span style={{
                      fontSize: '12px',
                      color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: st.completed ? 'line-through' : 'none'
                    }}>
                      {st.title}
                    </span>
                  </label>

                  <button
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="btn-icon"
                    style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Añadir subtarea..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtask();
                }}
                className="form-input"
                style={{ height: '30px', fontSize: '12px' }}
              />
              <button
                onClick={handleAddSubtask}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                <Plus size={13} />
                <span>Añadir</span>
              </button>
            </div>
          </div>

          {/* Comments & Activity Stream */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <MessageSquare size={15} color="#38BDF8" />
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Comentarios & Registro de Actividad
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {task.comments.map(c => (
                <div
                  key={c.id}
                  style={{
                    background: 'var(--bg-card)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.avatar} {c.author}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {c.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input box */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Escribe un comentario o nota para el equipo..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment();
                }}
                className="form-input"
                style={{ height: '32px', fontSize: '12px' }}
              />
              <button
                onClick={handleAddComment}
                className="btn btn-primary"
                style={{ padding: '4px 10px' }}
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {previewImageModal && (
        <>
          <div className="drawer-backdrop" style={{ zIndex: 1200 }} onClick={() => setPreviewImageModal(null)} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            zIndex: 1201,
            background: '#070A10',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
              <button onClick={() => setPreviewImageModal(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <img src={previewImageModal} alt="Preview" style={{ maxWidth: '85vw', maxHeight: '80vh', display: 'block', margin: '0 auto 12px' }} />
          </div>
        </>
      )}
    </>
  );
};
