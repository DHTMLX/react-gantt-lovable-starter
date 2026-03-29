# Build Log

## Task 01 — App Shell & Navigation

**Request**: Create a clean, modern app shell with collapsible sidebar (Dashboard, Projects, Reports, Workload), top bar with app name and toggle (collapsed by default), Projects list with mock data, Project detail page, placeholder pages, search + logout in sidebar footer, and light/dark theme switcher.

**Response**:
- Updated design system (index.css, tailwind.config.ts) with Inter font, slate/blue palette, light+dark tokens
- Created `AppLayout` (sidebar + topbar shell), `AppSidebar` (nav items, search, logout), `ThemeToggle`
- Created `use-theme` hook for localStorage-persisted light/dark toggle
- Built pages: Dashboard (stat cards), Projects (mock list with badges), ProjectDetail (progress bar), Reports, Workload (placeholders)
- Configured all routes in App.tsx
- Sidebar collapsed by default (`defaultOpen={false}`)
- Created `00-project-architecture.md` documenting stack, structure, routing
- Created `build-log.md` (this file)

## Task 02 — DHTMLX Gantt on Project Detail

**Request**: Add DHTMLX trial React Gantt to the project detail page. Use mock data (tasks, links). Render at /projects/:id — opening a project shows the chart. Gantt fills available content area in full width and height. Use existing app theme as single source of truth. Gantt must automatically follow light/dark mode changes. Do not introduce a separate theme state or switcher. Append to build-log.md.

**Response**:
- Installed `@dhtmlx/trial-react-gantt`
- Created `src/features/gantt/components/ProjectGantt.tsx` — standalone Gantt wrapper with mock tasks/links per project, reads `useTheme()` to map app theme → `"terrace"` | `"dark"`
- Rewrote `src/pages/ProjectDetail.tsx` — replaced progress bar with full-height Gantt, header with back link + project info, flex layout fills available space
- Updated `AppLayout.tsx` — added `min-h-0` to `<main>` so flex children can properly fill height
- Mock data: project "1" has a 6-task waterfall with links; other projects get a generic 3-task fallback
- No separate theme state introduced; Gantt reads the existing `useTheme()` hook directly

## Task 03 — Supabase Read Path & Seed Data

**Request**: Connect Supabase for the read path and replace mock loading with real starter data. Create tables (users, projects, project_members, tasks, links) with UUID PKs, FKs, check constraints, indexes, and unique constraints. Seed 4 users, 6 projects with tasks and links. Fully connect the app — no mock data, loading/error states, filter tasks/links by project_id.

**Response**:
- Created schema migration with 5 tables: `users`, `projects`, `project_members`, `tasks`, `links`
- All tables use `uuid` PKs with `gen_random_uuid()` defaults
- Foreign keys: `project_members` → `projects`/`users`, `tasks` → `projects`/`tasks`(parent)/`users`(assignee), `links` → `projects`/`tasks`(source/target) — all with appropriate CASCADE rules
- Check constraints: `tasks.progress` 0–1, `tasks.duration` ≥ 0, `tasks.type` enum, no self-parent; `links.type` enum, no self-link
- Unique constraints: `(project_id, user_id)` on members, `(project_id, source, target, type)` on links
- Indexes on all FK columns and common query patterns
- RLS enabled with public read policies (no auth yet)
- Deterministic seed: 4 users, 6 projects, tasks and links per project with explicit UUID casts
- Created `src/features/projects/api/useProjects.ts` — fetches project list with computed task counts
- Created `src/features/projects/api/useProject.ts` — fetches single project by ID
- Created `src/features/gantt/api/useGanttData.ts` — fetches tasks/links filtered by `project_id`, maps DB rows to Gantt objects (`rowToGanttTask`, `rowToGanttLink`)
- Rewrote `Projects.tsx` — uses `useProjects()`, derives status from counts, skeleton loading, error state
- Rewrote `ProjectDetail.tsx` — uses `useProject()`, loading/error states, no mock import
- Rewrote `ProjectGantt.tsx` — uses `useGanttData()`, syncs DB data to local state, skeleton/error states
- Removed all mock data references

## Task 04 — Gantt CRUD Persistence via data.save

**Request**: Implement Gantt CRUD persistence via data.save. Scope: task create/update/delete, link create/delete. React state as source of truth, Supabase as persistence layer. Persist task ordering via `sortorder`. Replace temp Gantt IDs with real UUIDs after insert. Use stable local date conversion helpers. Build write payloads from normalized local task model. Persist `parent_id` only if real UUID. Persist links only when both ends have real UUIDs. Optimistic updates from latest state.

**Response**:
- Created `src/features/gantt/utils/date.ts` — `dateToISO()` and `isoToDate()` conversion helpers
- Created `src/features/gantt/utils/payload.ts` — `buildTaskInsert()`, `buildTaskUpdate()`, `buildLinkInsert()`, `isRealUUID()` payload builders that normalize Gantt objects into Supabase write payloads
- Rewrote `src/features/gantt/components/ProjectGantt.tsx`:
  - `data.save` callback handles task create/update/delete and link create/delete
  - Task create: optimistic add → Supabase insert → replace temp ID with real UUID in both tasks and links state
  - Task update: optimistic update → Supabase update (only for real UUIDs), preserves existing `sortorder`
  - Task delete: optimistic remove → Supabase delete (only for real UUIDs)
  - Link create: optimistic add → only persists when both source/target are real UUIDs → replaces temp link ID
  - Link delete: optimistic remove → Supabase delete (only for real UUIDs)
  - `nextSortorder()` helper derives next ordering value from current task state
- Added RLS policies: public INSERT/UPDATE/DELETE on `tasks`, public INSERT/DELETE on `links` (no auth yet — will be locked down when auth is added)
- Architecture: state-first optimistic updates, Supabase fire-and-forget persistence, `sortorder` preserved on normal updates
