/**
 * Dashboard TypeScript Types
 * Matching backend CallActivity and event structures
 */

export type EventType =
  | 'MC_VERIFICATION_FAILED'
  | 'MC_VERIFIED'
  | 'LOAD_SEARCH_NO_RESULTS'
  | 'LOAD_SEARCHED'
  | 'LOAD_ACCEPTED'
  | 'NEGOTIATION_ROUND'
  | 'CALL_ENDED';

export type NegotiationAction = 'COUNTER' | 'ACCEPT' | 'TRANSFER';

export interface CallActivity {
  id: string;
  run_id: string;
  event_type: EventType;
  data: Record<string, any>;
  timestamp: string;
}

export interface CarrierInfo {
  mc_number?: string;
  carrier_name?: string;
  status: 'idle' | 'verifying' | 'verified' | 'failed';
  verified_at?: string;
}

export interface MCVerifiedData {
  mc_number: string;
  carrier_name: string;
  carrier_status: string;
  physical_address: string;
  is_active: boolean;
}

export interface MCVerificationFailedData {
  mc_number: string;
  reason: string;
}

export interface LoadSearchedData {
  search_params: {
    origin?: string;
    destination?: string;
    equipment_type?: string;
  };
  results_count: number;
  loads: Array<{
    load_id: string;
    origin: string;
    destination: string;
    equipment_type: string;
    loadboard_rate: number;
    miles: number;
  }>;
}

export interface LoadAcceptedData {
  load_id: string;
  loadboard_rate: number;
  accepted_price: number;
  negotiation_id: string;
}

export interface NegotiationRoundData {
  load_id: string;
  round: number;
  carrier_offer: number;
  loadboard_rate: number;
  action: NegotiationAction;
  counter_offer?: number | null;
  reason: string;
  negotiation_id: string;
}

export interface CallEndedData {
  mc_number?: string;
  carrier?: string;
  load_id?: string;
  final_price?: number;
  outcome?: string;
  outcome_reason?: string;
  sentiment?: string;
  negotiation_rounds?: number;
  duration?: string;
  call_end?: string;
  database_call_id: string;
}

export interface FormattedEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: string;
  badge?: {
    text: string;
    variant: 'default' | 'destructive' | 'secondary' | 'outline';
  };
  data: Record<string, any>;
}
