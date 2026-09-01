import React from 'react';
// import { EChart0DTE_Opts } from './EChart0DTE_Opts';
import { EChartThemed } from '../EChartThemed';
import { LIVE_OTM_VOLUME_URL } from '@/lib/fetchdata/apiURLs';
import MainLoading from '@/app/loading';
import { EChart0DTE_Volume_Opts } from './EChart0DTE_Volume_Opts';
import useCustomSWRLocalStorage from '@/lib/fetchdata/fetch-custom-save';
import { ChartEmptyState, ChartLoadError } from '@/components/ChartStates';
import { liveRefreshInterval } from '@/lib/marketTime';

const EChart0DTE_Volume = ({ params }) => {
  // Null key until the date is resolved — no fetch for a non-existent session
  const { data, isError, mutate } = useCustomSWRLocalStorage(
    params.date ? LIVE_OTM_VOLUME_URL : null,
    params,
    {
      refreshInterval: liveRefreshInterval(params.date),
      keepPreviousData: true,
    }
  );

  if (isError) {
    return <ChartLoadError onRetry={() => mutate()} />;
  }

  if (!data) {
    return <MainLoading />;
  }

  if (!data.data?.length) {
    return <ChartEmptyState />;
  }

  const ecOptions = EChart0DTE_Volume_Opts(data.data);

  return <EChartThemed option={ecOptions} style={{ height: '650px' }} />;
};
export default EChart0DTE_Volume;
