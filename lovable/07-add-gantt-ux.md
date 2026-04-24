Before implementing, review 00-project-architecture.md and use it as the architecture baseline. Follow it by default, deviate only when necessary.

Task 07:
Add a Gantt toolbar with zoom and undo/redo controls, and make row reorder persist correctly.

Scope:
- Gantt toolbar
- zoom controls inside the toolbar
- undo / redo controls inside the toolbar
- persistent task row reorder

Rules:
- use Redux Toolkit as the state layer for Gantt UX/history state
- add a dedicated Gantt toolbar with zoom and undo/redo controls
- zoom must support at least hour / day / week / month / year
- keep undo/redo stable across Redux history, Supabase sync, and rehydration
- save/refetch must not wipe undo/redo history
- keep the date pipeline consistent and the Redux history state serializable

Row reorder rules:
- enable row ordering in the Gantt config
- treat row reorder as a dedicated reorder flow, not as a normal single-task update
- detect reorder updates from the Gantt task update payload using `target`
- when a row is moved, rebuild the full ordered task list in memory
- recompute `sortorder` for all affected tasks, not only the moved task
- update local state with the reordered task list
- persist the reordered task set by updating `sortorder` for all affected rows
- if hierarchy can change during row move, persist `parent_id` together with `sortorder`
- after reload, the same task order must be restored from Supabase using `order("sortorder")`
- keep the reorder implementation targeted; do not refactor unrelated CRUD logic

Append to build-log.md the full request and full response after completion (append only, do not modify existing entries).