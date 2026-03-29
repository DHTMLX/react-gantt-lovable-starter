import { useMemo, useRef, useState, useEffect, useCallback } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import {
  isRealUUID,
  buildTaskInsert,
  buildTaskUpdate,
  buildLinkInsert,
} from "@/features/gantt/utils/payload";

interface ProjectGanttProps {
  projectId: string;
  readOnly?: boolean;
}

export default function ProjectGantt({ projectId, readOnly = false }: ProjectGanttProps) {
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

  // ── Next sortorder helper ──────────────────────────────────
  const nextSortorder = useCallback((): number => {
    let max = 0;
    // Read from latest state via functional ref isn't possible here,
    // but we can read the current tasks array (it's from useState).
    for (const t of tasks) {
      const so = (t as any).sortorder ?? 0;
      if (so > max) max = so;
    }
    return max + 1;
  }, [tasks]);

  // ── CRUD handlers ──────────────────────────────────────────

  const handleSave = useCallback(
    async (
      entity: string,
      action: string,
      item: any,
      id: string | number,
    ) => {
      // ── TASK CRUD ────────────────────────────────────────
      if (entity === "task") {
        const task = item as Task;

        if (action === "create") {
          const sortorder = nextSortorder();
          // Optimistic: add with temp id
          setTasks((prev) => [...prev, { ...task, sortorder } as any]);

          const payload = buildTaskInsert(task, projectId, sortorder);
          const { data, error: err } = await supabase
            .from("tasks")
            .insert(payload)
            .select("id")
            .single();

          if (data) {
            // Replace temp id with real UUID
            const realId = data.id;
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, id: realId } : t)),
            );
            // Also update any links referencing the temp id
            setLinks((prev) =>
              prev.map((l) => ({
                ...l,
                source: l.source === task.id ? realId : l.source,
                target: l.target === task.id ? realId : l.target,
              })),
            );
          }
          if (err) console.error("Task insert failed:", err);
        }

        if (action === "update") {
          // Optimistic update
          setTasks((prev) =>
            prev.map((t) => (t.id === id ? (task as Task) : t)),
          );

          if (isRealUUID(String(id))) {
            const payload = buildTaskUpdate(task);
            const { error: err } = await supabase
              .from("tasks")
              .update(payload)
              .eq("id", String(id));
            if (err) console.error("Task update failed:", err);
          }
        }

        if (action === "delete") {
          setTasks((prev) => prev.filter((t) => t.id !== id));

          if (isRealUUID(String(id))) {
            const { error: err } = await supabase
              .from("tasks")
              .delete()
              .eq("id", String(id));
            if (err) console.error("Task delete failed:", err);
          }
        }
      }

      // ── LINK CRUD ────────────────────────────────────────
      if (entity === "link") {
        const link = item as Link;

        if (action === "create") {
          // Optimistic
          setLinks((prev) => [...prev, link]);

          const payload = buildLinkInsert(link, projectId);
          if (payload) {
            const { data, error: err } = await supabase
              .from("links")
              .insert(payload)
              .select("id")
              .single();

            if (data) {
              const realId = data.id;
              setLinks((prev) =>
                prev.map((l) => (l.id === link.id ? { ...l, id: realId } : l)),
              );
            }
            if (err) console.error("Link insert failed:", err);
          }
        }

        if (action === "delete") {
          setLinks((prev) => prev.filter((l) => l.id !== id));

          if (isRealUUID(String(id))) {
            const { error: err } = await supabase
              .from("links")
              .delete()
              .eq("id", String(id));
            if (err) console.error("Link delete failed:", err);
          }
        }
      }
    },
    [projectId, nextSortorder],
  );

  // ── Config ─────────────────────────────────────────────────

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
        data={{ save: handleSave }}
      />
    </div>
  );
}
