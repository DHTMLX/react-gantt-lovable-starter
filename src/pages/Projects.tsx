import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";

export const mockProjects = [
  { id: "1", name: "Website Redesign", status: "In Progress", tasks: 24, completed: 12 },
  { id: "2", name: "Mobile App", status: "Planning", tasks: 18, completed: 3 },
  { id: "3", name: "API Integration", status: "In Progress", tasks: 15, completed: 9 },
  { id: "4", name: "Analytics Dashboard", status: "Review", tasks: 10, completed: 8 },
  { id: "5", name: "Design System", status: "In Progress", tasks: 30, completed: 20 },
];

const statusColor: Record<string, string> = {
  "In Progress": "bg-primary/10 text-primary border-0",
  Planning: "bg-muted text-muted-foreground border-0",
  Review: "bg-accent text-accent-foreground border-0",
};

const Projects = () => (
  <AppLayout>
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <p className="text-muted-foreground mt-1">All projects in your workspace.</p>

      <div className="mt-6 space-y-2">
        {mockProjects.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-accent/40 transition-colors"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {p.completed}/{p.tasks} tasks completed
              </p>
            </div>
            <Badge className={statusColor[p.status] ?? ""}>{p.status}</Badge>
          </Link>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Projects;
