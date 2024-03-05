import React, { useEffect, useState } from 'react';
import { EChartThemed } from '../EChartThemed';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';

import MainLoading from '@/app/loading';
import { LIVE_EXPO_GREEK_URL } from '@/lib/fetchdata/apiURLs';
import { EChart0DTE_ExpoGreek_Opts } from './EChart0DTE_ExpoGreek_Opts';

const EChart0DTE_ExpoGreek = ({ params }) => {
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

  const { data, isLoading } = useCustomSWR(LIVE_EXPO_GREEK_URL, params, {
    refreshInterval,
  });

  if (!data || isLoading) {
    return <MainLoading />;
  }

  const ecOptions = EChart0DTE_ExpoGreek_Opts(data.data, params.greek);
  return <EChartThemed option={ecOptions} style={{ height: '650px' }} />;
};
export default EChart0DTE_ExpoGreek;
