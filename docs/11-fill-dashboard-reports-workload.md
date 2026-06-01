Before implementing, review 00-project-architecture.md and use it as the architecture baseline. Follow it by default, deviate only when necessary.

Task 11:
Fill the existing Dashboard, Reports, and Workload pages with the following content and layout.

Dashboard

Page
Title: Dashboard

About Card
Title: About this demo app
Text: starter project planning tool built with DHTMLX React Gantt, React, Lovable, and Supabase

Quick Actions Card
Title: Quick actions
Button: Open Projects ->
Action: navigate to the same Projects route as in the sidebar

Features Card
Title: Features demonstrated in this demo
Items:
Multi-project planning
Gantt timeline per project
Task dependencies
Drag-and-drop scheduling
Supabase data persistence
Viewer / Editor roles

Layout
Top row: 1 full-width card
Bottom row: 2 side-by-side cards
No extra elements
UI only, except navigation

Reports

Page
Title: Reports
Subtitle: Project and task overview.

Stats
Projects
Icon: folder/projects
Value: total accessible projects

Tasks
Icon: list/tasks
Value: total tasks in accessible projects

Rules
Use existing data layer
Do not hardcode values
Count only projects available through project_members
Count only tasks from accessible projects
No extra charts or widgets

Layout
2 equal cards in one row
Center icon, value, and label vertically
Keep styling consistent with Dashboard

Workload

Page
Title: Workload
Subtitle: Team capacity and task distribution.

Stats
Team Members
Value: unique users from project_members in accessible projects

Assigned Tasks
Value: assigned tasks in accessible projects

Team Workload Card
Title: Team Workload
Content: vertical user list

Row Content
User name
Secondary text: username or login
Assigned tasks count, for example: 5 tasks

Rules
Use users from project_members
Respect project visibility
Count assigned tasks only
All values must be dynamic

Layout
Simple list inside a card
Spacing and styling consistent with other pages

Append to build-log.md the full request and full response after completion (append only, do not modify existing entries).