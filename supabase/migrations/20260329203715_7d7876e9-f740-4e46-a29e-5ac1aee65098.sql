
-- ============================================================
-- SCHEMA
-- ============================================================

-- users
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE
);

-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- project_members
CREATE TABLE public.project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  UNIQUE (project_id, user_id)
);

-- tasks
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  text text NOT NULL,
  start_date timestamptz NULL,
  duration int4 NULL,
  progress numeric NOT NULL DEFAULT 0,
  parent_id uuid NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  sortorder int4 NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL DEFAULT 'task',
  assignee_user_id uuid NULL REFERENCES public.users(id),
  CONSTRAINT tasks_progress_range CHECK (progress >= 0 AND progress <= 1),
  CONSTRAINT tasks_duration_positive CHECK (duration IS NULL OR duration >= 0),
  CONSTRAINT tasks_type_valid CHECK (type IN ('task', 'project', 'milestone')),
  CONSTRAINT tasks_no_self_parent CHECK (parent_id != id)
);

-- links
CREATE TABLE public.links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  source uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  target uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT links_type_valid CHECK (type IN ('0', '1', '2', '3')),
  CONSTRAINT links_no_self_link CHECK (source != target),
  UNIQUE (project_id, source, target, type)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_parent_id ON public.tasks(parent_id);
CREATE INDEX idx_tasks_start_date ON public.tasks(start_date);
CREATE INDEX idx_links_project_id ON public.links(project_id);
CREATE INDEX idx_links_source ON public.links(source);
CREATE INDEX idx_links_target ON public.links(target);
CREATE INDEX idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX idx_project_members_project_user ON public.project_members(project_id, user_id);

-- ============================================================
-- RLS (public read for now — no auth yet)
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read project_members" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Public read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public read links" ON public.links FOR SELECT USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Users
INSERT INTO public.users (id, username, full_name, email) VALUES
  ('a1111111-1111-1111-1111-111111111111'::uuid, 'jdoe',     'Jane Doe',      'jane@example.com'),
  ('a2222222-2222-2222-2222-222222222222'::uuid, 'jsmith',   'John Smith',    'john@example.com'),
  ('a3333333-3333-3333-3333-333333333333'::uuid, 'agarcia',  'Ana Garcia',    'ana@example.com'),
  ('a4444444-4444-4444-4444-444444444444'::uuid, 'mchen',    'Ming Chen',     'ming@example.com');

-- Projects
INSERT INTO public.projects (id, name) VALUES
  ('b1111111-1111-1111-1111-111111111111'::uuid, 'Website Redesign'),
  ('b2222222-2222-2222-2222-222222222222'::uuid, 'Mobile App'),
  ('b3333333-3333-3333-3333-333333333333'::uuid, 'API Integration'),
  ('b4444444-4444-4444-4444-444444444444'::uuid, 'Analytics Dashboard'),
  ('b5555555-5555-5555-5555-555555555555'::uuid, 'Design System'),
  ('b6666666-6666-6666-6666-666666666666'::uuid, 'DevOps Pipeline');

-- Project members
INSERT INTO public.project_members (project_id, user_id, role) VALUES
  ('b1111111-1111-1111-1111-111111111111'::uuid, 'a1111111-1111-1111-1111-111111111111'::uuid, 'owner'),
  ('b1111111-1111-1111-1111-111111111111'::uuid, 'a2222222-2222-2222-2222-222222222222'::uuid, 'member'),
  ('b2222222-2222-2222-2222-222222222222'::uuid, 'a3333333-3333-3333-3333-333333333333'::uuid, 'owner'),
  ('b2222222-2222-2222-2222-222222222222'::uuid, 'a4444444-4444-4444-4444-444444444444'::uuid, 'member'),
  ('b3333333-3333-3333-3333-333333333333'::uuid, 'a1111111-1111-1111-1111-111111111111'::uuid, 'owner'),
  ('b4444444-4444-4444-4444-444444444444'::uuid, 'a2222222-2222-2222-2222-222222222222'::uuid, 'owner'),
  ('b5555555-5555-5555-5555-555555555555'::uuid, 'a3333333-3333-3333-3333-333333333333'::uuid, 'owner'),
  ('b6666666-6666-6666-6666-666666666666'::uuid, 'a4444444-4444-4444-4444-444444444444'::uuid, 'owner');

-- ============================================================
-- Tasks for Website Redesign (b1111111...)
-- ============================================================
INSERT INTO public.tasks (id, project_id, text, start_date, duration, progress, parent_id, sortorder, type, assignee_user_id) VALUES
  ('c1000001-0000-0000-0000-000000000001'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 'Website Redesign',       '2026-03-02'::timestamptz, 20, 0.5, NULL, 1, 'project', NULL),
  ('c1000001-0000-0000-0000-000000000002'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 'Research & Discovery',   '2026-03-02'::timestamptz, 4,  1.0, 'c1000001-0000-0000-0000-000000000001'::uuid, 2, 'task', 'a1111111-1111-1111-1111-111111111111'::uuid),
  ('c1000001-0000-0000-0000-000000000003'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 'Wireframes',             '2026-03-06'::timestamptz, 5,  0.8, 'c1000001-0000-0000-0000-000000000001'::uuid, 3, 'task', 'a2222222-2222-2222-2222-222222222222'::uuid),
  ('c1000001-0000-0000-0000-000000000004'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 'Visual Design',          '2026-03-11'::timestamptz, 6,  0.4, 'c1000001-0000-0000-0000-000000000001'::uuid, 4, 'task', 'a1111111-1111-1111-1111-111111111111'::uuid),
  ('c1000001-0000-0000-0000-000000000005'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 'Development',            '2026-03-14'::timestamptz, 8,  0.1, 'c1000001-0000-0000-0000-000000000001'::uuid, 5, 'task', 'a2222222-2222-2222-2222-222222222222'::uuid),
  ('c1000001-0000-0000-0000-000000000006'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 'QA & Launch',            '2026-03-20'::timestamptz, 2,  0.0, 'c1000001-0000-0000-0000-000000000001'::uuid, 6, 'milestone', NULL);

-- Links for Website Redesign
INSERT INTO public.links (project_id, source, target, type) VALUES
  ('b1111111-1111-1111-1111-111111111111'::uuid, 'c1000001-0000-0000-0000-000000000002'::uuid, 'c1000001-0000-0000-0000-000000000003'::uuid, '0'),
  ('b1111111-1111-1111-1111-111111111111'::uuid, 'c1000001-0000-0000-0000-000000000003'::uuid, 'c1000001-0000-0000-0000-000000000004'::uuid, '0'),
  ('b1111111-1111-1111-1111-111111111111'::uuid, 'c1000001-0000-0000-0000-000000000004'::uuid, 'c1000001-0000-0000-0000-000000000005'::uuid, '0'),
  ('b1111111-1111-1111-1111-111111111111'::uuid, 'c1000001-0000-0000-0000-000000000005'::uuid, 'c1000001-0000-0000-0000-000000000006'::uuid, '0');

-- ============================================================
-- Tasks for Mobile App (b2222222...)
-- ============================================================
INSERT INTO public.tasks (id, project_id, text, start_date, duration, progress, parent_id, sortorder, type, assignee_user_id) VALUES
  ('c2000001-0000-0000-0000-000000000001'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, 'Mobile App',             '2026-03-09'::timestamptz, 25, 0.2, NULL, 1, 'project', NULL),
  ('c2000001-0000-0000-0000-000000000002'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, 'Requirements Gathering', '2026-03-09'::timestamptz, 3,  1.0, 'c2000001-0000-0000-0000-000000000001'::uuid, 2, 'task', 'a3333333-3333-3333-3333-333333333333'::uuid),
  ('c2000001-0000-0000-0000-000000000003'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, 'UI Prototyping',         '2026-03-12'::timestamptz, 5,  0.5, 'c2000001-0000-0000-0000-000000000001'::uuid, 3, 'task', 'a4444444-4444-4444-4444-444444444444'::uuid),
  ('c2000001-0000-0000-0000-000000000004'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, 'Backend Setup',          '2026-03-12'::timestamptz, 4,  0.3, 'c2000001-0000-0000-0000-000000000001'::uuid, 4, 'task', 'a3333333-3333-3333-3333-333333333333'::uuid),
  ('c2000001-0000-0000-0000-000000000005'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, 'App Development',        '2026-03-17'::timestamptz, 10, 0.0, 'c2000001-0000-0000-0000-000000000001'::uuid, 5, 'task', 'a4444444-4444-4444-4444-444444444444'::uuid),
  ('c2000001-0000-0000-0000-000000000006'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, 'Beta Release',           '2026-03-30'::timestamptz, 0,  0.0, 'c2000001-0000-0000-0000-000000000001'::uuid, 6, 'milestone', NULL);

INSERT INTO public.links (project_id, source, target, type) VALUES
  ('b2222222-2222-2222-2222-222222222222'::uuid, 'c2000001-0000-0000-0000-000000000002'::uuid, 'c2000001-0000-0000-0000-000000000003'::uuid, '0'),
  ('b2222222-2222-2222-2222-222222222222'::uuid, 'c2000001-0000-0000-0000-000000000002'::uuid, 'c2000001-0000-0000-0000-000000000004'::uuid, '0'),
  ('b2222222-2222-2222-2222-222222222222'::uuid, 'c2000001-0000-0000-0000-000000000003'::uuid, 'c2000001-0000-0000-0000-000000000005'::uuid, '0'),
  ('b2222222-2222-2222-2222-222222222222'::uuid, 'c2000001-0000-0000-0000-000000000005'::uuid, 'c2000001-0000-0000-0000-000000000006'::uuid, '0');

-- ============================================================
-- Tasks for API Integration (b3333333...)
-- ============================================================
INSERT INTO public.tasks (id, project_id, text, start_date, duration, progress, parent_id, sortorder, type, assignee_user_id) VALUES
  ('c3000001-0000-0000-0000-000000000001'::uuid, 'b3333333-3333-3333-3333-333333333333'::uuid, 'API Integration',        '2026-03-05'::timestamptz, 15, 0.6, NULL, 1, 'project', NULL),
  ('c3000001-0000-0000-0000-000000000002'::uuid, 'b3333333-3333-3333-3333-333333333333'::uuid, 'API Audit',              '2026-03-05'::timestamptz, 3,  1.0, 'c3000001-0000-0000-0000-000000000001'::uuid, 2, 'task', 'a1111111-1111-1111-1111-111111111111'::uuid),
  ('c3000001-0000-0000-0000-000000000003'::uuid, 'b3333333-3333-3333-3333-333333333333'::uuid, 'Endpoint Migration',     '2026-03-08'::timestamptz, 7,  0.5, 'c3000001-0000-0000-0000-000000000001'::uuid, 3, 'task', 'a1111111-1111-1111-1111-111111111111'::uuid),
  ('c3000001-0000-0000-0000-000000000004'::uuid, 'b3333333-3333-3333-3333-333333333333'::uuid, 'Integration Testing',    '2026-03-15'::timestamptz, 5,  0.0, 'c3000001-0000-0000-0000-000000000001'::uuid, 4, 'task', 'a1111111-1111-1111-1111-111111111111'::uuid);

INSERT INTO public.links (project_id, source, target, type) VALUES
  ('b3333333-3333-3333-3333-333333333333'::uuid, 'c3000001-0000-0000-0000-000000000002'::uuid, 'c3000001-0000-0000-0000-000000000003'::uuid, '0'),
  ('b3333333-3333-3333-3333-333333333333'::uuid, 'c3000001-0000-0000-0000-000000000003'::uuid, 'c3000001-0000-0000-0000-000000000004'::uuid, '0');

-- ============================================================
-- Tasks for Analytics Dashboard (b4444444...)
-- ============================================================
INSERT INTO public.tasks (id, project_id, text, start_date, duration, progress, parent_id, sortorder, type, assignee_user_id) VALUES
  ('c4000001-0000-0000-0000-000000000001'::uuid, 'b4444444-4444-4444-4444-444444444444'::uuid, 'Analytics Dashboard',    '2026-03-10'::timestamptz, 12, 0.8, NULL, 1, 'project', NULL),
  ('c4000001-0000-0000-0000-000000000002'::uuid, 'b4444444-4444-4444-4444-444444444444'::uuid, 'Data Modeling',          '2026-03-10'::timestamptz, 3,  1.0, 'c4000001-0000-0000-0000-000000000001'::uuid, 2, 'task', 'a2222222-2222-2222-2222-222222222222'::uuid),
  ('c4000001-0000-0000-0000-000000000003'::uuid, 'b4444444-4444-4444-4444-444444444444'::uuid, 'Chart Components',       '2026-03-13'::timestamptz, 5,  0.8, 'c4000001-0000-0000-0000-000000000001'::uuid, 3, 'task', 'a2222222-2222-2222-2222-222222222222'::uuid),
  ('c4000001-0000-0000-0000-000000000004'::uuid, 'b4444444-4444-4444-4444-444444444444'::uuid, 'Dashboard Layout',       '2026-03-18'::timestamptz, 4,  0.5, 'c4000001-0000-0000-0000-000000000001'::uuid, 4, 'task', 'a2222222-2222-2222-2222-222222222222'::uuid);

INSERT INTO public.links (project_id, source, target, type) VALUES
  ('b4444444-4444-4444-4444-444444444444'::uuid, 'c4000001-0000-0000-0000-000000000002'::uuid, 'c4000001-0000-0000-0000-000000000003'::uuid, '0'),
  ('b4444444-4444-4444-4444-444444444444'::uuid, 'c4000001-0000-0000-0000-000000000003'::uuid, 'c4000001-0000-0000-0000-000000000004'::uuid, '0');

-- ============================================================
-- Tasks for Design System (b5555555...)
-- ============================================================
INSERT INTO public.tasks (id, project_id, text, start_date, duration, progress, parent_id, sortorder, type, assignee_user_id) VALUES
  ('c5000001-0000-0000-0000-000000000001'::uuid, 'b5555555-5555-5555-5555-555555555555'::uuid, 'Design System',          '2026-03-03'::timestamptz, 18, 0.65, NULL, 1, 'project', NULL),
  ('c5000001-0000-0000-0000-000000000002'::uuid, 'b5555555-5555-5555-5555-555555555555'::uuid, 'Token Definition',       '2026-03-03'::timestamptz, 4,  1.0, 'c5000001-0000-0000-0000-000000000001'::uuid, 2, 'task', 'a3333333-3333-3333-3333-333333333333'::uuid),
  ('c5000001-0000-0000-0000-000000000003'::uuid, 'b5555555-5555-5555-5555-555555555555'::uuid, 'Component Library',      '2026-03-07'::timestamptz, 8,  0.6, 'c5000001-0000-0000-0000-000000000001'::uuid, 3, 'task', 'a3333333-3333-3333-3333-333333333333'::uuid),
  ('c5000001-0000-0000-0000-000000000004'::uuid, 'b5555555-5555-5555-5555-555555555555'::uuid, 'Documentation',          '2026-03-15'::timestamptz, 6,  0.2, 'c5000001-0000-0000-0000-000000000001'::uuid, 4, 'task', 'a3333333-3333-3333-3333-333333333333'::uuid);

INSERT INTO public.links (project_id, source, target, type) VALUES
  ('b5555555-5555-5555-5555-555555555555'::uuid, 'c5000001-0000-0000-0000-000000000002'::uuid, 'c5000001-0000-0000-0000-000000000003'::uuid, '0'),
  ('b5555555-5555-5555-5555-555555555555'::uuid, 'c5000001-0000-0000-0000-000000000003'::uuid, 'c5000001-0000-0000-0000-000000000004'::uuid, '0');

-- ============================================================
-- Tasks for DevOps Pipeline (b6666666...)
-- ============================================================
INSERT INTO public.tasks (id, project_id, text, start_date, duration, progress, parent_id, sortorder, type, assignee_user_id) VALUES
  ('c6000001-0000-0000-0000-000000000001'::uuid, 'b6666666-6666-6666-6666-666666666666'::uuid, 'DevOps Pipeline',        '2026-03-16'::timestamptz, 14, 0.1, NULL, 1, 'project', NULL),
  ('c6000001-0000-0000-0000-000000000002'::uuid, 'b6666666-6666-6666-6666-666666666666'::uuid, 'CI Setup',               '2026-03-16'::timestamptz, 3,  0.5, 'c6000001-0000-0000-0000-000000000001'::uuid, 2, 'task', 'a4444444-4444-4444-4444-444444444444'::uuid),
  ('c6000001-0000-0000-0000-000000000003'::uuid, 'b6666666-6666-6666-6666-666666666666'::uuid, 'CD Pipeline',            '2026-03-19'::timestamptz, 5,  0.0, 'c6000001-0000-0000-0000-000000000001'::uuid, 3, 'task', 'a4444444-4444-4444-4444-444444444444'::uuid),
  ('c6000001-0000-0000-0000-000000000004'::uuid, 'b6666666-6666-6666-6666-666666666666'::uuid, 'Monitoring & Alerts',    '2026-03-24'::timestamptz, 4,  0.0, 'c6000001-0000-0000-0000-000000000001'::uuid, 4, 'task', 'a4444444-4444-4444-4444-444444444444'::uuid),
  ('c6000001-0000-0000-0000-000000000005'::uuid, 'b6666666-6666-6666-6666-666666666666'::uuid, 'Go Live',                '2026-03-28'::timestamptz, 0,  0.0, 'c6000001-0000-0000-0000-000000000001'::uuid, 5, 'milestone', NULL);

INSERT INTO public.links (project_id, source, target, type) VALUES
  ('b6666666-6666-6666-6666-666666666666'::uuid, 'c6000001-0000-0000-0000-000000000002'::uuid, 'c6000001-0000-0000-0000-000000000003'::uuid, '0'),
  ('b6666666-6666-6666-6666-666666666666'::uuid, 'c6000001-0000-0000-0000-000000000003'::uuid, 'c6000001-0000-0000-0000-000000000004'::uuid, '0'),
  ('b6666666-6666-6666-6666-666666666666'::uuid, 'c6000001-0000-0000-0000-000000000004'::uuid, 'c6000001-0000-0000-0000-000000000005'::uuid, '0');
