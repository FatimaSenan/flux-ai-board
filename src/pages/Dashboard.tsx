// src/pages/Dashboard.tsx
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, FileCode, TrendingUp, AlertCircle, Send, Bell, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import BackgroundNetwork from "@/components/ui/BackgroundNetwork";
import VersionDiffModal from "@/components/VersionDiffModal";
import { askAssistant } from "@/services/aiService";

interface Ticket {
  id: number;
  name: string;
  description: string;
  status: string;
  creator: string;
  project: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface Notification {
  ticketId: number;
  ticketName: string;
  description: string;
  read?: boolean;
}

interface TicketVersion {
  id: number;
  name: string;
  description: string;
  status: string;
  creator: string;
  project: string;
}

const API_BASE_URL = "http://localhost:8081";

const Dashboard = () => {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState<string>("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"chat" | "notifications">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! I'm your AI assistant. How can I help you with this project today?" }
  ]);
  const [input, setInput] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<{
    ticketId: number;
    ticketName: string;
    description: string;
    versions?: TicketVersion[];
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🟢 Fetch project tickets + info + notifications
  useEffect(() => {
    async function fetchProjectData() {
      try {
        const ticketsRes = await fetch(`${API_BASE_URL}/projects/${projectId}/tickets`);
        const ticketsData: Ticket[] = await ticketsRes.json();
        setTickets(ticketsData);

        // Fetch notifications
        const notificationsRes = await fetch(`${API_BASE_URL}/modifications/latest`);
        const notificationsData: Notification[] = await notificationsRes.json();
        // Ajouter le statut "read" à false par défaut
        const notificationsWithReadStatus = notificationsData.map(notification => ({
          ...notification,
          read: false
        }));
        setNotifications(notificationsWithReadStatus);

        if (ticketsData.length > 0 && ticketsData[0].project) {
          setProjectName(ticketsData[0].project);
        } else {
          // fallback — fetch project name from projects endpoint
          const projRes = await fetch(`${API_BASE_URL}/projects/${projectId}`);
          const proj = await projRes.json();
          setProjectName(proj.name);
        }
      } catch (err) {
        console.error("❌ Error fetching project data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) fetchProjectData();
  }, [projectId]);

  // 🟢 Marquer une notification comme lue
  const markNotificationAsRead = (ticketId: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.ticketId === ticketId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // 🟢 Fetch ticket versions when notification is selected
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Marquer la notification comme lue
      markNotificationAsRead(notification.ticketId);

      const versionsRes = await fetch(`${API_BASE_URL}/tickets/${notification.ticketId}/versions`);
      const versionsData: TicketVersion[] = await versionsRes.json();
      
      setSelectedNotification({
        ...notification,
        versions: versionsData
      });
    } catch (error) {
      console.error("❌ Error fetching ticket versions:", error);
      setSelectedNotification(notification);
    }
  };

  // 🧮 Compute stats
  const totalTickets = tickets.length;
  const completed = tickets.filter((t) => t.status === "COMPLETED").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const starting = tickets.filter((t) => t.status === "STARTING").length;

  // 🧮 Calculer le nombre de notifications non lues
  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  const stats = [
    { title: "Total Tickets", value: totalTickets, icon: FileCode, color: "from-[#38BDF8] to-[#2563EB]" },
    { title: "In Progress", value: inProgress, icon: TrendingUp, color: "from-[#2563EB] to-[#38BDF8]" },
    { title: "Completed", value: completed, icon: AlertCircle, color: "from-[#38BDF8] to-[#F97316]" },
    { title: "Starting", value: starting, icon: FileCode, color: "from-[#F97316] to-[#2563EB]" },
  ];

  // 🧠 Chat send handler
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: messages.length + 1, role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const aiMessage: Message = { id: messages.length + 2, role: "assistant", content: "🤔 Thinking..." };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const result = await askAssistant({
        query: input,
        project_id: projectId ?? "default_project",
        num_results: 3,
      });

      const sourcesText = result.contexts
        .map((ctx, i) => `📄 Source ${i + 1}: ${ctx.source}`)
        .join("\n");

      const finalContent = `${result.answer}\n\n${sourcesText}`;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessage.id ? { ...msg, content: finalContent } : msg
        )
      );
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, role: "assistant", content: "⚠️ Sorry, I couldn't reach the AI service." },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading)
    return (
      <div className="text-center text-white pt-40 text-lg animate-pulse">
        Loading project dashboard...
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundNetwork />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/95 to-[#0F172A]/98 pointer-events-none" />

      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto space-y-3">
        {/* Project Title */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold gradient-text">{projectName || "Project Dashboard"}</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-0">
          {stats.map((stat) => {
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
                  <div className="text-xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Toggle Group */}
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
                Notifications ({unreadNotificationsCount})
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Main Area */}
        <div className="mt-3">
          <Card className="glass-card border border-[#38BDF8]/20 h-[calc(100vh-240px)] flex flex-col">
            {activeView === "chat" ? (
              <>
                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                  <ScrollArea className="flex-1 p-4 md:p-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                      {messages.slice(1).map((message) => (
                        <div key={message.id}>
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
                                {message.content.split("\n").map((line, idx) => {
                                  if (line.startsWith("📄 Source"))
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-gradient-to-r from-[#2563EB]/20 via-[#38BDF8]/10 to-[#F97316]/20
                                        px-3 py-1 rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300 mt-2 w-fit"
                                      >
                                        <span className="text-[#F97316] font-semibold text-sm">{line}</span>
                                      </div>
                                    );
                                  return <p key={idx} className="text-sm leading-relaxed">{line}</p>;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

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
              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                {/* ScrollArea avec scroll invisible */}
                <ScrollArea className="flex-1 scroll-area-hide">
                  <div className="p-4 md:p-6 w-full space-y-3">
                    {notifications.length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm py-8 w-full">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <Card
                          key={index}
                          onClick={() => handleNotificationClick(notification)}
                          className={`glass-card p-3 rounded-lg transition-all hover:shadow-[0_4px_18px_rgba(56,189,248,0.18)] hover:border-primary/20 cursor-pointer w-full ${
                            notification.read ? 'opacity-60' : 'border-l-4 border-l-blue-500'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 w-full">
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-primary">Ticket #{notification.ticketId}</span>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                )}
                              </div>
                              <p className="text-sm font-medium truncate">{notification.ticketName}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="flex-shrink-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      <VersionDiffModal 
        isOpen={!!selectedNotification} 
        onClose={() => setSelectedNotification(null)} 
        notification={selectedNotification} 
      />
    </div>
  );
};

export default Dashboard;