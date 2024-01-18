import { ECOpts_BT } from "./EChartBT_Opts";
import { EChartThemed } from "../EChartThemed";

const EChartBT = ({ data, greek }) => {
  let ecOptions;
  if (data) {
    ecOptions = ECOpts_BT(data.greek_exposure, greek);
  }
  return (
    <>
      <EChartThemed option={{ ...ecOptions }} style={{ height: "650px" }} />
    </>
  );
};

export default EChartBT;
