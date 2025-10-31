import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Bell, Users, FileCode, TrendingUp, AlertCircle, Send, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import BackgroundNetwork from "@/components/ui/BackgroundNetwork";
import VersionDiffModal from "@/components/VersionDiffModal";

const mockDashboardData = {
  1: { name: "AI Assistant Platform", stats: { totalTickets: 128, activeUsers: 45, closedTickets: 89, inProgress: 32, blockers: 7 } },
  2: { name: "Cloud Infrastructure", stats: { totalTickets: 89, activeUsers: 32, closedTickets: 56, inProgress: 28, blockers: 5 } },
  3: { name: "Mobile App Suite", stats: { totalTickets: 156, activeUsers: 28, closedTickets: 98, inProgress: 45, blockers: 13 } }
};

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const mockNotifications = [
  {
    id: 1,
    ticket: "PROJ-234",
    title: "User authentication flow",
    changes: "Priority changed from Medium to High",
    time: "5 minutes ago",
    oldValue: "Medium",
    newValue: "High",
    field: "Priority"
  },
  {
    id: 2,
    ticket: "PROJ-189",
    title: "Dashboard performance optimization",
    changes: "Description updated",
    time: "1 hour ago",
    oldValue: "Optimize the dashboard loading time",
    newValue: "Optimize the dashboard loading time and implement lazy loading for charts",
    field: "Description"
  },
  {
    id: 3,
    ticket: "PROJ-156",
    title: "Mobile responsive design",
    changes: "Status changed from In Progress to Review",
    time: "3 hours ago",
    oldValue: "In Progress",
    newValue: "Review",
    field: "Status"
  },
  {
    id: 4,
    ticket: "PROJ-204",
    title: "Checkout flow improvements",
    changes: "Description updated",
    time: "12 minutes ago",
    oldValue: "Enable guest checkout and add coupon validation.",
    newValue: "Enable guest checkout, add coupon validation, and display inline error states on payment form.",
    field: "Description"
  },
];

const Dashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"chat" | "notifications">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! I'm your AI assistant. How can I help you with this project today?" }
  ]);
  const [input, setInput] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const project = projectId && projectId in mockDashboardData ? mockDashboardData[Number(projectId) as keyof typeof mockDashboardData] : mockDashboardData[1];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input
    };

    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "I understand your question. I'm analyzing the project data and will provide you with relevant insights shortly."
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

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
      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-lg gradient-text">
            {project.name}
          </h1>
          <p className="text-[#94A3B8]">
            Project insights and AI assistant
          </p>
        </div>

        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="glass-card p-3 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 border border-[#38BDF8]/20"
              >
                <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
                  <CardTitle className="text-xs font-medium text-[#94A3B8]">{stat.title}</CardTitle>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-[#0F172A]" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <Badge variant="secondary" className="bg-[#1E293B]/40 text-[#38BDF8] text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Toggle Group */}
        <div className="flex items-center justify-center gap-2 p-1 glass-card rounded-lg border border-[#38BDF8]/20 w-fit mx-auto">
          <ToggleGroup type="single" value={activeView} onValueChange={(value) => value && setActiveView(value as "chat" | "notifications")}>
            <ToggleGroupItem 
              value="chat" 
              className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-primary data-[state=on]:to-secondary data-[state=on]:text-primary-foreground"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="notifications" 
              className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-primary data-[state=on]:to-secondary data-[state=on]:text-primary-foreground relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <Badge className="ml-2 bg-[#F97316] text-[#0F172A] text-xs h-5 px-1.5">
                {mockNotifications.length}
              </Badge>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Main Content Area */}
        <Card className="glass-card border border-[#38BDF8]/20 h-[calc(100vh-380px)] flex flex-col">
          {activeView === "chat" ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-[#38BDF8]/20 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold gradient-text">AI Assistant</CardTitle>
                  <Badge variant="secondary" className="bg-[#1E293B]/40 text-[#38BDF8]">
                    Active
                  </Badge>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                              : "glass-card border border-[#38BDF8]/20"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Chat Input */}
              <div className="p-4 border-t border-[#38BDF8]/20">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything about your project..."
                    className="flex-1 bg-[#1E293B]/40 border-[#38BDF8]/20"
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Notifications Header */}
              <CardHeader className="border-b border-[#38BDF8]/20 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold gradient-text">Recent Changes</CardTitle>
                  <Badge variant="secondary" className="bg-primary/30 text-primary border-primary/20">
                    {mockNotifications.length} updates
                  </Badge>
                </div>
              </CardHeader>

              {/* Notifications List */}
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-3">
                    {mockNotifications.map((n) => (
                      <Card
                        key={n.id}
                        onClick={() => setSelectedNotification(n)}
                        className="glass-card p-4 rounded-lg transition-all hover:shadow-[0_4px_18px_rgba(56,189,248,0.18)] hover:border-primary/20 cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-primary">{n.ticket}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{n.time}</span>
                            </div>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.changes}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </>
          )}
        </Card>

      </div>

      {/* Version Diff Modal */}
      <VersionDiffModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </div>
  );
};

export default Dashboard;
