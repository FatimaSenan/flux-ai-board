// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { Notification, TicketVersion } from '@/services/apiService';
import notificationService from '@/services/notificationsService';

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
}

/**
 * Hook personnalisé pour gérer les notifications
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error('Error in useNotifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refreshNotifications: fetchNotifications,
  };
};

interface UseTicketVersionsReturn {
  versions: TicketVersion[];
  loading: boolean;
  error: string | null;
  refreshVersions: () => Promise<void>;
}

/**
 * Hook personnalisé pour gérer les versions d'un ticket
 */
export const useTicketVersions = (ticketId: number | null): UseTicketVersionsReturn => {
  const [versions, setVersions] = useState<TicketVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    if (!ticketId) {
      setVersions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getTicketVersions(ticketId);
      setVersions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticket versions');
      console.error('Error in useTicketVersions:', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  return {
    versions,
    loading,
    error,
    refreshVersions: fetchVersions,
  };
};