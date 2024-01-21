import { create } from "zustand";

interface DateRange {
  from: Date;
  to: Date | undefined;
}

type State = {
  BackTestDate: DateRange;
};

type Action = {
  updateBackTestDate: (BackTestDate: DateRange) => void;
};

export const useBTDatePickerStore = create<State & Action>((set) => ({
  BackTestDate: { from: new Date("2018-06-05"), to: new Date("2018-06-05") },
  updateBackTestDate: (dateRange) => set({ BackTestDate: dateRange }),
}));
