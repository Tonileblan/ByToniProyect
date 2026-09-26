import React, { useState } from 'react';
import { X, CheckSquare, Sparkles, ShieldCheck } from 'lucide-react';
import { Task, Project, Section, TaskPriority, TaskStatus } from '../../types/project';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  sections: Section[];
  onSaveTask: (task: Task) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  project,
  sections,
  onSaveTask
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sectionId, setSectionId] = useState(sections[0]?.id || 'sec_1');
  const [priority, setPriority] = useState<TaskPriority>('Alta');
  const [assignedTo, setAssignedTo] = useState('Toni');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagsText, setTagsText] = useState('Core, Directrices');

  const [checkSupabase, setCheckSupabase] = useState(true);
  const [checkSecurity, setCheckSecurity] = useState(true);
  const [checkAI, setCheckAI] = useState(true);
  const [checkRGPD, setCheckRGPD] = useState(true);
  const [checkDrive, setCheckDrive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsText.split(',').map(t => t.trim()).filter(Boolean);

    const newTask: Task = {
      id: `task_${Date.now()}`,
      projectId: project.id,
      sectionId,
      title: title.trim(),
      description: description.trim() || 'Implementación técnica según directrices del proyecto.',
      status: 'in_development',
      priority,
      assignedTo: assignedTo.trim() || 'Toni',
      assignedAvatar: '👨‍💻',
      dueDate,
      startDate: new Date().toISOString().split('T')[0],
      estimatedHours: 3,
      subtasks: [
        { id: `sub_${Date.now()}_1`, title: 'Especificar arquitectura y requisitos', completed: false },
        { id: `sub_${Date.now()}_2`, title: 'Desarrollar componentes y lógica', completed: false },
        { id: `sub_${Date.now()}_3`, title: 'Validar directrices de Drive y QA', completed: false }
      ],
      tags,
      directivesChecked: {
        supabaseSchema: checkSupabase,
        rlsStrict: checkSupabase,
        securityAuth: checkSecurity,
        aiStreaming: checkAI,
        rgpdLegal: checkRGPD,
        driveSync: checkDrive
      },
      comments: [],
      activities: [
        {
          id: `act_${Date.now()}`,
          user: 'Toni',
          action: 'Creó la tarea',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    triggerCelebration();
    onSaveTask(newTask);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '600px', maxWidth: '95vw' }}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={18} color="#6366F1" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Nueva Tarea para {project.name}
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Título de la Tarea *
            </label>
            <input
              type="text"
              placeholder="ej. Integrar autenticación y route guards"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Sección / Etapa
              </label>
              <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="form-input">
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Prioridad
              </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="form-input">
                <option value="Urgente">Urgente</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Responsable
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Fecha Límite
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Descripción / Requerimientos
            </label>
            <textarea
              rows={3}
              placeholder="Instrucciones para el desarrollo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Directrices de Drive a comprobar:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={checkSupabase} onChange={(e) => setCheckSupabase(e.target.checked)} />
                <span>🗄️ Supabase RLS & Schema</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={checkSecurity} onChange={(e) => setCheckSecurity(e.target.checked)} />
                <span>🛡️ Auth & Route Guards</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={checkAI} onChange={(e) => setCheckAI(e.target.checked)} />
                <span>🤖 IA Streaming SSE</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={checkRGPD} onChange={(e) => setCheckRGPD(e.target.checked)} />
                <span>⚖️ RGPD & By Toni</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Sparkles size={14} />
              <span>Crear Tarea</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
