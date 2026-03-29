import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/pages/Projects";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

  const pct = Math.round((project.completed / project.tasks) * 100);

  return (
    <AppLayout>
      <div className="max-w-4xl">
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground mt-1">Status: {project.status}</p>

        <div className="mt-6 rounded-lg border bg-card p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {project.completed} of {project.tasks} tasks completed
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
