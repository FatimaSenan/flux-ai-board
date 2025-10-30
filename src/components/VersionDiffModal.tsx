import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";

interface VersionDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    ticket: string;
    title: string;
    oldValue: string;
    newValue: string;
    field: string;
    time: string;
  } | null;
}

const VersionDiffModal = ({ isOpen, onClose, notification }: VersionDiffModalProps) => {
  if (!isOpen || !notification) return null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Simulation d'analyse IA basée sur le type de changement
  const getAIAnalysis = () => {
    const field = notification.field.toLowerCase();
    
    if (field.includes("description")) {
      return {
        icon: AlertCircle,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        summary: "Ce changement de description ajoute de nouvelles exigences fonctionnelles. Il est recommandé de revoir le budget estimé (+15%) et d'allouer 3 jours supplémentaires pour l'implémentation. Deux développeurs (frontend et backend) devront collaborer sur cette tâche."
      };
    } else if (field.includes("priorité") || field.includes("priority")) {
      return {
        icon: AlertCircle,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
        summary: "Le changement de priorité impacte l'organisation du sprint actuel. Cette tâche remonte dans le top 3 des priorités, ce qui nécessite une réorganisation immédiate. 4 tickets dépendants doivent être vérifiés et certaines tâches moins critiques pourraient être reportées au prochain sprint."
      };
    } else if (field.includes("statut") || field.includes("status")) {
      return {
        icon: Sparkles,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        summary: "Ce changement de statut indique une progression positive du projet. L'équipe maintient un bon rythme de développement avec une avancée globale de +12%. Ce déblocage permet également de libérer une dépendance critique qui affectait un autre ticket."
      };
    } else {
      return {
        icon: Sparkles,
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/30",
        summary: "Ce changement a un impact limité sur le projet global. Aucune action particulière n'est requise au-delà de la mise à jour de la documentation et de la notification aux membres concernés de l'équipe."
      };
    }
  };

  const aiAnalysis = getAIAnalysis();
  const IconComponent = aiAnalysis.icon;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      onMouseDown={onClose}
    >
      <div
        className="glass-card rounded-2xl shadow-2xl glow-border max-w-3xl w-full max-h-[80vh] overflow-hidden animate-scale-in pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold">Version History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.ticket} • {notification.title}
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 rounded bg-muted">
                {notification.field} changed
              </span>
              <span>•</span>
              <span>{notification.time}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <h3 className="font-semibold text-sm">Previous Value</h3>
                </div>
                <div className="glass-card p-4 rounded-lg border-l-4 border-destructive/50">
                  <p className="text-sm text-muted-foreground line-through">
                    {notification.oldValue}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-2 md:col-start-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h3 className="font-semibold text-sm">New Value</h3>
                </div>
                <div className="glass-card p-4 rounded-lg border-l-4 border-primary/50">
                  <p className="text-sm">
                    {notification.newValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm">Change Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Field</p>
                  <p className="font-medium">{notification.field}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ticket</p>
                  <p className="font-medium font-mono">{notification.ticket}</p>
                </div>
              </div>
            </div>

            {/* Section d'analyse IA */}
            <div className={`glass-card rounded-lg border-l-4 ${aiAnalysis.borderColor} overflow-hidden`}>
              <div className={`${aiAnalysis.bgColor} p-4`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-background/50 ${aiAnalysis.color} flex-shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">Analyse IA</h3>
                      <span className="px-2 py-0.5 rounded-full bg-background/50 text-xs font-medium">
                        Auto-générée
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {aiAnalysis.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VersionDiffModal;