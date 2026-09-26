import React, { useState, useRef, useEffect } from 'react';
import { Task, Subtask, TaskAttachment } from '../../types/project';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Edit2, Check, Plus, X, Image as ImageIcon, CheckSquare, AlignLeft, Paperclip, Trash2 } from 'lucide-react';
import Xarrow, { Xwrapper } from 'react-xarrows';

interface ColumnData {
  id: string;
  name: string;
  taskIds: string[];
}

interface DualBoardViewProps {
  projectId: string;
  tasks: Task[];
}

export const DualBoardView: React.FC<DualBoardViewProps> = ({ projectId, tasks: propTasks }) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'mindmap'>('kanban');
  const [isBrowser, setIsBrowser] = useState(false);
  
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [columns, setColumns] = useState<ColumnData[]>([]);
  
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColName, setEditingColName] = useState<string>('');

  // Task Modal State
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    setIsBrowser(true);
    const taskMap: { [key: string]: Task } = {};
    propTasks.forEach(t => { taskMap[t.id] = t; });
    setTasks(taskMap);

    const cols = [
      { id: 'col-1', name: 'Backlog', taskIds: propTasks.filter(t => (t.status as any) === 'pending' || t.status === 'ideas_proposals').map(t => t.id) },
      { id: 'col-2', name: 'Especificación', taskIds: propTasks.filter(t => t.status === 'specification').map(t => t.id) },
      { id: 'col-3', name: 'En Desarrollo', taskIds: propTasks.filter(t => t.status === 'in_development').map(t => t.id) },
      { id: 'col-4', name: 'Revisión QA', taskIds: propTasks.filter(t => t.status === 'bugs_errors').map(t => t.id) },
      { id: 'col-5', name: 'Listo', taskIds: propTasks.filter(t => t.status === 'completed').map(t => t.id) },
    ];
    
    const assignedIds = new Set(cols.flatMap(c => c.taskIds));
    const unassignedIds = propTasks.filter(t => !assignedIds.has(t.id)).map(t => t.id);
    cols[0].taskIds.push(...unassignedIds);
    setColumns(cols);
  }, [propTasks]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'column') {
      const newCols = Array.from(columns);
      const [removed] = newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, removed);
      setColumns(newCols);
      return;
    }

    const startColIndex = columns.findIndex(c => c.id === source.droppableId);
    const finishColIndex = columns.findIndex(c => c.id === destination.droppableId);
    const startCol = columns[startColIndex];
    const finishCol = columns[finishColIndex];

    if (startCol.id === finishCol.id) {
      const newTaskIds = Array.from(startCol.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newCols = [...columns];
      newCols[startColIndex] = { ...startCol, taskIds: newTaskIds };
      setColumns(newCols);
    } else {
      const startTaskIds = Array.from(startCol.taskIds);
      startTaskIds.splice(source.index, 1);
      const finishTaskIds = Array.from(finishCol.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newCols = [...columns];
      newCols[startColIndex] = { ...startCol, taskIds: startTaskIds };
      newCols[finishColIndex] = { ...finishCol, taskIds: finishTaskIds };
      setColumns(newCols);
    }
  };

  const saveColumnName = (colId: string) => {
    if (editingColName.trim()) {
      setColumns(cols => cols.map(c => c.id === colId ? { ...c, name: editingColName.trim() } : c));
    }
    setEditingColId(null);
  };

  const handleAddTask = (colId: string) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      projectId,
      sectionId: colId,
      title: 'Nueva Tarea',
      description: '',
      status: 'pending' as any,
      priority: 'Media',
      assignedTo: 'Unassigned',
      dueDate: '',
      subtasks: [],
      tags: [],
      directivesChecked: { supabaseSchema: false, rlsStrict: false, securityAuth: false, aiStreaming: false, rgpdLegal: false, driveSync: false },
      comments: [],
      activities: [],
      createdAt: new Date().toISOString(),
      attachments: []
    };
    
    setTasks(prev => ({ ...prev, [newTask.id]: newTask }));
    setColumns(cols => cols.map(c => {
      if (c.id === colId) {
        return { ...c, taskIds: [...c.taskIds, newTask.id] };
      }
      return c;
    }));
    
    setActiveTask(newTask);
    setIsTaskModalOpen(true);
  };

  const updateActiveTask = (updates: Partial<Task>) => {
    if (!activeTask) return;
    const updated = { ...activeTask, ...updates };
    setActiveTask(updated);
    setTasks(prev => ({ ...prev, [updated.id]: updated }));
  };

  const handleAddSubtask = () => {
    const newSubtask: Subtask = { id: `st_${Date.now()}`, title: 'Nuevo elemento', completed: false };
    updateActiveTask({ subtasks: [...(activeTask?.subtasks || []), newSubtask] });
  };

  const toggleSubtask = (id: string) => {
    if (!activeTask) return;
    const updated = activeTask.subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st);
    updateActiveTask({ subtasks: updated });
  };

  const updateSubtaskTitle = (id: string, title: string) => {
    if (!activeTask) return;
    const updated = activeTask.subtasks.map(st => st.id === id ? { ...st, title } : st);
    updateActiveTask({ subtasks: updated });
  };

  const deleteSubtask = (id: string) => {
    if (!activeTask) return;
    updateActiveTask({ subtasks: activeTask.subtasks.filter(st => st.id !== id) });
  };

  const handleSimulateAddImage = () => {
    const newAttachment: TaskAttachment = {
      id: `att_${Date.now()}`,
      name: 'Captura_Diseño.png',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=300&q=80',
      uploadedAt: new Date().toISOString()
    };
    updateActiveTask({ attachments: [...(activeTask?.attachments || []), newAttachment] });
  };

  // Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.dnd-draggable') || (e.target as HTMLElement).closest('.modal-overlay')) return;
    isDown.current = true;
    if (!scrollRef.current) return;
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'auto';
      scrollRef.current.style.userSelect = 'auto';
    }
  };
  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'auto';
      scrollRef.current.style.userSelect = 'auto';
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (!isBrowser) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px', padding: '10px', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-glass-heavy)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Tablero de Mando</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0 0 0' }}>Gestiona las tareas en modo Kanban arrastrable</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '4px', border: '1px solid var(--border-subtle)' }}>
          <button onClick={() => setViewMode('kanban')} className={viewMode === 'kanban' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ padding: '8px 20px', border: 'none', borderRadius: 'var(--radius-sm)' }}>Kanban</button>
          <button onClick={() => setViewMode('mindmap')} className={viewMode === 'mindmap' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ padding: '8px 20px', border: 'none', borderRadius: 'var(--radius-sm)', marginLeft: '4px' }}>Mapa Mental</button>
        </div>
      </div>

      {/* Content Area */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
        style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', paddingBottom: '20px' }}
      >
        {viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', gap: '16px', height: '100%', minWidth: 'max-content' }}>
                  {columns.map((col, index) => (
                    <Draggable key={col.id} draggableId={col.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef} {...provided.draggableProps} className="dnd-draggable"
                          style={{
                            width: '320px', display: 'flex', flexDirection: 'column', background: 'var(--bg-glass)',
                            border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xl)',
                            padding: '16px', maxHeight: '100%', boxShadow: snapshot.isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                            ...provided.draggableProps.style
                          }}
                        >
                          <div {...provided.dragHandleProps} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', cursor: 'grab' }}>
                            {editingColId === col.id ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <input autoFocus value={editingColName} onChange={e => setEditingColName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveColumnName(col.id)} className="form-input" style={{ flex: 1, padding: '4px 8px', fontSize: '14px' }} />
                                <button onClick={() => saveColumnName(col.id)} style={{ background: 'none', border: 'none', color: '#10B981', cursor: 'pointer' }}><Check size={16} /></button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{col.name}</h3>
                                <button onClick={() => { setEditingColId(col.id); setEditingColName(col.name); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}><Edit2 size={12} /></button>
                              </div>
                            )}
                            <span style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 'bold' }}>{col.taskIds.length}</span>
                          </div>
                          
                          <Droppable droppableId={col.id} type="task">
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: snapshot.isDraggingOver ? 'var(--border-subtle)' : 'transparent', borderRadius: 'var(--radius-lg)', minHeight: '100px' }}>
                                {col.taskIds.map((taskId, index) => {
                                  const task = tasks[taskId];
                                  if (!task) return null;
                                  
                                  const imagesCount = task.attachments?.filter(a => a.type === 'image').length || 0;
                                  const subtasksTotal = task.subtasks?.length || 0;
                                  const subtasksCompleted = task.subtasks?.filter(s => s.completed).length || 0;

                                  return (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="dnd-draggable"
                                          onClick={() => { setActiveTask(task); setIsTaskModalOpen(true); }}
                                          style={{
                                            background: snapshot.isDragging ? 'var(--bg-card-hover)' : 'var(--bg-card)', border: '1px solid',
                                            borderColor: snapshot.isDragging ? 'var(--accent-primary)' : 'var(--border-medium)',
                                            padding: '16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                                            boxShadow: snapshot.isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                                            ...provided.draggableProps.style
                                          }}
                                        >
                                          {task.attachments && task.attachments.length > 0 && task.attachments[0].type === 'image' && (
                                            <div style={{ width: '100%', height: '120px', borderRadius: 'var(--radius-md)', marginBottom: '12px', backgroundImage: `url(${task.attachments[0].url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                          )}
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <span className="badge badge-indigo">{task.priority || 'Normal'}</span>
                                            <span style={{ fontSize: '16px' }}>{task.assignedAvatar || '👤'}</span>
                                          </div>
                                          <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', lineHeight: 1.4 }}>{task.title}</h4>
                                          {task.description && (
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</p>
                                          )}
                                          <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '11px', marginTop: 'auto' }}>
                                            {subtasksTotal > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckSquare size={12} /> {subtasksCompleted}/{subtasksTotal}</span>}
                                            {imagesCount > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ImageIcon size={12} /> {imagesCount}</span>}
                                            {task.description && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlignLeft size={12} /></span>}
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                                <button onClick={() => handleAddTask(col.id)} className="btn btn-secondary" style={{ marginTop: '8px', padding: '12px', width: '100%', justifyContent: 'flex-start', borderStyle: 'dashed' }}>
                                  <Plus size={16} /> Añadir Tarjeta
                                </button>
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <Xwrapper>
            <div style={{ display: 'flex', alignItems: 'center', padding: '60px', gap: '120px', minWidth: 'max-content', height: 'fit-content' }}>
              
              {/* Root Node */}
              <div id="mindmap-root" style={{
                background: 'var(--accent-primary)', color: 'white', padding: '24px 32px',
                borderRadius: 'var(--radius-xl)', fontSize: '20px', fontWeight: 'bold',
                boxShadow: 'var(--shadow-glow)', border: '2px solid var(--border-medium)',
                zIndex: 10
              }}>
                El Cerebro Central
              </div>

              {/* Columns & Tasks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                {columns.map(col => (
                  <div key={col.id} style={{ display: 'flex', alignItems: 'center', gap: '100px' }}>
                    
                    {/* Column Node */}
                    <div id={`mm-col-${col.id}`} style={{
                      background: 'var(--bg-glass-heavy)',
                      padding: '16px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-medium)',
                      fontWeight: 600, color: 'var(--text-primary)', zIndex: 10, minWidth: '160px', textAlign: 'center'
                    }}>
                      {col.name}
                    </div>
                    <Xarrow 
                      start="mindmap-root" end={`mm-col-${col.id}`} 
                      color="#8B5CF6" strokeWidth={3} path="smooth" 
                      startAnchor="right" endAnchor="left" curveness={0.8}
                    />

                    {/* Tasks Nodes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {col.taskIds.map(taskId => {
                        const task = tasks[taskId];
                        if (!task) return null;
                        return (
                          <React.Fragment key={taskId}>
                            <div 
                              id={`mm-task-${taskId}`} 
                              onClick={() => { setActiveTask(task); setIsTaskModalOpen(true); }}
                              style={{
                                background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                                fontSize: '13px', cursor: 'pointer', zIndex: 10, minWidth: '220px',
                                maxWidth: '300px', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span className="badge badge-indigo" style={{ fontSize: '10px' }}>{task.priority || 'Normal'}</span>
                              </div>
                              <div style={{ fontWeight: 500, lineHeight: 1.4 }}>{task.title}</div>
                            </div>
                            <Xarrow 
                              start={`mm-col-${col.id}`} end={`mm-task-${taskId}`} 
                              color="var(--border-medium)" strokeWidth={2} path="smooth" 
                              startAnchor="right" endAnchor="left" curveness={0.6}
                            />
                          </React.Fragment>
                        );
                      })}
                      {col.taskIds.length === 0 && (
                        <div id={`mm-empty-${col.id}`} style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', background: 'transparent' }}>
                          Vacío
                        </div>
                      )}
                    </div>
                    {col.taskIds.length === 0 && (
                      <Xarrow start={`mm-col-${col.id}`} end={`mm-empty-${col.id}`} color="var(--border-medium)" strokeWidth={1} path="straight" startAnchor="right" endAnchor="left" />
                    )}

                  </div>
                ))}
              </div>

            </div>
          </Xwrapper>
        )}
      </div>

      {/* Task Edit Modal */}
      {isTaskModalOpen && activeTask && (
        <div className="modal-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-primary)', opacity: 0.95, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--bg-glass-heavy)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xl)', width: '600px', maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <input
                value={activeTask.title}
                onChange={e => updateActiveTask({ title: e.target.value })}
                className="form-input"
                style={{ fontSize: '20px', fontWeight: 'bold', border: 'none', background: 'transparent', padding: 0, flex: 1, outline: 'none', color: 'var(--text-primary)' }}
                placeholder="Título de la tarjeta..."
              />
              <button onClick={() => setIsTaskModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '16px' }}><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Description */}
              <div>
                <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', color: 'var(--text-secondary)' }}><AlignLeft size={14} /> Descripción</h4>
                <textarea
                  value={activeTask.description || ''}
                  onChange={e => updateActiveTask({ description: e.target.value })}
                  className="form-input"
                  placeholder="Añade una descripción más detallada..."
                  style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                />
              </div>

              {/* Checklist */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px 0' }}>
                  <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-secondary)' }}><CheckSquare size={14} /> Checklist</h4>
                  <button onClick={handleAddSubtask} className="btn-link" style={{ fontSize: '12px' }}>+ Añadir elemento</button>
                </div>
                
                {activeTask.subtasks && activeTask.subtasks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeTask.subtasks.map((st) => (
                      <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                        <input type="checkbox" checked={st.completed} onChange={() => toggleSubtask(st.id)} style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }} />
                        <input
                          value={st.title}
                          onChange={e => updateSubtaskTitle(st.id, e.target.value)}
                          style={{ flex: 1, background: 'transparent', border: 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: st.completed ? 'line-through' : 'none', outline: 'none', fontSize: '14px' }}
                        />
                        <button onClick={() => deleteSubtask(st.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>No hay elementos en el checklist.</p>
                )}
              </div>

              {/* Images/Attachments */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px 0' }}>
                  <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-secondary)' }}><Paperclip size={14} /> Adjuntos e Imágenes</h4>
                  <button onClick={handleSimulateAddImage} className="btn-link" style={{ fontSize: '12px' }}>+ Añadir Portada / Imagen</button>
                </div>
                {activeTask.attachments && activeTask.attachments.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {activeTask.attachments.map(att => (
                      <div key={att.id} style={{ position: 'relative', width: '140px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-medium)' }}>
                        {att.type === 'image' ? (
                          <img src={att.url} alt={att.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', fontSize: '12px' }}>{att.name}</div>
                        )}
                        <button 
                          onClick={() => updateActiveTask({ attachments: activeTask.attachments?.filter(a => a.id !== att.id) })}
                          style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>No hay archivos adjuntos.</p>
                )}
              </div>

            </div>
            
            {/* Modal Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsTaskModalOpen(false)} className="btn btn-primary" style={{ padding: '8px 24px' }}>Guardar y Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
