import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, ListChecks } from "lucide-react";
import { useProjects } from "@/features/projects/api/useProjects";

const Reports = () => {
  const { data: projects, isLoading } = useProjects();

  const projectCount = projects?.length ?? 0;
  const taskCount = projects?.reduce((sum, p) => sum + p.task_count, 0) ?? 0;

  return (
    <AppLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Project and task overview.</p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
                <FolderKanban className="h-8 w-8 text-primary" />
                <p className="text-3xl font-semibold">{projectCount}</p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
                <ListChecks className="h-8 w-8 text-primary" />
                <p className="text-3xl font-semibold">{taskCount}</p>
                <p className="text-sm text-muted-foreground">Tasks</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Reports;
