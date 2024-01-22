'use client';

import React from 'react';
import { Card, Grid } from '@mantine/core';
import { EChartToS_Opts } from './EChartToS_Opts';
import { EChart_Opts_VolOI } from '../EChart_Opts_VolOI';
import { modify_data } from '../UtilECharts';
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

export default function EChartToS({ symbol, data, theoData, greek }) {
  let ecOptions, ecVoloptions;
  if (data) {
    const { modified_data, nonzero_data } = modify_data(data, greek);
    // const chartDataList = getChartDataList(data, []);
    ecOptions = EChartToS_Opts(symbol, nonzero_data, []);
    ecVoloptions = EChart_Opts_VolOI(symbol, modified_data);
  }

  return (
    <Card withBorder radius="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <EChartThemed option={{ ...ecOptions }} style={{ height: '650px' }} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <EChartThemed option={{ ...ecVoloptions }} style={{ height: '650px' }} />
        </Grid.Col>
        <small>Last Updated: {convertToPST(data[0].saved_datetime)}</small>
      </Grid>
    </Card>
  );
}
