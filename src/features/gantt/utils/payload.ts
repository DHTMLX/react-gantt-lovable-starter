/**
 * Build Supabase write payloads from normalized Gantt task/link models.
 *
 * Never send the raw `data.save` item directly — always map through these
 * builders so we control exactly which columns are written.
 */

import type { Task as GanttTask, Link as GanttLink } from "@dhtmlx/trial-react-gantt";
import { dateToISO } from "./date";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isRealUUID(id: string | number | undefined | null): boolean {
  if (!id) return false;
  return UUID_RE.test(String(id));
}

// ── Task payload ────────────────────────────────────────────

export interface TaskInsertPayload {
  project_id: string;
  text: string;
  start_date: string | null;
  duration: number | null;
  progress: number;
  parent_id: string | null;
  sortorder: number;
  type: string;
  assignee_user_id: string | null;
}

export interface TaskUpdatePayload {
  text?: string;
  start_date?: string | null;
  duration?: number | null;
  progress?: number;
  parent_id?: string | null;
  type?: string;
  assignee_user_id?: string | null;
}

export function buildTaskInsert(
  task: GanttTask,
  projectId: string,
  sortorder: number,
): TaskInsertPayload {
  const assignee = (task as any).assignee_user_id;
  return {
    project_id: projectId,
    text: task.text ?? "New task",
    start_date: dateToISO(task.start_date as Date | null),
    duration: task.duration ?? null,
    progress: Number(task.progress) || 0,
    parent_id: isRealUUID(task.parent as string) ? String(task.parent) : null,
    sortorder,
    type: task.type ?? "task",
    assignee_user_id: isRealUUID(assignee) ? assignee : null,
  };
}

export function buildTaskUpdate(task: GanttTask): TaskUpdatePayload {
  const assignee = (task as any).assignee_user_id;
  return {
    text: task.text,
    start_date: dateToISO(task.start_date as Date | null),
    duration: task.duration ?? null,
    progress: Number(task.progress) || 0,
    parent_id: isRealUUID(task.parent as string) ? String(task.parent) : null,
    type: task.type ?? "task",
    assignee_user_id: isRealUUID(assignee) ? assignee : null,
  };
}

// ── Link payload ────────────────────────────────────────────

export interface LinkInsertPayload {
  project_id: string;
  source: string;
  target: string;
  type: string;
}

export function buildLinkInsert(
  link: GanttLink,
  projectId: string,
): LinkInsertPayload | null {
  const source = String(link.source);
  const target = String(link.target);
  // Only persist when both ends are real persisted tasks
  if (!isRealUUID(source) || !isRealUUID(target)) return null;
  return {
    project_id: projectId,
    source,
    target,
    type: String(link.type),
  };
}
