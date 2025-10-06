'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CallActivity } from '@/types/dashboard';

interface UseActivityFeedOptions {
  run_id?: string;
  limit?: number;
  pollingInterval?: number; // milliseconds
  enabled?: boolean;
}

interface UseActivityFeedReturn {
  activities: CallActivity[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useActivityFeed({
  run_id,
  limit = 50,
  pollingInterval = 2000, // Default: 2 seconds
  enabled = true,
}: UseActivityFeedOptions = {}): UseActivityFeedReturn {
  const [activities, setActivities] = useState<CallActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (run_id) {
        params.set('run_id', run_id);
      }
      params.set('limit', limit.toString());

      const response = await fetch(`/api/activity?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch activities');
      }

      setActivities(data.activities || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [run_id, limit]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchActivities();
    }
  }, [enabled, fetchActivities]);

  // Polling
  useEffect(() => {
    if (!enabled || pollingInterval <= 0) {
      return;
    }

    const interval = setInterval(() => {
      fetchActivities();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enabled, pollingInterval, fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities,
  };
}
