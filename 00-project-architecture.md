# Project Architecture — ProjectHub

## Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: react-router-dom v6
- **State**: React Query (tanstack)

## Directory Structure
```
src/
  components/       # Shared UI components
    ui/             # shadcn primitives
    AppLayout.tsx   # Shell layout (sidebar + topbar)
    AppSidebar.tsx  # Sidebar navigation
    ThemeToggle.tsx # Light/dark toggle
  hooks/            # Custom hooks (use-theme, use-mobile, etc.)
  pages/            # Route-level page components
    Index.tsx       # Dashboard (/)
    Projects.tsx    # Projects list (/projects)
    ProjectDetail.tsx # Single project (/projects/:id)
    Reports.tsx     # Reports placeholder (/reports)
    Workload.tsx    # Workload placeholder (/workload)
  lib/              # Utilities
```

## Design System
- Tokens defined in `src/index.css` (HSL variables)
- Extended in `tailwind.config.ts`
- Font: Inter
- Theme: light/dark via `.dark` class on `<html>`
- Sidebar collapsed by default

## Routing
| Path | Page |
|------|------|
| `/` | Dashboard |
| `/projects` | Projects list |
| `/projects/:id` | Project detail |
| `/reports` | Reports (placeholder) |
| `/workload` | Workload (placeholder) |
| `*` | 404 Not Found |
