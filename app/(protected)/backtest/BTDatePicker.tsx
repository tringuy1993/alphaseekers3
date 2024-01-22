import DatePickerWrapper from '@/components/DatePicker/DatePickerWrapper';
import { useBTDatePickerStore } from '@/store';
// import { DateRangePicker } from "./daterangepicker/date-range-picker";

export default function BTDatePicker() {
  const { BackTestDate, updateBackTestDate } = useBTDatePickerStore();

  return (
    <DatePickerWrapper
      initialDateRange={BackTestDate}
      onUpdate={(e) => {
        updateBackTestDate(e);
      }}
    />
  );
}
