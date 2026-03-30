import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Gantt, { type GanttConfig, type Link, type ReactGanttRef, type Task } from "@dhtmlx/trial-react-gantt";
import "@dhtmlx/trial-react-gantt/dist/react-gantt.css";
import { useTheme } from "@/hooks/use-theme";
import { useGanttData } from "@/features/gantt/api/useGanttData";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { isRealUUID, buildTaskInsert, buildTaskUpdate, buildLinkInsert } from "@/features/gantt/utils/payload";
import { useAppDispatch, useAppSelector } from "@/features/gantt/store";
import { hydrate, reset, commit, patch, undo, redo } from "@/features/gantt/store/ganttSlice";
import { serializeTask, serializeLink, deserializeTask, deserializeLink } from "@/features/gantt/store/serialization";
import type { GanttSnapshot, SerializedTask, SerializedLink } from "@/features/gantt/store/types";
import { GanttToolbar } from "./GanttToolbar";
import { ZOOM_LEVELS, type ZoomLevel } from "@/features/gantt/utils/zoom";
import { PROJECT_CALENDAR, isNonWorkingDay } from "@/features/gantt/utils/calendar";
import type { GanttTemplates } from "@dhtmlx/trial-react-gantt";

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
  const presentRef = useRef(present);
  presentRef.current = present;
  const pastRef = useRef(past);
  pastRef.current = past;
  const futureRef = useRef(future);
  futureRef.current = future;

  const [zoom, setZoom] = useState<ZoomLevel>("day");

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
    for (const t of presentRef.current.tasks) {
      if (t.sortorder > max) max = t.sortorder;
    }
    return max + 1;
  }, []);

  const persistSnapshot = useCallback(
    async (previousSnapshot: GanttSnapshot, nextSnapshot: GanttSnapshot) => {
      const nextTaskRows = nextSnapshot.tasks
        .filter((task) => isRealUUID(String(task.id)))
        .map((task) => ({
          id: String(task.id),
          project_id: projectId,
          text: task.text,
          start_date: task.start_date,
          duration: task.duration,
          progress: task.progress,
          parent_id: isRealUUID(String(task.parent)) ? String(task.parent) : null,
          sortorder: task.sortorder,
          type: task.type ?? "task",
          assignee_user_id: task.assignee_user_id ?? null,
        }));

      const previousTaskIds = new Set(
        previousSnapshot.tasks.filter((task) => isRealUUID(String(task.id))).map((task) => String(task.id)),
      );
      const nextTaskIds = new Set(nextTaskRows.map((task) => task.id));
      const deletedTaskIds = [...previousTaskIds].filter((id) => !nextTaskIds.has(id));

      if (nextTaskRows.length > 0) {
        const { error } = await supabase.from("tasks").upsert(nextTaskRows);
        if (error) throw error;
      }

      if (deletedTaskIds.length > 0) {
        const { error } = await supabase.from("tasks").delete().in("id", deletedTaskIds);
        if (error) throw error;
      }

      const previousLinks = new Map(
        previousSnapshot.links
          .filter((link) => isRealUUID(String(link.id)))
          .map((link) => [String(link.id), link] as const),
      );
      const nextLinks = new Map(
        nextSnapshot.links
          .filter(
            (link) => isRealUUID(String(link.id)) && isRealUUID(String(link.source)) && isRealUUID(String(link.target)),
          )
          .map((link) => [String(link.id), link] as const),
      );

      const deletedLinkIds = [...previousLinks.keys()].filter((id) => !nextLinks.has(id));
      const insertedLinks = [...nextLinks.entries()]
        .filter(([id]) => !previousLinks.has(id))
        .map(([, link]) => ({
          id: String(link.id),
          project_id: projectId,
          source: String(link.source),
          target: String(link.target),
          type: String(link.type),
        }));

      if (deletedLinkIds.length > 0) {
        const { error } = await supabase.from("links").delete().in("id", deletedLinkIds);
        if (error) throw error;
      }

      if (insertedLinks.length > 0) {
        const { error } = await supabase.from("links").insert(insertedLinks);
        if (error) throw error;
      }
    },
    [projectId],
  );

  // ── Row reorder ────────────────────────────────────────────
  const handleReorder = useCallback(
    async (movedTask: Task) => {
      const currentSnapshot = presentRef.current;
      const moved = movedTask as any;
      const targetId = moved.target;
      const newParent = moved.parent;

      // Build the current ordered list
      const currentTasks = [...currentSnapshot.tasks];

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
          links: currentSnapshot.links,
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
          supabase.from("tasks").update({ sortorder, parent_id }).eq("id", id),
        ),
      );
    },
    [dispatch],
  );

  // ── CRUD handler ───────────────────────────────────────────
  const handleSave = useCallback(
    async (entity: string, action: string, item: any, id: string | number) => {
      const currentSnapshot = presentRef.current;

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
              tasks: [...currentSnapshot.tasks, newTask],
              links: currentSnapshot.links,
            }),
          );

          const payload = buildTaskInsert(task, projectId, sortorder);
          const { data, error: err } = await supabase.from("tasks").insert(payload).select("id").single();

          if (data) {
            const realId = data.id;
            // Patch IDs in-place (no history push)
            dispatch(
              patch({
                tasks: currentSnapshot.tasks.concat(newTask).map((t) => (t.id === task.id ? { ...t, id: realId } : t)),
                links: currentSnapshot.links.map((l) => ({
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
          const existing = currentSnapshot.tasks.find((t) => t.id === id);
          if (existing) updated.sortorder = existing.sortorder;

          dispatch(
            commit({
              tasks: currentSnapshot.tasks.map((t) => (t.id === id ? updated : t)),
              links: currentSnapshot.links,
            }),
          );

          if (isRealUUID(String(id))) {
            const payload = buildTaskUpdate(task);
            const { error: err } = await supabase.from("tasks").update(payload).eq("id", String(id));
            if (err) console.error("Task update failed:", err);
          }
        }

        if (action === "delete") {
          dispatch(
            commit({
              tasks: currentSnapshot.tasks.filter((t) => t.id !== id),
              links: currentSnapshot.links,
            }),
          );

          if (isRealUUID(String(id))) {
            const { error: err } = await supabase.from("tasks").delete().eq("id", String(id));
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
              tasks: currentSnapshot.tasks,
              links: [...currentSnapshot.links, newLink],
            }),
          );

          const payload = buildLinkInsert(link, projectId);
          if (payload) {
            const { data, error: err } = await supabase.from("links").insert(payload).select("id").single();

            if (data) {
              const realId = data.id;
              dispatch(
                patch({
                  links: currentSnapshot.links
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
              tasks: currentSnapshot.tasks,
              links: currentSnapshot.links.filter((l) => l.id !== id),
            }),
          );

          if (isRealUUID(String(id))) {
            const { error: err } = await supabase.from("links").delete().eq("id", String(id));
            if (err) console.error("Link delete failed:", err);
          }
        }
      }
    },
    [projectId, nextSortorder, handleReorder, dispatch],
  );

  // ── Undo/Redo handlers ────────────────────────────────────
  const handleUndo = useCallback(async () => {
    const previousSnapshot = presentRef.current;
    const targetSnapshot = pastRef.current[pastRef.current.length - 1];
    if (!targetSnapshot) return;

    dispatch(undo());
    try {
      await persistSnapshot(previousSnapshot, targetSnapshot);
    } catch (err) {
      console.error("Undo persistence failed:", err);
    }
  }, [dispatch, persistSnapshot]);

  const handleRedo = useCallback(async () => {
    const previousSnapshot = presentRef.current;
    const targetSnapshot = futureRef.current[0];
    if (!targetSnapshot) return;

    dispatch(redo());
    try {
      await persistSnapshot(previousSnapshot, targetSnapshot);
    } catch (err) {
      console.error("Redo persistence failed:", err);
    }
  }, [dispatch, persistSnapshot]);

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
      work_time: true,
      skip_off_time: false,
    }),
    [readOnly, zoom],
  );

  const templates: GanttTemplates = useMemo(
    () => ({
      timeline_cell_class: (_item: Task, date: Date) => (isNonWorkingDay(date) ? "weekend-cell" : ""),
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
          templates={templates}
          calendars={[PROJECT_CALENDAR]}
          theme={ganttTheme}
          data={{ save: handleSave }}
        />
      </div>
    </div>
  );
}
