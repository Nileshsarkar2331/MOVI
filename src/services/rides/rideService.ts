import { RideRequest } from '@/types/ride';

export type CreateRideInput = RideRequest;

export const rideService = {
  createRide: async (input: CreateRideInput) => input
};
