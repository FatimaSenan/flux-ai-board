import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Users, FileCode, Layers } from "lucide-react";

const mockProjects = [
  {
    id: 1,
    name: "AI Assistant Platform",
    description: "Next-generation conversational AI with advanced NLP capabilities",
    logo: Bot,
    color: "from-primary to-secondary",
    stats: { users: 45, tickets: 128 }
  },
  {
    id: 2,
    name: "Cloud Infrastructure",
    description: "Scalable microservices architecture with Kubernetes orchestration",
    logo: Layers,
    color: "from-secondary to-primary",
    stats: { users: 32, tickets: 89 }
  },
  {
    id: 3,
    name: "Mobile App Suite",
    description: "Cross-platform mobile applications for iOS and Android",
    logo: FileCode,
    color: "from-primary to-accent",
    stats: { users: 28, tickets: 156 }
  },
];

const Projects = () => {
  const navigate = useNavigate();

  const handleProjectSelect = (projectId: number) => {
    navigate(`/dashboard/${projectId}`);
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Your Projects
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a project to view its dashboard and insights
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => {
            const Icon = project.logo;
            return (
              <Card
                key={project.id}
                className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-glow)] cursor-pointer group"
                onClick={() => handleProjectSelect(project.id)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-4 group-hover:animate-float`}>
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{project.stats.users} users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4" />
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
