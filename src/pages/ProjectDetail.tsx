import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/features/projects/api/useProject";
import ProjectGantt from "@/features/gantt/components/ProjectGantt";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, error } = useProject(id);

  if (isLoading) {
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

  return (
    <AppLayout>
      <div className="flex flex-col h-full -m-6">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
        </div>
        <div className="flex-1 min-h-0 px-6 pb-6">
          <ProjectGantt projectId={project.id} />
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
