import { formatEvent, formatRelativeTime } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import type { CallActivity } from '@/types/dashboard';

interface ActivityItemProps {
  activity: CallActivity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const formatted = formatEvent(activity);

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
        <div className="w-0.5 h-full bg-border mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight">{formatted.title}</h4>
          {formatted.badge && (
            <Badge variant={formatted.badge.variant} className="shrink-0">
              {formatted.badge.text}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-snug">
          {formatted.description}
        </p>

        <p className="text-xs text-muted-foreground/70">
          {formatRelativeTime(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}
