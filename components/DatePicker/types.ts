export type DateRange = {
  dateRange: Array<Date>;
};

export type DatePickerProps = {
  dateRange: Date[];
  onSubmit: (selectedDateRange: DateRange) => void;
  // BackTest?: boolean;
};
