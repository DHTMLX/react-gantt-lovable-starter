import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CalendarRange, CheckCircle2 } from "lucide-react";
import { useProjects } from "@/features/projects/api/useProjects";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";

function statusLabel(taskCount: number, completedCount: number): string {
  if (taskCount === 0) return "Empty";
  if (completedCount >= taskCount) return "Complete";
  if (completedCount > 0) return "In Progress";
  return "Planning";
}

const statusColor: Record<string, string> = {
  "In Progress": "bg-primary/10 text-primary border-0",
  Planning: "bg-muted text-muted-foreground border-0",
  Complete: "bg-accent text-accent-foreground border-0",
  Empty: "bg-muted text-muted-foreground border-0",
};

const Projects = () => {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <AppLayout>
      <PageHeader badge="Projects" title="Project portfolio" subtitle="Built for calm, visible planning across projects, people, and delivery risk." />

      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-accent to-card overflow-hidden">
          <CardContent className="py-8 px-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 mb-4">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-primary">
                Portfolio Overview
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-3">
              Shape the portfolio<br />before it turns noisy.
            </h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-md">
              Review every accessible project from one polished view, then dive straight into the Gantt workspace when a schedule needs attention.
            </p>
            <CreateProjectDialog />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-8 px-6">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">Portfolio Mode</p>
            <h3 className="text-lg font-semibold mb-2">Scan broadly, enter deeply</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The layout now behaves more like a portfolio control room. Summary and action sit beside the list instead of forcing everything into a narrow single-column rhythm.
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <p className="text-destructive">Failed to load projects.</p>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      )}

      {projects && projects.length === 0 && (
        <p className="text-muted-foreground">
          You're not a member of any projects yet. Create one to get started.
        </p>
      )}

      {projects && projects.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {projects.map((p) => {
              const status = statusLabel(p.task_count, p.completed_count);
              const pct = p.task_count > 0 ? Math.round((p.completed_count / p.task_count) * 100) : 0;

              return (
                <Card key={p.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="py-5 px-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Active Project</p>
                        <h3 className="text-lg font-semibold mt-0.5">{p.name}</h3>
                      </div>
                      <Badge className={statusColor[status] ?? ""}>{status}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="rounded-lg border p-3">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Completion</p>
                        <p className="text-xl font-semibold mt-0.5">{pct}%</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Tasks</p>
                        <p className="text-xl font-semibold mt-0.5">{p.task_count}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Done</p>
                        <p className="text-xl font-semibold mt-0.5">{p.completed_count}</p>
                      </div>
                    </div>

                    <Progress value={pct} className="h-1.5 mb-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarRange className="h-3.5 w-3.5" />
                        Schedule workspace ready
                      </div>
                      <Link
                        to={`/projects/${p.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        Open plan <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Context cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 bg-gradient-to-br from-accent/50 to-card">
              <CardContent className="py-5 px-5 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold mb-1">Portfolio signal</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The card view makes it easier to spot momentum, emptier projects, and schedules that need a deeper look.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-5 px-5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Interaction Model</p>
                <h3 className="text-sm font-semibold mb-1">Cards should feel like launch points</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Wider portfolio cards work better here because the user is selecting a workspace, not reading a compact list.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Projects;
