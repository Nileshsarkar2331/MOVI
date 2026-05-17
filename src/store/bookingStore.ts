import { create } from 'zustand';

import { BookingDraft } from '@/types/booking';

type BookingState = {
  draft: BookingDraft;
  setDraft: (draft: BookingDraft) => void;
  resetDraft: () => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  draft: {},
  setDraft: (draft) => set({ draft }),
  resetDraft: () => set({ draft: {} })
}));
