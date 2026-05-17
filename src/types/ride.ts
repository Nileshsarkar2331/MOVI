import { MoviLocation } from './location';
import { VehicleType } from './vehicle';

export type RideMode = 'private' | 'shared';

export type RideRequest = {
  id: string;
  mode: RideMode;
  vehicleType: VehicleType;
  pickup: MoviLocation;
  drop: MoviLocation;
};
