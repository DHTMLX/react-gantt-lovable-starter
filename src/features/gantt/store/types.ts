/**
 * Serializable snapshot of Gantt task state for undo/redo history.
 * Dates are stored as ISO strings to keep Redux state serializable.
 */

export interface SerializedTask {
  id: string | number;
  text: string;
  start_date: string | null; // ISO string
  duration: number;
  progress: number;
  parent: string | number;
  type?: string;
  open?: boolean;
  sortorder: number;
  assignee_user_id?: string | null;
}

export interface SerializedLink {
  id: string | number;
  source: string | number;
  target: string | number;
  type: string;
}

export interface GanttSnapshot {
  tasks: SerializedTask[];
  links: SerializedLink[];
}
