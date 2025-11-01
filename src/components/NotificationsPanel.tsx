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
  notifications: Array<{
    ticketId: number;
    ticketName: string;
    description: string;
    read?: boolean;
  }>;
  onMarkAsRead?: (ticketId: number) => void;
}

// Transformez les mock notifications pour qu'elles correspondent à la structure attendue
const transformMockNotifications = [
  {
    ticketId: 234,
    ticketName: "User authentication flow",
    description: "Priority changed from Medium to High",
    read: false
  },
  {
    ticketId: 189,
    ticketName: "Dashboard performance optimization", 
    description: "Description updated",
    read: false
  },
  {
    ticketId: 156,
    ticketName: "Mobile responsive design",
    description: "Status changed from In Progress to Review",
    read: false
  },
  {
    ticketId: 204,
    ticketName: "Checkout flow improvements",
    description: "Description updated",
    read: false
  },
];

const NotificationsPanel = ({ 
  isOpen, 
  onClose, 
  notifications = transformMockNotifications,
  onMarkAsRead 
}: NotificationsPanelProps) => {
  const [selectedNotification, setSelectedNotification] = useState<{
    ticketId: number;
    ticketName: string;
    description: string;
    versions?: Array<{
      id: number;
      name: string;
      description: string;
      status: string;
      creator: string;
      project: string;
    }>;
  } | null>(null);

  // Fonction pour récupérer uniquement les 2 premières versions
  const getLimitedVersions = (versions: any[]) => {
    if (!versions || versions.length === 0) return [];
    
    // Retourne seulement les 2 premières versions : [dernière, avant-dernière]
    return versions.slice(0, 2);
  };

  // Calculer le nombre de notifications non lues
  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  // Simulation de récupération des versions (à remplacer par votre appel API)
  const handleNotificationClick = async (notification: any) => {
    try {
      // Marquer la notification comme lue
      if (onMarkAsRead) {
        onMarkAsRead(notification.ticketId);
      }

      // Simulation d'appel API - remplacez par votre vrai appel
      const mockVersions = [
        {
          id: notification.ticketId,
          name: notification.ticketName,
          description: "Description actuelle - dernière version",
          status: "COMPLETED",
          creator: "Yassine Azami",
          project: "Plateforme IA"
        },
        {
          id: notification.ticketId,
          name: "Ancien nom du ticket",
          description: "Ancienne description - version précédente",
          status: "IN_PROGRESS",
          creator: "Yassine Azami",
          project: "Plateforme IA"
        }
      ];

      setSelectedNotification({
        ...notification,
        versions: getLimitedVersions(mockVersions)
      });
    } catch (error) {
      console.error("Error fetching versions:", error);
      setSelectedNotification(notification);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 p-0">
        <SheetHeader className="p-6 border-b border-border/50 bg-card/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold gradient-text">Recent Changes</SheetTitle>
            <Badge variant="secondary" className="bg-primary/30 text-primary border-primary/20 font-semibold">
              {unreadNotificationsCount} unread
            </Badge>
          </div>
        </SheetHeader>

        {/* ScrollArea avec scroll invisible */}
        <ScrollArea className="h-[calc(100vh-100px)] scroll-area-hide">
          <div className="p-6 bg-background/30 w-full space-y-3">
            {notifications.map((notification, index) => (
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