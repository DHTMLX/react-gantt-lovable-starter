import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Task as GanttTask, Link as GanttLink } from "@dhtmlx/trial-react-gantt";

// ── Row → Gantt mapping ──────────────────────────────────────

interface TaskRow {
  id: string;
  text: string;
  start_date: string | null;
  duration: number | null;
  progress: number;
  parent_id: string | null;
  sortorder: number;
  type: string;
  assignee_user_id: string | null;
}

interface LinkRow {
  id: string;
  source: string;
  target: string;
  type: string;
}

function rowToGanttTask(row: TaskRow): GanttTask {
  return {
    id: row.id,
    text: row.text,
    start_date: row.start_date ? new Date(row.start_date) : new Date(),
    duration: row.duration ?? 1,
    progress: Number(row.progress),
    parent: row.parent_id ?? 0,
    type: row.type as GanttTask["type"],
    open: row.type === "project",
  };
}

function rowToGanttLink(row: LinkRow): GanttLink {
  return {
    id: row.id,
    source: row.source,
    target: row.target,
    type: row.type as GanttLink["type"],
  };
}

// ── Query functions ──────────────────────────────────────────

async function fetchTasks(projectId: string): Promise<GanttTask[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, text, start_date, duration, progress, parent_id, sortorder, type, assignee_user_id")
    .eq("project_id", projectId)
    .order("sortorder");

  if (error) throw error;
  return (data ?? []).map(rowToGanttTask);
}

async function fetchLinks(projectId: string): Promise<GanttLink[]> {
  const { data, error } = await supabase
    .from("links")
    .select("id, source, target, type")
    .eq("project_id", projectId);

  if (error) throw error;
  return (data ?? []).map(rowToGanttLink);
}

// ── Hook ─────────────────────────────────────────────────────

export function useGanttData(projectId: string | undefined) {
  const tasksQuery = useQuery({
    queryKey: ["gantt-tasks", projectId],
    queryFn: () => fetchTasks(projectId!),
    enabled: !!projectId,
  });

  const linksQuery = useQuery({
    queryKey: ["gantt-links", projectId],
    queryFn: () => fetchLinks(projectId!),
    enabled: !!projectId,
  });

  return {
    tasks: tasksQuery.data ?? [],
    links: linksQuery.data ?? [],
    isLoading: tasksQuery.isLoading || linksQuery.isLoading,
    error: tasksQuery.error || linksQuery.error,
  };
}
