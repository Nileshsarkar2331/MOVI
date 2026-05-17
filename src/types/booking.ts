import { FareEstimate } from './fare';
import { RideRequest } from './ride';

export type BookingDraft = {
  rideRequest?: RideRequest;
  fareEstimate?: FareEstimate;
};
