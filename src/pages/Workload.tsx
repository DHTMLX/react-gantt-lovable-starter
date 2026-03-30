import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, ClipboardCheck } from "lucide-react";
import { useWorkloadData } from "@/features/projects/api/useWorkloadData";

const Workload = () => {
  const { data, isLoading } = useWorkloadData();

  return (
    <AppLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Workload</h1>
        <p className="text-muted-foreground mt-1">Team capacity and task distribution.</p>

        {isLoading ? (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
            </div>
            <Skeleton className="h-[200px] rounded-lg" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
                  <Users className="h-8 w-8 text-primary" />
                  <p className="text-3xl font-semibold">{data?.teamMemberCount ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
                  <ClipboardCheck className="h-8 w-8 text-primary" />
                  <p className="text-3xl font-semibold">{data?.assignedTaskCount ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Assigned Tasks</p>
                </CardContent>
              </Card>
            </div>

            {/* Team Workload list */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Team Workload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.users.length === 0 && (
                  <p className="text-sm text-muted-foreground">No team members found.</p>
                )}
                {data?.users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">{u.username}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {u.assigned_count} {u.assigned_count === 1 ? "task" : "tasks"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Workload;
