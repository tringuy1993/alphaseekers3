'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Badge, Group, Stack, Switch, Text } from '@mantine/core';

import { getNextDate } from '@/components/DatePicker/utils';
import SelectWrapper from '@/components/SelectWrapper';
import EChartToSALL from '@/components/ECharts/ToS/EChartToS_ALL';
import EChartES from '@/components/ECharts/ES/EChartES';

import { ToS_Theo_Chart } from './ToS_Theo_Chart';
import DatePickerWrapper, { DateRange } from '@/components/DatePicker/DatePickerWrapper';
import { AnalyticsPageHeader, ChartGrid, DataPanel, FilterBar, MetricStrip } from '@/components/Layout';

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
const UNDERLYING_SET = ['$SPX.X', 'SPY', 'QQQ', '$NDX.X', '$RUT.X'];

export default function PageGreekTime() {
  // Select Date Range
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
  const [isTheoGreek, setIsTheoGreek] = useState(false);
  const toggleMode = () => setIsTheoGreek(!isTheoGreek);
  const tosParams = {
    und_symbol: UNDERLYING_SET,
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

  const dateRangeLabel = formatDateRange(dateRange);
  const greekLabel = getMenuLabel(GREEKMENU, greek);
  const modeLabel = isTheoGreek ? 'Theoretical surface' : 'Market surface';

  const toolbar = (
    <FilterBar
      contextSlot={<DatePickerWrapper initialDateRange={dateRange} onUpdate={handleDateChange} size="xs" />}
      viewSlot={
        <Group gap="sm" align="end">
          <SelectWrapper
            label="Greek"
            data={isTheoGreek ? LIMITEDGREEK : GREEKMENU}
            value={greek}
            onChange={(e) => setGreek(e || 'gamma')}
            size="xs"
            miw={190}
          />
          <Group gap={6} align="center">
            <Switch checked={isTheoGreek} onChange={toggleMode} size="sm" />
            <Text size="xs" c="var(--as-text-secondary)">
              Theo Mode
            </Text>
          </Group>
        </Group>
      }
      summarySlot={
        <Group gap="xs">
          <Badge variant="light" color="accent">
            {modeLabel}
          </Badge>
          <Badge variant="light" color="brand">
            Universe: {UNDERLYING_SET.length} underlyings
          </Badge>
        </Group>
      }
    />
  );

  return (
    <Stack gap="md">
      <AnalyticsPageHeader
        eyebrow="Analytics"
        title="Options Data"
        subtitle={`${modeLabel} across the core index and ETF basket for ${dateRangeLabel}.`}
        status={{ label: isTheoGreek ? 'Theoretical' : 'Market Derived', tone: isTheoGreek ? 'warn' : 'live' }}
        meta={[
          { label: 'Range', value: dateRangeLabel },
          { label: 'Greek', value: greekLabel },
          { label: 'Universe', value: `${UNDERLYING_SET.length} symbols` },
        ]}
      />

      <DataPanel controls={toolbar} stickyHeader variant="elevated" />

      <MetricStrip
        items={[
          { label: 'Range', value: dateRangeLabel, hint: 'Date window in focus' },
          { label: 'Greek', value: greekLabel, tone: 'live', hint: 'Applied to every series' },
          { label: 'Mode', value: modeLabel, tone: isTheoGreek ? 'warn' : 'positive', hint: 'Theoretical toggle preserved' },
          { label: 'Coverage', value: `${UNDERLYING_SET.length} symbols`, hint: UNDERLYING_SET.join(' / ') },
        ]}
      />

      <DataPanel
        eyebrow="Primary Surface"
        title={isTheoGreek ? 'Theoretical Greeks Surface' : 'Term Structure'}
        subtitle={
          isTheoGreek
            ? `${greekLabel} modeled across the selected range.`
            : `${greekLabel} term structure across the tracked index and ETF universe.`
        }
        variant="hero"
      >
        {isTheoGreek ? <ToS_Theo_Chart params={theoParams} /> : <EChartToSALL params={tosParams} />}
      </DataPanel>

      <ChartGrid columns={2} minColumnWidth={320}>
        {!isTheoGreek ? (
          <DataPanel
            title="ES Exposure"
            subtitle={`Directional read for ${greekLabel.toLowerCase()} over the active range.`}
            variant="elevated"
          >
            <EChartES params={esParams} />
          </DataPanel>
        ) : (
          <DataPanel title="Theory Context" subtitle="Why this view differs from the market-derived surface.">
            <SelectionPanel
              items={[
                { label: 'Model', value: 'Theo surface' },
                { label: 'Greek set', value: LIMITEDGREEK.map((item) => item.label).join(', ') },
                { label: 'Applied range', value: dateRangeLabel },
                { label: 'Readout', value: 'Compare modeled slope versus live structure' },
              ]}
            />
          </DataPanel>
        )}

        <DataPanel title="Active Selection" subtitle="Stable route context while filters and mode change.">
          <SelectionPanel
            items={[
              { label: 'Range', value: dateRangeLabel },
              { label: 'Greek', value: greekLabel },
              { label: 'Mode', value: modeLabel },
              { label: 'Underlyings', value: UNDERLYING_SET.join(', ') },
            ]}
          />
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
