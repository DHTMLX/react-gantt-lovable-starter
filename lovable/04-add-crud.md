Before implementing, review 00-project-architecture.md and use it as the architecture baseline. Follow it by default, deviate only when necessary.

Task 04:
Implement Gantt CRUD persistence via data.save.

Scope:
- task create
- task update
- task delete
- link create
- link delete

Rules:
- React state as the source of truth
- Supabase is the persistence layer
- Persist task ordering
- Use the real UUID returned by Supabase after insert and replace any temporary Gantt id
- Use stable local date conversion helpers
- Persist `sortorder` as the canonical task ordering field
- Load tasks ordered by `sortorder`
- Normal task updates must preserve the current `sortorder` unless a dedicated row-reorder flow changes it
- In this step, prepare task persistence so later row reorder can update `sortorder` without changing the CRUD architecture
- Build Supabase write payloads from the normalized local task model, not directly from the raw `data.save` payload
- Persist `parent_id` only if `task.parent` is a real UUID
- Do not reject valid project UUIDs with overly strict client-side validation
- Persist a link only when both linked tasks already have real persisted UUIDs
- Build optimistic updates from the latest current task and link state, not from stale render-time state

Append to build-log.md the full request and full response after completion (append only, do not modify existing entries).