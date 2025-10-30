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
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 p-0">
        <SheetHeader className="p-6 border-b border-border/50 bg-card/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold gradient-text">Ticket Changes</SheetTitle>
            <Badge variant="secondary" className="bg-primary/30 text-primary border-primary/20 font-semibold">
              {mockNotifications.length} updates
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] p-6 bg-background/30">
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <Card key={notification.id} className="bg-card/90 backdrop-blur-sm border-border/50 p-6 hover:border-primary/30 hover:shadow-[var(--shadow-glow)] transition-all">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                        <FileCode className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-base">{notification.title}</p>
                        <p className="text-sm text-primary font-medium">{notification.ticketId}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.timestamp}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <span>Previous Description</span>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/20 border border-destructive/30 backdrop-blur-sm">
                        <p className="text-sm text-foreground leading-relaxed">{notification.oldDescription}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-1">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <span>Updated Description</span>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/20 border border-primary/30 backdrop-blur-sm">
                        <p className="text-sm text-foreground leading-relaxed">{notification.newDescription}</p>
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
