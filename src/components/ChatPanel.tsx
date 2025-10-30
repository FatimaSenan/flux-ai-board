import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Maximize2, Minimize2, X } from "lucide-react";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const ChatPanel = ({ isOpen, onClose, projectName }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `Hello! I'm your AI assistant for ${projectName}. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: `I understand you're asking about "${input}". Based on the project data, I can provide insights on tickets, team members, and project progress. What specific information would you like to know?`
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleClose = () => {
    if (isFullScreen) {
      setIsFullScreen(false);
    }
    onClose();
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-fade-in">
        {/* Header Full Screen */}
        <div className="glass-card border-b border-border/50 p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl gradient-text font-semibold">AI Assistant</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullScreen}
                className="hover:bg-muted/50 h-9 w-9"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hover:bg-muted/50 h-9 w-9"
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Full Screen */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" 
                      ? "bg-[#F97316]" 
                      : "bg-gradient-to-br from-primary to-accent"
                  }`}>
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-secondary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-2xl p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-muted/30 border border-[#F97316]/40"
                      : "bg-muted/30 border border-primary/20"
                  }`}>
                    <p className="text-sm text-foreground">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Input Full Screen */}
        <div className="glass-card border-t border-border/50 p-6">
          <div className="max-w-4xl mx-auto flex gap-2 items-center">
            <div className="rounded-xl p-[2.5px] bg-gradient-to-r from-[#2563EB] to-[#F97316] flex-1">
              <Input
                placeholder="Ask about this project..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="bg-background border-0 focus-visible:ring-0 focus-visible:outline-none rounded-[10px] px-4 py-3 text-base"
              />
            </div>
            <Button 
              onClick={handleSend}
              size="icon"
              className="bg-gradient-to-r from-[#2563EB] to-[#F97316] hover:opacity-90 transition-opacity h-12 w-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg glass-card border-border/50 p-0 [&>button]:hidden">
        <SheetHeader className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <SheetTitle className="text-xl gradient-text">AI Assistant</SheetTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullScreen}
                className="hover:bg-muted/50 h-9 w-9"
                title="Full screen"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hover:bg-muted/50 h-9 w-9"
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" 
                    ? "bg-[#F97316]" 
                    : "bg-gradient-to-br from-primary to-accent"
                }`}>
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-secondary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <div className={`flex-1 p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-muted/30 border border-[#F97316]/40"
                    : "bg-muted/30 border border-primary/20"
                }`}>
                  <p className="text-sm text-foreground">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex gap-2 items-center">
            <div className="rounded-xl p-[2.5px] bg-gradient-to-r from-[#2563EB] to-[#F97316] flex-1">
              <Input
                placeholder="Ask about this project..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="bg-background border-0 focus-visible:ring-0 focus-visible:outline-none rounded-[10px] px-4 py-2"
              />
            </div>
            <Button 
              onClick={handleSend}
              size="icon"
              className="bg-gradient-to-r from-[#2563EB] to-[#F97316] hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatPanel;