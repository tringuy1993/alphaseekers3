type ESOptionData = {
  openinterest: number;
  optiontype: string | number;
  strike: number;
  ticker_last_price: number;
  volume: number;
  [key: string]: number; // Index signature for dynamic properties
};

type ESOptionResult = {
  strike_price?: number;
  strike?: number;
  last_price?: number;
  open_price?: number;
  exp_date_str?: string | number;
  c_totalvolume: number;
  c_openinterest?: number;
  c_notion_expo: number;
  p_totalvolume: number;
  p_openinterest?: number;
  p_notion_expo: number;
  total_notional_exposure: number;

  // c_openinterest?: number;
  // p_openinterest?: number;
};

export function combineESOptionData(
  data: ESOptionData[],
  greek: string
): ESOptionResult[] {
  let combined_data: ESOptionResult[];
  if (data.some((obj) => "exp_date" in obj)) {

    const call_data = data
      .filter((data) => data.optiontype === "c")
      .map((data) => ({
        strike: data.strike,
        exp_date_str: data.exp_date,
        c_totalvolume: data.volume,
        c_openinterest: data.openinterest,
        c_notion_expo: data[greek + "_notion_expo"],
      }));

    const put_data = data
      .filter((data) => data.optiontype === "p")
      .map((data) => ({
        strike: data.strike,
        exp_date_str: data.exp_date,
        p_totalvolume: -1 * data.volume,
        p_openinterest: -1 * data.openinterest,
        p_notion_expo: data[greek + "_notion_expo"],
      }));

    combined_data = call_data.reduce((acc: ESOptionResult[], curr) => {
      const matching_put_data = put_data.find(
        (data) =>
          data.strike === curr.strike && data.exp_date_str === curr.exp_date_str
      );
      if (matching_put_data) {
        // console.log(acc);
        acc.push({
          strike_price: curr?.strike,
          exp_date_str: curr?.exp_date_str,
          c_totalvolume: curr.c_totalvolume,
          c_openinterest: curr.c_openinterest,
          c_notion_expo: curr.c_notion_expo,
          p_totalvolume: matching_put_data.p_totalvolume,
          p_openinterest: matching_put_data.p_openinterest,
          p_notion_expo: matching_put_data.p_notion_expo,
          total_notional_exposure:
            curr.c_notion_expo + matching_put_data.p_notion_expo,
        });
      }
      return acc;
    }, []);
  } else {
    const call_data = data
      .filter((data) => data.optiontype === "c")
      .map((data) => ({
        strike: data.strike,
        c_totalvolume: data.volume,
        c_openinterest: data.openinterest,
        c_notion_expo: data[greek + "_notion_expo"],
      }));

    const put_data = data
      .filter((data) => data.optiontype === "p")
      .map((data) => ({
        strike: data.strike,
        p_totalvolume: -1 * data.volume,
        p_openinterest: -1 * data.openinterest,
        p_notion_expo: data[greek + "_notion_expo"],
      }));

    combined_data = call_data.reduce((acc: ESOptionResult[], curr) => {
      const matching_put_data = put_data.find(
        (data) => data.strike === curr.strike
      );
      if (matching_put_data) {
        acc.push({
          strike: curr.strike,
          c_totalvolume: curr.c_totalvolume,
          c_openinterest: curr.c_openinterest,
          c_notion_expo: curr.c_notion_expo,
          p_totalvolume: matching_put_data.p_totalvolume,
          p_openinterest: matching_put_data.p_openinterest,
          p_notion_expo: matching_put_data.p_notion_expo,
          total_notional_exposure:
            curr.c_notion_expo + matching_put_data.p_notion_expo,
        });
      }
      return acc;
    }, []);
  }
  return combined_data;
}

export const GetAllModifiedToSData = (data, greek: string): ESOptionResult => {
  return {
    strike_price: data.strike_price,
    exp_date_str: data.exp_date_str,
    last_price: data.last_price,
    open_price: data.open_price,
    c_totalvolume: data.c_totalvolume,
    p_totalvolume: -1 * data.p_totalvolume,
    total_notional_exposure: data[greek + "_total_notional_exposure"],
    c_notion_expo: data["c_" + greek + "_notion_expo"],
    p_notion_expo: data["p_" + greek + "_notion_expo"],
  };
};

export const GetModifiedToSData = (data, greek: string): ESOptionResult => {
  return {
    strike_price: data.strike_price,
    last_price: data.last_price,
    open_price: data.open_price,

    c_totalvolume: data.c_totalvolume,
    c_openinterest: data.c_openinterest,

    p_totalvolume: -1 * data.p_totalvolume,
    p_openinterest: -1 * data.p_openinterest,

    total_notional_exposure: data[greek + "_total_notional_exposure"],
    c_notion_expo: data["c_" + greek + "_notion_expo"],
    p_notion_expo: data["p_" + greek + "_notion_expo"],
  };
};

export type TheoDataProps = {
  strike_price?: number;
  spot_price?: number;
  total_gamma: number;
  // index: number;
};
export const GetModifiedToSTheoData = (data: TheoDataProps): TheoDataProps => {
  return {
    strike_price: data.spot_price,
    total_gamma: data.total_gamma,
  };
};
