import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AppHeader from "./components/AppHeader";

const queryClient = new QueryClient();

const mockDashboardData = {
  1: { name: "AI Assistant Platform" },
  2: { name: "Cloud Infrastructure" },
  3: { name: "Mobile App Suite" }
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const HeaderWrapper = () => {
  const location = useLocation();
  const hideOn = ["/", "/login"];
  const shouldShow = !hideOn.includes(location.pathname);
  return shouldShow ? <AppHeader /> : null;
};

const DashboardWithHeader = () => {
  const { projectId } = useParams();
  const project = projectId && projectId in mockDashboardData 
    ? mockDashboardData[Number(projectId) as keyof typeof mockDashboardData] 
    : mockDashboardData[1];
  
  return (
    <>
      <AppHeader projectName={project.name} />
      <Dashboard />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={
            <ProtectedRoute>
              <>
                <AppHeader />
                <Projects />
              </>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/:projectId" element={
            <ProtectedRoute>
              <DashboardWithHeader />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
