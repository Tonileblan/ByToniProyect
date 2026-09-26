-- ==============================================================================
-- MIGRACIÓN SUPABASE: ESQUEMA AISLADO mia_bytoniproyect (BY TONI)
-- ==============================================================================
-- Cumplimiento de la Directriz #1 de Drive: Arquitectura Supabase con RLS estricto

CREATE SCHEMA IF NOT EXISTS mia_bytoniproyect;

-- 1. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.projects (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  app_type TEXT NOT NULL,
  tagline TEXT,
  problem TEXT,
  target_audience TEXT,
  core_features JSONB DEFAULT '[]'::jsonb,
  database TEXT,
  auth TEXT,
  ai_integration TEXT,
  ai_provider TEXT,
  business_model TEXT,
  frontend_stack TEXT,
  ui_style TEXT,
  color TEXT DEFAULT '#6366F1',
  icon TEXT DEFAULT 'FolderKanban',
  supabase_schema TEXT,
  drive_folder_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Secciones / Etapas
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.sections (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  project_id TEXT NOT NULL REFERENCES mia_bytoniproyect.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Tareas
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.tasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  project_id TEXT NOT NULL REFERENCES mia_bytoniproyect.projects(id) ON DELETE CASCADE,
  section_id TEXT REFERENCES mia_bytoniproyect.sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'backlog',
  priority TEXT NOT NULL DEFAULT 'Media',
  assigned_to TEXT DEFAULT 'Toni',
  assigned_avatar TEXT DEFAULT '👨‍💻',
  due_date DATE,
  start_date DATE,
  estimated_hours NUMERIC,
  tags JSONB DEFAULT '[]'::jsonb,
  directives_checked JSONB DEFAULT '{}'::jsonb,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla de Subtareas
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.subtasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  task_id TEXT NOT NULL REFERENCES mia_bytoniproyect.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabla de Directrices Maestras y Específicas
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.directives (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  summary TEXT,
  rules JSONB DEFAULT '[]'::jsonb,
  prompt_template TEXT,
  drive_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ACTIVACIÓN DE ROW LEVEL SECURITY (RLS) ESTRICTO
-- ==============================================================================
ALTER TABLE mia_bytoniproyect.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_bytoniproyect.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_bytoniproyect.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_bytoniproyect.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_bytoniproyect.directives ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Projects
CREATE POLICY "Users can manage own projects" ON mia_bytoniproyect.projects
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para Sections
CREATE POLICY "Users can manage own sections" ON mia_bytoniproyect.sections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para Tasks
CREATE POLICY "Users can manage own tasks" ON mia_bytoniproyect.tasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para Subtasks
CREATE POLICY "Users can manage own subtasks" ON mia_bytoniproyect.subtasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para Directives
CREATE POLICY "Users can manage own directives" ON mia_bytoniproyect.directives
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
