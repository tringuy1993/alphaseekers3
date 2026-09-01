import React from 'react';
import { EChartThemed } from '../EChartThemed';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';

import MainLoading from '@/app/loading';
import { LIVE_EXPO_GREEK_URL } from '@/lib/fetchdata/apiURLs';
import { EChart0DTE_ExpoGreek_Opts } from './EChart0DTE_ExpoGreek_Opts';
import { ChartEmptyState, ChartLoadError } from '@/components/ChartStates';
import { liveRefreshInterval } from '@/lib/marketTime';

const EChart0DTE_ExpoGreek = ({ params }) => {
  // Null key until the date is resolved — no fetch for a non-existent session
  const { data, isError, mutate } = useCustomSWR(params.date ? LIVE_EXPO_GREEK_URL : null, params, {
    refreshInterval: liveRefreshInterval(params.date),
    keepPreviousData: true,
  });

  if (isError) {
    return <ChartLoadError onRetry={() => mutate()} />;
  }

  if (!data) {
    return <MainLoading />;
  }

  if (!data.data?.length) {
    return <ChartEmptyState />;
  }

  const ecOptions = EChart0DTE_ExpoGreek_Opts(data.data, params.greek);
  return <EChartThemed option={ecOptions} style={{ height: '650px' }} />;
};
export default EChart0DTE_ExpoGreek;
