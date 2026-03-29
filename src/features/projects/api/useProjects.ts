import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDemoAuth } from "@/features/auth/DemoAuthContext";

export interface Project {
  id: string;
  name: string;
  created_at: string;
  task_count: number;
  completed_count: number;
}

async function fetchProjects(userId: string): Promise<Project[]> {
  // Get project IDs the user is a member of
  const { data: memberships, error: mErr } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", userId);

  if (mErr) throw mErr;

  const projectIds = (memberships ?? []).map((m) => m.project_id);
  if (projectIds.length === 0) return [];

  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select("id, name, created_at")
    .in("id", projectIds)
    .order("name");

  if (pErr) throw pErr;

  // Fetch task counts for these projects
  const { data: tasks, error: tErr } = await supabase
    .from("tasks")
    .select("project_id, progress")
    .in("project_id", projectIds);

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
  const { user } = useDemoAuth();

  return useQuery({
    queryKey: ["projects", user?.id],
    queryFn: () => fetchProjects(user!.id),
    enabled: !!user,
  });
}
