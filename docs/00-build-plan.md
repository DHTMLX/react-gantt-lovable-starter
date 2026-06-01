# Build Plan

The `lovable` folder contains:
- instruction templates for each build step
- a project architecture template
- a knowledge-base template

## Setup Flow

1. Send the prompt/instruction from `01-create-app-shell.md` to Lovable.
2. After the application shell is created according to that instruction, open project settings and put into the Knowledge Base everything from `00-knowledge.md`, then save it.
3. During execution of `01-create-app-shell.md`, `00-project-architecture.md` will be created in the project. Use the contents of the `00-project-architecture.md` template from the `lovable` folder for that file.
4. After that, execute the remaining instructions sequentially from `02` through `11`.

## Backend Decision Before Step 03

Before executing `03-connect-supabase.md`, decide which backend will be used in the project.

- If you want to use your own backend, for example Supabase, connect that Supabase project in project settings before running step 03.
- If you do not connect your own backend, the Lovable backend will be used.

Important constraints:
- The Lovable backend does not provide UI access to the backend itself.
- After the backend is selected, it cannot be changed later.

## Step Order

1. `01-create-app-shell.md`
2. `02-add-gantt-core.md`
3. `03-connect-supabase.md`
4. `04-add-crud.md`
5. `05-add-permissions.md`
6. `06-browser-verify.md`
7. `07-add-gantt-ux.md`
8. `08-add-working-calendar.md`
9. `09-add-resources.md`
10. `10-final-verify.md`
11. `11-fill-dashboard-reports-workload.md`
