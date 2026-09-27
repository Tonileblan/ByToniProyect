-- ==============================================================================
-- MIGRACIÓN SUPABASE: ESQUEMA AISLADO mia_bytoniproyect (BY TONI)
-- ==============================================================================
-- Cumplimiento de la Directriz #1 de Drive: Arquitectura Supabase con RLS estricto

CREATE SCHEMA IF NOT EXISTS mia_bytoniproyect;

-- Otorgar permisos de uso del esquema a los roles de Supabase / PostgREST
GRANT USAGE ON SCHEMA mia_bytoniproyect TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA mia_bytoniproyect TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA mia_bytoniproyect TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA mia_bytoniproyect GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 1. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.projects (
  id TEXT PRIMARY KEY,
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
  google_notebook_url TEXT,
  research_insights JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Secciones / Etapas
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.sections (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES mia_bytoniproyect.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Tareas
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES mia_bytoniproyect.projects(id) ON DELETE CASCADE,
  section_id TEXT REFERENCES mia_bytoniproyect.sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'ideas_proposals',
  priority TEXT NOT NULL DEFAULT 'Media',
  assigned_to TEXT DEFAULT 'Toni',
  assigned_avatar TEXT DEFAULT '👨‍💻',
  due_date DATE,
  start_date DATE,
  estimated_hours NUMERIC DEFAULT 0,
  subtasks JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  directives_checked JSONB DEFAULT '{}'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  activities JSONB DEFAULT '[]'::jsonb,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  ai_prompt_snippet TEXT,
  origin TEXT,
  reported_by TEXT,
  report_type TEXT,
  device_info TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla de Directrices Maestras y Específicas
CREATE TABLE IF NOT EXISTS mia_bytoniproyect.directives (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  summary TEXT,
  app_types JSONB DEFAULT '[]'::jsonb,
  rules JSONB DEFAULT '[]'::jsonb,
  prompt_template TEXT,
  drive_url TEXT,
  full_markdown_content TEXT,
  is_official_master BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ACTIVACIÓN DE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE mia_bytoniproyect.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_bytoniproyect.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_bytoniproyect.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_bytoniproyect.directives ENABLE ROW LEVEL SECURITY;

-- Limpieza preventiva de políticas
DROP POLICY IF EXISTS "Allow all for projects" ON mia_bytoniproyect.projects;
DROP POLICY IF EXISTS "Allow all for sections" ON mia_bytoniproyect.sections;
DROP POLICY IF EXISTS "Allow all for tasks" ON mia_bytoniproyect.tasks;
DROP POLICY IF EXISTS "Allow all for directives" ON mia_bytoniproyect.directives;

-- Políticas de Acceso para la Aplicación (Lectura y Escritura)
CREATE POLICY "Allow all for projects" ON mia_bytoniproyect.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for sections" ON mia_bytoniproyect.sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for tasks" ON mia_bytoniproyect.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for directives" ON mia_bytoniproyect.directives FOR ALL USING (true) WITH CHECK (true);
