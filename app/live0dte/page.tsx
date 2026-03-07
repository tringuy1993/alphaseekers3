'use client';

import { useState } from 'react';
import { Badge, Grid, Group, Stack, Text } from '@mantine/core';
import { SelectUticker } from './selectUTicker';
import EChart0DTE from '@/components/ECharts/Live0DTE/EChart0DTE';
import { SelectUDate } from './selectDate';
import EChart0DTE_ExpoGreek from '@/components/ECharts/Live0DTE/EChart0DTE_ExpoGreek';
import EChart0DTE_Volume from '@/components/ECharts/Live0DTE/EChart0DTE_Volume';
import {
  AnalyticsPageHeader,
  ChartGrid,
  DataPanel,
  FilterBar,
  MetricStrip,
} from '@/components/Layout';

export default function PageLive0DTE() {
  const [uTicker, setUTicker] = useState('$SPX.X');
  const [defaultDate, setUDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const handleUTickerChange = (newDate: string) => {
    setUDate(newDate);
  };

  const chartParams = { und_symbol: uTicker, date: defaultDate };

  const gammaChartParams = { ...chartParams, greek: 'Gamma' };
  const vannaChartParams = { ...chartParams, greek: 'Vanna' };
  const deltaChartParams = { ...chartParams, greek: 'Delta' };

  const controls = (
    <FilterBar
      contextSlot={<SelectUDate uTicker={uTicker} onDefaultDateChange={handleUTickerChange} size="xs" />}
      viewSlot={<SelectUticker uTicker={uTicker} setUTicker={setUTicker} size="xs" />}
      summarySlot={
        <Group gap="xs">
          <Badge variant="light" color="positive">
            Live session
          </Badge>
          <Badge variant="light" color="brand">
            {uTicker}
          </Badge>
          <Badge variant="light" color="accent">
            {defaultDate}
          </Badge>
        </Group>
      }
    />
  );

  return (
    <Stack gap="md">
      <AnalyticsPageHeader
        eyebrow="Market Map"
        title="Live 0DTE"
        subtitle={`Intraday 0DTE surface for ${uTicker} on ${defaultDate}, with volume and greek lenses in supporting panels.`}
        status={{ label: 'Live Session', tone: 'live' }}
        meta={[
          { label: 'Underlying', value: uTicker },
          { label: 'Session Date', value: defaultDate },
          { label: 'Lenses', value: 'Gamma / Vanna / Delta' },
          { label: 'Volume', value: 'At strike' },
        ]}
      />

      <DataPanel controls={controls} stickyHeader variant="elevated" />

      <MetricStrip
        items={[
          { label: 'Underlying', value: uTicker, hint: 'Current live session symbol' },
          { label: 'Date', value: defaultDate, hint: 'Selected trading date' },
          { label: 'View', value: 'Live map', tone: 'live', hint: 'Primary intraday surface' },
          { label: 'Greek lenses', value: '3', hint: 'Gamma, Vanna, Delta' },
          { label: 'Volume pane', value: 'Enabled', tone: 'positive', hint: 'Strike-level readout' },
        ]}
      />

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <DataPanel
            eyebrow="Context Rail"
            title="Session context"
            subtitle="Fast orientation before reading the live surface."
          >
            <SelectionPanel
              items={[
                { label: 'Underlying', value: uTicker },
                { label: 'Date', value: defaultDate },
                { label: 'Mode', value: '0DTE live monitoring' },
                { label: 'Supporting lenses', value: 'Gamma / Vanna / Delta' },
              ]}
            />
          </DataPanel>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <DataPanel
            eyebrow="Primary Surface"
            title="Live 0DTE surface"
            subtitle="Dominant intraday chart for monitoring where exposure and activity are concentrating."
            variant="hero"
          >
            <EChart0DTE params={chartParams} />
          </DataPanel>
        </Grid.Col>
      </Grid>

      <ChartGrid columns={3} minColumnWidth={260}>
        <DataPanel title="Gamma exposure" subtitle="Strike-by-strike gamma posture.">
          <EChart0DTE_ExpoGreek params={gammaChartParams} />
        </DataPanel>
        <DataPanel title="Vanna exposure" subtitle="Cross-sensitivity lens for the same session.">
          <EChart0DTE_ExpoGreek params={vannaChartParams} />
        </DataPanel>
        <DataPanel title="Delta exposure" subtitle="Directional concentration by strike.">
          <EChart0DTE_ExpoGreek params={deltaChartParams} />
        </DataPanel>
      </ChartGrid>

      <DataPanel
        title="Volume at strike"
        subtitle="Follow the live map with a strike-level volume check before acting on the signal."
        variant="elevated"
      >
        <EChart0DTE_Volume params={chartParams} />
      </DataPanel>
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
