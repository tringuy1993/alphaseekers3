import React, { useEffect, useState } from "react";
import { EChart0DTE_Opts } from "./EChart0DTE_Opts";
import { EChartThemed } from "../EChartThemed";
import useCustomSWR from "@/lib/fetchdata/fetch-custom";
import { LIVE_OTM_URL } from "@/lib/fetchdata/apiURLs";
import MainLoading from "@/app/loading";

const EChart0DTE = ({ params }) => {
  const [refreshInterval, setRefreshInterval] = useState<number>();

  useEffect(() => {
    //Update Refresh Interval based on the date selected.
    const today = new Date().toISOString().slice(0, 10);
    if (params.date === today) {
      setRefreshInterval(60000);
    } else {
      setRefreshInterval(0);
    }
  }, [params]);

  const { data, isLoading } = useCustomSWR(LIVE_OTM_URL, params, {
    refreshInterval: refreshInterval,
  });

  if (!data || isLoading) {
    return <MainLoading />;
  }

  const ecOptions = EChart0DTE_Opts(data.data);
  return <EChartThemed option={ecOptions} style={{ height: "650px" }} />;
};
export default EChart0DTE;
