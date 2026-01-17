'use client';

import { useState, useEffect } from 'react';
import { Box, Group, SegmentedControl, Select, Text, Paper, Stack, Grid, Center, Loader } from '@mantine/core';

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
import CustomCard from '@/components/CustomCard/CustomCard';

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
    selectedDate ? GAMMA_DASHBOARD_EXPIRATIONS_URL : null,
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

  return (
    <Box className="p-2 max-w-full mx-auto">
      <Text size="xl" fw={700} className="text-center mb-2">
        Gamma Dashboard
      </Text>

      <Paper shadow="sm" p="sm" mb="sm" withBorder>
        <Group grow>
          <Select
            label="Underlying"
            data={tickerOptions}
            value={ticker}
            onChange={(val) => val && setTicker(val)}
            searchable
            size="sm"
          />
          <Select
            label="Trade Date"
            data={dateOptions}
            value={selectedDate}
            onChange={(val) => val && setSelectedDate(val)}
            searchable
            size="sm"
          />
          <Box>
            <Text size="sm" fw={500} mb={4}>
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
            />
          </Box>
          <Select
            label="Specific Exp"
            data={expOptions}
            value={specificExp}
            onChange={setSpecificExp}
            placeholder="Select expiration"
            clearable
            disabled={effectiveExpFilter !== 'custom'}
            size="sm"
          />
        </Group>
      </Paper>

      {/* Main Layout: Levels on left, Heatmap + Time Series on right */}
      {!chartParams || datesLoading ? (
        <Center h={400}>
          <Loader size="xl" />
        </Center>
      ) : (
        <Grid gutter="sm">
          {/* Left: Gamma Levels by Strike (horizontal bars) */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <CustomCard>
              <EChartGammaLevels params={chartParams} />
            </CustomCard>
          </Grid.Col>

          {/* Right: Heatmap on top, Time Series on bottom */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="sm">
              <CustomCard>
                <EChartGammaHeatmap params={chartParams} />
              </CustomCard>
              <CustomCard>
                <EChartGammaTimeSeries params={chartParams} />
              </CustomCard>
            </Stack>
          </Grid.Col>
        </Grid>
      )}
    </Box>
  );
}
