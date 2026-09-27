import React, { useState, useEffect } from 'react';
import { 
  Plus, CheckCircle2, Circle, Clock, Tag, User, 
  Calendar, CheckSquare, Sparkles, ChevronRight, ChevronLeft,
  Paperclip, Image as ImageIcon, Mic, FileText, Link2, GripVertical,
  Shield, Eye, Lock, HelpCircle, Lightbulb, Bug, MessageSquare,
  ArrowLeftRight, RotateCcw, CheckCheck
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Project } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface BoardViewProps {
  project?: Project;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onAddTaskToStatus: (status: TaskStatus, title: string) => void;
  onOpenHelpChat?: () => void;
  isAdminMode?: boolean;
  onToggleAdminMode?: () => void;
}

export interface KanbanColumnDef {
  id: TaskStatus;
  title: string;
  color: string;
  bg: string;
  icon: string;
  description: string;
}

const DEFAULT_ROADMAP_COLUMNS: KanbanColumnDef[] = [
  { 
    id: 'ideas_proposals', 
    title: '💡 Ideas & Mejoras', 
    color: '#8B5CF6', 
    bg: 'rgba(139, 92, 246, 0.08)',
    icon: '💡',
    description: 'Propuestas recibidas desde el Chat de Ayuda o planteadas en el roadmap'
  },
  { 
    id: 'bugs_errors', 
    title: '🐛 Errores & Bugs', 
    color: '#EF4444', 
    bg: 'rgba(239, 68, 68, 0.08)',
    icon: '🐛',
    description: 'Incidencias técnicas reportadas por usuarios desde la zona de ayuda'
  },
  { 
    id: 'approved', 
    title: '✨ Aprobadas', 
    color: '#EC4899', 
    bg: 'rgba(236, 72, 153, 0.08)',
    icon: '✨',
    description: 'Ideas, mejoras y correcciones aprobadas por Toni listas para especificación o desarrollo'
  },
  { 
    id: 'specification', 
    title: '📐 Especificación & Drive', 
    color: '#6366F1', 
    bg: 'rgba(99, 102, 241, 0.08)',
    icon: '📐',
    description: 'Análisis y cumplimiento de directrices maestras de Google Drive'
  },
  { 
    id: 'in_development', 
    title: '⚡ En Desarrollo', 
    color: '#06B6D4', 
    bg: 'rgba(6, 182, 212, 0.08)',
    icon: '⚡',
    description: 'En implementación activa de código y lógica'
  },
  { 
    id: 'review_qa', 
    title: '🔍 Revisión & QA', 
    color: '#F59E0B', 
    bg: 'rgba(245, 158, 11, 0.08)',
    icon: '🔍',
    description: 'Validación técnica, pruebas funcionales y tests de regresión'
  },
  { 
    id: 'completed', 
    title: '✅ Listo / En Producción', 
    color: '#10B981', 
    bg: 'rgba(16, 185, 129, 0.08)',
    icon: '✅',
    description: 'Funcionalidades y correcciones desplegadas activas en la app'
  }
];

const COLUMN_ORDER_STORAGE_KEY = 'bytoni_kanban_column_order_v2';

export const BoardView: React.FC<BoardViewProps> = ({
  project,
  tasks,
  onSelectTask,
  onUpdateTaskStatus,
  onAddTaskToStatus,
  onOpenHelpChat,
  isAdminMode = true,
  onToggleAdminMode
}) => {
  const [localAdminMode, setLocalAdminMode] = useState(isAdminMode);
  const [columns, setColumns] = useState<KanbanColumnDef[]>(() => {
    try {
      const saved = localStorage.getItem(COLUMN_ORDER_STORAGE_KEY);
      if (saved) {
        const orderIds: string[] = JSON.parse(saved);
        const mapped = orderIds
          .map(id => DEFAULT_ROADMAP_COLUMNS.find(c => c.id === id))
          .filter(Boolean) as KanbanColumnDef[];
        
        // Check if any new column like 'approved' was missing
        DEFAULT_ROADMAP_COLUMNS.forEach(c => {
          if (!mapped.some(m => m.id === c.id)) {
            const approvedIdx = c.id === 'approved' ? 2 : mapped.length;
            mapped.splice(approvedIdx, 0, c);
          }
        });

        if (mapped.length > 0) return mapped;
      }
    } catch (e) {
      console.error('Error loading column order:', e);
    }
    return DEFAULT_ROADMAP_COLUMNS;
  });

  const [addingStatus, setAddingStatus] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState('');
  
  // Drag states for tasks
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<TaskStatus | null>(null);

  // Drag states for column reordering
  const [draggedColumnId, setDraggedColumnId] = useState<TaskStatus | null>(null);
  const [dragOverColumnTargetId, setDragOverColumnTargetId] = useState<TaskStatus | null>(null);

  const effectiveAdmin = onToggleAdminMode !== undefined ? isAdminMode : localAdminMode;

  // Save column order to localStorage whenever it changes
  useEffect(() => {
    try {
      const orderIds = columns.map(c => c.id);
      localStorage.setItem(COLUMN_ORDER_STORAGE_KEY, JSON.stringify(orderIds));
    } catch (e) {
      console.error('Error saving column order:', e);
    }
  }, [columns]);

  const handleAdd = (status: TaskStatus) => {
    if (!newTitle.trim()) return;
    onAddTaskToStatus(status, newTitle.trim());
    setNewTitle('');
    setAddingStatus(null);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgente': return 'badge-rose';
      case 'Alta': return 'badge-amber';
      case 'Media': return 'badge-indigo';
      case 'Baja': return 'badge-cyan';
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    const currentIdx = columns.findIndex(c => c.id === current);
    return currentIdx >= 0 && currentIdx < columns.length - 1 ? columns[currentIdx + 1].id : null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    const currentIdx = columns.findIndex(c => c.id === current);
    return currentIdx > 0 ? columns[currentIdx - 1].id : null;
  };

  // ==========================================
  // COLUMN REORDERING HANDLERS
  // ==========================================
  const moveColumn = (colId: TaskStatus, direction: 'left' | 'right') => {
    const idx = columns.findIndex(c => c.id === colId);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= columns.length) return;

    const updated = [...columns];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setColumns(updated);
  };

  const resetColumnOrder = () => {
    setColumns(DEFAULT_ROADMAP_COLUMNS);
    try {
      localStorage.removeItem(COLUMN_ORDER_STORAGE_KEY);
    } catch (e) {}
  };

  const handleColumnDragStart = (e: React.DragEvent, colId: TaskStatus) => {
    if (!effectiveAdmin) return;
    e.dataTransfer.setData('application/bytoni-column', colId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedColumnId(colId);
  };

  const handleColumnDragOver = (e: React.DragEvent, targetColId: TaskStatus) => {
    if (e.dataTransfer.types.includes('application/bytoni-column')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverColumnTargetId !== targetColId) {
        setDragOverColumnTargetId(targetColId);
      }
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetColId: TaskStatus) => {
    if (e.dataTransfer.types.includes('application/bytoni-column')) {
      e.preventDefault();
      const sourceColId = (e.dataTransfer.getData('application/bytoni-column') || draggedColumnId) as TaskStatus;
      
      if (sourceColId && sourceColId !== targetColId) {
        const sourceIdx = columns.findIndex(c => c.id === sourceColId);
        const targetIdx = columns.findIndex(c => c.id === targetColId);
        if (sourceIdx !== -1 && targetIdx !== -1) {
          const updated = [...columns];
          const [moved] = updated.splice(sourceIdx, 1);
          updated.splice(targetIdx, 0, moved);
          setColumns(updated);
        }
      }
      setDraggedColumnId(null);
      setDragOverColumnTargetId(null);
    }
  };

  // ==========================================
  // TASK DRAG & DROP HANDLERS
  // ==========================================
  const handleTaskDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    if (!effectiveAdmin) return;
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleTaskDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColId(null);
    setDraggedColumnId(null);
    setDragOverColumnTargetId(null);
  };

  const handleTaskDragOver = (e: React.DragEvent<HTMLDivElement>, colId: TaskStatus) => {
    if (!effectiveAdmin) return;
    if (e.dataTransfer.types.includes('text/plain')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverColId !== colId) {
        setDragOverColId(colId);
      }
    }
  };

  const handleTaskDragLeave = (e: React.DragEvent<HTMLDivElement>, colId: TaskStatus) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleTaskDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    if (!effectiveAdmin) return;
    if (e.dataTransfer.types.includes('text/plain')) {
      e.preventDefault();
      setDragOverColId(null);
      const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
      
      if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== targetStatus) {
          if (targetStatus === 'completed') {
            triggerCelebration();
          }
          onUpdateTaskStatus(taskId, targetStatus);
        }
      }
      setDraggedTaskId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Roadmap Top Control & Permission Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 18px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={16} color="#818CF8" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Hoja de Ruta & Tablero de Evolución {project ? `· ${project.name}` : ''}
              </h3>
              <span className={`badge ${effectiveAdmin ? 'badge-indigo' : 'badge-emerald'}`} style={{ fontSize: '10px' }}>
                {effectiveAdmin ? '🛡️ Modo Toni / Admin' : '👁️ Vista Visitante (Solo Lectura)'}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
              {effectiveAdmin 
                ? 'Puedes arrastrar tareas entre etapas y también arrastrar las cabeceras de columnas para reordenar el tablero a tu gusto.' 
                : 'Modo lectura para usuarios: Las propuestas y errores se envían exclusivamente desde el Chat de Ayuda.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {effectiveAdmin && (
            <button
              onClick={resetColumnOrder}
              className="btn btn-secondary"
              style={{ fontSize: '11px', padding: '6px 10px' }}
              title="Restablecer el orden original de las columnas"
            >
              <RotateCcw size={12} />
              <span>Restablecer Columnas</span>
            </button>
          )}

          {onOpenHelpChat && (
            <button
              onClick={onOpenHelpChat}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}
            >
              <HelpCircle size={14} />
              <span>Zona de Ayuda & Feedback</span>
            </button>
          )}

          <button
            onClick={() => {
              if (onToggleAdminMode) onToggleAdminMode();
              else setLocalAdminMode(!localAdminMode);
            }}
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px' }}
            title="Cambiar entre vista de usuario visitante y modo administrador"
          >
            {effectiveAdmin ? (
              <>
                <Eye size={13} color="#10B981" />
                <span>Simular Vista Usuario</span>
              </>
            ) : (
              <>
                <Shield size={13} color="#818CF8" />
                <span>Activar Modo Toni</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visitor Mode Information Banner */}
      {!effectiveAdmin && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#7DD3FC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={13} />
            <span><strong>Modo Consulta Activo:</strong> Los usuarios solo pueden ver y leer el estado de las tareas. Las ideas y errores se proponen desde el asistente.</span>
          </div>
          {onOpenHelpChat && (
            <button
              onClick={onOpenHelpChat}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', textDecoration: 'underline', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
            >
              Abrir Chat de Ayuda ➔
            </button>
          )}
        </div>
      )}

      {/* 7 Reorderable Kanban Columns Roadmap Grid */}
      <div style={{
        display: 'flex',
        gap: '14px',
        overflowX: 'auto',
        paddingBottom: '20px',
        minHeight: 'calc(100vh - 250px)'
      }}>
        {columns.map((col, colIdx) => {
          // Filter tasks for this column (supporting legacy 'backlog' into 'ideas_proposals')
          const colTasks = tasks.filter(t => {
            if (col.id === 'ideas_proposals' && (t.status === 'ideas_proposals' || (t.status as string) === 'backlog')) return true;
            return t.status === col.id;
          });

          const isColumnHovered = effectiveAdmin && dragOverColId === col.id;
          const isColumnReorderHovered = effectiveAdmin && dragOverColumnTargetId === col.id;
          const isColumnBeingDragged = draggedColumnId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                handleTaskDragOver(e, col.id);
                handleColumnDragOver(e, col.id);
              }}
              onDragLeave={(e) => handleTaskDragLeave(e, col.id)}
              onDrop={(e) => {
                handleTaskDrop(e, col.id);
                handleColumnDrop(e, col.id);
              }}
              style={{
                flex: '0 0 310px',
                background: isColumnHovered ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-glass)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: isColumnReorderHovered
                  ? '1px solid #EC4899'
                  : isColumnHovered 
                  ? '1px dashed var(--accent-primary)' 
                  : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 250px)',
                overflow: 'hidden',
                opacity: isColumnBeingDragged ? 0.35 : 1,
                transform: isColumnReorderHovered ? 'scale(1.01)' : 'none',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {/* Column Header (Draggable for column reordering) */}
              <div 
                draggable={effectiveAdmin}
                onDragStart={(e) => handleColumnDragStart(e, col.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: col.bg,
                  cursor: effectiveAdmin ? 'grab' : 'default',
                  userSelect: 'none'
                }}
                title={effectiveAdmin ? 'Arrastra la cabecera para cambiar el orden de la columna' : ''}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {effectiveAdmin && (
                    <GripVertical size={14} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                  )}
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-primary)'
                  }}>
                    {col.title}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: col.color,
                    background: 'var(--bg-card)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {effectiveAdmin && (
                    <>
                      {/* Column Move Left / Right Buttons */}
                      {colIdx > 0 && (
                        <button
                          onClick={() => moveColumn(col.id, 'left')}
                          className="btn-icon"
                          style={{ width: '20px', height: '20px' }}
                          title="Mover columna a la izquierda"
                        >
                          <ChevronLeft size={12} />
                        </button>
                      )}
                      {colIdx < columns.length - 1 && (
                        <button
                          onClick={() => moveColumn(col.id, 'right')}
                          className="btn-icon"
                          style={{ width: '20px', height: '20px' }}
                          title="Mover columna a la derecha"
                        >
                          <ChevronRight size={12} />
                        </button>
                      )}

                      <button
                        onClick={() => setAddingStatus(col.id)}
                        className="btn-icon"
                        style={{ width: '22px', height: '22px', marginLeft: '2px' }}
                        title={`Añadir tarjeta a ${col.title}`}
                      >
                        <Plus size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Cards List */}
              <div style={{
                padding: '12px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                flex: 1
              }}>
                {colTasks.map(task => {
                  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                  const totalSubtasks = task.subtasks.length;
                  const directivesCount = Object.values(task.directivesChecked).filter(Boolean).length;
                  const prev = getPrevStatus(task.status);
                  const next = getNextStatus(task.status);
                  const isDragging = draggedTaskId === task.id;

                  const attachments = task.attachments || [];
                  const imageAttachment = attachments.find(a => a.type === 'image');
                  const hasAudio = attachments.some(a => a.type === 'audio');

                  return (
                    <div
                      key={task.id}
                      draggable={effectiveAdmin}
                      onDragStart={(e) => handleTaskDragStart(e, task.id)}
                      onDragEnd={handleTaskDragEnd}
                      onClick={() => onSelectTask(task)}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        cursor: effectiveAdmin ? 'grab' : 'pointer',
                        opacity: isDragging ? 0.4 : 1,
                        transform: isDragging ? 'scale(0.98)' : 'none',
                        transition: 'all var(--transition-fast)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isDragging) {
                          e.currentTarget.style.borderColor = 'var(--border-highlight)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isDragging) {
                          e.currentTarget.style.borderColor = 'var(--border-medium)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {/* Card Top: Origin Badge & Priority */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className={`badge ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.origin === 'chat_help' && (
                            <span style={{
                              fontSize: '9px',
                              color: task.reportType === 'error' ? '#F87171' : '#A78BFA',
                              background: task.reportType === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                              padding: '1px 5px',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: 700
                            }}>
                              {task.reportType === 'error' ? '🐛 Error' : '💡 Propuesta'}
                            </span>
                          )}
                          {task.status === 'approved' && (
                            <span style={{
                              fontSize: '9px',
                              color: '#F472B6',
                              background: 'rgba(236, 72, 153, 0.15)',
                              padding: '1px 5px',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: 700
                            }}>
                              ✨ Aprobada
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{
                            fontSize: '10px',
                            color: '#818CF8',
                            background: 'rgba(99, 102, 241, 0.12)',
                            padding: '1px 5px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600
                          }}>
                            {directivesCount} dir.
                          </span>
                          {effectiveAdmin && (
                            <GripVertical size={13} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                          )}
                        </div>
                      </div>

                      {/* Image Attachment Preview Thumbnail */}
                      {imageAttachment && (
                        <div style={{
                          width: '100%',
                          height: '100px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          background: '#070A10',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          <img
                            src={imageAttachment.url}
                            alt={imageAttachment.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      {/* Card Title */}
                      <h4 style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                        margin: 0,
                        lineHeight: 1.35,
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                      }}>
                        {task.title}
                      </h4>

                      {/* Subtasks Progress Bar */}
                      {totalSubtasks > 0 && (
                        <div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '10px',
                            color: 'var(--text-muted)',
                            marginBottom: '3px'
                          }}>
                            <span>Subtareas</span>
                            <span>{completedSubtasks}/{totalSubtasks}</span>
                          </div>
                          <div style={{
                            height: '4px',
                            width: '100%',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                              background: completedSubtasks === totalSubtasks ? '#10B981' : '#6366F1'
                            }} />
                          </div>
                        </div>
                      )}

                      {/* Attachments Badges */}
                      {attachments.length > 0 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap',
                          paddingTop: '2px'
                        }}>
                          <span style={{
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            color: '#38BDF8',
                            background: 'rgba(56, 189, 248, 0.1)',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-sm)'
                          }}>
                            <Paperclip size={11} />
                            <span>{attachments.length} adjunto{attachments.length > 1 ? 's' : ''}</span>
                          </span>

                          {hasAudio && (
                            <span style={{
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              color: '#EC4899',
                              background: 'rgba(236, 72, 153, 0.12)',
                              padding: '1px 6px',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: 600
                            }}>
                              <Mic size={11} />
                              <span>Audio</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Card Footer */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '6px',
                        borderTop: '1px solid var(--border-subtle)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>{task.assignedAvatar || '👤'}</span>
                          <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.assignedTo}
                          </span>
                        </div>

                        {/* Stage Move Controls (Admin only) */}
                        {effectiveAdmin && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} onClick={(e) => e.stopPropagation()}>
                            {prev && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, prev)}
                                className="btn-icon"
                                style={{ width: '20px', height: '20px' }}
                                title={`Mover a ${columns.find(c => c.id === prev)?.title || 'etapa anterior'}`}
                              >
                                <ChevronLeft size={13} />
                              </button>
                            )}
                            {next && (
                              <button
                                onClick={() => {
                                  if (next === 'completed') triggerCelebration();
                                  onUpdateTaskStatus(task.id, next);
                                }}
                                className="btn-icon"
                                style={{ width: '20px', height: '20px' }}
                                title={`Avanzar a ${columns.find(c => c.id === next)?.title || 'siguiente etapa'}`}
                              >
                                <ChevronRight size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Quick Add Card Form (Only in Admin mode) */}
                {effectiveAdmin && addingStatus === col.id ? (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <textarea
                      placeholder="Título de la tarjeta..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      autoFocus
                      rows={2}
                      className="form-input"
                      style={{ fontSize: '12px', resize: 'none' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAdd(col.id);
                        }
                        if (e.key === 'Escape') setAddingStatus(null);
                      }}
                    />
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setAddingStatus(null)}
                        className="btn btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleAdd(col.id)}
                        className="btn btn-primary"
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                ) : effectiveAdmin ? (
                  <button
                    onClick={() => setAddingStatus(col.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      background: 'transparent',
                      border: '1px dashed var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-muted)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
                  >
                    <Plus size={14} />
                    <span>Añadir tarjeta</span>
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
