import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/features/projects/api/useProjects";

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
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">All projects in your workspace.</p>

        {error && (
          <p className="mt-6 text-destructive">Failed to load projects.</p>
        )}

        {isLoading && (
          <div className="mt-6 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] rounded-lg" />
            ))}
          </div>
        )}

        {projects && (
          <div className="mt-6 space-y-2">
            {projects.map((p) => {
              const status = statusLabel(p.task_count, p.completed_count);
              return (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-accent/40 transition-colors"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {p.completed_count}/{p.task_count} tasks completed
                    </p>
                  </div>
                  <Badge className={statusColor[status] ?? ""}>{status}</Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;
