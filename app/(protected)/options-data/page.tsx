'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Box, Group, Switch } from '@mantine/core';

import { getNextDate } from '@/components/DatePicker/utils';
import SelectWrapper from '@/components/SelectWrapper';
import EChartToSALL from '@/components/ECharts/ToS/EChartToS_ALL';
import EChartES from '@/components/ECharts/ES/EChartES';

import { ToS_Theo_Chart } from './ToS_Theo_Chart';
import DatePickerWrapper from '@/components/DatePicker/DatePickerWrapper';

const formatDate = (dateobj: Date): string => format(dateobj, 'yyyy-MM-dd');
const GREEKMENU = [
  { label: 'Gamma', value: 'gamma' },
  { label: 'Vanna', value: 'vanna' },
  { label: 'Charm', value: 'charm' },
  { label: 'Delta', value: 'delta' },
  { label: 'Theta', value: 'theta' },
  { label: 'Vomma', value: 'vomma' },
];

const LIMITEDGREEK = [GREEKMENU[0], GREEKMENU[1]];

export default function PageGreekTime() {
  // Select Date Range
  const [dateRange, setDateRange] = useState<DateRange>([
    new Date(),
    getNextDate({
      currentDate: new Date(new Date().setHours(0, 0, 0, 0)),
      targetDayName: 'Saturday',
    }),
  ]);

  const handleDateChange = (values) => {
    setDateRange(values);
  };
  //Select Greeks
  const [greek, setGreek] = useState('gamma');

  // State to manage the mode
  const [isTheoGreek, setIsTheoGreek] = useState(false);
  // Function to toggle the mode
  const toggleMode = () => setIsTheoGreek(!isTheoGreek);
  const theoStatus = isTheoGreek ? 'Theo' : 'NonTheo';
  //Select Ticker

  const tickers = ['$SPX.X', 'SPY', 'QQQ', '$NDX.X', '$RUT.X'];
  const tosParams = {
    und_symbol: tickers,
    greek,
    startDate: dateRange[0],
    endDate: dateRange[1],
  };

  const esParams = {
    und_symbol: 'ES',
    greek,
    startDate: formatDate(dateRange[0] as Date),
    endDate: formatDate(dateRange[1] as Date),
  };

  const theoParams = {
    greek,
    startDate: formatDate(dateRange[0] as Date),
    endDate: formatDate(dateRange[1] as Date),
  };
  return (
    <Box style={{ textAlign: 'center', margin: 'auto' }}>
      <DatePickerWrapper initialDateRange={dateRange} onUpdate={handleDateChange} />
      <SelectWrapper
        label="Greek:"
        data={isTheoGreek ? LIMITEDGREEK : GREEKMENU}
        value={greek}
        onChange={(e) => setGreek(e)}
      />

      <Group>
        <Switch checked={isTheoGreek} onChange={toggleMode} />
        {theoStatus}
      </Group>

      {!isTheoGreek ? (
        <>
          {' '}
          <EChartES params={esParams} />
          <EChartToSALL params={tosParams} />
        </>
      ) : (
        <ToS_Theo_Chart params={theoParams} />
      )}
    </Box>
  );
}
