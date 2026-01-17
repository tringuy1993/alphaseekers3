'use client';

import { useEffect, useState, useMemo } from 'react';
import { EChartGamma_Heatmap_Opts } from './EChartGamma_Heatmap_Opts';
import { EChartThemed } from '../EChartThemed';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import { GAMMA_DASHBOARD_HEATMAP_URL } from '@/lib/fetchdata/apiURLs';
import MainLoading from '@/app/loading';

interface EChartGammaHeatmapProps {
  params: {
    und_symbol: string;
    date: string;
    exp_filter: string;
  };
}

const EChartGammaHeatmap = ({ params }: EChartGammaHeatmapProps) => {
  const [refreshInterval, setRefreshInterval] = useState<number>(0);

  useEffect(() => {
    // Update Refresh Interval based on the date selected
    const today = new Date().toISOString().slice(0, 10);
    if (params.date === today) {
      setRefreshInterval(60000);
    } else {
      setRefreshInterval(0);
    }
  }, [params.date]);

  const { data, isLoading } = useCustomSWR(GAMMA_DASHBOARD_HEATMAP_URL, params, {
    refreshInterval,
  });

  // Create a stable key for the chart based on params to force remount on significant changes
  const chartKey = useMemo(
    () => `${params.und_symbol}-${params.date}-${params.exp_filter}`,
    [params.und_symbol, params.date, params.exp_filter]
  );

  if (!data || isLoading) {
    return <MainLoading />;
  }

  if (!data.data || data.data.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No data available</div>;
  }

  const ecOptions = EChartGamma_Heatmap_Opts(data.data);

  // Check if options indicate no data (fallback return from opts function)
  if (!ecOptions.series) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No data available</div>;
  }

  return <EChartThemed key={chartKey} option={ecOptions} style={{ height: '500px' }} />;
};

export default EChartGammaHeatmap;
