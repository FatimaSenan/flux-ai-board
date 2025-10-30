import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Bell, Users, FileCode, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ChatPanel from "@/components/ChatPanel";
import NotificationsPanel from "@/components/NotificationsPanel";

const mockDashboardData = {
  1: {
    name: "AI Assistant Platform",
    stats: {
      totalTickets: 128,
      activeUsers: 45,
      closedTickets: 89,
      inProgress: 32,
      blockers: 7
    }
  },
  2: {
    name: "Cloud Infrastructure",
    stats: {
      totalTickets: 89,
      activeUsers: 32,
      closedTickets: 56,
      inProgress: 28,
      blockers: 5
    }
  },
  3: {
    name: "Mobile App Suite",
    stats: {
      totalTickets: 156,
      activeUsers: 28,
      closedTickets: 98,
      inProgress: 45,
      blockers: 13
    }
  }
};

const Dashboard = () => {
  const { projectId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationCount] = useState(5);

  const projectData = projectId && projectId in mockDashboardData 
    ? mockDashboardData[Number(projectId) as keyof typeof mockDashboardData]
    : mockDashboardData[1];
  const project = projectData;

  const statCards = [
    { 
      title: "Total Tickets", 
      value: project.stats.totalTickets, 
      icon: FileCode, 
      color: "from-primary to-accent",
      trend: "+12%"
    },
    { 
      title: "Active Users", 
      value: project.stats.activeUsers, 
      icon: Users, 
      color: "from-secondary to-primary",
      trend: "+8%"
    },
    { 
      title: "In Progress", 
      value: project.stats.inProgress, 
      icon: TrendingUp, 
      color: "from-accent to-secondary",
      trend: "+5%"
    },
    { 
      title: "Blockers", 
      value: project.stats.blockers, 
      icon: AlertCircle, 
      color: "from-destructive to-secondary",
      trend: "-2%"
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            {project.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Project insights and statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <Badge variant="secondary" className="bg-muted/50">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Card */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New feature deployed to staging</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Critical bug fixed in production</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        {/* Notifications Button */}
        <Button
          size="lg"
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-primary hover:opacity-90 transition-all shadow-[var(--shadow-glow-secondary)] animate-pulse-glow"
          onClick={() => setIsNotificationsOpen(true)}
        >
          <Bell className="w-6 h-6" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground">
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* Chat Button */}
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-all shadow-[var(--shadow-glow)] animate-float"
          onClick={() => setIsChatOpen(true)}
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        projectName={project.name}
      />

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
