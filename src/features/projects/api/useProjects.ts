import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  name: string;
  created_at: string;
  task_count: number;
  completed_count: number;
}

async function fetchProjects(): Promise<Project[]> {
  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select("id, name, created_at")
    .order("name");

  if (pErr) throw pErr;

  // Fetch task counts per project in a single query
  const { data: tasks, error: tErr } = await supabase
    .from("tasks")
    .select("project_id, progress");

  if (tErr) throw tErr;

  const counts = new Map<string, { total: number; completed: number }>();
  for (const t of tasks ?? []) {
    const entry = counts.get(t.project_id) ?? { total: 0, completed: 0 };
    entry.total++;
    if (Number(t.progress) >= 1) entry.completed++;
    counts.set(t.project_id, entry);
  }

  return (projects ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    created_at: p.created_at,
    task_count: counts.get(p.id)?.total ?? 0,
    completed_count: counts.get(p.id)?.completed ?? 0,
  }));
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}
