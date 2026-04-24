**01. Shared Theme Context**

This fix was applied after `02-add-gantt-core.md` to make theme state usable across the routed app instead of being isolated per hook call. It changes src/main.tsx and src/hooks/use-theme.ts. The Gantt screen and the theme toggle both depend on the same light/dark source of truth, so converting `useTheme()` from local component state into a context-backed provider was necessary to keep the chart theme in sync with the shell theme.

## After Step
`02-add-gantt-core.md`

## File
`src/main.tsx`

https://www.diffchecker.com/KpwbbBAA/

## File
`src/hooks/use-theme.ts`

https://www.diffchecker.com/f87DBgvz/

**02. Gantt Date Normalization**

This fix was applied after `04-add-crud.md` in src/features/gantt/utils/date.ts. The CRUD layer originally assumed DHTMLX always emitted real `Date` objects, but task updates can come back from the Gantt as formatted strings. Normalizing those strings before calling `toISOString()` was necessary to stop update payload generation from failing and to preserve stable Gantt-to-Supabase date round-trips.

## After Step
`04-add-crud.md`

## File
`src/features/gantt/utils/date.ts`

https://www.diffchecker.com/PeXuRziA/

**03. Fresh Redux Snapshot Access**

This fix was applied after `07-add-gantt-ux.md` across src/features/gantt/components/ProjectGantt.tsx and src/features/gantt/store/serialization.ts. The project had already moved beyond the architecture baseline into Redux-backed Gantt history, so `data.save` callbacks were reading stale snapshot state captured before hydration. The component update adds refs to the latest Redux snapshot, and the serialization update normalizes task dates before they are written back into Redux, preventing both stale-state commits and date drift during drag/update operations.

## After Step
`07-add-gantt-ux.md`

## File
`src/features/gantt/components/ProjectGantt.tsx`

https://www.diffchecker.com/jyuNaRv4/

## File
`src/features/gantt/store/serialization.ts`

https://www.diffchecker.com/tO4ZhEXM/

**04. Undo/Redo Persistence**

This fix was applied after `07-add-gantt-ux.md` in src/features/gantt/components/ProjectGantt.tsx. By this stage the project was using Redux snapshots for local history while Supabase remained the persistence layer, so undo/redo only changed client state and was lost on reload. The updated version extends the Gantt component with snapshot persistence for undo/redo and keeps history refs in sync, which closes the architectural gap between Redux history and database-backed project state.

## After Step
`07-add-gantt-ux.md`

## File
`src/features/gantt/components/ProjectGantt.tsx`

https://www.diffchecker.com/g6WBvS6r/

**05. Weekend Template Signature Fix**

This fix was applied after `08-add-working-calendar.md` in src/features/gantt/components/ProjectGantt.tsx. The working-time step introduced weekend highlighting through a DHTMLX template, but the callback was wired with the wrong argument signature, so the non-working-day helper received a task object instead of a `Date`. The fix aligns the template with the React Gantt API and restores weekend styling without changing the calendar rules source of truth.

## After Step
`08-add-working-calendar.md`

## File
`src/features/gantt/components/ProjectGantt.tsx`

https://www.diffchecker.com/qS1JAaDt/
