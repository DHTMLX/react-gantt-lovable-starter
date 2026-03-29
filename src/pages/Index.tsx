import { AppLayout } from "@/components/AppLayout";

const Dashboard = () => (
  <AppLayout>
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground mt-1">Overview of your workspace activity.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: "Active Projects", value: "12" },
          { label: "Tasks Due Today", value: "5" },
          { label: "Team Members", value: "8" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-semibold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Dashboard;
