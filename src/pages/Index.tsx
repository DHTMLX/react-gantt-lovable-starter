import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarRange,
  Link2,
  GripVertical,
  Database,
  ShieldCheck,
  LayoutList,
} from "lucide-react";

const features = [
  { icon: LayoutList, label: "Multi-project planning" },
  { icon: CalendarRange, label: "Gantt timeline per project" },
  { icon: Link2, label: "Task dependencies" },
  { icon: GripVertical, label: "Drag-and-drop scheduling" },
  { icon: Database, label: "Supabase data persistence" },
  { icon: ShieldCheck, label: "Viewer / Editor roles" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        {/* About card — full width */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">About this demo app</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Starter project planning tool built with DHTMLX React Gantt, React, Lovable, and
              Supabase.
            </p>
          </CardContent>
        </Card>

        {/* Bottom row — 2 cards side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="gap-2" onClick={() => navigate("/projects")}>
                Open Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Features demonstrated in this demo</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    {label}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
