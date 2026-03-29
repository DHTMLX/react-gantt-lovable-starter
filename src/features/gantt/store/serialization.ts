import type { Task as GanttTask, Link as GanttLink } from "@dhtmlx/trial-react-gantt";
import type { SerializedTask, SerializedLink } from "./types";

/** Convert a Gantt Task (with Date objects) to a serializable form. */
export function serializeTask(t: GanttTask): SerializedTask {
  const startDate = t.start_date instanceof Date
    ? t.start_date.toISOString()
    : typeof t.start_date === "string"
      ? t.start_date
      : null;

  return {
    id: t.id,
    text: t.text,
    start_date: startDate,
    duration: t.duration ?? 1,
    progress: Number(t.progress) || 0,
    parent: t.parent ?? 0,
    type: t.type ?? "task",
    open: t.open,
    sortorder: (t as any).sortorder ?? 0,
    assignee_user_id: (t as any).assignee_user_id ?? null,
  };
}

/** Convert a serialized task back to a Gantt Task (with Date objects). */
export function deserializeTask(s: SerializedTask): GanttTask & { sortorder: number; assignee_user_id?: string | null } {
  return {
    id: s.id,
    text: s.text,
    start_date: s.start_date ? new Date(s.start_date) : new Date(),
    duration: s.duration,
    progress: s.progress,
    parent: s.parent,
    type: s.type as GanttTask["type"],
    open: s.open,
    sortorder: s.sortorder,
    assignee_user_id: s.assignee_user_id,
  } as any;
}

export function serializeLink(l: GanttLink): SerializedLink {
  return {
    id: l.id,
    source: l.source,
    target: l.target,
    type: String(l.type),
  };
}

export function deserializeLink(s: SerializedLink): GanttLink {
  return {
    id: s.id,
    source: s.source,
    target: s.target,
    type: s.type as GanttLink["type"],
  };
}
