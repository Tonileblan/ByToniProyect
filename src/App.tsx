import React, { useState, useEffect } from 'react';
import { Project, Section, Task, DirectiveItem, ViewTab, FilterOptions, TaskStatus, TaskPriority } from './types/project';
import { storageService } from './services/storageService';
import { feedbackService, AppFeedbackPayload } from './services/feedbackService';
import { TopNavbar } from './components/layout/TopNavbar';
import { Sidebar } from './components/layout/Sidebar';
import { ProjectHeader } from './components/projects/ProjectHeader';
import { ListView } from './components/views/ListView';
import { BoardView } from './components/views/BoardView';
import { TimelineView } from './components/views/TimelineView';
import { CalendarView } from './components/views/CalendarView';
import { DashboardView } from './components/views/DashboardView';
import { DirectivesHubView } from './components/views/DirectivesHubView';
import { AIPromptStudioView } from './components/views/AIPromptStudioView';
import { MyTasksView } from './components/views/MyTasksView';
import { GlobalHomeView } from './components/views/GlobalHomeView';
import { TaskDetailDrawer } from './components/tasks/TaskDetailDrawer';
import { NewProjectModal } from './components/projects/NewProjectModal';
import { NewTaskModal } from './components/tasks/NewTaskModal';
import { AICopilotModal } from './components/common/AICopilotModal';
import { AppHelpChatModal } from './components/common/AppHelpChatModal';
import { triggerCelebration } from './common/ConfettiCelebration';

export function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [directives, setDirectives] = useState<DirectiveItem[]>([]);
  
  const [activeMainView, setActiveMainView] = useState<'dashboard' | 'my_tasks' | 'project' | 'directives' | 'ai_studio'>('project');
  const [activeProjectId, setActiveProjectId] = useState<string>('proj_bytoni');
  const [activeProjectTab, setActiveProjectTab] = useState<ViewTab>('board');
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isAICopilotModalOpen, setIsAICopilotModalOpen] = useState(false);
  const [isHelpChatModalOpen, setIsHelpChatModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    tag: 'all'
  });

  // Hydrate from Storage
  useEffect(() => {
    const loadedProjects = storageService.getProjects();
    const loadedSections = storageService.getSections();
    const loadedTasks = storageService.getTasks();
    const loadedDirectives = storageService.getDirectives();
    const savedActiveProjId = storageService.getActiveProjectId();

    setProjects(loadedProjects);
    setSections(loadedSections);
    setTasks(loadedTasks);
    setDirectives(loadedDirectives);
    setActiveProjectId(savedActiveProjId);
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (projects.length > 0) storageService.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (sections.length > 0) storageService.saveSections(sections);
  }, [sections]);

  useEffect(() => {
    if (tasks.length > 0) storageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    if (directives.length > 0) storageService.saveDirectives(directives);
  }, [directives]);

  // Listen to cross-app feedback / reports (e.g. Bicicletas-Puertanueva)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'puertanueva_issue_reports_v4' && e.newValue) {
        try {
          const reports = JSON.parse(e.newValue);
          if (Array.isArray(reports) && reports.length > 0) {
            const latest = reports[0];
            const isError = latest.type === 'error';
            const status: TaskStatus = isError ? 'bugs_errors' : 'ideas_proposals';
            
            // Check if already in tasks
            setTasks(prev => {
              const alreadyExists = prev.some(t => t.description.includes(latest.id || latest.description));
              if (alreadyExists) return prev;

              const newTask: Task = {
                id: `rep_${Date.now()}`,
                projectId: 'proj_bici',
                sectionId: 'sec_1',
                title: latest.title || (isError ? 'Error reportado en Bicicletas Puertanueva' : 'Mejora propuesta para Bicicletas Puertanueva'),
                description: `${latest.description}\n\n[ID Reporte: ${latest.id || 'N/A'}]`,
                status,
                priority: isError ? 'Alta' : 'Media',
                assignedTo: 'Toni',
                assignedAvatar: '👨‍💻',
                dueDate: new Date().toISOString().split('T')[0],
                startDate: new Date().toISOString().split('T')[0],
                subtasks: [],
                tags: [isError ? 'Bug' : 'Mejora', 'Bicicletas Puertanueva'],
                directivesChecked: {
                  supabaseSchema: true,
                  rlsStrict: true,
                  securityAuth: true,
                  aiStreaming: false,
                  rgpdLegal: true,
                  driveSync: true
                },
                attachments: [],
                comments: [
                  {
                    id: `comm_${Date.now()}`,
                    author: 'Asistente Bicicletas Puertanueva',
                    avatar: isError ? '🐛' : '💡',
                    content: `Reporte sincronizado desde el chat de ayuda de Bicicletas Puertanueva (${latest.date || 'Hoy'}).`,
                    createdAt: new Date().toISOString()
                  }
                ],
                activities: [{ id: `act_${Date.now()}`, user: 'Cliente Puertanueva', action: 'Reportó incidencia', timestamp: new Date().toISOString() }],
                origin: 'chat_help',
                reportType: latest.type,
                createdAt: new Date().toISOString()
              };
              return [newTask, ...prev];
            });
          }
        } catch (err) {
          console.error('Error parsing cross-app report:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  // Filter tasks for current project
  const projectTasks = tasks.filter(t => {
    if (activeMainView === 'project' && t.projectId !== activeProjectId) return false;
    
    // Global or project search
    if (searchQuery.trim()) {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
    }

    if (filterOptions.status !== 'all' && t.status !== filterOptions.status) return false;
    if (filterOptions.priority !== 'all' && t.priority !== filterOptions.priority) return false;

    return true;
  });

  const projectSections = sections.filter(s => s.projectId === activeProjectId);

  const handleSelectProject = (projId: string) => {
    setActiveProjectId(projId);
    storageService.setActiveProjectId(projId);
    setActiveMainView('project');
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus: TaskStatus = t.status === 'completed' ? 'in_development' : 'completed';
        if (nextStatus === 'completed') triggerCelebration();
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleUpdateTaskPriority = (taskId: string, priority: TaskPriority) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority } : t));
  };

  const handleAddTaskToSection = (sectionId: string, title: string) => {
    if (!activeProject) return;
    const newTask: Task = {
      id: `task_${Date.now()}`,
      projectId: activeProject.id,
      sectionId,
      title,
      description: 'Implementación según metodología By Toni y directrices de Drive.',
      status: 'in_development',
      priority: 'Alta',
      assignedTo: 'Toni',
      assignedAvatar: '👨‍💻',
      dueDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      estimatedHours: 2,
      subtasks: [],
      tags: ['Core'],
      directivesChecked: {
        supabaseSchema: true,
        rlsStrict: true,
        securityAuth: true,
        aiStreaming: true,
        rgpdLegal: true,
        driveSync: true
      },
      attachments: [],
      comments: [],
      activities: [{ id: `act_${Date.now()}`, user: 'Toni', action: 'Creó la tarea', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };
    triggerCelebration();
    setTasks(prev => [...prev, newTask]);
  };

  const handleAddTaskToStatus = (status: TaskStatus, title: string) => {
    if (!activeProject) return;
    const firstSection = projectSections[0] || { id: `sec_${Date.now()}` };
    const newTask: Task = {
      id: `task_${Date.now()}`,
      projectId: activeProject.id,
      sectionId: firstSection.id,
      title,
      description: 'Implementación según metodología By Toni y directrices de Drive.',
      status,
      priority: status === 'bugs_errors' ? 'Alta' : 'Media',
      assignedTo: 'Toni',
      assignedAvatar: '👨‍💻',
      dueDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      estimatedHours: 2,
      subtasks: [],
      tags: [status === 'bugs_errors' ? 'Bug' : 'Mejora'],
      directivesChecked: {
        supabaseSchema: true,
        rlsStrict: true,
        securityAuth: true,
        aiStreaming: true,
        rgpdLegal: true,
        driveSync: true
      },
      attachments: [],
      comments: [],
      activities: [{ id: `act_${Date.now()}`, user: 'Toni', action: `Añadió tarea a ${status}`, timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };
    if (status === 'completed') triggerCelebration();
    setTasks(prev => [...prev, newTask]);
  };

  const handleNewFeedbackTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleSaveNewProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
    
    // Auto generate 3 default sections for the new project
    const defaultSections: Section[] = [
      { id: `sec_${Date.now()}_1`, projectId: newProject.id, title: '🚀 Fase 1: Especificación & Setup', order: 1 },
      { id: `sec_${Date.now()}_2`, projectId: newProject.id, title: '💻 Fase 2: Desarrollo Core & UI', order: 2 },
      { id: `sec_${Date.now()}_3`, projectId: newProject.id, title: '⚡ Fase 3: Directrices Drive & QA', order: 3 }
    ];
    setSections(prev => [...prev, ...defaultSections]);

    // Add initial setup task
    const initialTask: Task = {
      id: `task_${Date.now()}`,
      projectId: newProject.id,
      sectionId: defaultSections[0].id,
      title: `Inicializar ${newProject.name} según directrices de Drive`,
      description: `Aplicar la especificación técnica: ${newProject.tagline}`,
      status: 'specification',
      priority: 'Alta',
      assignedTo: 'Toni',
      assignedAvatar: '👨‍💻',
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      estimatedHours: 4,
      subtasks: [
        { id: 'st_1', title: `Crear esquema Supabase ${newProject.supabaseSchema || newProject.slug}`, completed: false },
        { id: 'st_2', title: 'Generar vistas UI con Dark Glassmorphism', completed: false },
        { id: 'st_3', title: 'Actualizar Registro_Proyectos_Toni.csv en Google Drive', completed: false }
      ],
      tags: ['Inicialización', 'Drive'],
      directivesChecked: {
        supabaseSchema: newProject.database.includes('Supabase'),
        rlsStrict: newProject.database.includes('Supabase'),
        securityAuth: newProject.auth.includes('Supabase'),
        aiStreaming: !newProject.aiIntegration.includes('No Requiere'),
        rgpdLegal: true,
        driveSync: true
      },
      attachments: [],
      comments: [],
      activities: [{ id: `act_${Date.now()}`, user: 'Toni', action: 'Inicializó el proyecto', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, initialTask]);

    handleSelectProject(newProject.id);
    setIsNewProjectModalOpen(false);
    triggerCelebration();
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  // Directives CRUD handlers
  const handleAddDirective = (newDir: DirectiveItem) => {
    setDirectives(prev => [newDir, ...prev]);
  };

  const handleUpdateDirective = (updatedDir: DirectiveItem) => {
    setDirectives(prev => prev.map(d => d.id === updatedDir.id ? updatedDir : d));
  };

  const handleDeleteDirective = (directiveId: string) => {
    setDirectives(prev => prev.filter(d => d.id !== directiveId));
  };

  const handleExportBriefing = () => {
    if (!activeProject) return;
    const content = `# ⚡ INFO_PROYECTO: ${activeProject.name} (By Toni)

> **Ubicación Google Drive:** \`Google Drive > Mi unidad > 1-Proyectos > Apps-Desarrollo > ${activeProject.name}\`  
> **Slug / Código:** \`${activeProject.slug}\`  
> **Categoría:** ${activeProject.category}  
> **Estado:** ${activeProject.status}  
> **Base de Datos:** ${activeProject.database} (${activeProject.supabaseSchema || activeProject.slug})  
> **Directrices Maestras Drive:** [Carpeta de Directrices](https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW)

---

## 🎯 1. Propuesta de Valor y Objetivo
${activeProject.tagline}

### 💡 Problema Principal que Resuelve
${activeProject.problem}

### 👥 Público Objetivo
${activeProject.targetAudience}

---

## 🛠️ 2. Arquitectura y Stack Tecnológico
- **Frontend:** ${activeProject.frontendStack}
- **Estilos:** ${activeProject.uiStyle}
- **Autenticación:** ${activeProject.auth}
- **Motor de IA:** ${activeProject.aiIntegration} (${activeProject.aiProvider})
- **Modelo de Negocio:** ${activeProject.businessModel}

---

## 🚀 3. Funcionalidades Core (MVP)
${activeProject.coreFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

---

*Ficha generada automáticamente según la Directriz de Registro y Control de Google Drive (By Toni).*
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `INFO_PROYECTO_${activeProject.slug.toUpperCase()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const totalPendingTasks = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        activeMainView={activeMainView}
        onSelectProject={handleSelectProject}
        onSelectMainView={(v) => setActiveMainView(v)}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        totalPendingTasks={totalPendingTasks}
      />

      {/* Main Work Area */}
      <div className="main-content">
        {/* Top Navbar */}
        <TopNavbar
          currentProject={activeProject}
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          onOpenAICopilot={() => setIsAICopilotModalOpen(true)}
          onOpenHelpChat={() => setIsHelpChatModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Project Header (when in project view) */}
        {activeMainView === 'project' && activeProject && (
          <ProjectHeader
            project={activeProject}
            activeTab={activeProjectTab}
            onTabChange={setActiveProjectTab}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
            onExportBriefing={handleExportBriefing}
            onOpenHelpChat={() => setIsHelpChatModalOpen(true)}
            filterOptions={filterOptions}
            onFilterChange={(f) => setFilterOptions(prev => ({ ...prev, ...f }))}
          />
        )}

        {/* View Content Renderer */}
        <div className="view-container">
          {activeMainView === 'dashboard' && (
            <GlobalHomeView
              projects={projects}
              tasks={tasks}
              onSelectProject={handleSelectProject}
              onOpenNewProject={() => setIsNewProjectModalOpen(true)}
              onOpenAICopilot={() => setIsAICopilotModalOpen(true)}
            />
          )}

          {activeMainView === 'my_tasks' && (
            <MyTasksView
              tasks={tasks}
              projects={projects}
              onSelectTask={(t) => setSelectedTask(t)}
              onToggleTaskStatus={handleToggleTaskStatus}
              onOpenNewTask={() => setIsNewTaskModalOpen(true)}
            />
          )}

          {activeMainView === 'directives' && (
            <DirectivesHubView
              directives={directives}
              onAddDirective={handleAddDirective}
              onUpdateDirective={handleUpdateDirective}
              onDeleteDirective={handleDeleteDirective}
            />
          )}

          {activeMainView === 'ai_studio' && activeProject && (
            <AIPromptStudioView
              projects={projects}
              activeProject={activeProject}
              directives={directives}
              tasks={tasks}
              onSelectProject={handleSelectProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeMainView === 'project' && activeProject && (
            <>
              {activeProjectTab === 'list' && (
                <ListView
                  sections={projectSections}
                  tasks={projectTasks}
                  onSelectTask={(t) => setSelectedTask(t)}
                  onToggleTaskStatus={handleToggleTaskStatus}
                  onAddTaskToSection={handleAddTaskToSection}
                  onUpdateTaskPriority={handleUpdateTaskPriority}
                />
              )}

              {activeProjectTab === 'board' && (
                <BoardView
                  project={activeProject}
                  tasks={projectTasks}
                  onSelectTask={(t) => setSelectedTask(t)}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onAddTaskToStatus={handleAddTaskToStatus}
                  onOpenHelpChat={() => setIsHelpChatModalOpen(true)}
                  isAdminMode={isAdminMode}
                  onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
                />
              )}

              {activeProjectTab === 'timeline' && (
                <TimelineView
                  tasks={projectTasks}
                  onSelectTask={(t) => setSelectedTask(t)}
                />
              )}

              {activeProjectTab === 'calendar' && (
                <CalendarView
                  tasks={projectTasks}
                  onSelectTask={(t) => setSelectedTask(t)}
                />
              )}

              {activeProjectTab === 'dashboard' && (
                <DashboardView
                  project={activeProject}
                  tasks={projectTasks}
                  directives={directives}
                />
              )}

              {activeProjectTab === 'directives' && (
                <DirectivesHubView
                  directives={directives}
                  onAddDirective={handleAddDirective}
                  onUpdateDirective={handleUpdateDirective}
                  onDeleteDirective={handleDeleteDirective}
                />
              )}

              {activeProjectTab === 'ai_studio' && (
                <AIPromptStudioView
                  projects={projects}
                  activeProject={activeProject}
                  directives={directives}
                  tasks={tasks}
                  onSelectProject={handleSelectProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Slide-Over Task Details Drawer */}
      {selectedTask && activeProject && (
        <TaskDetailDrawer
          task={selectedTask}
          project={projects.find(p => p.id === selectedTask.projectId) || activeProject}
          directives={directives}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={(updated) => {
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
            setSelectedTask(updated);
          }}
          onDeleteTask={(taskId) => {
            setTasks(prev => prev.filter(t => t.id !== taskId));
            setSelectedTask(null);
          }}
        />
      )}

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSaveProject={handleSaveNewProject}
      />

      {activeProject && (
        <NewTaskModal
          isOpen={isNewTaskModalOpen}
          onClose={() => setIsNewTaskModalOpen(false)}
          project={activeProject}
          sections={projectSections}
          onSaveTask={(newTask) => setTasks(prev => [...prev, newTask])}
        />
      )}

      <AICopilotModal
        isOpen={isAICopilotModalOpen}
        onClose={() => setIsAICopilotModalOpen(false)}
        activeProject={activeProject}
        directives={directives}
      />

      {/* App Help & Feedback Chat Modal */}
      {activeProject && (
        <AppHelpChatModal
          isOpen={isHelpChatModalOpen}
          onClose={() => setIsHelpChatModalOpen(false)}
          activeProject={activeProject}
          onNewFeedbackTask={handleNewFeedbackTask}
        />
      )}
    </div>
  );
}

export default App;
