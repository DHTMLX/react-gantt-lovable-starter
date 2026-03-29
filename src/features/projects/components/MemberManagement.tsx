import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDemoAuth } from "@/features/auth/DemoAuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Trash2, Users } from "lucide-react";
import type { ProjectRole } from "@/features/projects/api/useProjectRole";

interface MemberManagementProps {
  projectId: string;
  currentRole: ProjectRole;
}

interface MemberRow {
  id: string;
  user_id: string;
  role: string;
  user_full_name?: string;
}

export function MemberManagement({ projectId, currentRole }: MemberManagementProps) {
  const { user, users: allUsers } = useDemoAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [addUserId, setAddUserId] = useState("");
  const [addRole, setAddRole] = useState("viewer");

  const isOwner = currentRole === "owner";

  const { data: members = [] } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_members")
        .select("id, user_id, role")
        .eq("project_id", projectId);
      if (error) throw error;

      // Enrich with user names
      return (data ?? []).map((m) => {
        const u = allUsers.find((u) => u.id === m.user_id);
        return { ...m, user_full_name: u?.full_name ?? "Unknown" } as MemberRow;
      });
    },
    enabled: !!projectId && allUsers.length > 0,
  });

  const addMember = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("project_members")
        .insert({ project_id: projectId, user_id: addUserId, role: addRole });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setAddUserId("");
      setAddRole("viewer");
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const existingUserIds = new Set(members.map((m) => m.user_id));
  const availableUsers = allUsers.filter((u) => !existingUserIds.has(u.id));

  const roleBadgeColor: Record<string, string> = {
    owner: "bg-primary/10 text-primary border-0",
    editor: "bg-accent text-accent-foreground border-0",
    viewer: "bg-muted text-muted-foreground border-0",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Users className="h-4 w-4" /> Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Project Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{m.user_full_name}</span>
                <Badge className={roleBadgeColor[m.role] ?? ""}>{m.role}</Badge>
              </div>
              {isOwner && m.user_id !== user?.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeMember.mutate(m.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {isOwner && availableUsers.length > 0 && (
          <div className="flex items-end gap-2 pt-4 border-t">
            <div className="flex-1 space-y-1">
              <Select value={addUserId} onValueChange={setAddUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Add user…" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={addRole} onValueChange={setAddRole}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              disabled={!addUserId || addMember.isPending}
              onClick={() => addMember.mutate()}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
