import { useEffect, useState } from 'react';

import { LIVE_OTM_DATES } from '@/lib/fetchdata/apiURLs';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import MainLoading from '../loading';
import SelectWrapper from '@/components/SelectWrapper';
import { uDateType } from './types';

type SelectUDateProps = {
  uTicker: string;
  onDefaultDateChange: (date: string) => void;
};

export function SelectUDate({ uTicker, onDefaultDateChange }: SelectUDateProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const { data: uDateData, isLoading } = useCustomSWR(LIVE_OTM_DATES, {
    und_symbol: uTicker,
  });

  const dateData = uDateData?.data?.map((item: uDateType) => ({
    label: item.saved_date,
    value: item.saved_date,
  }));

  // Set the initial default date and update on data change
  useEffect(() => {
    if (uDateData?.data) {
      const initialDate = isLatestDateEqualToToday(uDateData.data).date;
      setSelectedDate(initialDate);
      onDefaultDateChange(initialDate);
    }
  }, [uDateData]);

  // Update parent component when selection changes
  const handleDateChange = (selectedOption: string) => {
    setSelectedDate(selectedOption);
    onDefaultDateChange(selectedOption);
  };

  if (isLoading) {
    return <MainLoading />;
  }

  return (
    <SelectWrapper
      label="Select Date"
      data={dateData}
      value={selectedDate} // Use value instead of defaultValue for controlled component
      onChange={handleDateChange} // Use onChange event handler
    />
  );
}

function isLatestDateEqualToToday(dateList: uDateType[]) {
  // Sort the list by date in descending order
  dateList.sort(
    (a: uDateType, b: uDateType) =>
      new Date(b.saved_date).getTime() - new Date(a.saved_date).getTime()
  );

  // Get the latest date
  const latestDate = dateList[0].saved_date;

  // Get today's date formatted as YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  const now = new Date();
  const isAfterTwoThirty =
    now.getUTCHours() > 14 || (now.getUTCHours() === 14 && now.getUTCMinutes() > 30);

  // Compare and return the appropriate date
  if (latestDate === today && isAfterTwoThirty) {
    return { is0DTE: true, date: today };
  }

  return { is0DTE: false, date: latestDate };
}
