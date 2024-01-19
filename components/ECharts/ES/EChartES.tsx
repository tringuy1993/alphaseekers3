'use client';

import React from 'react';
import { combineESOptionData } from '../DataEChart';
import { ECOpts_ES_VolOI, EChartES_Opts } from './EChartES_Opts';
// import { EChartThemed } from "../EChartThemed";
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import { ES_URL } from '@/lib/fetchdata/apiURLs';
// import { Card } from '@/components/ui/card';
import { EChartThemed } from '../EChartThemed';
import MainLoading from '@/app/loading';
import { Grid } from '@mantine/core';

const EChartES = ({ params }) => {
  const { greek, und_symbol: symbol } = params;
  const { data, isLoading } = useCustomSWR(ES_URL, params, {
    refreshInterval: 60000,
  });

  if (!data || isLoading) {
    return <MainLoading />;
  }

  const modified_data = combineESOptionData(data, greek);
  const ecOptions = EChartES_Opts(symbol, modified_data);
  const ecVoloptions = ECOpts_ES_VolOI(symbol, modified_data);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <EChartThemed option={{ ...ecOptions }} style={{ height: '650px' }} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <EChartThemed option={{ ...ecVoloptions }} style={{ height: '650px' }} />
      </Grid.Col>
    </Grid>
  );
};
export default EChartES;
