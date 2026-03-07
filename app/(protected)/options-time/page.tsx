'use client';

import { format } from 'date-fns';
import { Badge, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';

import DatePickerWrapper, { DateRange } from '@/components/DatePicker/DatePickerWrapper';
import { formatDate, getNextDate } from '@/components/DatePicker/utils';
import EChartTime from '@/components/ECharts/Time/EChartTime';
import SelectWrapper from '@/components/SelectWrapper';
import { AnalyticsPageHeader, ChartGrid, DataPanel, FilterBar, MetricStrip } from '@/components/Layout';

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

  const [greek, setGreek] = useState('gamma');
  const [ticker, setTicker] = useState('$SPX.X');
  const PARAMS = {
    und_symbol: ticker,
    greek,
    startDate: formatDate(dateRange[0] as Date),
    endDate: formatDate(dateRange[1] as Date),
  };

  const tickerLabel = getMenuLabel(TICKERMENU, ticker);
  const greekLabel = getMenuLabel(GREEKMENU, greek);
  const dateRangeLabel = formatDateRange(dateRange);

  const controls = (
    <FilterBar
      contextSlot={<DatePickerWrapper initialDateRange={dateRange} onUpdate={handleDateChange} size="xs" />}
      viewSlot={
        <Group gap="sm">
          <SelectWrapper
            label="Greek"
            data={GREEKMENU}
            value={greek}
            onChange={(e) => setGreek(e || 'gamma')}
            miw={180}
          />
          <SelectWrapper
            label="Ticker"
            data={TICKERMENU}
            value={ticker}
            onChange={(e) => setTicker(e || '$SPX.X')}
            miw={180}
          />
        </Group>
      }
      summarySlot={
        <Group gap="xs">
          <Badge variant="light" color="brand">
            Expiration curves
          </Badge>
          <Badge variant="light" color="accent">
            {tickerLabel} / {greekLabel}
          </Badge>
        </Group>
      }
    />
  );

  return (
    <Stack gap="md">
      <AnalyticsPageHeader
        eyebrow="Analytics"
        title="Options Time"
        subtitle={`${tickerLabel} ${greekLabel.toLowerCase()} curves by expiration over ${dateRangeLabel}.`}
        status={{ label: 'Historical Surface', tone: 'muted' }}
        meta={[
          { label: 'Ticker', value: tickerLabel },
          { label: 'Greek', value: greekLabel },
          { label: 'Range', value: dateRangeLabel },
        ]}
      />

      <DataPanel controls={controls} stickyHeader variant="elevated" />

      <MetricStrip
        items={[
          { label: 'Ticker', value: tickerLabel, hint: 'Underlying in focus' },
          { label: 'Greek', value: greekLabel, tone: 'live', hint: 'Exposure curve selection' },
          { label: 'Span', value: dateRangeLabel, hint: 'Date range applied to the history' },
          { label: 'View', value: 'By expiration', hint: 'Cross-series comparison' },
        ]}
      />

      <DataPanel
        eyebrow="Primary Surface"
        title={`${tickerLabel} ${greekLabel} by expiration`}
        subtitle="Dominant view for comparing how the selected greek shifts across expiries."
        variant="hero"
      >
        <EChartTime params={PARAMS} />
      </DataPanel>

      <ChartGrid columns={2} minColumnWidth={320}>
        <DataPanel title="Selection Summary" subtitle="Context that should stay stable as the chart is explored.">
          <SelectionPanel
            items={[
              { label: 'Ticker', value: tickerLabel },
              { label: 'Greek', value: greekLabel },
              { label: 'Range', value: dateRangeLabel },
              { label: 'Focus', value: 'Expiration ladder' },
            ]}
          />
        </DataPanel>

        <DataPanel title="Reading Guide" subtitle="How this page should be used during analysis.">
          <Stack gap={8}>
            <Text size="sm" c="var(--as-text-secondary)">
              Use this view to compare where exposure concentrates as expiration changes.
            </Text>
            <Text size="sm" c="var(--as-text-secondary)">
              Keep the greek fixed, then sweep ticker or date range to isolate whether the shift is structural or event-driven.
            </Text>
            <Text size="sm" c="var(--as-text-secondary)">
              Treat the hero chart as the decision surface and the metric strip as the fast context summary.
            </Text>
          </Stack>
        </DataPanel>
      </ChartGrid>
    </Stack>
  );
}

function SelectionPanel({ items }: { items: { label: string; value: string }[] }) {
  return (
    <Stack gap={8}>
      {items.map((item) => (
        <Group key={item.label} justify="space-between" wrap="nowrap" gap="sm">
          <Text size="xs" c="var(--as-text-secondary)">
            {item.label}
          </Text>
          <Text size="sm" fw={600} ff="monospace" className="mono-num" ta="right">
            {item.value}
          </Text>
        </Group>
      ))}
    </Stack>
  );
}

function getMenuLabel(menu: { label: string; value: string }[], value: string) {
  return menu.find((item) => item.value === value)?.label || value;
}

function formatDateRange(dateRange: DateRange) {
  const [startDate, endDate] = dateRange;

  if (!startDate || !endDate) {
    return 'No range selected';
  }

  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
}
