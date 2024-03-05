'use client';

import { useState } from 'react';
import { SelectUticker } from './selectUTicker';
import EChart0DTE from '@/components/ECharts/Live0DTE/EChart0DTE';
import { SelectUDate } from './selectDate';
import CustomCard from '@/components/CustomCard/CustomCard';
import EChart0DTE_ExpoGreek from '@/components/ECharts/Live0DTE/EChart0DTE_ExpoGreek';

export default function PageLive0DTE() {
  const [uTicker, setUTicker] = useState('$SPX.X');
  const [defaultDate, setUDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const handleUTickerChange = (newDate: string) => {
    setUDate(newDate);
  };

  const chartParams = { und_symbol: uTicker, date: defaultDate };

  const gammaChartParams = {...chartParams, greek: 'Gamma'};
  const vannaChartParams = {...chartParams, greek: 'Vanna'};
  const deltaChartParams = {...chartParams, greek: 'Delta'};

  return (
    <div className="flex flex-col items-center justify-center">
      <header>
        <SelectUticker uTicker={uTicker} setUTicker={setUTicker} />
        <SelectUDate uTicker={uTicker} onDefaultDateChange={handleUTickerChange} />
      </header>

      <CustomCard>
        <EChart0DTE params={chartParams} />
        <EChart0DTE_ExpoGreek params={gammaChartParams}/>
        <EChart0DTE_ExpoGreek params={vannaChartParams}/>
        <EChart0DTE_ExpoGreek params={deltaChartParams}/>
      </CustomCard>
    </div>
  );
}
