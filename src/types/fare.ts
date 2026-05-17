export type FareEstimate = {
  currency: 'INR';
  privateFare: number;
  estimatedSharedFare?: number;
  passengerCount?: number;
};
