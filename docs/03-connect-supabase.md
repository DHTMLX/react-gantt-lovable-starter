Before implementing, review 00-project-architecture.md and use it as the architecture baseline. Follow it by default, deviate only when necessary.

Task 03:
Connect Supabase for the read path and replace mock loading with real starter data.

Scope:
- projects list -> projects
- project detail -> projects by route param
- tasks -> tasks filtered by project_id
- links -> links filtered by project_id
- schema migration
- deterministic seed data

Schema:
Use UUID primary keys with default gen_random_uuid().

Create tables:

users
- id uuid primary key default gen_random_uuid()
- username text not null unique
- full_name text not null
- email text not null unique

projects
- id uuid primary key default gen_random_uuid()
- name text not null
- created_at timestamptz not null default now()

project_members
- id uuid primary key default gen_random_uuid()
- project_id uuid not null
- user_id uuid not null
- role text not null

tasks
- id uuid primary key default gen_random_uuid()
- project_id uuid not null
- text text not null
- start_date timestamptz null
- duration int4 null
- progress numeric not null default 0
- parent_id uuid null
- sortorder int4 not null default 0
- created_at timestamptz not null default now()
- type text not null default 'task'
- assignee_user_id uuid null

links
- id uuid primary key default gen_random_uuid()
- project_id uuid not null
- source uuid not null
- target uuid not null
- type text not null
- created_at timestamptz not null default now()

Foreign keys:
- project_members.project_id -> projects.id ON DELETE CASCADE
- project_members.user_id -> users.id ON DELETE CASCADE
- tasks.project_id -> projects.id ON DELETE CASCADE
- tasks.parent_id -> tasks.id ON DELETE CASCADE
- tasks.assignee_user_id -> users.id
- links.project_id -> projects.id ON DELETE CASCADE
- links.source -> tasks.id ON DELETE CASCADE
- links.target -> tasks.id ON DELETE CASCADE

Checks:
- tasks.progress between 0 and 1
- tasks.duration is null or >= 0
- tasks.type in ('task', 'project', 'milestone')
- tasks.parent_id != tasks.id
- links.type in ('0', '1', '2', '3')
- links.source != links.target

Unique constraints:
- unique(project_id, user_id) on project_members
- unique(project_id, source, target, type) on links

Indexes:
- tasks(project_id)
- tasks(parent_id)
- tasks(start_date)
- links(project_id)
- links(source)
- links(target)
- project_members(project_id)
- project_members(user_id)
- project_members(project_id, user_id)

Seed:
Prepare deterministic readable seed data with at least:
- 4 demo users
- 6 projects
- tasks for each project
- links for each project

Rules:
- do not stop at generating migration or seed files
- fully connect the app to the real Supabase project in this step
- configure env vars
- apply migration and seed
- verify real Supabase data loading
- do not implement CRUD yet
- do not use username as a foreign key anywhere
- tasks and links must always load only for the selected project
- project detail page must only read the selected project
- map DB rows into valid React Gantt task/link objects
- keep row-to-Gantt mapping explicit and readable
- keep loading and error states on pages
- do not rely on random or hardcoded project ids in seed chains
- synthetic UUID literals in seed SQL must be explicitly cast to uuid
- each seed insert block must be self-contained; do not reference a CTE from a later separate statement

Return:
1. the final SQL migration for Supabase
2. a short explanation of each table
3. a short explanation of each foreign key

Append to build-log.md the full request and full response after completion (append only, do not modify existing entries).