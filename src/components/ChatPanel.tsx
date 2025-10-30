import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg glass-card border-border/50 p-0">
        <SheetHeader className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <SheetTitle className="text-xl gradient-text">AI Assistant</SheetTitle>
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
                    ? "bg-secondary" 
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
                    ? "bg-secondary/50 border border-border/30"
                    : "bg-muted/30 border border-primary/20"
                }`}>
                  <p className="text-sm text-foreground">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about this project..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="bg-muted/50 border-border/50 focus:border-primary"
            />
            <Button 
              onClick={handleSend}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
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
