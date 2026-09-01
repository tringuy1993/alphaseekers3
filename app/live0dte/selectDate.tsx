import { useEffect, useState } from 'react';

import { LIVE_OTM_DATES } from '@/lib/fetchdata/apiURLs';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import MainLoading from '../loading';
import SelectWrapper from '@/components/SelectWrapper';
import { ChartEmptyState, ChartLoadError } from '@/components/ChartStates';
import { etToday, isAfterMarketOpenET } from '@/lib/marketTime';
import { uDateType } from './types';

type SelectUDateProps = {
  uTicker: string;
  onDefaultDateChange: (date: string) => void;
  size?: string;
};

export function SelectUDate({ uTicker, onDefaultDateChange, size }: SelectUDateProps) {
  const [selectedDate, setSelectedDate] = useState('');
  // ... rest of component ...
  const {
    data: uDateData,
    isLoading,
    isError,
    mutate,
  } = useCustomSWR(LIVE_OTM_DATES, {
    und_symbol: uTicker,
  });

  const dateData = uDateData?.data?.map((item: uDateType) => ({
    label: item.saved_date,
    value: item.saved_date,
  }));

  // Set the initial default date and update on data change
  useEffect(() => {
    if (uDateData?.data?.length) {
      const initialDate = resolveInitialDate(uDateData.data).date;
      setSelectedDate(initialDate);
      onDefaultDateChange(initialDate);
    }
  }, [uDateData]);

  // Update parent component when selection changes
  const handleDateChange = (selectedOption: string) => {
    setSelectedDate(selectedOption);
    onDefaultDateChange(selectedOption);
  };

  if (isError) {
    return <ChartLoadError message="Failed to load dates." onRetry={() => mutate()} />;
  }

  if (isLoading) {
    return <MainLoading />;
  }

  if (!uDateData?.data?.length) {
    return <ChartEmptyState message="No dates available." />;
  }

  return (
    <SelectWrapper
      label="Date"
      data={dateData}
      value={selectedDate} // Use value instead of defaultValue for controlled component
      onChange={(value: string | null) => {
        if (value) {
          handleDateChange(value);
        }
      }}
      size={size}
      miw={220}
    />
  );
}

function resolveInitialDate(dateList: uDateType[]) {
  // Sort a copy by date descending — don't mutate the SWR-cached array
  const sorted = [...dateList].sort(
    (a: uDateType, b: uDateType) =>
      new Date(b.saved_date).getTime() - new Date(a.saved_date).getTime()
  );

  const latestDate = sorted[0].saved_date;

  // Today's session (ET) only counts as live once the market has opened
  if (latestDate === etToday() && isAfterMarketOpenET()) {
    return { is0DTE: true, date: latestDate };
  }

  return { is0DTE: false, date: latestDate };
}
