# React Gantt Lovable Starter

[![npm: @dhtmlx/trial-react-gantt](https://img.shields.io/npm/v/@dhtmlx/trial-react-gantt?label=%40dhtmlx%2Ftrial-react-gantt)](https://www.npmjs.com/package/@dhtmlx/trial-react-gantt)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Built with Lovable](https://img.shields.io/badge/built%20with-Lovable-ff69b4)](https://lovable.dev)

This project is a multi-project planning demo built with **DHTMLX React Gantt**, **React**, **TypeScript**, **Vite**, and **Supabase**. It combines a routed app shell, project portfolio pages, a per-project Gantt workspace, demo-only role-based access, persistent CRUD, row reordering, working-time behavior, and resource workload views.

The app was assembled step by step from the prompts and architecture notes in [`docs/`](./docs), so that folder also serves as the project's build history and implementation guide.

### **[✨ Try the Live Demo >>>](https://react-gantt-lovable-starter.lovable.app)**

## What's inside

This repo has three layers, each useful on its own:

- **App code** under [`src/`](./src) - a working React + Supabase planner you can run, fork, or strip down for your own use.
- **Supabase migrations** under [`supabase/migrations`](./supabase/migrations) - schema, demo policies, and seed data, applied in order.
- **Lovable build recipe** under [`docs/`](./docs) - the exact prompt sequence used to generate the app, plus a log of every manual fix that was applied to the generated output. Reuse it to reproduce the build in your own Lovable workspace, or read it as a worked example of building a complex Gantt app with Lovable.

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
docs/                        prompt sequence + build log
```

The full ordered prompt list lives in [`docs/00-build-plan.md`](./docs/00-build-plan.md), with companion files for the architecture baseline, the Knowledge Base content, the implementation prompts for each stage, and a record of every manual fix.

## Going to production

This starter installs the public trial package `@dhtmlx/trial-react-gantt`, which renders an evaluation watermark. Before shipping to real users:

1. Obtain a commercial DHTMLX license, configure the [DHTMLX private npm registry](https://docs.dhtmlx.com/gantt/integrations/react/installation/), and swap `@dhtmlx/trial-react-gantt` for `@dhx/react-gantt`. The [installation guide](https://docs.dhtmlx.com/gantt/integrations/react/installation/#moving-from-the-trial-package-to-the-commercial-one) walks through the package swap and a short Lovable note.
2. Replace the demo identity flow with real authentication. Permissions in this starter are demo-only; the project membership rows and role checks are intentionally lightweight.

## AI tooling

If you continue editing this project with an AI coding assistant, three companion tools sharpen the output:

- [DHTMLX MCP Server](https://docs.dhtmlx.com/gantt/integrations/ai-tools/mcp-server/) - real-time DHTMLX API reference for any MCP-aware assistant (Claude Code, Cursor, ChatGPT, Gemini CLI, and others).
- [DHTMLX Agent Skills](https://github.com/DHTMLX/skills) - opinionated patterns and known pitfalls for working with React Gantt; pair with MCP for best results.
- [Lovable AI integration guide](https://docs.dhtmlx.com/gantt/integrations/ai-tools/lovable-ai/) - the published walkthrough of using DHTMLX inside Lovable, including the [reproduction guide](https://docs.dhtmlx.com/gantt/integrations/ai-tools/lovable-starter-walkthrough/) for this starter.

## License

Source code in this demo is released under the **MIT License**.
**DHTMLX React Gantt** is a commercial library and should be used under a valid [DHTMLX license](https://dhtmlx.com/docs/products/licenses.shtml) or evaluation agreement.

Using **Supabase** is subject to their [terms of service](https://supabase.com/terms) and billing. Stay within the free tier or set quotas that fit your usage.

## Useful Links

- [DHTMLX Gantt Product Page](https://dhtmlx.com/docs/products/dhtmlxGantt/)
- [DHTMLX Gantt Documentation](https://docs.dhtmlx.com/gantt/)
- [DHTMLX AI Tools overview](https://docs.dhtmlx.com/gantt/integrations/ai-tools/) - MCP, agent skills, Lovable, and semantic search
- [Supabase Documentation](https://supabase.com/docs)
- [DHTMLX technical support forum](https://forum.dhtmlx.com/)
- Other React starters: [react-gantt-quick-start](https://github.com/dhtmlx/react-gantt-quick-start), [react-gantt-jotai-starter](https://github.com/dhtmlx/react-gantt-jotai-starter), [react-gantt-redux-starter](https://github.com/dhtmlx/react-gantt-redux-starter), [react-gantt-tanstack-query-starter](https://github.com/dhtmlx/react-gantt-tanstack-query-starter), [react-gantt-zustand-starter](https://github.com/dhtmlx/react-gantt-zustand-starter)
