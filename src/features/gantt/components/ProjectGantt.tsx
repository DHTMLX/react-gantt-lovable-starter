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
import { useAppDispatch, useAppSelector } from "@/features/gantt/store";
import {
  hydrate,
  reset,
  commit,
  patch,
  undo,
  redo,
} from "@/features/gantt/store/ganttSlice";
import {
  serializeTask,
  serializeLink,
  deserializeTask,
  deserializeLink,
} from "@/features/gantt/store/serialization";
import type { SerializedTask, SerializedLink } from "@/features/gantt/store/types";
import { GanttToolbar } from "./GanttToolbar";
import { ZOOM_LEVELS, type ZoomLevel } from "@/features/gantt/utils/zoom";

interface ProjectGanttProps {
  projectId: string;
  readOnly?: boolean;
}

export default function ProjectGantt({ projectId, readOnly = false }: ProjectGanttProps) {
  const ganttRef = useRef<ReactGanttRef>(null);
  const { theme: appTheme } = useTheme();
  const { tasks: dbTasks, links: dbLinks, isLoading, error } = useGanttData(projectId);

  const dispatch = useAppDispatch();
  const { past, present, future } = useAppSelector((s) => s.gantt);

  const [zoom, setZoom] = useState<ZoomLevel>("week");

  // Derive live Gantt arrays from Redux (deserialize dates)
  const tasks: Task[] = useMemo(() => present.tasks.map(deserializeTask), [present.tasks]);
  const links: Link[] = useMemo(() => present.links.map(deserializeLink), [present.links]);

  // ── Hydrate from DB ───────────────────────────────────────
  const prevProjectId = useRef<string | null>(null);

  useEffect(() => {
    if (projectId !== prevProjectId.current) {
      dispatch(reset());
      prevProjectId.current = projectId;
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (!isLoading && (dbTasks.length > 0 || dbLinks.length > 0)) {
      dispatch(
        hydrate({
          tasks: dbTasks.map(serializeTask),
          links: dbLinks.map(serializeLink),
        }),
      );
    }
  }, [dbTasks, dbLinks, isLoading, dispatch]);

  // ── Helpers ────────────────────────────────────────────────
  const nextSortorder = useCallback((): number => {
    let max = 0;
    for (const t of present.tasks) {
      if (t.sortorder > max) max = t.sortorder;
    }
    return max + 1;
  }, [present.tasks]);

  // ── Row reorder ────────────────────────────────────────────
  const handleReorder = useCallback(
    async (movedTask: Task) => {
      const moved = movedTask as any;
      const targetId = moved.target;
      const newParent = moved.parent;

      // Build the current ordered list
      const currentTasks = [...present.tasks];

      // Remove the moved task from its current position
      const movedIdx = currentTasks.findIndex((t) => t.id === moved.id);
      if (movedIdx === -1) return;
      const [movedItem] = currentTasks.splice(movedIdx, 1);

      // Update parent if changed
      const updatedItem: SerializedTask = {
        ...movedItem,
        parent: newParent ?? movedItem.parent,
      };

      // Find target position
      let insertIdx: number;
      if (!targetId) {
        // Dropped at the end
        insertIdx = currentTasks.length;
      } else {
        const targetIdx = currentTasks.findIndex((t) => t.id === targetId);
        if (targetIdx === -1) {
          insertIdx = currentTasks.length;
        } else {
          insertIdx = targetIdx;
        }
      }

      currentTasks.splice(insertIdx, 0, updatedItem);

      // Recompute sortorder for all tasks
      const reordered = currentTasks.map((t, i) => ({
        ...t,
        sortorder: i + 1,
      }));

      // Commit to Redux (with history)
      dispatch(
        commit({
          tasks: reordered,
          links: present.links,
        }),
      );

      // Persist all affected sortorders + parent_id to Supabase
      const updates = reordered
        .filter((t) => isRealUUID(String(t.id)))
        .map((t) => ({
          id: String(t.id),
          sortorder: t.sortorder,
          parent_id: isRealUUID(String(t.parent)) ? String(t.parent) : null,
        }));

      // Batch update via individual calls (Supabase doesn't support batch upsert on non-PK)
      await Promise.all(
        updates.map(({ id, sortorder, parent_id }) =>
          supabase
            .from("tasks")
            .update({ sortorder, parent_id })
            .eq("id", id),
        ),
      );
    },
    [present, dispatch],
  );

  // ── CRUD handler ───────────────────────────────────────────
  const handleSave = useCallback(
    async (
      entity: string,
      action: string,
      item: any,
      id: string | number,
    ) => {
      console.log("[Gantt data.save]", entity, action, id, item);

      // ── TASK CRUD ────────────────────────────────────────
      if (entity === "task") {
        const task = item as Task;

        // Detect row reorder: task update with a `target` property
        if (action === "update" && "target" in (item as any)) {
          await handleReorder(task);
          return;
        }

        if (action === "create") {
          const sortorder = nextSortorder();
          const newTask = serializeTask({ ...task, sortorder } as any);
          newTask.sortorder = sortorder;

          dispatch(
            commit({
              tasks: [...present.tasks, newTask],
              links: present.links,
            }),
          );

          const payload = buildTaskInsert(task, projectId, sortorder);
          const { data, error: err } = await supabase
            .from("tasks")
            .insert(payload)
            .select("id")
            .single();

          if (data) {
            const realId = data.id;
            // Patch IDs in-place (no history push)
            dispatch(
              patch({
                tasks: present.tasks
                  .concat(newTask)
                  .map((t) => (t.id === task.id ? { ...t, id: realId } : t)),
                links: present.links.map((l) => ({
                  ...l,
                  source: l.source === task.id ? realId : l.source,
                  target: l.target === task.id ? realId : l.target,
                })),
              }),
            );
          }
          if (err) console.error("Task insert failed:", err);
        }

        if (action === "update") {
          const updated = serializeTask(task);
          // Preserve sortorder from existing task
          const existing = present.tasks.find((t) => t.id === id);
          if (existing) updated.sortorder = existing.sortorder;

          dispatch(
            commit({
              tasks: present.tasks.map((t) => (t.id === id ? updated : t)),
              links: present.links,
            }),
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
          dispatch(
            commit({
              tasks: present.tasks.filter((t) => t.id !== id),
              links: present.links,
            }),
          );

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
          const newLink = serializeLink(link);
          dispatch(
            commit({
              tasks: present.tasks,
              links: [...present.links, newLink],
            }),
          );

          const payload = buildLinkInsert(link, projectId);
          if (payload) {
            const { data, error: err } = await supabase
              .from("links")
              .insert(payload)
              .select("id")
              .single();

            if (data) {
              const realId = data.id;
              dispatch(
                patch({
                  links: present.links
                    .concat(newLink)
                    .map((l) => (l.id === link.id ? { ...l, id: realId } : l)),
                }),
              );
            }
            if (err) console.error("Link insert failed:", err);
          }
        }

        if (action === "delete") {
          dispatch(
            commit({
              tasks: present.tasks,
              links: present.links.filter((l) => l.id !== id),
            }),
          );

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
    [projectId, nextSortorder, handleReorder, present, dispatch],
  );

  // ── Undo/Redo handlers ────────────────────────────────────
  const handleUndo = useCallback(() => dispatch(undo()), [dispatch]);
  const handleRedo = useCallback(() => dispatch(redo()), [dispatch]);

  // ── Config ─────────────────────────────────────────────────
  const config: GanttConfig = useMemo(
    () => ({
      grid_width: 340,
      row_height: 36,
      bar_height: 24,
      scales: ZOOM_LEVELS[zoom].scales,
      columns: [
        { name: "text", label: "Task", tree: true, width: "*" },
        { name: "start_date", label: "Start", align: "center", width: 90 },
        { name: "duration", label: "Days", align: "center", width: 60 },
        ...(readOnly ? [] : [{ name: "add", label: "", width: 44 }]),
      ],
      drag_move: !readOnly,
      drag_resize: !readOnly,
      readonly: readOnly,
      order_branch: !readOnly ? "marker" : undefined,
      order_branch_free: !readOnly,
    }),
    [readOnly, zoom],
  );

  const ganttTheme = appTheme === "dark" ? "dark" : "terrace";

  if (isLoading) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }

  if (error) {
    return <p className="text-destructive">Failed to load Gantt data.</p>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <GanttToolbar
        zoom={zoom}
        onZoomChange={setZoom}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        readOnly={readOnly}
      />
      <div className="flex-1 min-h-0">
        <Gantt
          ref={ganttRef}
          tasks={tasks}
          links={links}
          config={config}
          theme={ganttTheme}
          data={{ save: handleSave }}
        />
      </div>
    </div>
  );
}
