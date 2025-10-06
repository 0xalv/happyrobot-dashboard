import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { CallActivity, MCVerifiedData } from '@/types/dashboard';

interface CarrierInfoCardProps {
  activities: CallActivity[];
  isLoading: boolean;
}

export function CarrierInfoCard({ activities, isLoading }: CarrierInfoCardProps) {
  // Find MC verification event
  const mcEvent = activities.find(
    (a) => a.event_type === 'MC_VERIFIED' || a.event_type === 'MC_VERIFICATION_FAILED'
  );

  const isVerified = mcEvent?.event_type === 'MC_VERIFIED';
  const isFailed = mcEvent?.event_type === 'MC_VERIFICATION_FAILED';
  const carrierData = isVerified ? (mcEvent.data as MCVerifiedData) : null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carrier Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  if (!mcEvent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carrier Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-muted-foreground animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Waiting for Verification</p>
              <p className="text-xs text-muted-foreground">
                Carrier details will appear after MC verification
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isFailed) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Carrier Information</CardTitle>
            <Badge variant="destructive">Failed</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">MC #{mcEvent.data.mc_number}</p>
            <p className="text-sm text-destructive">{mcEvent.data.reason}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isVerified && carrierData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Carrier Information</CardTitle>
            <Badge variant="success">Verified</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Company Name</p>
            <p className="text-base font-semibold">{carrierData.carrier_name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">MC Number</p>
            <p className="text-base font-semibold">MC #{carrierData.mc_number}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">
              {carrierData.carrier_status === 'A' ? 'Active' : carrierData.carrier_status}
              {carrierData.is_active && ' ✓'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p className="text-sm">{carrierData.physical_address}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
