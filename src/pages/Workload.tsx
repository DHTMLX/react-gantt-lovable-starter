import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, ClipboardCheck, Zap } from "lucide-react";
import { useWorkloadData } from "@/features/projects/api/useWorkloadData";

const Workload = () => {
  const { data, isLoading } = useWorkloadData();

  const peakLoad = data?.users.length ? Math.max(...data.users.map((u) => u.assigned_count)) : 0;

  return (
    <AppLayout>
      <PageHeader badge="Workload" title="Team capacity" subtitle="Built for calm, visible planning across projects, people, and delivery risk." />

      {isLoading ? (
        <div className="space-y-4">
          <Card className="border-0 bg-gradient-to-br from-accent to-card">
            <CardContent className="py-10"><Skeleton className="h-24 w-full" /></CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
          </div>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-accent to-card overflow-hidden">
              <CardContent className="py-8 px-8">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 mb-4">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-primary">Capacity Map</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-3">
                  See where the team has room,<br />and where it is starting to stretch.
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  The workload view now reads like an operations surface, with quick counts up front and a cleaner list of people below.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-8 px-6">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">Operating Note</p>
                <h3 className="text-lg font-semibold mb-2">Capacity should be visible at a glance</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This page is now structured more like a planning console: a broad lead panel, fast metrics, and a denser collaborator list that can scale with the team.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
                <Users className="h-7 w-7 text-primary" />
                <p className="text-3xl font-bold">{data?.teamMemberCount ?? 0}</p>
                <p className="text-xs text-muted-foreground">Unique people across the projects you can access.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
                <ClipboardCheck className="h-7 w-7 text-primary" />
                <p className="text-3xl font-bold">{data?.assignedTaskCount ?? 0}</p>
                <p className="text-xs text-muted-foreground">Assigned tasks currently distributed across the team.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
                <Zap className="h-7 w-7 text-primary" />
                <p className="text-3xl font-bold">{peakLoad}</p>
                <p className="text-xs text-muted-foreground">Current highest visible task load on one collaborator.</p>
              </CardContent>
            </Card>
          </div>

          {/* Team list */}
          <Card>
            <CardContent className="py-5 px-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Team Distribution</p>
                  <h3 className="text-base font-semibold">Capacity by collaborator</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Zap className="h-3.5 w-3.5" />
                  Sorted from highest load to lowest
                </div>
              </div>
              {data?.users.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">No team members found.</p>
              )}
              <div className="divide-y">
                {data?.users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">@{u.username}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {u.assigned_count} {u.assigned_count === 1 ? "task" : "tasks"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
};

export default Workload;
