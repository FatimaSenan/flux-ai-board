import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, ArrowRight, Eye, X } from "lucide-react";
import VersionDiffModal from "@/components/VersionDiffModal";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
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

const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null);
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 p-0">
        <SheetHeader className="p-6 border-b border-border/50 bg-card/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold gradient-text">Recent Changes</SheetTitle>
            <Badge variant="secondary" className="bg-primary/30 text-primary border-primary/20 font-semibold">
              {mockNotifications.length} updates
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] p-6 bg-background/30">
          <div className="space-y-3">
            {mockNotifications.map((n) => (
              <Card
                key={n.id}
                onClick={() => setSelectedNotification(n)}
                className="glass-card p-3 rounded-lg transition-all hover:shadow-[0_4px_18px_rgba(56,189,248,0.18)] hover:border-primary/20 cursor-pointer"
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
      </SheetContent>
      <VersionDiffModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </Sheet>
  );
};

export default NotificationsPanel;
