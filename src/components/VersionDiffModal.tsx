import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, AlertCircle, FileCode, Plus, Minus, Edit, Loader2 } from "lucide-react";

interface TicketVersion {
  id: number;
  name: string;
  description: string;
  status: string;
  creator: string;
  project: string;
}

interface Notification {
  ticketId: number;
  ticketName: string;
  description: string;
  versions?: TicketVersion[];
}

interface VersionDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
}

// Interface pour la réponse de l'analyse IA
interface AIAnalysisResponse {
  summary_changes: string;
  changes_details: Array<{
    type: string;
    description: string;
  }>;
  recommendations: string;
  effort_estimation: {
    effort_level: string;
    estimated_hours: number;
  };
  cost_recalculation: {
    impact_level: string;
    reason: string;
  };
  old_description: string;
  new_description: string;
}

// Service d'analyse IA simplifié
const analyzeSpecChanges = async (oldDesc: string, newDesc: string): Promise<AIAnalysisResponse> => {
  try {
    const response = await fetch("http://localhost:6066/api/ai-analyze/analyze-spec-changes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_desc: oldDesc,
        new_desc: newDesc,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling AI analysis API:", error);
    throw error;
  }
};

const VersionDiffModal = ({ isOpen, onClose, notification }: VersionDiffModalProps) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Réinitialiser l'état quand la modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen && notification?.versions && notification.versions.length >= 2) {
      fetchAIAnalysis();
    } else {
      setAiAnalysis(null);
      setAnalysisError(null);
      setLoadingAnalysis(false);
    }
  }, [isOpen, notification]);

  // Gestion de la touche Escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const fetchAIAnalysis = async () => {
    if (!notification?.versions || notification.versions.length < 2) {
      console.log("❌ Not enough versions for analysis");
      return;
    }
    
    console.log("🔍 Starting AI analysis...");
    setLoadingAnalysis(true);
    setAnalysisError(null);
    
    try {
      const current = notification.versions[0];
      const previous = notification.versions[1];
      
      console.log("📤 Sending to AI API:", {
        old_desc: previous.description,
        new_desc: current.description
      });
      
      const analysis = await analyzeSpecChanges(previous.description, current.description);
      
      console.log("✅ AI Analysis received successfully");
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("❌ Error in AI analysis:", error);
      setAnalysisError("Service IA temporairement indisponible. Analyse basique affichée.");
      // Utiliser une analyse basique en cas d'erreur
      setAiAnalysis(getBasicAnalysis());
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Fonction pour obtenir une analyse basique
  const getBasicAnalysis = (): AIAnalysisResponse => {
    if (!notification?.versions || notification.versions.length < 2) {
      return getEmptyAnalysis();
    }

    const current = notification.versions[0];
    const previous = notification.versions[1];
    const changes = detectChanges();

    return {
      summary_changes: `Modification détectée dans le ticket. Ancienne description: "${previous.description.substring(0, 50)}...", Nouvelle description: "${current.description.substring(0, 50)}..."`,
      changes_details: changes.map(change => ({
        type: "Modified feature",
        description: `${change.field} modifié`
      })),
      recommendations: "Vérifier l'impact de ces changements sur le planning et les ressources.",
      effort_estimation: {
        effort_level: "Medium",
        estimated_hours: 8
      },
      cost_recalculation: {
        impact_level: "Medium", 
        reason: "Changements nécessitant une revue des estimations"
      },
      old_description: previous.description,
      new_description: current.description
    };
  };

  const getEmptyAnalysis = (): AIAnalysisResponse => ({
    summary_changes: "Aucune analyse disponible",
    changes_details: [],
    recommendations: "Veuillez réessayer plus tard",
    effort_estimation: {
      effort_level: "Unknown",
      estimated_hours: 0
    },
    cost_recalculation: {
      impact_level: "Unknown",
      reason: "Données insuffisantes"
    },
    old_description: "",
    new_description: ""
  });

  // Récupérer uniquement les 2 premières versions
  const getLimitedVersions = (): TicketVersion[] => {
    if (!notification?.versions || notification.versions.length === 0) {
      return [];
    }
    return notification.versions.slice(0, 2);
  };

  const versions = getLimitedVersions();

  // Détection des changements entre les versions
  const detectChanges = () => {
    if (versions.length < 2) return [];

    const current = versions[0];
    const previous = versions[1];
    const changes = [];

    // Détection changement de nom
    if (current.name !== previous.name) {
      changes.push({
        field: "Nom",
        type: "modified",
        previous: previous.name,
        current: current.name,
        icon: Edit
      });
    }

    // Détection changement de description
    if (current.description !== previous.description) {
      changes.push({
        field: "Description", 
        type: "modified",
        previous: previous.description,
        current: current.description,
        icon: Edit
      });
    }

    // Détection changement de statut
    if (current.status !== previous.status) {
      changes.push({
        field: "Statut",
        type: "modified", 
        previous: previous.status,
        current: current.status,
        icon: ArrowRight
      });
    }

    return changes;
  };

  const changes = detectChanges();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "IN_PROGRESS": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "STARTING": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Review": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "added": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "removed": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "modified": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getEffortColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "high": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  if (!isOpen || !notification) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card rounded-2xl shadow-2xl glow-border max-w-5xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold">Comparaison des Versions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ticket #{notification.ticketId} • {notification.ticketName}
            </p>
          </div>
          {changes.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-primary">
                {changes.length} changement{changes.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-4">
            ×
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Description de la notification */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 rounded bg-muted">
                {notification.description}
              </span>
            </div>

            {/* Section Détection des Changements */}
            {changes.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-blue-500 rounded-full" />
                  <h3 className="font-bold text-xl gradient-text">Changements Détectés</h3>
                </div>
                
                <div className="grid gap-4">
                  {changes.map((change, index) => {
                    const ChangeIcon = change.icon;
                    return (
                      <div
                        key={index}
                        className="glass-card p-4 rounded-xl border-l-4 border-blue-500/50 bg-gradient-to-r from-blue-500/5 to-transparent"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <ChangeIcon className="w-5 h-5 text-blue-400" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-semibold text-blue-400">{change.field}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getChangeColor(change.type)}`}>
                                {change.type === 'modified' ? 'Modifié' : change.type}
                              </span>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Minus className="w-4 h-4 text-red-400" />
                                  <span className="text-xs font-medium text-muted-foreground">Ancienne valeur</span>
                                </div>
                                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                  <p className="text-red-400 line-through text-sm leading-relaxed">
                                    {change.previous}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Plus className="w-4 h-4 text-green-400" />
                                  <span className="text-xs font-medium text-muted-foreground">Nouvelle valeur</span>
                                </div>
                                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                                  <p className="text-green-400 text-sm leading-relaxed font-medium">
                                    {change.current}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Aucun changement détecté entre les versions
              </div>
            )}

            {/* Historique des versions */}
            {versions.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Détails des Versions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {versions.map((version, index) => (
                    <div
                      key={index}
                      className={`glass-card p-4 rounded-lg border-l-4 ${
                        index === 0 
                          ? "border-green-500/50 bg-green-500/5" 
                          : "border-blue-500/50 bg-blue-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <FileCode className="w-4 h-4 text-primary" />
                        <span className="font-mono text-sm font-semibold">
                          {index === 0 ? "Version Actuelle" : "Version Précédente"}
                        </span>
                        <div className={`px-2 py-1 rounded text-xs border ${getStatusColor(version.status)}`}>
                          {version.status}
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Nom</p>
                          <p className="font-medium">{version.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Description</p>
                          <p className="font-medium">{version.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-muted-foreground">Créateur</p>
                            <p>{version.creator}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Projet</p>
                            <p>{version.project}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section d'analyse IA */}
            <div className="glass-card rounded-lg border-l-4 border-purple-500/50 overflow-hidden">
              <div className="bg-purple-500/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background/50 text-purple-500 flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-purple-400">Analyse IA</h3>
                      <span className="px-2 py-0.5 rounded-full bg-background/50 text-xs font-medium">
                        {loadingAnalysis ? "Chargement..." : "Auto-générée"}
                      </span>
                      {analysisError && (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                          Mode basique
                        </span>
                      )}
                    </div>

                    {loadingAnalysis ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyse des changements en cours...
                      </div>
                    ) : aiAnalysis ? (
                      <div className="space-y-4">
                        {/* Résumé des changements */}
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-white">Résumé des changements</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {aiAnalysis.summary_changes}
                          </p>
                        </div>

                        {/* Détails des changements */}
                        {aiAnalysis.changes_details && aiAnalysis.changes_details.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-white">Détails des modifications</h4>
                            <div className="space-y-2">
                              {aiAnalysis.changes_details.map((detail, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    detail.type.includes('Added') ? 'bg-green-400' : 
                                    detail.type.includes('Modified') ? 'bg-blue-400' : 'bg-gray-400'
                                  }`} />
                                  <div>
                                    <span className="font-medium">{detail.type}:</span>
                                    <span className="text-muted-foreground ml-1">{detail.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Estimation d'effort et coûts */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-white">Estimation d'effort</h4>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs border ${getEffortColor(aiAnalysis.effort_estimation.effort_level)}`}>
                                {aiAnalysis.effort_estimation.effort_level}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {aiAnalysis.effort_estimation.estimated_hours}h
                              </span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2 text-white">Impact sur les coûts</h4>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs border ${getEffortColor(aiAnalysis.cost_recalculation.impact_level)}`}>
                                {aiAnalysis.cost_recalculation.impact_level}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Recommandations */}
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-white">Recommandations</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {aiAnalysis.recommendations}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">
                          {analysisError || "L'analyse IA nécessite au moins deux versions pour fonctionner."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {versions.length >= 2 && (
            <Button 
              onClick={fetchAIAnalysis}
              variant="secondary"
              disabled={loadingAnalysis}
              className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
            >
              {loadingAnalysis ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Réanalyser
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionDiffModal;