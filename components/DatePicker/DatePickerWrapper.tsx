import React, { useMemo, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Button, Group, Popover, Stack, Text } from '@mantine/core';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';
import { formatDate, getNextDate } from './utils';
import classes from './DatePickerWrapper.module.css';

interface Preset {
  name: string;
  label: string;
}

const PRESETS: Preset[] = [
  { name: 'today', label: 'Today' },
  { name: 'thisWeek', label: 'This Week' },
  { name: 'nextWeek', label: 'Next Week' },
  { name: 'next1Month', label: 'Next 1 Month' },
  { name: 'next3Month', label: 'Next 3 Months' },
];

type DatePickerWrapperProps = {
  initialDateRange: [Date | null, Date | null];
  onUpdate: (dateRange: [Date | null, Date | null]) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
  size = 'xs',
}: DatePickerWrapperProps) => {
  const [opened, setOpened] = useState(false);
  const [appliedRange, setAppliedRange] = useState<DateRange>(initialDateRange);
  const [pendingRange, setPendingRange] = useState<DateRange>(initialDateRange);
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);

  const displayDateRange = useMemo(() => {
    if (!appliedRange[0] || !appliedRange[1]) return 'Select date range';
    return `${formatDate(appliedRange[0])} - ${formatDate(appliedRange[1])}`;
  }, [appliedRange]);

  const openPopover = () => {
    setPendingRange(appliedRange);
    setOpened(true);
  };

  const closePopover = () => {
    setPendingRange(appliedRange);
    setOpened(false);
  };

  const applyRange = () => {
    setAppliedRange(pendingRange);
    onUpdate(pendingRange);
    setOpened(false);
  };

  const resetRange = () => {
    setPendingRange(appliedRange);
    setSelectedPreset(undefined);
  };

  const applyPreset = (presetName: string) => {
    const presetRange = getPresetRange(presetName);
    setPendingRange(presetRange);
    setSelectedPreset(presetName);
  };

  return (
    <Popover
      opened={opened}
      width="auto"
      withArrow
      shadow="md"
      onClose={closePopover}
      trapFocus
      position="bottom-start"
    >
      <Popover.Target>
        <Button
          size={size}
          variant="default"
          className={classes.trigger}
          leftSection={<IconCalendar size={16} />}
          rightSection={<IconChevronDown size={16} />}
          onClick={openPopover}
        >
          {displayDateRange}
        </Button>
      </Popover.Target>

      <Popover.Dropdown className={classes.dropdown}>
        <Stack gap="sm">
          <Text size="xs" c="var(--as-text-secondary)">
            Date Range
          </Text>
          <DatePicker
            type="range"
            value={pendingRange}
            onChange={setPendingRange}
            allowSingleDateInRange
            firstDayOfWeek={0}
            defaultDate={pendingRange[0] || new Date()}
          />

          <div className={classes.presetGrid}>
            {PRESETS.map((preset) => (
              <Button
                key={preset.name}
                size="xs"
                variant={selectedPreset === preset.name ? 'light' : 'default'}
                onClick={() => applyPreset(preset.name)}
                className={classes.presetButton}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <Group justify="space-between">
            <Button variant="subtle" size="xs" onClick={resetRange}>
              Reset
            </Button>
            <Group gap="xs">
              <Button variant="default" size="xs" onClick={closePopover}>
                Cancel
              </Button>
              <Button size="xs" onClick={applyRange}>
                Apply
              </Button>
            </Group>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DatePickerWrapper;

const getPresetRange = (presetName: string): DateRange => {
  const preset = PRESETS.find(({ name }) => name === presetName);
  if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
  const from = new Date();
  const to = new Date();
  const dayOfWeek = from.getDay();
  const dayOfToWeek = to.getDay();

  switch (preset.name) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek':
      from.setDate(from.getDate() - dayOfWeek);
      from.setHours(0, 0, 0, 0);
      to.setDate(from.getDate() + 7);
      to.setHours(23, 59, 59, 999);
      break;
    case 'nextWeek':
      from.setDate(from.getDate() - dayOfWeek + 7);
      from.setHours(0, 0, 0, 0);
      to.setDate(from.getDate() + 7);
      to.setHours(23, 59, 59, 999);
      break;
    case 'next1Month':
      from.setDate(from.getDate() - dayOfWeek);
      from.setHours(0, 0, 0, 0);
      to.setFullYear(from.getFullYear(), from.getMonth() + 1, from.getDate());
      if (dayOfToWeek !== 0) {
        to.setDate(to.getDate() + (7 - dayOfToWeek));
      }
      to.setHours(23, 59, 59, 999);
      break;
    case 'next3Month':
      from.setDate(from.getDate() - dayOfWeek);
      from.setHours(0, 0, 0, 0);
      to.setFullYear(from.getFullYear(), from.getMonth() + 3, from.getDate());
      if (dayOfToWeek !== 0) {
        to.setDate(to.getDate() + (7 - dayOfToWeek));
      }
      to.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }

  return [from, to];
};
