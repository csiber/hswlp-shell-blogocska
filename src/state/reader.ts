import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReaderModeState {
  enabled: boolean;
  toggle: () => void;
}

export const useReaderModeStore = create<ReaderModeState>()(
  persist(
    (set, get) => ({
      enabled: false,
      toggle: () => set({ enabled: !get().enabled }),
    }),
    { name: "reader-mode" }
  )
);
