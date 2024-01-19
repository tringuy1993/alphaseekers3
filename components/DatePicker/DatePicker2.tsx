import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Box, Button, CheckIcon, Container, Flex, Group, Popover } from '@mantine/core';
import { useForm } from '@mantine/form';
import { getNextDate } from './utils';

interface Preset {
  name: string;
  label: string;
}

// Define presets
const PRESETS: Preset[] = [
  { name: 'today', label: 'Today' },
  { name: 'thisWeek', label: 'This Week' },
  { name: 'nextWeek', label: 'Next Week' },
  { name: 'next1Month', label: 'Next 1 Month' },
  { name: 'next3Month', label: 'Next 3 Month' },
];

// Define the type for the props
type DatePickerWrapperProps = {
  initialDateRange: [Date | null, Date | null];
  onUpdate: (dateRange: [Date | null, Date | null]) => void;
};

export type DateRange = [Date | null, Date | null];

const DatePickerWrapper = ({
  initialDateRange = [
    new Date(new Date().setHours(0, 0, 0, 0)),
    getNextDate({
      currentDate: new Date(new Date().setHours(0, 0, 0, 0)),
      targetDayName: 'Saturday',
    }),
  ],
  onUpdate,
}: DatePickerWrapperProps) => {
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange); // Selected Date Range within the component for state management
  const [lastConfirmedDate, setLastConfirmedDate] = useState<DateRange>([null, null]); // Final Confirmed Date Selection
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined); // Preset Selection
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false); // State to control Popover visibility

  const form = useForm<{ dateRange: DateRange }>({
    initialValues: {
      dateRange: dateRange,
    },
  });

  const setPreset = (preset: string): void => {
    const presetRange = getPresetRange(preset);
    handleDateChange(presetRange);
    setSelectedPreset(preset); // Update the selected preset
  };
  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }): JSX.Element => (
    <>
      {' '}
      <Button
        size="sm"
        justify="center"
        variant={isSelected ? 'light' : 'default'}
        // mt="md"
        onClick={() => {
          setPreset(preset);
        }}
        fullWidth
        leftSection={isSelected ? <CheckIcon width={18} /> : ' '}
      >
        {label}
      </Button>
    </>
  );

  const displayDateRange = () => {
    if (!dateRange[0] || !dateRange[1]) return 'Select date range';
    return `${formatPrintDate(dateRange[0])} - ${formatPrintDate(dateRange[1])}`;
  };

  const handleDateChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    form.setFieldValue('dateRange', newDateRange);
  };

  //Windows Screen for PopOver
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 960 : false
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  // Final Cancellation
  const handleClosePopover = () => {
    // Reset the date to the last confirmed date
    setDateRange(lastConfirmedDate);
    form.setFieldValue('dateRange', lastConfirmedDate);
    setIsPopoverOpen(false);
  };

  // Or Final Submission of new Date
  const handleSubmit = (values: { dateRange: DateRange }) => {
    setLastConfirmedDate(values.dateRange);
    onUpdate(values.dateRange);
    setIsPopoverOpen(false);
  };

  return (
    <Popover
      opened={isPopoverOpen}
      width="auto"
      // position="bottom"
      withArrow
      shadow="md"
      onClose={handleClosePopover} // Handle popover close
    >
      <Popover.Target>
        <Button w={280} onClick={togglePopover}>
          {displayDateRange()}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Container size="25rem">
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              gap={{ base: 'sm', sm: 'lg' }}
              justify={{ sm: 'center' }}
            >
              <DatePicker
                type="range"
                value={dateRange}
                onChange={handleDateChange}
                allowSingleDateInRange
                firstDayOfWeek={0}
              />

              <Group justify="flex-end" gap="sm">
                {PRESETS.map((preset) => (
                  <PresetButton
                    key={preset.name}
                    preset={preset.name}
                    label={preset.label}
                    isSelected={selectedPreset === preset.name}
                  />
                ))}
                <Button type="submit">Submit Date</Button>
              </Group>
            </Flex>
          </Container>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DatePickerWrapper;

const formatPrintDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getPresetRange = (presetName: string): DateRange => {
  const preset = PRESETS.find(({ name }) => name === presetName);
  if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
  const from = new Date();
  const to = new Date();
  const first = from.getDate() - from.getDay();
  const thisSaturday = getNextDate({ targetDayName: 'Saturday' });
  const dayOfWeek = from.getDay(); // Sunday - 0, Monday - 1, etc.
  const dayOfToWeek = to.getDay();

  switch (preset.name) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek':
      from.setDate(from.getDate() - dayOfWeek); // Go back to the last Sunday
      from.setHours(0, 0, 0, 0); // Set the time to the start of the day

      // Clone 'from' date to avoid modifying it when setting 'to'
      const endOfWeek = new Date(from.getTime());

      // Set 'to' to the next Sunday (end of the current week)
      endOfWeek.setDate(from.getDate() + 7); // Add 7 days to get to the next Sunday
      endOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day
      to.setDate(endOfWeek.getDate());
      break;
    case 'nextWeek':
      from.setDate(from.getDate() - dayOfWeek + 7); // Go back to the last Sunday
      from.setHours(0, 0, 0, 0); // Set the time to the start of the day

      // Clone 'from' date to avoid modifying it when setting 'to'
      const endOfNextWeek = new Date(from.getTime());

      // Set 'to' to the next Sunday (end of the current week)
      endOfNextWeek.setDate(from.getDate() + 7); // Add 7 days to get to the next Sunday
      endOfNextWeek.setHours(23, 59, 59, 999); // Set time to the end of the day
      to.setDate(endOfNextWeek.getDate());
      break;

    case 'next1Month':
      // Start from the previous Sunday
      from.setDate(from.getDate() - dayOfWeek);
      from.setHours(0, 0, 0, 0);

      // Add 1 month to the 'from' date
      to.setFullYear(from.getFullYear(), from.getMonth() + 1, from.getDate());

      // Adjust to the end of the week (Sunday)

      if (dayOfToWeek !== 0) {
        // If not already a Sunday
        to.setDate(to.getDate() + (7 - dayOfToWeek));
      }

      to.setHours(23, 59, 59, 999);
      break;

    case 'next3Month':
      // Start from the previous Sunday
      from.setDate(from.getDate() - dayOfWeek);
      from.setHours(0, 0, 0, 0);

      // Add 1 month to the 'from' date
      to.setFullYear(from.getFullYear(), from.getMonth() + 3, from.getDate());

      // Adjust to the end of the week (Sunday)
      if (dayOfToWeek !== 0) {
        // If not already a Sunday
        to.setDate(to.getDate() + (7 - dayOfToWeek));
      }

      to.setHours(23, 59, 59, 999);
      break;
    case 'thisMonth':
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      to.setDate(to.getDate() - 1);
      to.setHours(23, 59, 59, 999);
      break;
    case 'last7':
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case 'last14':
      from.setDate(from.getDate() - 13);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case 'last30':
      from.setDate(from.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case 'lastWeek':
      from.setDate(from.getDate() - 7 - from.getDay());
      to.setDate(to.getDate() - to.getDay() - 1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
  }

  return [from, to];
};
