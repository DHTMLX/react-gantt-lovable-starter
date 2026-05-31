Before implementing, review 00-project-architecture.md and use it as the architecture baseline. Follow it by default, deviate only when necessary.

Task 05:
Implement a simple demo-only project permissions layer.

Scope:
- sign-in based on the existing `users` table
- initial sign-in must be presented as a modal gate on app load
- project access resolution through `project_members`
- project-level viewer/editor permissions resolved from the user's `role` in `project_members`
- projects list visibility based on membership
- create project UI for the current demo user
- minimal member management UI

Rules:
- keep the auth model demo-only and lightweight
- keep sign-in demo-only (user selection via dropdown is acceptable)
- use the existing schema from step 03
- use `project_members.user_id -> users.id`, not username-based joins
- do not redesign the read or CRUD architecture introduced in steps 03 and 04
- derive Gantt `readOnly` mode from the resolved project membership role
- show only projects available to the current demo user through `project_members`
- do not add passwords, sessions, or production-style authentication flows

Append to build-log.md the full request and full response after completion (append only, do not modify existing entries).