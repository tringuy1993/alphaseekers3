'use client';

import { Box } from '@mantine/core';
import { useState } from 'react';

import DatePickerWrapper, { DateRange } from '@/components/DatePicker/DatePickerWrapper';
import { formatDate, getNextDate } from '@/components/DatePicker/utils';
import EChartTime from '@/components/ECharts/Time/EChartTime';
import SelectWrapper from '@/components/SelectWrapper';

const GREEKMENU = [
  { label: 'Gamma', value: 'gamma' },
  { label: 'Vanna', value: 'vanna' },
  { label: 'Charm', value: 'charm' },
  { label: 'Delta', value: 'delta' },
  { label: 'Theta', value: 'theta' },
  { label: 'Vomma', value: 'vomma' },
];

const TICKERMENU = [
  { label: 'ES', value: 'ES' },
  { label: 'SPX', value: '$SPX.X' },
  { label: 'VIX', value: '$VIX.X' },
  { label: 'SPY', value: 'SPY' },
  { label: 'QQQ', value: 'QQQ' },
  { label: 'NDX', value: '$NDX.X' },
];

export default function PageOptionsTime() {
  const [dateRange, setDateRange] = useState<DateRange>([
    new Date(),
    getNextDate({
      currentDate: new Date(new Date().setHours(0, 0, 0, 0)),
      targetDayName: 'Saturday',
    }),
  ]);

  const handleDateChange = (values: DateRange) => {
    setDateRange(values);
  };
  //Select Greeks
  const [greek, setGreek] = useState('gamma');
  const [ticker, setTicker] = useState('$SPX.X');
  const PARAMS = {
    und_symbol: ticker,
    greek: greek,
    startDate: formatDate(dateRange[0] as Date),
    endDate: formatDate(dateRange[1] as Date),
  };

  return (
    <Box style={{ textAlign: 'center', margin: 'auto' }}>
      <DatePickerWrapper initialDateRange={dateRange} onUpdate={handleDateChange} />
      <SelectWrapper label="Greek:" data={GREEKMENU} value={greek} onChange={(e) => setGreek(e)} />
      <SelectWrapper
        label="Ticker:"
        data={TICKERMENU}
        value={ticker}
        onChange={(e) => setTicker(e)}
      />

      <EChartTime params={PARAMS} />
    </Box>
  );
}
