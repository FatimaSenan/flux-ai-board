// src/services/ticketAnalysisService.ts

export interface TicketVersion {
  id: number;
  name: string;
  description: string;
  status: string;
  creator: string;
  project: string;
  timestamp?: string;
}

export interface AIAnalysisRequest {
  old_desc: string;
  new_desc: string;
}

export interface ChangeDetail {
  type: string;
  description: string;
}

export interface EffortEstimation {
  effort_level: string;
  estimated_hours: number;
}

export interface CostRecalculation {
  impact_level: string;
  reason: string;
}

export interface AIAnalysisResponse {
  summary_changes: string;
  changes_details: ChangeDetail[];
  recommendations: string;
  effort_estimation: EffortEstimation;
  cost_recalculation: CostRecalculation;
  old_description: string;
  new_description: string;
}

const API_BASE_URL = "http://localhost:6066/api/ai-analyze";

/**
 * Récupère les deux dernières versions d'un ticket
 */
export async function getLastTwoVersions(ticketId: number): Promise<TicketVersion[]> {
  try {
    const response = await fetch(`http://localhost:8081/tickets/${ticketId}/versions`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch versions: ${response.status}`);
    }

    const versions: TicketVersion[] = await response.json();
    
    // Trier par timestamp ou par ID pour avoir les plus récentes en premier
    const sortedVersions = versions.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return b.id - a.id; // Fallback sur l'ID si pas de timestamp
    });

    // Retourner les deux plus récentes versions
    return sortedVersions.slice(0, 2);
  } catch (error) {
    console.error("❌ Error fetching ticket versions:", error);
    throw error;
  }
}

/**
 * Compare deux versions et détecte les changements
 */
export function compareVersions(oldVersion: TicketVersion, newVersion: TicketVersion): {
  hasChanges: boolean;
  changes: string[];
  oldDescription: string;
  newDescription: string;
} {
  const changes: string[] = [];

  if (oldVersion.name !== newVersion.name) {
    changes.push(`Title changed from "${oldVersion.name}" to "${newVersion.name}"`);
  }

  if (oldVersion.status !== newVersion.status) {
    changes.push(`Status changed from ${oldVersion.status} to ${newVersion.status}`);
  }

  if (oldVersion.description !== newVersion.description) {
    changes.push("Description updated");
  }

  return {
    hasChanges: changes.length > 0,
    changes,
    oldDescription: oldVersion.description,
    newDescription: newVersion.description
  };
}

/**
 * Envoie les descriptions au service IA pour analyse
 */
export async function analyzeTicketChanges(
  oldDescription: string, 
  newDescription: string
): Promise<AIAnalysisResponse> {
  try {
    const requestBody: AIAnalysisRequest = {
      old_desc: oldDescription,
      new_desc: newDescription
    };

    const response = await fetch(`${API_BASE_URL}/analyze-spec-changes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Analysis API error: ${response.status} ${errorText}`);
    }

    const data: AIAnalysisResponse = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error calling AI Analysis API:", error);
    throw error;
  }
}

/**
 * Fonction principale pour analyser les changements d'un ticket avec l'IA
 */
export async function analyzeTicketWithAI(ticketId: number): Promise<{
  analysis: AIAnalysisResponse | null;
  changes: string[];
  hasChanges: boolean;
}> {
  try {
    // Récupérer les deux dernières versions
    const versions = await getLastTwoVersions(ticketId);
    
    if (versions.length < 2) {
      return {
        analysis: null,
        changes: [],
        hasChanges: false
      };
    }

    const [newVersion, oldVersion] = versions; // Les versions sont triées du plus récent au plus ancien
    
    // Comparer les versions
    const comparison = compareVersions(oldVersion, newVersion);
    
    if (!comparison.hasChanges) {
      return {
        analysis: null,
        changes: [],
        hasChanges: false
      };
    }

    // Analyser les changements avec l'IA
    const analysis = await analyzeTicketChanges(
      comparison.oldDescription,
      comparison.newDescription
    );

    return {
      analysis,
      changes: comparison.changes,
      hasChanges: true
    };

  } catch (error) {
    console.error("❌ Error analyzing ticket with AI:", error);
    throw error;
  }
}