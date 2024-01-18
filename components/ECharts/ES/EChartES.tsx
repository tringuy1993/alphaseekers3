'use client';

import React from 'react';
import { combineESOptionData } from '../DataEChart';
import { ECOpts_ES_VolOI, EChartES_Opts } from './EChartES_Opts';
// import { EChartThemed } from "../EChartThemed";
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import { ES_URL } from '@/lib/fetchdata/apiURLs';
import { Card } from '@/components/ui/card';
import { EChartThemed } from '../EChartThemed';
import MainLoading from '@/app/loading';

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
    <Card className="flex flex-col mx-2.5 screen-1200px:flex-row screen-1200px:mx-28">
      <div className="flex-1">
        <EChartThemed option={ecOptions} style={{ height: '650px' }} />
      </div>

      <div className="flex-1">
        <EChartThemed option={ecVoloptions} style={{ height: '650px' }} />
      </div>
    </Card>
  );
};
export default EChartES;
