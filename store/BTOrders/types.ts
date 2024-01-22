type OrderState = {
  buy_type?: string;
  option_type: boolean;
  price: number;
  expiration: string;
  quote_datetime: string;

  ask?: number;
  bid?: number;

  strike: number;
  gamma?: number;
  delta?: number;
};

type State = {
  legs: OrderState[];
  legsPriceSum: number;
};

type Actions = {
  addLegs: (addedLeg: OrderState) => void;
  removeAllLegs: () => void;
  setOrder: () => void;
};

type OrderData = {
  order: { legs: OrderState[]; orderCost: number };
};
export type { OrderState, State, Actions, OrderData };
