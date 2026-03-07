'use client';

import { useState, useEffect } from 'react';
import { Badge, Box, Grid, Group, SegmentedControl, Skeleton, Stack, Text } from '@mantine/core';

import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import {
  GAMMA_DASHBOARD_DATES_URL,
  LIVE_OTM_UTICKERS,
  GAMMA_DASHBOARD_EXPIRATIONS_URL,
} from '@/lib/fetchdata/apiURLs';
import {
  EChartGammaTimeSeries,
  EChartGammaHeatmap,
  EChartGammaLevels,
} from '@/components/ECharts/GammaDashboard';
import { AnalyticsPageHeader, DataPanel, FilterBar, MetricStrip } from '@/components/Layout';
import SelectWrapper from '@/components/SelectWrapper';

const EXP_FILTER_OPTIONS = [
  { label: '0DTE', value: '0dte' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'All', value: 'all' },
];

export default function GammaDashboardPage() {
  const [ticker, setTicker] = useState('$SPX.X');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [expFilter, setExpFilter] = useState('0dte');
  const [specificExp, setSpecificExp] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch available tickers
  const { data: tickerData } = useCustomSWR(LIVE_OTM_UTICKERS, {});
  const tickerOptions =
    tickerData?.data?.map((t: { uticker: string }) => ({
      label: t.uticker,
      value: t.uticker,
    })) || [];

  // Fetch available dates
  const { data: dateData, isLoading: datesLoading } = useCustomSWR(GAMMA_DASHBOARD_DATES_URL, { und_symbol: ticker });
  const dateOptions =
    dateData?.data?.map((d: { saved_date: string }) => ({
      label: d.saved_date,
      value: d.saved_date,
    })) || [];

  // Fetch available expirations (only when we have a valid date)
  const { data: expData } = useCustomSWR(
    selectedDate ? GAMMA_DASHBOARD_EXPIRATIONS_URL : (null as unknown as string),
    selectedDate ? { und_symbol: ticker, date: selectedDate } : {}
  );
  const expOptions =
    expData?.data?.map((e: { expiration_date: string; dte: number }) => ({
      label: `${e.expiration_date} (${e.dte} DTE)`,
      value: e.expiration_date,
    })) || [];

  // Initialize date when dates load for the first time
  useEffect(() => {
    if (dateData?.data?.length > 0 && !isInitialized) {
      setSelectedDate(dateData.data[0].saved_date);
      setIsInitialized(true);
    }
  }, [dateData, isInitialized]);

  // Update date when ticker changes (reset initialization)
  useEffect(() => {
    setIsInitialized(false);
    setSelectedDate(null);
  }, [ticker]);

  const chartParams = selectedDate ? {
    und_symbol: ticker,
    date: selectedDate,
    exp_filter: specificExp || expFilter,
  } : null;

  const effectiveExpFilter = specificExp ? 'custom' : expFilter;
  const snapshotLabel = selectedDate || 'Loading snapshot';
  const expirationLabel = specificExp || EXP_FILTER_OPTIONS.find((option) => option.value === expFilter)?.label || '0DTE';

  const filterControls = (
    <FilterBar
      contextSlot={
        <Group gap="sm">
          <SelectWrapper
            label="Underlying"
            data={tickerOptions}
            value={ticker}
            onChange={(val) => val && setTicker(val)}
            searchable
            size="xs"
            miw={160}
          />
          <SelectWrapper
            label="Date"
            data={dateOptions}
            value={selectedDate}
            onChange={(val) => val && setSelectedDate(val)}
            searchable
            size="xs"
            miw={170}
          />
        </Group>
      }
      viewSlot={
        <Group gap="sm" align="end">
          <Box>
            <Text size="xs" c="var(--as-text-secondary)" mb={2}>
              Expiration
            </Text>
            <SegmentedControl
              value={effectiveExpFilter}
              onChange={(val) => {
                if (val !== 'custom') {
                  setExpFilter(val);
                  setSpecificExp(null);
                }
              }}
              data={[...EXP_FILTER_OPTIONS, { label: 'Custom', value: 'custom' }]}
              size="xs"
              styles={{ root: { backgroundColor: 'var(--as-bg-tertiary)' } }}
            />
          </Box>
          <SelectWrapper
            label="Specific Exp"
            data={expOptions}
            value={specificExp}
            onChange={setSpecificExp}
            placeholder="Select expiration"
            clearable
            disabled={effectiveExpFilter !== 'custom'}
            size="xs"
            miw={200}
          />
        </Group>
      }
      summarySlot={
        <Group gap="xs">
          <Badge variant="light" color="brand">
            Snapshot: {snapshotLabel}
          </Badge>
          <Badge variant="light" color="accent">
            {specificExp ? 'Custom expiration' : expirationLabel}
          </Badge>
        </Group>
      }
    />
  );

  return (
    <Stack gap="md">
      <AnalyticsPageHeader
        eyebrow="Market Map"
        title="Gamma Dashboard"
        subtitle={`Snapshot view for ${ticker} on ${snapshotLabel} using ${specificExp ? `custom expiration ${specificExp}` : expirationLabel}.`}
        status={{ label: specificExp ? 'Custom Expiration' : 'Saved Snapshot', tone: specificExp ? 'warn' : 'muted' }}
        meta={[
          { label: 'Underlying', value: ticker },
          { label: 'Snapshot', value: snapshotLabel },
          { label: 'Expiration', value: expirationLabel },
          { label: 'Choices', value: expOptions.length ? `${expOptions.length} expiries` : 'Loading list' },
        ]}
      />

      <DataPanel controls={filterControls} stickyHeader variant="elevated" />

      <MetricStrip
        items={[
          { label: 'Underlying', value: ticker, hint: 'Current dashboard symbol' },
          { label: 'Snapshot', value: snapshotLabel, hint: 'Saved dashboard date' },
          { label: 'View', value: 'Heatmap + ladder', tone: 'live', hint: 'Market-map template' },
          { label: 'Expiration', value: expirationLabel, tone: specificExp ? 'warn' : 'neutral', hint: specificExp ? 'Manual override active' : 'Preset bucket active' },
          { label: 'Expiries', value: expOptions.length ? expOptions.length : '--', hint: 'Custom menu availability' },
        ]}
      />

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <DataPanel
            eyebrow="Context Rail"
            title="Levels by strike"
            subtitle="Narrow reference rail for locating concentration before using the heatmap."
            variant="elevated"
          >
            {chartParams && !datesLoading ? (
              <EChartGammaLevels params={chartParams} />
            ) : (
              <PanelSkeleton height={420} />
            )}
          </DataPanel>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <DataPanel
            eyebrow="Primary Surface"
            title="Gamma heatmap"
            subtitle="Dominant surface for identifying where exposure thickens or thins across strikes and expirations."
            variant="hero"
          >
            {chartParams && !datesLoading ? (
              <EChartGammaHeatmap params={chartParams} />
            ) : (
              <PanelSkeleton height={460} />
            )}
          </DataPanel>
        </Grid.Col>
      </Grid>

      <DataPanel
        title="Time series follow-through"
        subtitle="Use the trend line after the heatmap to confirm whether concentration is holding, accelerating, or fading."
        variant="elevated"
      >
        {chartParams && !datesLoading ? (
          <EChartGammaTimeSeries params={chartParams} />
        ) : (
          <PanelSkeleton height={320} />
        )}
      </DataPanel>
    </Stack>
  );
}

function PanelSkeleton({ height }: { height: number }) {
  return (
    <Stack gap="sm">
      <Skeleton height={height} radius="sm" />
      <Skeleton height={14} width="40%" radius="xl" />
      <Skeleton height={10} width="72%" radius="xl" />
    </Stack>
  );
}
