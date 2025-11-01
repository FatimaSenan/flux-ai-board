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
  
  // We'll pass the projectId to the Dashboard component and let it handle fetching the project name
  // The AppHeader will get the project name from the Dashboard through props or context
  return (
    <>
      <AppHeader projectId={projectId} />
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