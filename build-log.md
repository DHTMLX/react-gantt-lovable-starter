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
