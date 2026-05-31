Task 06:
Validate the real user flow, persistence, and core role-based editing behavior in the browser.

Verify this flow:

1. Open the app
2. Confirm the sidebar and main navigation render
3. Sign in as a viewer
4. Open the projects page
5. Open a project
6. Confirm the Gantt loads with tasks and links
7. Confirm the page shows Viewer mode
8. Confirm task editing is blocked in viewer mode
9. Sign out
10. Sign in as a lead/editor
11. Open the same project
12. Confirm the page shows Editor mode
13. Create a task
14. Drag or resize a task
15. Create a link
16. Reload the page
17. Confirm the created data persisted
18. Delete a task
19. Reload the page
20. Confirm the deletion persisted

If something fails:
- identify the exact failure point
- fix only the root cause
- avoid broad unrelated refactors
- verify the same flow again after the fix

Append to build-log.md the full request and full response after completion (append only, do not modify existing entries).