// src/services/apiService.ts

export interface Notification {
  ticketId: number;
  ticketName: string;
  description: string;
}

export interface TicketVersion {
  id: number;
  name: string;
  description: string;
  status: string;
  creator: string;
  project: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
}

export interface Ticket {
  id: number;
  name: string;
  description: string;
  status: string;
  creator: string;
  project: string;
}

const API_BASE_URL = "http://localhost:8081";

/**
 * Service pour gérer les appels API
 */
class ApiService {
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
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les dernières modifications/notifications
   */
  async getLatestNotifications(): Promise<Notification[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/modifications/latest`);
  }

  /**
   * Récupère l'historique des versions d'un ticket
   */
  async getTicketVersions(ticketId: number): Promise<TicketVersion[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/tickets/${ticketId}/versions`);
  }

  /**
   * Récupère tous les tickets d'un projet
   */
  async getProjectTickets(projectId: string): Promise<Ticket[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/projects/${projectId}/tickets`);
  }

  /**
   * Récupère les informations d'un projet
   */
  async getProject(projectId: string): Promise<Project> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/projects/${projectId}`);
  }

  /**
   * Récupère un ticket spécifique
   */
  async getTicket(ticketId: number): Promise<Ticket> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/tickets/${ticketId}`);
  }

  /**
   * Met à jour un ticket
   */
  async updateTicket(ticketId: number, updates: Partial<Ticket>): Promise<Ticket> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Crée un nouveau ticket
   */
  async createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  /**
   * Supprime un ticket
   */
  async deleteTicket(ticketId: number): Promise<void> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'DELETE',
    });
  }
}

// Instance singleton
export const apiService = new ApiService();

/**
 * Hook personnalisé pour utiliser le service API
 */
export const useApiService = () => {
  return apiService;
};

export default apiService;