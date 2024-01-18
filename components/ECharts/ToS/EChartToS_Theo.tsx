import useCustomSWR from "@/lib/fetchdata/fetch-custom";
import { EChartThemed } from "../EChartThemed";
import { EChartToS_Theo_Opts } from "./EChartToS_Opts";
import { THEOVANNA_URL } from "@/lib/fetchdata/apiURLs";
import MainLoading from "@/app/loading";

const EChartToS_Theo_Comp = ({ params }) => {
  const { greek, und_symbol: symbol } = params;

  const { data, isLoading } = useCustomSWR(THEOVANNA_URL, params, {
    refreshInterval: 60000,
  });

  if (!data || isLoading) {
    return <MainLoading />;
  }

  const ecOptions = EChartToS_Theo_Opts(symbol, data, greek);

  return <EChartThemed option={ecOptions} style={{ height: "650px" }} />;
};

export default EChartToS_Theo_Comp;
