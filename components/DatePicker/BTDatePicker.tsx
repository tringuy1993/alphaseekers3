import { DatePickerInput } from "@mantine/dates";
import { Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useStyles } from "./DatePickerStyle";
import { useBTDatePickerStore } from "@/store/btDatePickerStore";

export default function BTDatePicker() {
  //Work!
  const { classes } = useStyles();
  const { BackTestDate, updateBackTestDate } = useBTDatePickerStore();

  const handleSubmit = (selectedDateRange) => {
    console.log("HandleSubmit", selectedDateRange);
    updateBackTestDate(selectedDateRange.dateRange);
  };
  const form = useForm({
    initialValues: {
      dateRange: BackTestDate,
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Group align={"center"} justify={"center"} className={classes.group}>
        <DatePickerInput
          type="range"
          // value={date_start}
          className={classes.input}
          placeholder="Pick Expiration Date"
          firstDayOfWeek={0}
          clearable={false}
          allowSingleDateInRange
          // value={dateRange}
          {...form.getInputProps("dateRange")}
        ></DatePickerInput>
        <Button type="submit"> Submit Date </Button>
      </Group>
    </form>
  );
}
