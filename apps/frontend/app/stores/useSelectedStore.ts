import { create } from "zustand";

interface SelectedStoreState {
  selectedStoreId: number | null;
  setSelectedStoreId: (id: number) => void;
}

export const useSelectedStore = create<SelectedStoreState>(set => ({
  selectedStoreId: null,
  setSelectedStoreId: id => set({ selectedStoreId: id }),
}));
