import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Users, FileCode, Layers } from "lucide-react";
import BackgroundNetwork from "@/components/ui/BackgroundNetwork";

const mockProjects = [
  {
    id: 1,
    name: "AI Assistant Platform",
    description: "Next-generation conversational AI with advanced NLP capabilities.",
    logo: Bot,
    stats: { users: 45, tickets: 128 },
  },
  {
    id: 2,
    name: "Cloud Infrastructure",
    description: "Scalable microservices architecture with Kubernetes orchestration.",
    logo: Layers,
    stats: { users: 32, tickets: 89 },
  },
  {
    id: 3,
    name: "Mobile App Suite",
    description: "Cross-platform mobile applications for iOS and Android.",
    logo: FileCode,
    stats: { users: 28, tickets: 156 },
  },
];

const Projects = () => {
  const navigate = useNavigate();
  const handleProjectSelect = (projectId: number) => navigate(`/dashboard/${projectId}`);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🕸️ Animated network background */}
      <BackgroundNetwork />

      {/* Gradient overlay to make content pop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/95 to-[#0F172A]/98 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-extrabold gradient-text">My Projects</h1>
          <p className="text-[#94A3B8] text-lg">Access your dashboards and AI insights.</p>
        </div>


        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {mockProjects.map((project) => {
            const Icon = project.logo;
            return (
              <Card
                key={project.id}
                onClick={() => handleProjectSelect(project.id)}
                className="relative group overflow-hidden bg-[#1E293B]/40 backdrop-blur-lg border border-[#38BDF8]/10 rounded-2xl p-1
                           hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500 cursor-pointer"
              >
                {/* Glow border effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#38BDF8]/30 via-[#2563EB]/30 to-[#F97316]/20 blur-xl transition-all duration-700" />

                <CardHeader className="space-y-4 relative z-10">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 
                               bg-gradient-to-br from-[#38BDF8] to-[#2563EB] shadow-[0_0_25px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-500"
                  >
                    <Icon className="w-8 h-8 text-[#0F172A]" />
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
                      <span>{project.stats.users} users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-[#F97316]" />
                      <span>{project.stats.tickets} tickets</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;
