import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDemoAuth } from "@/features/auth/DemoAuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useDemoAuth();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-5 bg-card shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Signed in</p>
                  <p className="text-xs font-medium leading-tight">{user.full_name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{user.email}</p>
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 min-h-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
