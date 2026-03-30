import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Resource { id: string | number; text: string; [key: string]: any; }

const UNASSIGNED_RESOURCE: Resource = { id: "unassigned", text: "Unassigned" };

export type { Resource };

export function useProjectResources(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-resources", projectId],
    queryFn: async (): Promise<Resource[]> => {
      // Fetch project members with user info
      const { data: members, error: mErr } = await supabase
        .from("project_members")
        .select("user_id")
        .eq("project_id", projectId!);
      if (mErr) throw mErr;

      const userIds = (members ?? []).map((m) => m.user_id);
      if (userIds.length === 0) return [UNASSIGNED_RESOURCE];

      const { data: users, error: uErr } = await supabase
        .from("users")
        .select("id, full_name")
        .in("id", userIds);
      if (uErr) throw uErr;

      const resources: Resource[] = (users ?? []).map((u) => ({
        id: u.id,
        text: u.full_name,
      }));

      resources.push(UNASSIGNED_RESOURCE);
      return resources;
    },
    enabled: !!projectId,
  });
}
