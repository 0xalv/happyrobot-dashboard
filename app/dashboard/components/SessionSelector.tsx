'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Session {
  run_id: string;
  latest_timestamp: string;
  first_timestamp: string;
  total_activities: number;
  latest_event_type: string;
  has_ended: boolean;
}

interface SessionSelectorProps {
  selectedRunId: string | undefined;
  onRunIdChange: (runId: string | undefined, mode: 'waitroom' | 'history' | 'session') => void;
  onNewSessionDetected?: (runId: string) => void;
}

export function SessionSelector({ selectedRunId, onRunIdChange, onNewSessionDetected }: SessionSelectorProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prevSessionIds, setPrevSessionIds] = useState<Set<string>>(new Set());

  const isSessionLive = useCallback((session: Session) => {
    // Session is NOT live if it has ended
    if (session.has_ended) {
      return false;
    }

    // Session is live if less than 10 minutes have passed since the FIRST event
    const firstEventTime = new Date(session.first_timestamp).getTime();
    const now = Date.now();
    const diffSeconds = (now - firstEventTime) / 1000;
    const tenMinutesInSeconds = 10 * 60; // 600 seconds

    return diffSeconds < tenMinutesInSeconds;
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      if (data.success) {
        const newSessions = data.sessions || [];
        setSessions(newSessions);

        // Detect new sessions
        const currentSessionIds = new Set<string>(newSessions.map((s: Session) => s.run_id));
        const newSessionIds = Array.from(currentSessionIds).filter(id => !prevSessionIds.has(id));

        // If we found a new live session, notify parent
        if (newSessionIds.length > 0 && onNewSessionDetected) {
          const newestSession = newSessions.find((s: Session) =>
            newSessionIds.includes(s.run_id) && isSessionLive(s)
          );
          if (newestSession) {
            onNewSessionDetected(newestSession.run_id);
          }
        }

        setPrevSessionIds(currentSessionIds);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [prevSessionIds, onNewSessionDetected, isSessionLive]);

  // Initial fetch
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Polling every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSessions();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchSessions]);

  const handleValueChange = (value: string) => {
    if (value === 'waitroom') {
      onRunIdChange(undefined, 'waitroom');
    } else if (value === 'all') {
      onRunIdChange(undefined, 'history');
    } else {
      onRunIdChange(value, 'session');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="session-select" className="text-sm font-medium whitespace-nowrap">
        Session:
      </label>
      <Select
        value={selectedRunId || 'waitroom'}
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger id="session-select" className="w-[300px]">
          <SelectValue placeholder="Select a session" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="waitroom">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-medium">Wait Room</span>
            </div>
          </SelectItem>
          <SelectItem value="all">All Sessions (History)</SelectItem>
          {sessions.map((session) => {
            const isLive = isSessionLive(session);
            return (
              <SelectItem key={session.run_id} value={session.run_id}>
                <div className="flex items-center gap-2">
                  {isLive && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                  <span className="font-mono text-xs">
                    {session.run_id.substring(0, 8)}...
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ({session.total_activities} events)
                  </span>
                  {isLive && (
                    <Badge variant="destructive" className="text-xs px-1 py-0">LIVE</Badge>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
