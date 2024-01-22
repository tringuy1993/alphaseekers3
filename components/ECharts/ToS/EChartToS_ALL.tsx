'use client';

import React from 'react';
import { GREEK_EXPO_URL } from '@/lib/fetchdata/apiURLs';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import { request_data_params } from '../utils';
import { TheoDataProps } from '../DataEChart';
import EChartToS from './EChartToS';

// Get Chart Data List
function getChartDataList(data: Record<string, any> | undefined, tosTheoData_SPX: TheoDataProps) {
  const chartDataList: { symbol: string; data: any[]; theoData: any }[] = [];
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value) && value.length > 0) {
        let theoData;
        if (key === '$SPX.X') {
          theoData = tosTheoData_SPX;
        } else {
          theoData = '';
        }
        chartDataList.push({
          symbol: key,
          data: value,
          theoData: theoData,
        });
      }
    }
  }

  return chartDataList;
}

export default function EChartToSALL({ params }) {
  const { data, isLoading, isError } = useCustomSWR(GREEK_EXPO_URL, request_data_params(params), {
    refreshInterval: 60000,
  });

  let chartDataList;
  if (data && !isLoading && !isError) {
    chartDataList = getChartDataList(data.data, []);
  }

  return (
    <>
      {data && (
        <>
          {chartDataList.map(({ symbol, data, theoData }) => (
            <EChartToS
              key={symbol}
              symbol={symbol}
              data={data}
              theoData={theoData}
              greek={params.greek}
            />
          ))}
        </>
      )}
    </>
  );
}
