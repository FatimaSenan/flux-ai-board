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
import { askAssistant } from "@/services/aiService";

const mockDashboardData = {
  1: { name: "AI Assistant Platform", stats: { totalTickets: 128, activeUsers: 45, closedTickets: 89, inProgress: 32, blockers: 7 } },
  2: { name: "Cloud Infrastructure", stats: { totalTickets: 89, activeUsers: 32, closedTickets: 56, inProgress: 28, blockers: 5 } },
  3: { name: "Mobile App Suite", stats: { totalTickets: 156, activeUsers: 28, closedTickets: 98, inProgress: 45, blockers: 13 } },
  4: { name: "Analytics Dashboard", stats: { totalTickets: 10, activeUsers: 5, closedTickets: 6, inProgress: 3, blockers: 1 } },
  5: { name: "Automation Engine", stats: { totalTickets: 46, activeUsers: 14, closedTickets: 30, inProgress: 9, blockers: 3 } }
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

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage: Message = {
    id: messages.length + 1,
    role: "user",
    content: input
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const aiMessage: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: "🤔 Thinking..."
    };
    setMessages((prev) => [...prev, aiMessage]);

    // Call backend
    const result = await askAssistant({
      query: input,
      project_id: projectId ?? "default_project",
      num_results: 3,
    });


    // Replace the "Thinking..." with the real answer
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === aiMessage.id
          ? { ...msg, content: result.answer }
          : msg
      )
    );

  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "assistant",
        content: "⚠️ Sorry, I couldn't reach the AI service."
      }
    ]);
  }
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
      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto space-y-3">

        {/* Stats Grid - Ultra Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-0">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="glass-card p-2.5 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 border border-[#38BDF8]/20"
              >
                <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5">
                  <CardTitle className="text-xs font-medium text-[#94A3B8]">{stat.title}</CardTitle>
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-3.5 h-3.5 text-[#0F172A]" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-end justify-between">
                    <div className="text-xl font-bold">{stat.value}</div>
                    <Badge variant="secondary" className="bg-[#1E293B]/40 text-[#38BDF8] text-xs px-1.5 py-0">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Toggle Group - Compact */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl mt-0">
            <ToggleGroup
              type="single"
              value={activeView}
              onValueChange={(value) => value && setActiveView(value as "chat" | "notifications")}
              className="w-full flex glass-card rounded-lg border border-[#38BDF8]/20 overflow-hidden"
            >
              <ToggleGroupItem
                value="chat"
                className="flex-1 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#2563EB] data-[state=on]:to-[#38BDF8] data-[state=on]:text-white text-sm font-medium flex items-center justify-center gap-1.5 py-2.5 transition-all"
              >
                <Bot className="w-4 h-4" />
                AI Assistant
              </ToggleGroupItem>

              <ToggleGroupItem
                value="notifications"
                className="flex-1 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#38BDF8] data-[state=on]:to-[#2563EB] data-[state=on]:text-white relative text-sm font-medium flex items-center justify-center gap-1.5 py-2.5 transition-all"
              >
                <Bell className="w-4 h-4" />
                Notifications
                <Badge className="ml-1 bg-[#F97316] text-[#0F172A] text-[10px] h-4 px-1.5 rounded-sm">
                  {mockNotifications.length}
                </Badge>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mt-3">
        <Card className="glass-card border border-[#38BDF8]/20 h-[calc(100vh-240px)] flex flex-col">
          {activeView === "chat" ? (
            <>
              {/* Chat Messages - ChatGPT style */}
              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                {messages.length === 1 ? (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center space-y-6 max-w-2xl">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Bot className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-semibold gradient-text">How can I help you today?</h2>
                      <p className="text-muted-foreground text-sm">
                        Ask me anything about your project, from analyzing data to suggesting improvements.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="flex-1 p-4 md:p-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                      {messages.slice(1).map((message) => (
                        <div key={message.id} className="space-y-2">
                          {message.role === "user" ? (
                            <div className="flex justify-end">
                              <div className="bg-[#1E293B]/60 rounded-2xl px-4 py-2.5 max-w-[85%]">
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <div className="flex-1 pt-1">
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                )}
              </CardContent>

              {/* Chat Input - Fixed at bottom */}
              <div className="p-4 border-t border-[#38BDF8]/20">
                <div className="max-w-3xl mx-auto">
                  <div className="flex gap-2 items-end">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Message AI Assistant..."
                      className="flex-1 bg-[#1E293B]/40 border-[#38BDF8]/20 resize-none min-h-[44px]"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-[44px] px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
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
