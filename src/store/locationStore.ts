import { create } from 'zustand';

import { MoviLocation } from '@/types/location';

type LocationState = {
  pickup?: MoviLocation;
  drop?: MoviLocation;
  setPickup: (pickup: MoviLocation) => void;
  setDrop: (drop: MoviLocation) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  setPickup: (pickup) => set({ pickup }),
  setDrop: (drop) => set({ drop })
}));
