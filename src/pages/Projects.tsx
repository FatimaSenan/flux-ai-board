// src/pages/Projects.tsx
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCode } from "lucide-react";
import BackgroundNetwork from "@/components/ui/BackgroundNetwork";
import { useEffect, useState } from "react";

interface Project {
  id: number;
  creator: string;
  name: string;
  description: string;
  createdAt: string;
  status: string;
  innerTickets: number;
  innerFiles: number;
  users?: number;
  totalTickets?: number;
}

const API_BASE_URL = "http://localhost:8081";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) setUserName(storedUserName);

    async function fetchProjects() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const data: Project[] = await response.json();

        // Fetch ticket counts in parallel for better performance
        const projectsWithDetails = await Promise.all(
          data.map(async (proj) => {
            try {
              const ticketsRes = await fetch(`${API_BASE_URL}/projects/${proj.id}/tickets`);
              const tickets = await ticketsRes.json();
              return {
                ...proj,
                totalTickets: tickets.length,
                users: Math.floor(Math.random() * 50) + 10,
              };
            } catch (error) {
              console.error(`Error fetching tickets for project ${proj.id}:`, error);
              return {
                ...proj,
                totalTickets: proj.innerTickets || 0,
                users: Math.floor(Math.random() * 50) + 10,
              };
            }
          })
        );

        setProjects(projectsWithDetails);
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
        // Set empty array to prevent loading state
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleProjectSelect = (projectId: number) => navigate(`/dashboard/${projectId}`);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundNetwork />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/95 to-[#0F172A]/98 pointer-events-none" />

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-extrabold gradient-text">
            {userName ? `${userName}'s Projects` : "My Projects"}
          </h1>
          <p className="text-[#94A3B8] text-lg">
            {loading ? (
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Loading your projects...
              </div>
            ) : projects.length ? (
              `You have ${projects.length} project${projects.length !== 1 ? "s" : ""}.`
            ) : (
              "No projects found."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            // Skeleton loading for projects
            Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="relative overflow-hidden bg-[#1E293B]/40 backdrop-blur-lg border border-[#38BDF8]/10 rounded-2xl p-1 animate-pulse"
              >
                <CardHeader className="space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gray-600 mb-2"></div>
                  <CardTitle className="h-6 bg-gray-600 rounded"></CardTitle>
                  <CardDescription className="h-4 bg-gray-600 rounded"></CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 border-t border-[#38BDF8]/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-gray-600 rounded"></div>
                    <div className="h-4 w-16 bg-gray-600 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                onClick={() => handleProjectSelect(project.id)}
                className="relative group overflow-hidden bg-[#1E293B]/40 backdrop-blur-lg border border-[#38BDF8]/10 rounded-2xl p-1
                         hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500 cursor-pointer"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#38BDF8]/30 via-[#2563EB]/30 to-[#F97316]/20 blur-xl transition-all duration-700" />

                <CardHeader className="space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 
                               bg-gradient-to-br from-[#38BDF8] to-[#2563EB] shadow-[0_0_25px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-500">
                    <FileCode className="w-8 h-8 text-[#0F172A]" />
                  </div>

                  <CardTitle className="text-2xl font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors duration-300">
                    {project.name}
                  </CardTitle>

                  <CardDescription className="text-[#94A3B8] text-sm leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 border-t border-[#38BDF8]/10 pt-4">
                  <div className="flex items-center justify-between text-sm text-[#94A3B8]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#38BDF8]" />
                      <span>{project.users} users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-[#F97316]" />
                      <span>{project.totalTickets ?? project.innerTickets} tickets</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;