import { create } from 'zustand';

interface CreditsStore {
  credits: number;
  setCredits: (credits: number) => void;
}

export const useCredits = create<CreditsStore>((set) => ({
  credits: 0,
  setCredits: (credits: number) => set({ credits }),
}));
