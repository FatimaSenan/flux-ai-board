import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FileCode, ArrowRight } from "lucide-react";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    ticketId: "TICKET-1234",
    title: "User Authentication Bug",
    oldDescription: "Users cannot log in using social media accounts",
    newDescription: "Users cannot log in using social media accounts. Issue occurs specifically with Google OAuth integration.",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    ticketId: "TICKET-1235",
    title: "Dashboard Performance",
    oldDescription: "Dashboard loads slowly",
    newDescription: "Dashboard loads slowly when displaying more than 100 projects. Identified N+1 query issue in projects endpoint.",
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    ticketId: "TICKET-1236",
    title: "Mobile UI Responsiveness",
    oldDescription: "Mobile layout broken on iOS devices",
    newDescription: "Mobile layout broken on iOS devices. CSS grid issue affecting Safari browser specifically. Fixed by adding webkit prefixes.",
    timestamp: "1 day ago"
  },
  {
    id: 4,
    ticketId: "TICKET-1237",
    title: "API Rate Limiting",
    oldDescription: "Implement rate limiting",
    newDescription: "Implement rate limiting for public API endpoints. Using token bucket algorithm with 100 requests per minute limit per user.",
    timestamp: "1 day ago"
  },
  {
    id: 5,
    ticketId: "TICKET-1238",
    title: "Email Notifications",
    oldDescription: "Email notifications not working",
    newDescription: "Email notifications not working for password reset. SMTP configuration issue resolved. Added retry logic for failed sends.",
    timestamp: "2 days ago"
  },
];

const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl glass-card border-border/50 p-0">
        <SheetHeader className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl gradient-text">Ticket Changes</SheetTitle>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {mockNotifications.length} updates
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] p-6">
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <Card key={notification.id} className="glass-card border-border/50 p-6 hover:border-primary/30 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <FileCode className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.ticketId}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Previous Description</span>
                      </div>
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-foreground">{notification.oldDescription}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Updated Description</span>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm text-foreground">{notification.newDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
