import { create } from "zustand";

type State = {
  BackTestTime: string;
};
type Action = {
  updateBackTestTime: (BackTestTime: State["BackTestTime"]) => void;
};
export const useBTTimePickerStore = create<State & Action>((set) => ({
  BackTestTime: "09:31:00",
  updateBackTestTime: (currentTime) => set({ BackTestTime: currentTime }),
}));
