# Project Architecture

## Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: react-router-dom v6
- **State**: React Query (tanstack)

## Directory Structure
```
src/
├── assets/                  # Static images and media
├── components/              # Shared components
│   ├── ui/                  # shadcn primitives
│   ├── AppLayout.tsx        # Shell layout (sidebar + topbar + <Outlet />)
│   ├── AppSidebar.tsx       # Dark sidebar navigation
│   ├── ThemeToggle.tsx
│   └── NavLink.tsx          # Active-aware link
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities (cn, etc.)
├── pages/                   # Route-level page components
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── Reports.tsx
│   ├── Workload.tsx
│   └── NotFound.tsx
├── features/                # Feature-owned logic added in later phases
│   ├── gantt/
│   │   ├── api/             # Gantt queries and mutations
│   │   ├── components/      # Gantt screen/view/toolbar
│   │   ├── hooks/           # Gantt orchestration hooks
│   │   ├── store/           # Redux/history state if introduced
│   │   └── utils/           # Config, templates, mapping, date helpers
│   └── projects/
│       ├── api/             # Project queries
│       ├── components/      # Project-specific UI blocks
│       ├── hooks/           # Project data/access hooks
│       └── utils/           # Project-specific helpers
├── integrations/
│   └── supabase/            # Supabase client and DB types
├── App.tsx                  # Route definitions
├── main.tsx                 # Entry point
└── index.css                # Design system tokens
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
