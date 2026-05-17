import { create } from 'zustand';

type UiState = {
  isBookingSheetOpen: boolean;
  setBookingSheetOpen: (isBookingSheetOpen: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isBookingSheetOpen: true,
  setBookingSheetOpen: (isBookingSheetOpen) => set({ isBookingSheetOpen })
}));
