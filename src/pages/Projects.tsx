import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
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

      {error && (
        <p className="text-destructive">Failed to load projects.</p>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      )}

      {projects && projects.length === 0 && (
        <p className="text-muted-foreground mb-4">
          You're not a member of any projects yet. Create one to get started.
        </p>
      )}

      {projects && projects.length > 0 && (
        <div className="space-y-2 mb-4">
          {projects.map((p) => {
            const status = statusLabel(p.task_count, p.completed_count);
            const pct = p.task_count > 0 ? Math.round((p.completed_count / p.task_count) * 100) : 0;

            return (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg border bg-card hover:bg-accent transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <h3 className="text-sm font-medium truncate">{p.name}</h3>
                  <Badge className={`${statusColor[status] ?? ""} text-[10px] shrink-0`}>{status}</Badge>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-muted-foreground">{p.completed_count}/{p.task_count} tasks</span>
                  <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <CreateProjectDialog />
    </AppLayout>
  );
};

export default Projects;
