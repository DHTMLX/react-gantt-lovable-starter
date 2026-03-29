import { useMemo, useRef, useState, useEffect } from "react";
import Gantt, {
  type GanttConfig,
  type Link,
  type ReactGanttRef,
  type Task,
} from "@dhtmlx/trial-react-gantt";
import "@dhtmlx/trial-react-gantt/dist/react-gantt.css";
import { useTheme } from "@/hooks/use-theme";
import { useGanttData } from "@/features/gantt/api/useGanttData";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectGanttProps {
  projectId: string;
}

export default function ProjectGantt({ projectId }: ProjectGanttProps) {
  const ganttRef = useRef<ReactGanttRef>(null);
  const { theme: appTheme } = useTheme();
  const { tasks: dbTasks, links: dbLinks, isLoading, error } = useGanttData(projectId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  // Sync DB data into local state when it arrives
  useEffect(() => {
    if (dbTasks.length > 0 || !isLoading) setTasks(dbTasks);
  }, [dbTasks, isLoading]);

  useEffect(() => {
    if (dbLinks.length > 0 || !isLoading) setLinks(dbLinks);
  }, [dbLinks, isLoading]);

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

  if (isLoading) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }

  if (error) {
    return <p className="text-destructive">Failed to load Gantt data.</p>;
  }

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
