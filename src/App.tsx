import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoAuthProvider } from "@/features/auth/DemoAuthContext";
import { DemoSignInModal } from "@/features/auth/DemoSignInModal";
import { store } from "@/features/gantt/store";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Reports from "./pages/Reports";
import Workload from "./pages/Workload";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <DemoAuthProvider>
        <TooltipProvider>
          <Sonner />
          <DemoSignInModal />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/workload" element={<Workload />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DemoAuthProvider>
    </QueryClientProvider>
  </ReduxProvider>
);

export default App;
