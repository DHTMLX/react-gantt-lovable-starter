import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
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
  { icon: LayoutList, title: "Multi-project planning", desc: "Track delivery across parallel initiatives." },
  { icon: CalendarRange, title: "Live Gantt timelines", desc: "Shape milestones, start dates, and durations visually." },
  { icon: Link2, title: "Dependency mapping", desc: "Reveal handoffs and sequence risk before they block delivery." },
  { icon: GripVertical, title: "Drag-and-drop updates", desc: "Adjust plans with direct manipulation instead of forms." },
  { icon: Database, title: "Resource visibility", desc: "See who owns what and where load is stacking up." },
  { icon: ShieldCheck, title: "Role-based access", desc: "Keep viewers safe while editors and owners can move work." },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <PageHeader badge="Overview" title="Planning command center" subtitle="This application is a starter project planning tool built with the DHTMLX React Gantt component, demonstrating how a timeline-based project management app can be created in Lovable using React and Supabase." />

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Quick actions */}
        <Card className="lg:col-span-2">
          <CardContent className="py-8 px-6 flex flex-col h-full">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Quick Actions</p>
            <h3 className="text-lg font-semibold mb-2">Jump into the planning flow</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Start with the portfolio view to review active projects and open the workspace that needs attention.
            </p>
            <div className="mt-auto flex justify-end">
              <Button className="gap-2" onClick={() => navigate("/projects")}>
                Open Portfolio
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature tiles */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border hover:border-primary/30 transition-colors">
              <CardContent className="py-5 px-4">
                <Icon className="h-5 w-5 text-muted-foreground mb-3" />
                <p className="text-sm font-semibold mb-1">{title}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
