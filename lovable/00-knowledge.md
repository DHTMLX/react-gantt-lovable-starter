# DHTMLX React Gantt

## Source Of Truth

- use only these sources: 
  1. this knowledge file
  2. DHTMLX MCP server
  3. web search/fetch on `https://docs.dhtmlx.com/gantt/integrations/react/`
- Never guess APIs or props

## Package

`@dhtmlx/trial-react-gantt`

## Required Setup

- Install: `npm install @dhtmlx/trial-react-gantt`
- CSS import MUST be a separate line: `import "@dhtmlx/trial-react-gantt/dist/react-gantt.css";`
- Gantt container must have explicit height, e.g. `style={{ height: "500px" }}`

## Important Codegen Rules

- Prefer JavaScript Date objects for all date fields (e.g. `start_date`)
- Use `data.save` callback for CRUD handling
- Keep tasks and links in React state
- Wrap config and templates in `useMemo` if they contain functions to avoid re-renders

## Exported Types

```ts
import Gantt, {
  type Task,
  type Link,
  type GanttConfig,
  type GanttTemplates,
  type GanttPlugins,
  type ReactGanttRef,
  type Resource,
  type Baseline,
  type Marker,
  type Calendar,
  type GroupConfig,
} from "@dhtmlx/trial-react-gantt";
```

## Main Props

- `tasks: Task[]` — array of task objects
- `links: Link[]` — array of link objects
- `config: GanttConfig` — merged into gantt.config
- `templates: GanttTemplates` — overrides gantt.templates
- `theme: "terrace" | "dark"` — component theme
- `plugins: GanttPlugins` — enabled extensions such as `critical_path` and `auto_scheduling`
- `resources: Resource[]` — resource management data
- `baselines: Baseline[]` — baseline data
- `markers: Marker[]` — timeline marker objects
- `calendars: Calendar[]` — work calendar definitions
- `locale: string` — locale code, default is `"en"`
- `data: { save?, load?, batchSave? }` — data transport callbacks
- `customLightbox: ReactElement` — custom task editor dialog
- `inlineEditors: object` — custom inline editors by type
- `groupTasks: GroupConfig` — task grouping configuration
- `filter: (task: Task) => boolean` — task filter function
- `ref: ReactGanttRef` — access to the underlying gantt API

## Core Data Shapes

```ts
interface Task {
  id: number | string;
  text: string;
  start_date: Date;
  duration: number;
  progress: number;
  parent: number | string;
  type?: "task" | "project" | "milestone";
  open?: boolean;
  end_date?: Date;
}

interface Link {
  id: number | string;
  source: number | string;
  target: number | string;
  type: "0" | "1" | "2" | "3";
}
```

## Common Config Options

```ts
const config: GanttConfig = {
  grid_width: 400,
  row_height: 36,
  bar_height: 24,

  scales: [
    { unit: "year", step: 1, date: "%Y" },
    { unit: "month", step: 1, date: "%M %Y" },
    { unit: "week", step: 1, date: "Week %W" },
  ],

  columns: [
    { name: "text", label: "Task name", width: 200, tree: true },
    { name: "start_date", label: "Start", align: "center", width: 90 },
    { name: "duration", label: "Duration", align: "center", width: 70 },
  ],

  drag_move: true,
  drag_resize: true,
  readonly: false,
};
```

## Plugins

```tsx
<Gantt
  plugins={{
    critical_path: true,
    auto_scheduling: true,
    marker: true,
    tooltip: true,
  }}
/>
```

## Ref API Access

```ts
const ganttRef = useRef<ReactGanttRef>(null);
const gantt = ganttRef.current?.instance;

if (gantt) {
  gantt.updateTask(1);
  gantt.render();
}
```

## Theme Integration

```ts
import { useTheme } from "next-themes";

const { resolvedTheme } = useTheme();
const theme = resolvedTheme === "dark" ? "dark" : "terrace";

<Gantt theme={theme} />
```

## Supabase Integration Pattern

```ts
import { supabase } from "@/integrations/supabase/client";

const { data: tasks } = await supabase
  .from("tasks")
  .select("*");

const formattedTasks = tasks.map(t => ({
  ...t,
  start_date: new Date(t.start_date),
}));

const handleSave = (entity, action, item, id) => {
  if (entity === "task") {
    if (action === "create") supabase.from("tasks").insert(item);
    if (action === "update") supabase.from("tasks").update(item).eq("id", id);
    if (action === "delete") supabase.from("tasks").delete().eq("id", id);
  }
};
```

## Complete Component Example

```tsx
import { useMemo, useRef, useState } from "react";
import Gantt, {
  type GanttConfig,
  type GanttTemplates,
  type Link,
  type ReactGanttRef,
  type Resource,
  type Task,
} from "@dhtmlx/trial-react-gantt";
import "@dhtmlx/trial-react-gantt/dist/react-gantt.css";

type TaskA = Task & {
  assignee_user_id?: string | null;
};

const resources: Resource[] = [
  { id: "user-1", text: "Jane Doe" },
  { id: "user-2", text: "John Smith" },
  { id: "unassigned", text: "Unassigned" },
];

const initTasks: TaskA[] = [
  ...
  {
    id: "2",
    text: "Design",
    start_date: new Date(2026, 2, 2),
    duration: 3,
    progress: 0.6,
    parent: "1",
    assignee_user_id: "user-1"
  },
];

const initLinks: Link[] = [
  { id: "1", source: "2", target: "3", type: "0" },
];

interface ResGanttProps {
  theme?: "terrace" | "dark";
}

export default function ResGantt({ theme = "terrace" }: ResGanttProps) {
  const ganttRef = useRef<ReactGanttRef>(null);
  const [tasks, setTasks] = useState<TaskA[]>(initTasks);
  const [links, setLinks] = useState<Link[]>(initLinks);

  const rCfg = useMemo(
    () => ({
      columns: [
        { name: "name", label: "Name", tree: true, template: (resource: Resource) => resource.text },
        {
          name: "workload",
          label: "Workload",
          align: "center",
          template: (resource: Resource) => {
            const items = tasks.filter(
              (t) =>
                t.type !== "project" &&
                (t.assignee_user_id ?? "unassigned") === resource.id,
            );

            const dur = items.reduce(
              (sum, t) => sum + (t.duration || 0),
              0,
            );

            return `${dur * 8}h`;
          },
        },
      ],
    }),
    [tasks],
  );

  const config: GanttConfig = useMemo(
    () => ({
      grid_width: 400,
      row_height: 40,
      bar_height: 24,
      scales: [
        { unit: "month", step: 1, date: "%F %Y" },
        { unit: "week", step: 1, date: "Week %W" },
      ],
      resource_store: "resources",
      resource_property: "assignee_user_id",
      columns: [
        { name: "text", label: "Task", tree: true, width: "*" },
        {
          name: "owner",
          label: "Owner",
          align: "center",
          width: 120,
          template: (task: TaskA) => {
            const resource = resources.find(
              (r) => r.id === (task.assignee_user_id ?? "unassigned"),
            );
            return resource?.text ?? "Unassigned";
          },
        },
        { name: "duration", label: "Days", align: "center", width: 60 },
        { name: "add", label: "", width: 44 },
      ],
      lightbox: {
        sections: [
          { name: "description", height: 38, map_to: "text", type: "textarea", focus: true },
          {
            name: "resources",
            type: "select",
            map_to: "assignee_user_id",
            options: resources.map((resource) => ({
              key: resource.id,
              label: resource.text,
            })),
          },
          { name: "time", type: "duration", map_to: "auto" },
        ],
      },
      layout: {
        rows: [
          {
            cols: [
              { view: "grid", group: "grids", scrollY: "v1" },
              { resizer: true, width: 1 },
              { view: "timeline", scrollX: "h", scrollY: "v1" },
              { view: "scrollbar", id: "v1", group: "vertical" },
            ],
            gravity: 2,
          },
          { resizer: true, width: 1 },
          {
            config: rCfg,
            cols: [
              { view: "resourceGrid", group: "grids", scrollY: "v2" },
              { resizer: true, width: 1 },
              { view: "resourceTimeline", scrollX: "h", scrollY: "v2" },
              { view: "scrollbar", id: "v2", group: "vertical" },
            ],
            gravity: 1,
          },
          { view: "scrollbar", id: "h" },
        ],
      },
    }),
    [rCfg],
  );

  const templates: GanttTemplates = useMemo(
    () => ({
      task_class: (_start: Date, _end: Date, task: Task) =>
        task.progress >= 1 ? "completed-task" : "",
      resource_cell_class: (_start, _end, _resource, tasks) => {
        const css = ["gantt__resource-cell"];
        if (tasks.length <= 1) css.push("gantt__resource-cell--ok");
        else css.push("gantt__resource-cell--over");
        return css.join(" ");
      },
      resource_cell_value: (_start, _end, _resource, tasks) =>
        `<div>${tasks.length * 8}</div>`,
    }),
    [],
  );

  return (
    <div style={{ height: "700px", width: "100%" }}>
      <Gantt
        ref={ganttRef}
        tasks={tasks}
        links={links}
        resources={resources}
        config={config}
        templates={templates}
        theme={theme}
        data={{
          save: (entity, action, item, id) => {
            if (entity === "task") {
              if (action === "create") setTasks((prev) => [...prev, item as TaskA]);
              if (action === "update") {
                setTasks((prev) =>
                  prev.map((task) => (task.id === id ? (item as TaskA) : task)),
                );
              }
              if (action === "delete") {
                setTasks((prev) => prev.filter((task) => task.id !== id));
              }
            }

            if (entity === "link") {
              if (action === "create") setLinks((prev) => [...prev, item as Link]);
              if (action === "update") {
                setLinks((prev) =>
                  prev.map((link) => (link.id === id ? (item as Link) : link)),
                );
              }
              if (action === "delete") {
                setLinks((prev) => prev.filter((link) => link.id !== id));
              }
            }
          },
        }}
      />
    </div>
  );
}
```
