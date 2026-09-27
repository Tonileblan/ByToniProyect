import { Project, Section, Task, DirectiveItem, UserProfile, UserSettings, ReportPromptsConfig } from '../types/project';
import { INITIAL_PROJECTS, INITIAL_SECTIONS, INITIAL_TASKS, INITIAL_DIRECTIVES } from '../data/initialData';
import { DEFAULT_REPORT_PROMPTS, PROMPT_INFORME_MAESTRO } from './aiService';

const STORAGE_KEYS = {
  PROJECTS: 'bytoni_projects_v2',
  SECTIONS: 'bytoni_sections_v2',
  TASKS: 'bytoni_tasks_v2',
  DIRECTIVES: 'bytoni_directives_v2',
  ACTIVE_PROJECT: 'bytoni_active_project_id_v2',
  THEME: 'bytoni_theme_mode_v2',
  USER: 'bytoni_current_user_v2',
  SETTINGS: 'bytoni_user_settings_v2'
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr_toni',
  name: 'Antonio Javier García García',
  nickname: 'Toni',
  email: 'tonileblan@gmail.com',
  dni: '34799350M',
  role: 'Lead System Architect & Product Designer',
  avatar: 'TG',
  bio: 'Metodología SDD, Clean Architecture y 5 Directrices Maestras Google Drive.',
  isAuthenticated: true
};

export const DEFAULT_SETTINGS: UserSettings = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  selectedModel: 'gemini-1.5-flash',
  theme: 'dark',
  prompts: DEFAULT_REPORT_PROMPTS,
  masterPromptTemplate: PROMPT_INFORME_MAESTRO
};

export const storageService = {
  // --- User & Auth ---
  getUser(): UserProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading user from storage:', e);
    }
    this.saveUser(DEFAULT_USER);
    return DEFAULT_USER;
  },

  saveUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  logoutUser(): void {
    const user = this.getUser();
    user.isAuthenticated = false;
    this.saveUser(user);
  },

  loginAsToni(): UserProfile {
    const user = { ...DEFAULT_USER, isAuthenticated: true };
    this.saveUser(user);
    return user;
  },

  // --- Settings & Prompts ---
  getSettings(): UserSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...DEFAULT_SETTINGS, 
          ...parsed,
          prompts: { ...DEFAULT_REPORT_PROMPTS, ...(parsed.prompts || {}) }
        };
      }
    } catch (e) {
      console.error('Error loading settings from storage:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { 
      ...current, 
      ...settings,
      prompts: { ...current.prompts, ...(settings.prompts || {}) }
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  getReportPrompts(): ReportPromptsConfig {
    return this.getSettings().prompts || DEFAULT_REPORT_PROMPTS;
  },

  saveReportPrompts(prompts: Partial<ReportPromptsConfig>): ReportPromptsConfig {
    const current = this.getReportPrompts();
    const updated = { ...current, ...prompts };
    this.saveSettings({ prompts: updated });
    return updated;
  },

  resetReportPromptsToDefault(): ReportPromptsConfig {
    this.saveSettings({ prompts: DEFAULT_REPORT_PROMPTS });
    return DEFAULT_REPORT_PROMPTS;
  },

  getMasterPrompt(): string {
    return this.getReportPrompts().informeMaestro || PROMPT_INFORME_MAESTRO;
  },

  saveMasterPrompt(prompt: string): void {
    this.saveReportPrompts({ informeMaestro: prompt });
  },

  getGeminiApiKey(): string {
    return this.getSettings().geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  },

  saveGeminiApiKey(key: string): void {
    this.saveSettings({ geminiApiKey: key });
  },

  // --- Projects, Sections, Tasks & Directives ---
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
      settings: this.getSettings(),
      user: this.getUser(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllDataFromJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.projects && Array.isArray(parsed.projects)) {
        this.saveProjects(parsed.projects);
      }
      if (parsed.sections && Array.isArray(parsed.sections)) {
        this.saveSections(parsed.sections);
      }
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        this.saveTasks(parsed.tasks);
      }
      if (parsed.directives && Array.isArray(parsed.directives)) {
        this.saveDirectives(parsed.directives);
      }
      if (parsed.settings) {
        this.saveSettings(parsed.settings);
      }
      if (parsed.user) {
        this.saveUser(parsed.user);
      }
      return true;
    } catch (e) {
      console.error('Error importing backup JSON:', e);
      return false;
    }
  },

  // --- Generated Reports per Project ---
  getProjectReports(projectId: string): { id: string; type: string; date: string; content: string }[] {
    try {
      const saved = localStorage.getItem(`bytoni_reports_${projectId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading reports:', e);
    }
    return [];
  },

  saveProjectReports(projectId: string, reports: { id: string; type: string; date: string; content: string }[]): void {
    try {
      localStorage.setItem(`bytoni_reports_${projectId}`, JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving reports:', e);
    }
  },

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SECTIONS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.DIRECTIVES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};

