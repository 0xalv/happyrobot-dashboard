'use client';

import { useState, useCallback } from 'react';
import { useActivityFeed } from '@/lib/hooks/useActivityFeed';
import { CarrierInfoCard } from './components/CarrierInfoCard';
import { ActivityFeed } from './components/ActivityFeed';
import { SessionSelector } from './components/SessionSelector';

export default function DashboardPage() {
  const [selectedRunId, setSelectedRunId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'waitroom' | 'history' | 'session'>('waitroom');

  const { activities, isLoading, error } = useActivityFeed({
    run_id: selectedRunId,
    limit: 50,
    pollingInterval: 2000, // 2 seconds
    enabled: true,
  });

  // Auto-select new live sessions
  const handleNewSession = useCallback((runId: string) => {
    console.log('🔴 New live session detected, auto-selecting:', runId);
    setSelectedRunId(runId);
    setViewMode('session');
  }, []);

  // Handle session selection changes
  const handleRunIdChange = useCallback((runId: string | undefined, mode: 'waitroom' | 'history' | 'session') => {
    setSelectedRunId(runId);
    setViewMode(mode);
  }, []);

  // Check if session is active (no CALL_ENDED and less than 10 minutes since first event)
  const hasRecentActivity = activities.length > 0 && (() => {
    // Check if call has ended
    const hasCallEnded = activities.some(activity => activity.event_type === 'CALL_ENDED');
    if (hasCallEnded) {
      return false;
    }

    // Check if less than 10 minutes have passed since the FIRST event
    const sortedActivities = [...activities].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const firstEventTime = new Date(sortedActivities[0].timestamp).getTime();
    const now = Date.now();
    const diffSeconds = (now - firstEventTime) / 1000;
    const tenMinutesInSeconds = 10 * 60; // 600 seconds

    return diffSeconds < tenMinutesInSeconds;
  })();

  // Determine what activities to show based on view mode
  const displayActivities = viewMode === 'waitroom'
    ? (hasRecentActivity ? activities : [])
    : activities;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">HappyRobot Dashboard</h1>
            <p className="text-muted-foreground">Real-time call activity monitoring</p>
          </div>
          <SessionSelector
            selectedRunId={selectedRunId}
            onRunIdChange={handleRunIdChange}
            onNewSessionDetected={handleNewSession}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            <p className="font-medium">Error loading activities</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Carrier Info (1/4) */}
          <div className="lg:col-span-1">
            <CarrierInfoCard
              activities={displayActivities}
              isLoading={isLoading}
            />
          </div>

          {/* Right Panel - Activity Feed (3/4) */}
          <div className="lg:col-span-3">
            <ActivityFeed
              activities={displayActivities}
              isLoading={isLoading}
              autoScroll={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
