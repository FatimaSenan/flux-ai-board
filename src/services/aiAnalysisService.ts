// src/services/aiAnalysisService.ts

export interface AIAnalysisResponse {
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

export interface AIAnalysisRequest {
  old_desc: string;
  new_desc: string;
}

const AI_ANALYSIS_BASE_URL = "http://localhost:6066";

/**
 * Service pour analyser les changements avec l'IA
 */
class AIAnalysisService {
  private async fetchWithErrorHandling(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`AI Analysis API call failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Analyse les changements entre deux versions
   */
  async analyzeSpecChanges(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    return this.fetchWithErrorHandling(`${AI_ANALYSIS_BASE_URL}/api/ai-analyze/analyze-spec-changes`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

// Instance singleton
export const aiAnalysisService = new AIAnalysisService();

export default aiAnalysisService;