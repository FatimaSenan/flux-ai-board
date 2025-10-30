import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Bell, Users, FileCode, TrendingUp, AlertCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ChatPanel from "@/components/ChatPanel";
import NotificationsPanel from "@/components/NotificationsPanel";
import BackgroundNetwork from "@/components/ui/BackgroundNetwork";

const mockDashboardData = {
  1: { name: "AI Assistant Platform", stats: { totalTickets: 128, activeUsers: 45, closedTickets: 89, inProgress: 32, blockers: 7 } },
  2: { name: "Cloud Infrastructure", stats: { totalTickets: 89, activeUsers: 32, closedTickets: 56, inProgress: 28, blockers: 5 } },
  3: { name: "Mobile App Suite", stats: { totalTickets: 156, activeUsers: 28, closedTickets: 98, inProgress: 45, blockers: 13 } }
};

const Dashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationCount] = useState(5);

  const project = projectId && projectId in mockDashboardData ? mockDashboardData[Number(projectId) as keyof typeof mockDashboardData] : mockDashboardData[1];

  const statCards = [
    { title: "Total Tickets", value: project.stats.totalTickets, icon: FileCode, color: "from-[#38BDF8] to-[#2563EB]", trend: "+12%" },
    { title: "Active Users", value: project.stats.activeUsers, icon: Users, color: "from-[#2563EB] to-[#38BDF8]", trend: "+8%" },
    { title: "In Progress", value: project.stats.inProgress, icon: TrendingUp, color: "from-[#38BDF8] to-[#F97316]", trend: "+5%" },
    { title: "Blockers", value: project.stats.blockers, icon: AlertCircle, color: "from-[#F97316] to-[#2563EB]", trend: "-2%" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ✨ Animated network background */}
      <BackgroundNetwork />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/95 to-[#0F172A]/98 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto space-y-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-[#1E293B] hover:bg-[#2563EB] text-[#F8FAFC] hover:text-white
                     transition-all duration-300 shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg gradient-text">
            {project.name}
          </h1>
          <p className="text-[#94A3B8] text-lg">
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
                className="glass-card p-4 hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-500 cursor-pointer border border-[#38BDF8]/20"
              >
                <CardHeader className="flex items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#94A3B8]">{stat.title}</CardTitle>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-[#0F172A]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <Badge variant="secondary" className="bg-[#1E293B]/40 text-[#38BDF8]">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity (compact) */}
        <Card className="glass-card border border-[#38BDF8]/20 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#38BDF8]/20 scrollbar-track-transparent">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { color: "#F97316", text: "New feature deployed to staging", time: "2 hours ago" },
                { color: "#38BDF8", text: "Critical bug fixed in production", time: "5 hours ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-[#1E293B]/30 border border-[#38BDF8]/20">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-[#94A3B8]">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        <Button
          size="lg"
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#38BDF8] shadow-lg animate-pulse-glow hover:opacity-90 transition-all"
          onClick={() => setIsNotificationsOpen(true)}
        >
          <Bell className="w-6 h-6" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-[#F97316] text-[#0F172A]">
              {notificationCount}
            </Badge>
          )}
        </Button>

        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#2563EB] shadow-lg animate-float hover:opacity-90 transition-all"
          onClick={() => setIsChatOpen(true)}
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>

      {/* Panels */}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} projectName={project.name} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
};

export default Dashboard;
