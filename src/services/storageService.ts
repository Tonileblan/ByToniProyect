import { Project, Section, Task, DirectiveItem } from '../types/project';
import { INITIAL_PROJECTS, INITIAL_SECTIONS, INITIAL_TASKS, INITIAL_DIRECTIVES } from '../data/initialData';

const STORAGE_KEYS = {
  PROJECTS: 'bytoni_projects_v2',
  SECTIONS: 'bytoni_sections_v2',
  TASKS: 'bytoni_tasks_v2',
  DIRECTIVES: 'bytoni_directives_v2',
  ACTIVE_PROJECT: 'bytoni_active_project_id_v2',
  THEME: 'bytoni_theme_mode_v2'
};

export const storageService = {
  getProjects(): Project[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading projects from storage:', e);
    }
    this.saveProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  },

  saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getSections(): Section[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading sections from storage:', e);
    }
    this.saveSections(INITIAL_SECTIONS);
    return INITIAL_SECTIONS;
  },

  saveSections(sections: Section[]): void {
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  },

  getTasks(): Task[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading tasks from storage:', e);
    }
    this.saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getDirectives(): DirectiveItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIRECTIVES);
      if (saved) {
        const parsed: DirectiveItem[] = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].fullMarkdownContent) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading directives from storage:', e);
    }
    this.saveDirectives(INITIAL_DIRECTIVES);
    return INITIAL_DIRECTIVES;
  },

  saveDirectives(directives: DirectiveItem[]): void {
    localStorage.setItem(STORAGE_KEYS.DIRECTIVES, JSON.stringify(directives));
  },

  getActiveProjectId(): string {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT);
    return saved || 'proj_bytoni';
  },

  setActiveProjectId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, id);
  },

  exportAllDataAsJSON(): string {
    const backup = {
      projects: this.getProjects(),
      sections: this.getSections(),
      tasks: this.getTasks(),
      directives: this.getDirectives(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SECTIONS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.DIRECTIVES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT);
  }
};
