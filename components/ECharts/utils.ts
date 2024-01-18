import { format } from "date-fns";

export function formatDate(dateobj: Date): string {
  return format(dateobj, "yyyy-MM-dd");
}

export type requestParamsProps = {
  und_symbol: string[] | string;
  greek: string;
  startDate: string;
  endDate: string;
};

export function request_data_params({
  und_symbol,
  greek,
  startDate,
  endDate,
}): requestParamsProps {
  und_symbol =
    typeof und_symbol === "object" ? JSON.stringify(und_symbol) : und_symbol;
  return {
    und_symbol: und_symbol,
    greek: greek,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}
