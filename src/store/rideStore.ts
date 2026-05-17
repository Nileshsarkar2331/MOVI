import { create } from 'zustand';

import { RideMode } from '@/types/ride';
import { VehicleType } from '@/types/vehicle';

type RideState = {
  rideMode: RideMode;
  vehicleType: VehicleType;
  setRideMode: (rideMode: RideMode) => void;
  setVehicleType: (vehicleType: VehicleType) => void;
};

export const useRideStore = create<RideState>((set) => ({
  rideMode: 'shared',
  vehicleType: 'auto',
  setRideMode: (rideMode) => set({ rideMode }),
  setVehicleType: (vehicleType) => set({ vehicleType })
}));
