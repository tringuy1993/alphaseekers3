import { create } from 'zustand';

type DateRange = [Date, Date | undefined];

type State = {
  BackTestDate: DateRange;
};

type Action = {
  updateBackTestDate: (BackTestDate: DateRange) => void;
};

export const useBTDatePickerStore = create<State & Action>((set) => ({
  BackTestDate: [new Date('2018-06-05'), new Date('2018-06-05')],
  updateBackTestDate: (dateRange) => set({ BackTestDate: dateRange }),
}));
