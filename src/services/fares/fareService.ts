import { FareEstimate } from '@/types/fare';
import { RideMode } from '@/types/ride';
import { VehicleType } from '@/types/vehicle';

export const fareService = {
  estimateFare: (mode: RideMode, vehicleType: VehicleType): FareEstimate => {
    const privateFare = vehicleType === 'auto' ? 160 : 320;

    return {
      currency: 'INR',
      privateFare,
      estimatedSharedFare: mode === 'shared' ? Math.round(privateFare * 0.62) : undefined,
      passengerCount: mode === 'shared' ? 2 : undefined
    };
  }
};
