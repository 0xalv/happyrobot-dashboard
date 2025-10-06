import { format, formatDistanceToNow } from 'date-fns';
import type {
  CallActivity,
  FormattedEvent,
  MCVerifiedData,
  MCVerificationFailedData,
  LoadSearchedData,
  LoadAcceptedData,
  NegotiationRoundData,
  CallEndedData,
} from '@/types/dashboard';

/**
 * Format timestamp to human-readable string
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return format(date, 'MMM dd, yyyy HH:mm:ss');
}

/**
 * Format timestamp to relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format event to display-ready structure
 */
export function formatEvent(activity: CallActivity): FormattedEvent {
  const baseEvent: FormattedEvent = {
    id: activity.id,
    type: activity.event_type,
    title: '',
    description: '',
    timestamp: activity.timestamp,
    data: activity.data,
  };

  switch (activity.event_type) {
    case 'MC_VERIFIED': {
      const data = activity.data as MCVerifiedData;
      return {
        ...baseEvent,
        title: 'Carrier Verified',
        description: `MC #${data.mc_number} - ${data.carrier_name}`,
        badge: {
          text: 'Verified',
          variant: 'default',
        },
      };
    }

    case 'MC_VERIFICATION_FAILED': {
      const data = activity.data as MCVerificationFailedData;
      // Backend sends 'error' field, but type definition has 'reason'
      const errorMessage = ('reason' in data ? data.reason : '') || ('error' in data ? (data as { error: string }).error : '') || 'Carrier not valid';
      return {
        ...baseEvent,
        title: 'Verification Failed',
        description: `MC #${data.mc_number} - ${errorMessage}`,
        badge: {
          text: 'Failed',
          variant: 'destructive',
        },
      };
    }

    case 'LOAD_SEARCHED': {
      const data = activity.data as LoadSearchedData;
      const params = data.search_params;
      const searchTerms = [
        params.origin && `from ${params.origin}`,
        params.destination && `to ${params.destination}`,
        params.equipment_type && `(${params.equipment_type})`,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        ...baseEvent,
        title: 'Loads Found',
        description: `${data.results_count} load${data.results_count !== 1 ? 's' : ''} found ${searchTerms}`,
        badge: {
          text: `${data.results_count} result${data.results_count !== 1 ? 's' : ''}`,
          variant: 'default',
        },
      };
    }

    case 'LOAD_SEARCH_NO_RESULTS': {
      const data = activity.data as LoadSearchedData;
      const params = data.search_params;
      const searchTerms = [
        params.origin && `from ${params.origin}`,
        params.destination && `to ${params.destination}`,
        params.equipment_type && `(${params.equipment_type})`,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        ...baseEvent,
        title: 'No Loads Found',
        description: `No available loads ${searchTerms}`,
        badge: {
          text: 'No results',
          variant: 'secondary',
        },
      };
    }

    case 'LOAD_ACCEPTED': {
      const data = activity.data as LoadAcceptedData;
      return {
        ...baseEvent,
        title: 'Load Accepted',
        description: `Load ${data.load_id} accepted at ${formatCurrency(data.accepted_price)}`,
        badge: {
          text: 'Accepted',
          variant: 'default',
        },
      };
    }

    case 'NEGOTIATION_ROUND': {
      const data = activity.data as NegotiationRoundData;

      if (data.action === 'ACCEPT') {
        return {
          ...baseEvent,
          title: `Negotiation Round ${data.round} - Accepted`,
          description: `Load ${data.load_id} accepted at ${formatCurrency(data.carrier_offer)} - ${data.reason}`,
          badge: {
            text: 'Accepted',
            variant: 'default',
          },
        };
      }

      if (data.action === 'COUNTER') {
        return {
          ...baseEvent,
          title: `Negotiation Round ${data.round} - Counter Offer`,
          description: `Carrier offered ${formatCurrency(data.carrier_offer)}, countered with ${formatCurrency(data.counter_offer || 0)} - ${data.reason}`,
          badge: {
            text: 'Counter',
            variant: 'secondary',
          },
        };
      }

      if (data.action === 'TRANSFER') {
        return {
          ...baseEvent,
          title: `Negotiation Round ${data.round} - Transfer`,
          description: `Transferring to sales representative - ${data.reason}`,
          badge: {
            text: 'Transfer',
            variant: 'default',
          },
        };
      }

      return {
        ...baseEvent,
        title: `Negotiation Round ${data.round}`,
        description: data.reason,
      };
    }

    case 'CALL_ENDED': {
      const data = activity.data as CallEndedData;
      const outcomeInfo = data.outcome ? ` - ${data.outcome}` : '';
      const priceInfo = data.final_price ? ` at ${formatCurrency(data.final_price)}` : '';

      return {
        ...baseEvent,
        title: 'Call Ended',
        description: `${data.carrier || 'Call'}${outcomeInfo}${priceInfo}`,
        badge: data.outcome
          ? {
              text: data.outcome,
              variant: data.outcome === 'BOOKED' ? 'default' : 'default',
            }
          : undefined,
      };
    }

    default:
      return {
        ...baseEvent,
        title: activity.event_type,
        description: 'Unknown event type',
      };
  }
}
