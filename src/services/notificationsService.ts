// src/services/notificationService.ts

import apiService, { Notification } from "./apiService";
import { TicketVersion } from "./ticketsAnalysisService";

/**
 * Service spécialisé pour la gestion des notifications et de l'historique
 */
class NotificationService {
  private notificationsCache: Map<string, Notification[]> = new Map();
  private versionsCache: Map<number, TicketVersion[]> = new Map();

  /**
   * Récupère les notifications avec cache
   */
  async getNotifications(forceRefresh = false): Promise<Notification[]> {
    const cacheKey = 'latest';

    if (!forceRefresh && this.notificationsCache.has(cacheKey)) {
      return this.notificationsCache.get(cacheKey)!;
    }

    try {
      const notifications = await apiService.getLatestNotifications();
      this.notificationsCache.set(cacheKey, notifications);
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Récupère les versions d'un ticket avec cache
   */
  async getTicketVersions(ticketId: number, forceRefresh = false): Promise<TicketVersion[]> {
    if (!forceRefresh && this.versionsCache.has(ticketId)) {
      return this.versionsCache.get(ticketId)!;
    }

    try {
      const versions = await apiService.getTicketVersions(ticketId);
      
      // Trier les versions : la première est la plus récente
      const sortedVersions = this.sortVersionsByRecency(versions);
      this.versionsCache.set(ticketId, sortedVersions);
      
      return sortedVersions;
    } catch (error) {
      console.error(`Error fetching versions for ticket ${ticketId}:`, error);
      throw error;
    }
  }

  /**
   * Trie les versions par ordre de récence (première = plus récente)
   */
  private sortVersionsByRecency(versions: TicketVersion[]): TicketVersion[] {
    // Si les versions ont un timestamp ou ordre implicite, les trier ici
    // Pour l'instant, on retourne tel quel car l'API devrait déjà les retourner dans l'ordre
    return versions;
  }

  /**
   * Récupère les détails complets d'une notification avec ses versions
   */
  async getNotificationDetails(notification: Notification) {
    try {
      const versions = await this.getTicketVersions(notification.ticketId);
      return {
        ...notification,
        versions,
        hasHistory: versions.length > 0,
        latestVersion: versions[0],
        previousVersion: versions.length > 1 ? versions[1] : null,
      };
    } catch (error) {
      console.error('Error fetching notification details:', error);
      return {
        ...notification,
        versions: [],
        hasHistory: false,
        latestVersion: null,
        previousVersion: null,
      };
    }
  }

  /**
   * Nettoie le cache
   */
  clearCache() {
    this.notificationsCache.clear();
    this.versionsCache.clear();
  }

  /**
   * Nettoie le cache pour un ticket spécifique
   */
  clearTicketCache(ticketId: number) {
    this.versionsCache.delete(ticketId);
  }
}

// Instance singleton
export const notificationService = new NotificationService();

export default notificationService;