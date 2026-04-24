Before implementing, review 00-project-architecture.md and use it as the architecture baseline. Follow it by default, deviate only when necessary.

Task 09:
Add resources and task assignee support.

Scope:
- a resource panel with workload values based on assigned tasks
- resource selection in the lightbox

Rules:
- use the same persisted assignee field as the task model, mapping `tasks.assignee_user_id` to the Gantt-side `resource_id`
- build the resource list from current project members only
- include an explicit `Unassigned` resource option for tasks without an assignee
- keep assignee display and editing tied to the same persisted assignee/resource field
- show resource name and workload in the resource grid
- visually distinguish normal load and overload in resource panel cells
- display workload in hours
- compute each resource timeline cell value as assigned task count multiplied by 8
- render resource timeline values as small centered circular badges
- provide base CSS for the cell and badge so the badge is centered, rounded, fixed-size, and high-contrast
- show badge values as numbers only, for example 8, 16, 24
- use different badge styles for normal load and overload
- show resource grid workload values in the same hour-based model, for example 8h, 16h, 24h

Append to build-log.md the full request and full response after completion (append only, do not modify existing entries).