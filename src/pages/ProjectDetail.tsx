import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { ArrowLeft, CalendarRange, Link2, Settings2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProject } from "@/features/projects/api/useProject";
import { useProjectRole } from "@/features/projects/api/useProjectRole";
import { MemberManagement } from "@/features/projects/components/MemberManagement";
import ProjectGantt from "@/features/gantt/components/ProjectGantt";

const featureBadges = [
  { icon: CalendarRange, label: "Live schedule editing" },
  { icon: Link2, label: "Dependencies and milestones" },
  { icon: Settings2, label: "Editing enabled" },
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, error } = useProject(id);
  const { data: role, isLoading: roleLoading } = useProjectRole(id);

  if (isLoading || roleLoading) {
    return (
      <AppLayout>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-[400px] w-full rounded-lg" />
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">
          {error ? "Failed to load project." : "Project not found."}
        </p>
      </AppLayout>
    );
  }

  if (!role) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">You don't have access to this project.</p>
      </AppLayout>
    );
  }

  const readOnly = role === "viewer";

  return (
    <AppLayout>
      <div className="flex flex-col h-full -m-6">
        <div className="px-6 pt-6 pb-5 shrink-0">
          <PageHeader badge="Active Plan" title="Project workspace" subtitle="Built for calm, visible planning across projects, people, and delivery risk." />

          <Button variant="outline" size="sm" asChild className="mb-5 gap-1.5 text-xs">
            <Link to="/projects">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
            </Link>
          </Button>

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 mb-2">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-primary">Active Workspace</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs uppercase font-semibold tracking-wider">
                  {role}
                </Badge>
                <MemberManagement projectId={project.id} currentRole={role} />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 max-w-lg">
              A focused planning surface for sequencing work, adjusting assignments, and keeping dependencies legible.
            </p>

            {!readOnly && (
              <div className="flex flex-wrap gap-2">
                {featureBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </div>
                ))}
              </div>
            )}
            {readOnly && (
              <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                View-only access
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0 px-6 pb-6">
          <ProjectGantt projectId={project.id} readOnly={readOnly} />
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
