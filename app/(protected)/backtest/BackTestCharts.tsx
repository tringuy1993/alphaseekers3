import { format } from 'date-fns';
import EChartBT_Theo from '@/components/ECharts/BackTest/EChartBT_Theo';
import { useBTDatePickerStore, useBTTimePickerStore } from '@/store';

export const BackTestCharts = () => {
  const { BackTestDate } = useBTDatePickerStore();
  const { BackTestTime } = useBTTimePickerStore();

  const PARAMS = {
    trade_date: format(BackTestDate[0] as Date, 'yyyy-MM-dd'),
    expiration: format(BackTestDate[1] as Date, 'yyyy-MM-dd'),
    trade_time: BackTestTime,
    all_greeks: true,
  };

  return <EChartBT_Theo params={PARAMS} />;
};
