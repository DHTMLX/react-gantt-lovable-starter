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
