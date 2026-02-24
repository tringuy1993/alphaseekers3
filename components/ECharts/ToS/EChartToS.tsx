'use client';

import React from 'react';
import { Card, Grid } from '@mantine/core';
import { EChartToS_Opts } from './EChartToS_Opts';
import { EChart_Opts_VolOI } from '../EChart_Opts_VolOI';
import { modify_data } from '../UtilECharts';
import { EChartThemed } from '../EChartThemed';

function formatLocalTime(timestampStr: string): string {
  const timestamp = new Date(timestampStr);
  return timestamp.toLocaleString();
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
        <small>Last Updated: {formatLocalTime(data[0].saved_datetime)}</small>
      </Grid>
    </Card>
  );
}
