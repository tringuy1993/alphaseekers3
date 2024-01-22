import { create } from "zustand";

const today = new Date().toISOString().split("T")[0];
const useSelectedDateStore = create((set) => ({
  selectedDate: today,
  setSelectedDate: (value) => set({ selectedDate: value }),
}));

export default useSelectedDateStore;
