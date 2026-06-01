Before implementing, review 00-project-architecture.md and use it as the architecture baseline. Follow it by default, deviate only when necessary.

Task 02:
Add DHTMLX trial React Gantt to the project detail page.

Rules:
- use mock data (tasks, links).
- render it at /projects/:id:
    - opening a project shows the chart
    - the Gantt fills the available content area in full width and height
- use the existing app theme as the single source of truth
- gantt must automatically follow light/dark mode changes
- do not introduce a separate theme state or switcher

Append to build-log.md the full request and full response after completion (append only, do not modify existing entries).