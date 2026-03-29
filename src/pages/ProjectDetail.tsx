import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/pages/Projects";
import { ArrowLeft } from "lucide-react";
import ProjectGantt from "@/features/gantt/components/ProjectGantt";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">Project not found.</p>
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
          <p className="text-muted-foreground mt-1">
            {project.completed}/{project.tasks} tasks · {project.status}
          </p>
        </div>
        <div className="flex-1 min-h-0 px-6 pb-6">
          <ProjectGantt projectId={project.id} />
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
