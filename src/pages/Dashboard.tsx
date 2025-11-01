// src/pages/Dashboard.tsx
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, FileCode, TrendingUp, AlertCircle, Send, User, FileText, Upload, X } from "lucide-react";
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

interface ProjectFile {
  id: number;
  name: string;
  url: string;
  uploadDate: string;
  size: string;
}

const API_BASE_URL = "http://localhost:8081";
const AI_API_BASE_URL = "http://localhost:6066/api/ai-analyze";

const Dashboard = () => {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState<string>("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "notifications" | "files">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! I'm your AI assistant. How can I help you with this project today?" }
  ]);
  const [input, setInput] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🟢 Fetch project tickets + info - Optimized with Promise.all
  useEffect(() => {
    if (!projectId) return;

    async function fetchProjectData() {
      setLoading(true);
      try {
        // Fetch both project info and tickets in parallel
        const [ticketsRes, projRes] = await Promise.all([
          fetch(`${API_BASE_URL}/projects/${projectId}/tickets`),
          fetch(`${API_BASE_URL}/projects/${projectId}`)
        ]);

        const ticketsData: Ticket[] = await ticketsRes.json();
        const projectData = await projRes.json();

        setTickets(ticketsData);
        setProjectName(projectData.name);

      } catch (err) {
        console.error("❌ Error fetching project data:", err);
        // Set default values to prevent loading state
        setTickets([]);
        setProjectName("Project Dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId]);

  // 🗂️ Fetch project files
  const fetchProjectFiles = async () => {
    if (!projectId) return;
    
    setFilesLoading(true);
    try {
      // Note: You'll need to implement this endpoint to get project files
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files`);
      if (response.ok) {
        const filesData: ProjectFile[] = await response.json();
        setFiles(filesData);
      }
    } catch (err) {
      console.error("❌ Error fetching project files:", err);
    } finally {
      setFilesLoading(false);
    }
  };

  // 📤 Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile || !projectId) return;

    setUploading(true);
    try {
      // Step 1: Upload file to backend
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch(`${API_BASE_URL}/docs/upload/${projectId}`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const fileUrl = await uploadResponse.text();
      
      // Step 2: Process file with AI
      const processResponse = await fetch(`${AI_API_BASE_URL}/process-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url_or_path: fileUrl,
          project_id: projectId
        }),
      });

      if (!processResponse.ok) {
        throw new Error("File processing failed");
      }

      // Refresh files list
      await fetchProjectFiles();
      setSelectedFile(null);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("File uploaded and processed successfully!");

    } catch (error) {
      console.error("❌ Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // 📁 Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // 📂 Load files when files view is active
  useEffect(() => {
    if (activeView === "files") {
      fetchProjectFiles();
    }
  }, [activeView, projectId]);

  // 🧮 Compute stats - with fallback values
  const totalTickets = tickets.length;
  const completed = tickets.filter((t) => t.status === "COMPLETED").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const starting = tickets.filter((t) => t.status === "STARTING").length;

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
        num_results: 1,
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundNetwork />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/95 to-[#0F172A]/98 pointer-events-none" />

      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto space-y-3">

        {/* Stats Grid - Always visible with skeleton loading */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-0">
          {stats.map((stat, index) => {
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
                  <div className="text-xl font-bold">
                    {loading ? (
                      <div className="h-6 w-8 bg-gray-600 rounded animate-pulse"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Toggle Group - Always visible */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl mt-3">
            <ToggleGroup
              type="single"
              value={activeView}
              onValueChange={(value) => value && setActiveView(value as "chat" | "notifications" | "files")}
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
                value="files"
                className="flex-1 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#38BDF8] data-[state=on]:to-[#2563EB] data-[state=on]:text-white text-sm font-medium flex items-center justify-center gap-1.5 py-2.5 transition-all"
              >
                <FileText className="w-4 h-4" />
                Files
              </ToggleGroupItem>

              <ToggleGroupItem
                value="notifications"
                className="flex-1 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#38BDF8] data-[state=on]:to-[#2563EB] data-[state=on]:text-white relative text-sm font-medium flex items-center justify-center gap-1.5 py-2.5 transition-all"
              >
                Notifications
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Main Area - Always visible */}
        <div className="mt-3">
          <Card className="glass-card border border-[#38BDF8]/20 h-[calc(100vh-240px)] flex flex-col">
            {activeView === "chat" ? (
              <>
                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                  {messages.length === 1 ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="text-center space-y-6 max-w-2xl">
                        <div className="w-16 h-16 mx-auto rounded-full border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <img 
                            src="/m.png"
                            alt="MindTrace AI Assistant" 
                            className="w-10 h-10"
                          />
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
                                <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-blue-500/30">
                                  <img 
                                    src="/m.png"
                                    alt="MindTrace AI Assistant" 
                                    className="w-5 h-5"
                                  />
                                </div>
                                <div className="flex-1 pt-1">
                                  {message.content.split("\n").map((line, idx) => {
                                    if (line.startsWith("📄 Source")) {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 bg-gradient-to-r from-[#2563EB]/20 via-[#38BDF8]/10 to-[#F97316]/20
                                                    px-3 py-1 rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300 mt-2 w-fit"
                                        >
                                          <span className="text-[#F97316] font-semibold text-sm">{line}</span>
                                        </div>
                                      );
                                    }
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
                  )}
                </CardContent>

                <div className="p-4 border-t border-[#38BDF8]/20">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex gap-2 items-center">
                      <div className="rounded-xl p-[2.5px] bg-gradient-to-r from-[#2563EB] to-[#F97316] flex-1">
                        <Input
                          placeholder="Ask about this project..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                          className="bg-background border-0 focus-visible:ring-0 focus-visible:outline-none rounded-[10px] px-4 py-2 min-h-[44px]"
                        />
                      </div>
                      <Button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        size="icon"
                        className="bg-gradient-to-r from-[#2563EB] to-[#F97316] hover:opacity-90 transition-opacity h-12 w-12"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : activeView === "files" ? (
              <>
                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                  {/* File Upload Section */}
                  <div className="p-6 border-b border-[#38BDF8]/20">
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-lg font-semibold mb-4">Upload New File</h3>
                      <div className="flex gap-3 items-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="flex-1 border-dashed border-2 border-[#38BDF8]/40 hover:border-[#38BDF8] hover:bg-[#38BDF8]/10 transition-all"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {selectedFile ? selectedFile.name : "Choose File"}
                        </Button>
                        {selectedFile && (
                          <Button
                            onClick={() => setSelectedFile(null)}
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={handleFileUpload}
                          disabled={!selectedFile || uploading}
                          className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] hover:opacity-90 transition-opacity"
                        >
                          {uploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Files List Section */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-lg font-semibold mb-4">Project Files</h3>
                      {filesLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-16 bg-gray-600/20 rounded-lg animate-pulse"></div>
                          ))}
                        </div>
                      ) : files.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>No files uploaded yet.</p>
                          <p className="text-sm">Upload a file to get started.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {files.map((file) => (
                            <Card
                              key={file.id}
                              className="glass-card p-4 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all duration-300 border border-[#38BDF8]/20"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-8 h-8 text-[#38BDF8]" />
                                  <div>
                                    <h4 className="font-medium">{file.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {file.size} • {new Date(file.uploadDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(file.url, '_blank')}
                                >
                                  View
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center text-muted-foreground text-sm">
                {loading ? "Loading notifications..." : "No notifications yet."}
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      <VersionDiffModal isOpen={!!selectedNotification} onClose={() => setSelectedNotification(null)} notification={selectedNotification} />
    </div>
  );
};

export default Dashboard;