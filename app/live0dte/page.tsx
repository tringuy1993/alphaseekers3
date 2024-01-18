'use client';

import { useState } from 'react';
import { SelectUticker } from './selectUTicker';
import EChart0DTE from '@/components/ECharts/Live0DTE/EChart0DTE';
import { SelectUDate } from './selectDate';
import CardWrapper from '@/components/CardWrapper';

export default function PageLive0DTE() {
  const [uTicker, setUTicker] = useState('$SPX.X');
  const [defaultDate, setUDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const handleUTickerChange = (newDate: string) => {
    setUDate(newDate);
  };

  const chartParams = { und_symbol: uTicker, date: defaultDate };

  return (
    <div className="flex flex-col items-center justify-center">
      <header>
        <SelectUticker uTicker={uTicker} setUTicker={setUTicker} />
        <SelectUDate uTicker={uTicker} onDefaultDateChange={handleUTickerChange} />
      </header>

      <CardWrapper>
        <EChart0DTE params={chartParams} />
      </CardWrapper>
    </div>
  );
}
