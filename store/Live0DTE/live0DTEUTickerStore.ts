import { create } from "zustand";

const useSelectedUTickerStore = create((set) => ({
  selectedUTicker: "$SPX.X",
  setSelectedUTicker: (value) => set({ selectedUTicker: value }),
}));

export default useSelectedUTickerStore;
