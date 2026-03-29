import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDemoAuth } from "@/features/auth/DemoAuthContext";

export type ProjectRole = "owner" | "editor" | "viewer" | null;

async function fetchRole(projectId: string, userId: string): Promise<ProjectRole> {
  const { data, error } = await supabase
    .from("project_members")
    .select("role")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.role as ProjectRole) ?? null;
}

export function useProjectRole(projectId: string | undefined) {
  const { user } = useDemoAuth();

  return useQuery({
    queryKey: ["project-role", projectId, user?.id],
    queryFn: () => fetchRole(projectId!, user!.id),
    enabled: !!projectId && !!user,
  });
}
