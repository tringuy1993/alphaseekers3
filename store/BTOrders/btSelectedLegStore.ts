import { create } from "zustand";
import type { State, Actions, OrderData } from "./types";

export const useBTSelectedLegsStore = create<State & Actions>((set) => ({
  legs: [],
  legsPriceSum: 0,
  addLegs: (addedLeg) => {
    set((state) => {
      if (state.legs.length < 4) {
        const newLegs = [...state.legs, addedLeg];
        const newSum = newLegs.reduce((acc, leg) => acc + leg.price, 0);
        return { legs: newLegs, legsPriceSum: newSum };
      } else {
        return { legs: state.legs, legsPriceSum: state.legsPriceSum };
      }
    });
  },
  removeAllLegs: () => {
    set({ legs: [], legsPriceSum: 0 });
  },
  setOrder: () => {
    const allLegs = useBTSelectedLegsStore.getState().legs;
    const sum = useBTSelectedLegsStore.getState().legsPriceSum;
    useBTOrderStore.setState({
      order: { legs: allLegs, orderCost: Number(sum.toFixed(2)) },
    });
  },
}));

export const useBTOrderStore = create<OrderData>((set) => ({
  order: { legs: [], orderCost: 0 },
}));
