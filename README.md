# React Gantt Lovable Starter

This project is a multi-project planning demo built with **DHTMLX React Gantt**, **React**, **TypeScript**, **Vite**, and **Supabase**. It combines a routed app shell, project portfolio pages, a per-project Gantt workspace, demo-only role-based access, persistent CRUD, row reordering, working-time behavior, and resource workload views.

The app was assembled step by step from the prompts and architecture notes in [`lovable/`](./lovable), so that folder also serves as the project’s build history and implementation guide.

### **[✨ Try the Live Demo >>>](https://react-gantt-lovable-starter.lovable.app)**

## Features

- **Multi-project planning** with dashboard, projects, reports, and workload pages
- **Project-scoped Gantt data** loaded from Supabase for the selected project only
- **Task and link CRUD** persisted through the DHTMLX `data.save` flow
- **Persistent task ordering** via `sortorder`, including drag-and-drop row reorder
- **Undo/redo and zoom controls** backed by Redux Toolkit history state
- **Working calendar and weekend highlighting** with one shared calendar source of truth
- **Resource panel and assignee support** with workload badges and hour totals
- **Demo-only permissions** with project access resolved through `project_members`
- **Viewer / editor / owner roles** driving read-only vs editable Gantt behavior
- **Demo sign-in modal** based on seeded users, with the selected user stored in `localStorage`

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query
- Redux Toolkit
- Supabase
- DHTMLX React Gantt

## Quick Start

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Supabase Setup

1. Create a project at [https://supabase.com](https://supabase.com).
2. Go to **Settings → API** and copy:
   - Project URL
   - anon public key
3. Apply the SQL files from [`supabase/migrations`](./supabase/migrations) to your Supabase project in order. These migrations create the schema, demo policies, and seeded starter data.
4. Copy [`.env.example`](./.env.example) to `.env`:

```bash
cp .env.example .env
```

5. Fill in your `.env` with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

The client in [src/integrations/supabase/client.ts](./src/integrations/supabase/client.ts) reads these values from Vite env vars at runtime.

## Auth Model

Authentication is intentionally lightweight:

- users choose a demo identity from a modal on first load
- no passwords or production auth flows are implemented
- the selected demo user is restored from `localStorage`

Permissions are also demo-only:

- accessible projects are filtered through `project_members`
- project roles resolve from `project_members.role`
- viewers open the Gantt in read-only mode
- editors and owners can modify project data

## Application Routes

| Path | Purpose |
| --- | --- |
| `/` | Dashboard |
| `/projects` | Project portfolio list |
| `/projects/:id` | Project detail page with the Gantt workspace |
| `/reports` | Project and task counts for accessible projects |
| `/workload` | Team member and assignment summary for accessible projects |
| `*` | Not found page |

## Repo Structure

```text
src/
  components/                shared shell and UI primitives
  features/
    auth/                    demo sign-in and current-user context
    gantt/                   Gantt data hooks, toolbar, store, and utilities
    projects/                project queries, roles, dialogs, and member management
  integrations/supabase/     generated Supabase client and DB types
  pages/                     route-level screens
  hooks/                     shared React hooks
  lib/                       utilities
supabase/
  migrations/                schema, policy, and seed SQL
lovable/
  00-build-plan.md           step-by-step build sequence
  00-project-architecture.md architecture baseline
  00-knowledge.md            DHTMLX React Gantt knowledge base
  00-manual-edits.md         follow-up fixes applied after generated steps
  01-11 *.md                 implementation prompts for each build stage
```

## License

Source code in this demo is released under the **MIT License**.
**DHTMLX React Gantt** is a commercial library and should be used under a valid [DHTMLX license](https://dhtmlx.com/docs/products/licenses.shtml) or evaluation agreement.

Using **Supabase** is subject to their [terms of service](https://supabase.com/terms) and billing. Stay within the free tier or set quotas that fit your usage.

## Useful Links

- [DHTMLX Gantt Product Page](https://dhtmlx.com/docs/products/dhtmlxGantt/)
- [DHTMLX Gantt Documentation](https://docs.dhtmlx.com/gantt/)
- [Supabase Documentation](https://supabase.com/docs)
- [DHTMLX technical support forum](https://forum.dhtmlx.com/)
