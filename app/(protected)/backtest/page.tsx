'use client';

import { format } from 'date-fns';
import { Badge, Box, Grid, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';

import {
  useBTDatePickerStore,
  useBTOrderStore,
  useBTSelectedLegsStore,
  useBTTimePickerStore,
} from '@/store';
import TimeSlider from './TimeSlider';
import BTOptionChain from './BTOptionChain/BTOptionChain';
import { BTOrderMonitor } from './BTOrder/BTOrderMonitor';
import { OrderEntry } from './BTOrder/OrderEntry';
import { BackTestCharts } from './BackTestCharts';
import BTDatePicker from './BTDatePicker';
import { AnalyticsPageHeader, ChartGrid, DataPanel, FilterBar, MetricStrip } from '@/components/Layout';

export default function PageBTOrder() {
  const { BackTestDate } = useBTDatePickerStore();
  const { BackTestTime } = useBTTimePickerStore();
  const { legs, legsPriceSum } = useBTSelectedLegsStore();
  const { order } = useBTOrderStore();
  const [activeTab, setActiveTab] = useState('charts');
  const PARAMS = {
    trade_date: format(BackTestDate[0] as Date, 'yyyy-MM-dd'),
    expiration: format(BackTestDate[1] as Date, 'yyyy-MM-dd'),
    trade_time: BackTestTime,
    all_greeks: true,
  };
  const tradeDateLabel = format(BackTestDate[0] as Date, 'MMM d, yyyy');
  const expirationLabel = format(BackTestDate[1] as Date, 'MMM d, yyyy');
  const activePremium = order.orderCost !== 0 ? order.orderCost : legsPriceSum;

  const controls = (
    <FilterBar
      contextSlot={<BTDatePicker />}
      viewSlot={
        <Box w="100%" maw={900}>
          <TimeSlider />
        </Box>
      }
      summarySlot={
        <Group gap="xs">
          <Badge variant="light" color="accent">
            Replay mode
          </Badge>
          <Badge variant="light" color="brand">
            {BackTestTime}
          </Badge>
          <Badge variant="light" color="positive">
            {legs.length} selected legs
          </Badge>
        </Group>
      }
    />
  );

  return (
    <Stack gap="md">
      <AnalyticsPageHeader
        eyebrow="Workbench"
        title="Back Test"
        subtitle={`Replay ${tradeDateLabel} with expiration ${expirationLabel} at ${BackTestTime}.`}
        status={{ label: 'Replay', tone: 'warn' }}
        meta={[
          { label: 'Trade Date', value: tradeDateLabel },
          { label: 'Expiration', value: expirationLabel },
          { label: 'Replay Time', value: BackTestTime },
          { label: 'Selected Legs', value: legs.length || 0 },
        ]}
      />

      <DataPanel controls={controls} stickyHeader variant="elevated" />

      <MetricStrip
        items={[
          { label: 'Trade Date', value: tradeDateLabel, hint: 'Session under replay' },
          { label: 'Expiration', value: expirationLabel, hint: 'Contract expiry in focus' },
          { label: 'Replay Time', value: BackTestTime, tone: 'warn', hint: 'Current simulated timestamp' },
          { label: 'Leg Count', value: legs.length || 0, hint: 'Builder selection size' },
          {
            label: 'Active Premium',
            value: formatCurrency(activePremium),
            tone: activePremium >= 0 ? 'positive' : 'negative',
            hint: order.orderCost !== 0 ? 'Submitted order cost' : 'Current builder total',
          },
        ]}
      />

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <DataPanel
            eyebrow="Monitor"
            title="Tracked order"
            subtitle="Live mark-to-market for the submitted replay order."
            variant="elevated"
          >
            <BTOrderMonitor />
          </DataPanel>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <DataPanel
            eyebrow="Primary Surface"
            title={activeTab === 'charts' ? 'Backtest chart' : 'Option chain workbench'}
            subtitle={
              activeTab === 'charts'
                ? 'Chart-first replay surface for evaluating how the setup evolves over time.'
                : 'Order builder and option chain stay in one work area during construction.'
            }
            tabs={[
              { value: 'charts', label: 'Charts' },
              { value: 'chain', label: 'Option Chain' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="hero"
          >
            {activeTab === 'charts' ? (
              <BackTestCharts />
            ) : (
              <Stack gap="md">
                <div>
                  <Text size="xs" fw={700} tt="uppercase" lts="0.08em" c="var(--as-amber)" mb="xs">
                    Order Entry
                  </Text>
                  <OrderEntry />
                </div>
                <div>
                  <Text size="xs" fw={700} tt="uppercase" lts="0.08em" c="var(--as-amber)" mb="xs">
                    Option Chain
                  </Text>
                  <BTOptionChain params={PARAMS} />
                </div>
              </Stack>
            )}
          </DataPanel>
        </Grid.Col>
      </Grid>

      <ChartGrid columns={2} minColumnWidth={320}>
        <DataPanel title="Replay Summary" subtitle="Stable context while switching workbench tabs.">
          <SelectionPanel
            items={[
              { label: 'Trade date', value: tradeDateLabel },
              { label: 'Expiration', value: expirationLabel },
              { label: 'Replay time', value: BackTestTime },
              { label: 'Mode', value: 'Historical replay' },
            ]}
          />
        </DataPanel>

        <DataPanel title="Builder State" subtitle="Selection and submission posture without leaving the work area.">
          <SelectionPanel
            items={[
              { label: 'Selected legs', value: String(legs.length) },
              { label: 'Submitted legs', value: String(order.legs.length) },
              { label: 'Builder total', value: formatCurrency(legsPriceSum) },
              { label: 'Submitted cost', value: formatCurrency(order.orderCost) },
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

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  return `${value >= 0 ? '+' : '-'}$${Math.abs(value).toFixed(2)}`;
}
