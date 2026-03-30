import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDemoAuth } from "@/features/auth/DemoAuthContext";

export interface WorkloadUser {
  id: string;
  full_name: string;
  username: string;
  assigned_count: number;
}

export interface WorkloadData {
  teamMemberCount: number;
  assignedTaskCount: number;
  users: WorkloadUser[];
}

async function fetchWorkloadData(userId: string): Promise<WorkloadData> {
  // 1. Get accessible project IDs
  const { data: memberships, error: mErr } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", userId);
  if (mErr) throw mErr;

  const projectIds = (memberships ?? []).map((m) => m.project_id);
  if (projectIds.length === 0) {
    return { teamMemberCount: 0, assignedTaskCount: 0, users: [] };
  }

  // 2. Get unique team members from accessible projects
  const { data: allMembers, error: amErr } = await supabase
    .from("project_members")
    .select("user_id")
    .in("project_id", projectIds);
  if (amErr) throw amErr;

  const uniqueUserIds = [...new Set((allMembers ?? []).map((m) => m.user_id))];

  // 3. Get user details
  const { data: users, error: uErr } = await supabase
    .from("users")
    .select("id, full_name, username")
    .in("id", uniqueUserIds);
  if (uErr) throw uErr;

  // 4. Get assigned tasks in accessible projects
  const { data: tasks, error: tErr } = await supabase
    .from("tasks")
    .select("assignee_user_id")
    .in("project_id", projectIds)
    .not("assignee_user_id", "is", null);
  if (tErr) throw tErr;

  // Count per user
  const countMap = new Map<string, number>();
  for (const t of tasks ?? []) {
    if (t.assignee_user_id) {
      countMap.set(t.assignee_user_id, (countMap.get(t.assignee_user_id) ?? 0) + 1);
    }
  }

  const workloadUsers: WorkloadUser[] = (users ?? []).map((u) => ({
    id: u.id,
    full_name: u.full_name,
    username: u.username,
    assigned_count: countMap.get(u.id) ?? 0,
  }));

  // Sort by assigned count descending
  workloadUsers.sort((a, b) => b.assigned_count - a.assigned_count);

  return {
    teamMemberCount: uniqueUserIds.length,
    assignedTaskCount: (tasks ?? []).length,
    users: workloadUsers,
  };
}

export function useWorkloadData() {
  const { user } = useDemoAuth();

  return useQuery({
    queryKey: ["workload-data", user?.id],
    queryFn: () => fetchWorkloadData(user!.id),
    enabled: !!user,
  });
}
