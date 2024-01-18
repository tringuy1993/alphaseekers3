'use client';

import React from 'react';
import { EChartToS_Opts } from './EChartToS_Opts';
import { EChart_Opts_VolOI } from '../EChart_Opts_VolOI';
import { modify_data } from '../UtilECharts';
import { TheoDataProps } from '../DataEChart';
import { Card } from '@/components/ui/card';
import { EChartThemed } from '../EChartThemed';

function convertToPST(timestampStr) {
  // Create a JavaScript Date object from the input string
  const timestamp = new Date(timestampStr);

  // Get the UTC offset for PST (Pacific Standard Time) in minutes
  const pstOffsetMinutes = -480; // PST is UTC-8

  // Calculate the PST timestamp by applying the UTC offset
  const pstTimestamp = new Date(timestamp.getTime() + pstOffsetMinutes * 60000);

  // Format the PST timestamp as a string with 'PST' at the end
  const pstTimeStr = pstTimestamp
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, ' PST');

  return pstTimeStr;
}

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

export default function EChartToS({ symbol, data, theoData, greek }) {
  let ecOptions, ecVoloptions;
  if (data) {
    const { modified_data, nonzero_data } = modify_data(data, greek);
    // const chartDataList = getChartDataList(data, []);
    ecOptions = EChartToS_Opts(symbol, nonzero_data, []);
    ecVoloptions = EChart_Opts_VolOI(symbol, modified_data);
  }

  return (
    <Card className="flex flex-col mx-2.5 screen-1200px:flex-row screen-1200px:mx-28">
      <div className="flex-1">
        <EChartThemed option={{ ...ecOptions }} style={{ height: '650px' }} />
      </div>
      <div className="flex-1">
        <EChartThemed option={{ ...ecVoloptions }} style={{ height: '650px' }} />
        <small className="ml-32">Last Updated: {convertToPST(data[0].saved_datetime)}</small>
      </div>
    </Card>
  );
}
