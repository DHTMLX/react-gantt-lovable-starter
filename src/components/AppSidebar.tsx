import { LayoutDashboard, FolderKanban, BarChart3, Users, Search, LogOut, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDemoAuth } from "@/features/auth/DemoAuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", subtitle: "Pulse and priorities", url: "/", icon: LayoutDashboard },
  { title: "Projects", subtitle: "Portfolio and plans", url: "/projects", icon: FolderKanban },
  { title: "Reports", subtitle: "Progress signals", url: "/reports", icon: BarChart3 },
  { title: "Workload", subtitle: "Capacity view", url: "/workload", icon: Users },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, signOut } = useDemoAuth();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-sidebar-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-widest uppercase text-sidebar-primary">Dash Flow</p>
                <p className="text-xs text-sidebar-foreground truncate">Portfolio plannin…</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-sidebar-foreground/50" />
              <Input
                placeholder="Search projects"
                className="pl-8 h-8 text-xs bg-sidebar-accent border-0 text-sidebar-foreground placeholder:text-sidebar-foreground/40"
              />
            </div>
          </>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-sidebar-foreground/50">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60 py-2.5"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2.5 h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium leading-tight">{item.title}</span>
                          <span className="text-[10px] text-sidebar-foreground/50 leading-tight">{item.subtitle}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-1 py-1">
            <Avatar className="h-8 w-8 text-xs bg-primary/20 text-primary">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                {initials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-accent-foreground">{user.full_name}</p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">@{user.username}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/60"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-2 text-xs">Switch demo user</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
