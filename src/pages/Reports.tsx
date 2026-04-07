import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader badge="Reports" title="Progress signals" subtitle="Built for calm, visible planning across projects, people, and delivery risk." />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-[140px] rounded-lg" />
          <Skeleton className="h-[140px] rounded-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 gap-2">
              <FolderKanban className="h-8 w-8 text-primary" />
              <p className="text-4xl font-bold">{projectCount}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 gap-2">
              <ListChecks className="h-8 w-8 text-primary" />
              <p className="text-4xl font-bold">{taskCount}</p>
              <p className="text-xs text-muted-foreground">Tasks</p>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
};

export default Reports;
