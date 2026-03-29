import { useMemo, useRef, useState } from "react";
import Gantt, {
  type GanttConfig,
  type Link,
  type ReactGanttRef,
  type Task,
} from "@dhtmlx/trial-react-gantt";
import "@dhtmlx/trial-react-gantt/dist/react-gantt.css";
import { useTheme } from "@/hooks/use-theme";

interface ProjectGanttProps {
  projectId: string;
}

function buildMockData(projectId: string) {
  const base = new Date(2026, 2, 2);
  const d = (offset: number) => new Date(base.getTime() + offset * 86400000);

  const taskSets: Record<string, { tasks: Task[]; links: Link[] }> = {
    "1": {
      tasks: [
        { id: "1", text: "Website Redesign", start_date: d(0), duration: 20, progress: 0.5, parent: 0, type: "project", open: true },
        { id: "2", text: "Research & Discovery", start_date: d(0), duration: 4, progress: 1, parent: "1" },
        { id: "3", text: "Wireframes", start_date: d(4), duration: 5, progress: 0.8, parent: "1" },
        { id: "4", text: "Visual Design", start_date: d(9), duration: 6, progress: 0.4, parent: "1" },
        { id: "5", text: "Development", start_date: d(12), duration: 8, progress: 0.1, parent: "1" },
        { id: "6", text: "QA & Launch", start_date: d(18), duration: 2, progress: 0, parent: "1", type: "milestone" },
      ],
      links: [
        { id: "1", source: "2", target: "3", type: "0" },
        { id: "2", source: "3", target: "4", type: "0" },
        { id: "3", source: "4", target: "5", type: "0" },
        { id: "4", source: "5", target: "6", type: "0" },
      ],
    },
  };

  // Fallback: generate generic tasks for unknown project IDs
  return taskSets[projectId] ?? {
    tasks: [
      { id: "1", text: "Project Kickoff", start_date: d(0), duration: 2, progress: 1, parent: 0, open: true },
      { id: "2", text: "Planning", start_date: d(2), duration: 5, progress: 0.5, parent: 0 },
      { id: "3", text: "Execution", start_date: d(7), duration: 10, progress: 0, parent: 0 },
    ],
    links: [
      { id: "1", source: "1", target: "2", type: "0" },
      { id: "2", source: "2", target: "3", type: "0" },
    ],
  };
}

export default function ProjectGantt({ projectId }: ProjectGanttProps) {
  const ganttRef = useRef<ReactGanttRef>(null);
  const { theme: appTheme } = useTheme();

  const mock = useMemo(() => buildMockData(projectId), [projectId]);
  const [tasks, setTasks] = useState<Task[]>(mock.tasks);
  const [links, setLinks] = useState<Link[]>(mock.links);

  const config: GanttConfig = useMemo(
    () => ({
      grid_width: 340,
      row_height: 36,
      bar_height: 24,
      scales: [
        { unit: "month", step: 1, date: "%F %Y" },
        { unit: "week", step: 1, date: "Week %W" },
      ],
      columns: [
        { name: "text", label: "Task", tree: true, width: "*" },
        { name: "start_date", label: "Start", align: "center", width: 90 },
        { name: "duration", label: "Days", align: "center", width: 60 },
        { name: "add", label: "", width: 44 },
      ],
      drag_move: true,
      drag_resize: true,
    }),
    [],
  );

  const ganttTheme = appTheme === "dark" ? "dark" : "terrace";

  return (
    <div className="w-full h-full">
      <Gantt
        ref={ganttRef}
        tasks={tasks}
        links={links}
        config={config}
        theme={ganttTheme}
        data={{
          save: (entity, action, item, id) => {
            if (entity === "task") {
              if (action === "create") setTasks((prev) => [...prev, item as Task]);
              if (action === "update") setTasks((prev) => prev.map((t) => (t.id === id ? (item as Task) : t)));
              if (action === "delete") setTasks((prev) => prev.filter((t) => t.id !== id));
            }
            if (entity === "link") {
              if (action === "create") setLinks((prev) => [...prev, item as Link]);
              if (action === "update") setLinks((prev) => prev.map((l) => (l.id === id ? (item as Link) : l)));
              if (action === "delete") setLinks((prev) => prev.filter((l) => l.id !== id));
            }
          },
        }}
      />
    </div>
  );
}
