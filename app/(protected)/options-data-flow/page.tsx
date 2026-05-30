'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Group,
  MultiSelect,
  SegmentedControl,
  Skeleton,
  Stack,
  Switch,
  Text,
} from '@mantine/core';

import {
  AnalyticsPageHeader,
  ChartGrid,
  DataPanel,
  FilterBar,
  MetricStrip,
} from '@/components/Layout';
import SelectWrapper from '@/components/SelectWrapper';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import {
  OPTIONS_FLOW_EXPIRATIONS_URL,
  OPTIONS_FLOW_INTRADAY_GEX_URL,
  OPTIONS_FLOW_SESSIONS_URL,
  OPTIONS_FLOW_STRIKE_LADDER_URL,
} from '@/lib/fetchdata/apiURLs';

import { OptionsFlowIntradayChart, OptionsFlowIntradayRow } from './OptionsFlowIntradayChart';
import {
  OptionsFlowModel,
  OptionsFlowMetric,
  OptionsFlowStrikeRow,
  getStrikeMetricValue,
} from './OptionsFlowStrikeChart';
import { OptionsFlowPriceGexProfileChart } from './OptionsFlowPriceGexProfileChart';
import classes from './page.module.css';

const UNDERLYING_OPTIONS = [
  { label: 'SPX', value: '$SPX.X' },
  { label: 'SPY', value: 'SPY' },
  { label: 'QQQ', value: 'QQQ' },
  { label: 'NDX', value: '$NDX.X' },
  { label: 'RUT', value: '$RUT.X' },
];

const METRIC_OPTIONS = [
  { label: 'Flow-adjusted GEX', value: 'flow_adjusted_gex_1pct' },
  { label: '1m Dealer Flow', value: 'minute_dealer_gex_1pct' },
  { label: 'Baseline OI GEX', value: 'baseline_oi_gex_1pct' },
];

const FLOW_MODEL_OPTIONS = [
  { label: 'Strict', value: 'strict' },
  { label: 'Inferred', value: 'inferred' },
  { label: 'Strict + Inferred', value: 'blended' },
];

type FlowSession = {
  session_date: string;
  latest_snapshot_minute: string | null;
  spot_price: number | null;
  expiration_count: number;
  strike_count: number;
  is_latest_session: boolean;
};

type FlowExpiration = {
  session_date: string;
  expiration_date: string;
  dte: number;
  strike_count: number;
  open_interest: number;
  baseline_oi_gex_1pct: number;
  spot_price: number | null;
  latest_snapshot_minute: string | null;
  is_latest_session: boolean;
};

type StrikeLadderResponse = {
  meta: {
    und_symbol: string;
    calculation_version: string;
    session_date: string | null;
    latest_snapshot_minute: string | null;
    latest_available_session_date: string | null;
    is_latest_session: boolean;
    expirations: string[];
    spot: number | null;
    strike_count: number;
    total_flow_adjusted_gex_1pct: number;
    total_call_flow_adjusted_gex_1pct: number;
    total_put_flow_adjusted_gex_1pct: number;
    total_inferred_flow_adjusted_gex_1pct: number;
    total_call_inferred_flow_adjusted_gex_1pct: number;
    total_put_inferred_flow_adjusted_gex_1pct: number;
    total_blended_flow_adjusted_gex_1pct: number;
    total_call_blended_flow_adjusted_gex_1pct: number;
    total_put_blended_flow_adjusted_gex_1pct: number;
    total_minute_dealer_gex_1pct: number;
    total_call_minute_dealer_gex_1pct: number;
    total_put_minute_dealer_gex_1pct: number;
    total_inferred_minute_dealer_gex_1pct: number;
    total_call_inferred_minute_dealer_gex_1pct: number;
    total_put_inferred_minute_dealer_gex_1pct: number;
    total_blended_minute_dealer_gex_1pct: number;
    total_call_blended_minute_dealer_gex_1pct: number;
    total_put_blended_minute_dealer_gex_1pct: number;
    total_cumulative_dealer_gex_1pct: number;
    total_inferred_cumulative_dealer_gex_1pct: number;
    total_blended_cumulative_dealer_gex_1pct: number;
    total_session_inferred_contracts: number;
    total_session_uninferred_contracts: number;
    total_volume_contracts: number;
  };
  data: OptionsFlowStrikeRow[];
};

type IntradayGexResponse = {
  meta: {
    und_symbol: string;
    calculation_version: string;
    session_date: string | null;
    opening_snapshot_minute: string | null;
    latest_snapshot_minute: string | null;
    latest_available_session_date: string | null;
    is_latest_session: boolean;
    expirations: string[];
    point_count: number;
    latest_call_flow_adjusted_gex_1pct: number;
    latest_put_flow_adjusted_gex_1pct: number;
    latest_flow_adjusted_gex_1pct: number;
    latest_call_inferred_flow_adjusted_gex_1pct: number;
    latest_put_inferred_flow_adjusted_gex_1pct: number;
    latest_inferred_flow_adjusted_gex_1pct: number;
    latest_call_blended_flow_adjusted_gex_1pct: number;
    latest_put_blended_flow_adjusted_gex_1pct: number;
    latest_blended_flow_adjusted_gex_1pct: number;
  };
  data: OptionsFlowIntradayRow[];
};

export default function OptionsDataFlowPage() {
  const [ticker, setTicker] = useState('$SPX.X');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedExpirations, setSelectedExpirations] = useState<string[]>([]);
  const [metric, setMetric] = useState<OptionsFlowMetric>('flow_adjusted_gex_1pct');
  const [flowModel, setFlowModel] = useState<OptionsFlowModel>('blended');
  const [showTotal, setShowTotal] = useState(false);

  const { data: sessionsData, isLoading: sessionsLoading } = useCustomSWR(
    OPTIONS_FLOW_SESSIONS_URL,
    { und_symbol: ticker }
  );

  const sessions: FlowSession[] = useMemo(() => sessionsData?.data || [], [sessionsData]);
  const latestSession = sessions.find((session) => session.is_latest_session) || sessions[0];

  useEffect(() => {
    if (
      sessions.length > 0 &&
      !sessions.some((session) => session.session_date === selectedSession)
    ) {
      setSelectedSession(sessions[0].session_date);
    }
  }, [selectedSession, sessions]);

  useEffect(() => {
    setSelectedSession(null);
    setSelectedExpirations([]);
  }, [ticker]);

  const { data: expirationsData, isLoading: expirationsLoading } = useCustomSWR(
    selectedSession ? OPTIONS_FLOW_EXPIRATIONS_URL : null,
    selectedSession ? { und_symbol: ticker, session_date: selectedSession } : {}
  );

  const expirations: FlowExpiration[] = useMemo(
    () => expirationsData?.data || [],
    [expirationsData]
  );

  useEffect(() => {
    if (!expirations.length) {
      if (selectedExpirations.length > 0) {
        setSelectedExpirations([]);
      }
      return;
    }

    const available = expirations.map((expiration) => expiration.expiration_date);
    const retained = selectedExpirations.filter((expiration) => available.includes(expiration));

    if (retained.length === 0) {
      setSelectedExpirations(available.slice(0, 3));
      return;
    }

    if (retained.length !== selectedExpirations.length) {
      setSelectedExpirations(retained);
    }
  }, [expirations, selectedExpirations]);

  const isLatestSelected = Boolean(
    selectedSession && latestSession && selectedSession === latestSession.session_date
  );

  const ladderParams = useMemo(
    () => ({
      und_symbol: ticker,
      session_date: selectedSession,
      expirations: JSON.stringify(selectedExpirations),
    }),
    [selectedExpirations, selectedSession, ticker]
  );
  const chartResetKey = `${ticker}-${selectedSession || ''}-${selectedExpirations.join('|')}`;

  const {
    data: ladderData,
    isLoading: ladderLoading,
    isError: ladderError,
  } = useCustomSWR(
    selectedSession && selectedExpirations.length > 0 ? OPTIONS_FLOW_STRIKE_LADDER_URL : null,
    ladderParams,
    { refreshInterval: isLatestSelected ? 60000 : 0 }
  );

  const {
    data: intradayData,
    isLoading: intradayLoading,
    isError: intradayError,
  } = useCustomSWR(
    selectedSession && selectedExpirations.length > 0 ? OPTIONS_FLOW_INTRADAY_GEX_URL : null,
    ladderParams,
    { refreshInterval: isLatestSelected ? 60000 : 0 }
  );

  const ladder = ladderData as StrikeLadderResponse | undefined;
  const rows = ladder?.data || [];
  const meta = ladder?.meta;
  const intraday = intradayData as IntradayGexResponse | undefined;
  const intradayRows = intraday?.data || [];

  const sessionOptions = sessions.map((session) => ({
    label: session.session_date,
    value: session.session_date,
  }));

  const expirationOptions = expirations.map((expiration) => ({
    label: `${expiration.expiration_date} (${expiration.dte} DTE)`,
    value: expiration.expiration_date,
  }));

  const selectedExpLabel = selectedExpirations.length
    ? selectedExpirations.join(', ')
    : 'No expirations';
  const snapshotLabel = meta?.latest_snapshot_minute
    ? formatDateTime(meta.latest_snapshot_minute)
    : 'No snapshot';
  const spotLabel = meta?.spot ? formatCurrency(meta.spot, 2) : '--';
  const totalAdjusted = getMetaFlowAdjusted(meta, 'total', flowModel);
  const totalCallAdjusted = getMetaFlowAdjusted(meta, 'call', flowModel);
  const totalPutAdjusted = getMetaFlowAdjusted(meta, 'put', flowModel);
  const totalFlow = getMetaMinuteFlow(meta, 'total', flowModel);
  const totalCallFlow = getMetaMinuteFlow(meta, 'call', flowModel);
  const totalPutFlow = getMetaMinuteFlow(meta, 'put', flowModel);
  const inferredContracts = Number(meta?.total_session_inferred_contracts || 0);
  const uninferredContracts = Number(meta?.total_session_uninferred_contracts || 0);

  const controls = (
    <FilterBar
      contextSlot={
        <Group gap="sm" align="end">
          <SelectWrapper
            label="Underlying"
            data={UNDERLYING_OPTIONS}
            value={ticker}
            onChange={(value) => value && setTicker(value)}
            searchable
            miw={150}
          />
          <SelectWrapper
            label="Session"
            data={sessionOptions}
            value={selectedSession}
            onChange={(value) => value && setSelectedSession(value)}
            searchable
            disabled={sessionsLoading || sessionOptions.length === 0}
            miw={170}
          />
          <MultiSelect
            label="Expirations"
            data={expirationOptions}
            value={selectedExpirations}
            onChange={setSelectedExpirations}
            searchable
            clearable
            disabled={expirationsLoading || expirationOptions.length === 0}
            size="xs"
            miw={280}
            maxDropdownHeight={280}
            styles={{
              input: {
                minHeight: 'var(--as-density-control-h)',
                fontSize: 'var(--as-density-font)',
                backgroundColor: 'var(--as-surface-secondary)',
                borderColor: 'var(--as-border)',
              },
              label: {
                marginBottom: 2,
                fontSize: '11px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--as-text-secondary)',
              },
              dropdown: {
                backgroundColor: 'var(--as-surface-elevated)',
                borderColor: 'var(--as-border)',
              },
            }}
          />
        </Group>
      }
      viewSlot={
        <Box className={classes.metricControl}>
          <Group justify="space-between" align="center" mb={2}>
            <Text size="xs" c="var(--as-text-secondary)" tt="uppercase" lts="0.04em">
              Metric
            </Text>
            <Switch
              label="Total"
              checked={showTotal}
              onChange={(event) => setShowTotal(event.currentTarget.checked)}
              size="xs"
            />
          </Group>
          <SegmentedControl
            value={metric}
            onChange={(value) => setMetric(value as OptionsFlowMetric)}
            data={METRIC_OPTIONS}
            size="xs"
            fullWidth
          />
          <Text size="xs" c="var(--as-text-secondary)" mt={8} mb={2} tt="uppercase" lts="0.04em">
            Flow Model
          </Text>
          <SegmentedControl
            value={flowModel}
            onChange={(value) => setFlowModel(value as OptionsFlowModel)}
            data={FLOW_MODEL_OPTIONS}
            size="xs"
            fullWidth
          />
        </Box>
      }
      summarySlot={
        <Group gap="xs">
          <Badge variant="light" color={isLatestSelected ? 'positive' : 'gray'}>
            {isLatestSelected ? 'Live refresh' : 'Static session'}
          </Badge>
          <Badge variant="light" color="brand">
            {selectedExpirations.length || 0} expiries
          </Badge>
          <Badge variant="light" color="accent">
            {rows.length || 0} strikes
          </Badge>
        </Group>
      }
    />
  );

  return (
    <Stack gap="md">
      <AnalyticsPageHeader
        eyebrow="Analytics"
        title="Options Data Flow"
        subtitle={`${ticker} flow-adjusted gamma exposure by strike across ${selectedExpLabel}.`}
        status={{
          label: isLatestSelected ? 'Live' : 'Snapshot',
          tone: isLatestSelected ? 'live' : 'muted',
        }}
        meta={[
          { label: 'Underlying', value: ticker },
          { label: 'Session', value: selectedSession || 'Loading' },
          { label: 'Snapshot', value: snapshotLabel },
          { label: 'Expiries', value: selectedExpirations.length || 0 },
        ]}
      />

      <DataPanel controls={controls} stickyHeader variant="elevated" />

      <MetricStrip
        items={[
          {
            label: 'Latest Snapshot',
            value: snapshotLabel,
            tone: isLatestSelected ? 'live' : 'neutral',
          },
          { label: 'Spot', value: spotLabel, hint: ticker },
          {
            label: 'Selected Expiries',
            value: selectedExpirations.length || 0,
            hint: selectedExpLabel,
          },
          {
            label: 'Call GEX',
            value: formatCompact(totalCallAdjusted),
            tone: totalCallAdjusted >= 0 ? 'positive' : 'negative',
            hint: getFlowModelLabel(flowModel),
          },
          {
            label: 'Put GEX',
            value: formatCompact(totalPutAdjusted),
            tone: totalPutAdjusted >= 0 ? 'positive' : 'negative',
            hint: getFlowModelLabel(flowModel),
          },
          {
            label: 'Total GEX',
            value: formatCompact(totalAdjusted),
            tone: totalAdjusted >= 0 ? 'positive' : 'negative',
            hint: getFlowModelLabel(flowModel),
          },
          {
            label: '1m Dealer Flow',
            value: formatCompact(totalFlow),
            tone: totalFlow >= 0 ? 'positive' : 'negative',
            hint: `C ${formatCompact(totalCallFlow)} / P ${formatCompact(totalPutFlow)}`,
          },
          {
            label: 'Inferred Contracts',
            value: formatCompact(inferredContracts),
            tone: 'neutral',
            hint: `${formatCompact(uninferredContracts)} still uncertain`,
          },
        ]}
      />

      <DataPanel
        eyebrow="Primary Surface"
        title={`${ticker} intraday price and latest ${getMetricLabel(metric)} profile`}
        subtitle={`${getFlowModelLabel(flowModel)} profile aligned to the right price axis across the selected expirations.`}
        variant="hero"
      >
        {ladderLoading || intradayLoading || sessionsLoading ? (
          <ChartSkeleton />
        ) : (
          <OptionsFlowPriceGexProfileChart
            ticker={ticker}
            intradayRows={intradayRows}
            strikeRows={rows}
            metric={metric}
            flowModel={flowModel}
            showTotal={showTotal}
            resetKey={chartResetKey}
          />
        )}
        {ladderError ? (
          <Text size="xs" c="var(--as-negative)" mt="sm">
            Could not load the strike ladder.
          </Text>
        ) : null}
        {intradayError ? (
          <Text size="xs" c="var(--as-negative)" mt="sm">
            Could not load the intraday price path.
          </Text>
        ) : null}
      </DataPanel>

      <DataPanel
        eyebrow="Intraday Path"
        title="Adjusted call and put GEX through the session"
        subtitle="Opening baseline OI GEX plus cumulative dealer GEX flow, updated minute by minute."
        variant="elevated"
      >
        {intradayLoading || sessionsLoading ? (
          <SmallChartSkeleton />
        ) : (
          <OptionsFlowIntradayChart
            rows={intradayRows}
            flowModel={flowModel}
            showTotal={showTotal}
            resetKey={chartResetKey}
          />
        )}
        {intradayError ? (
          <Text size="xs" c="var(--as-negative)" mt="sm">
            Could not load the intraday GEX path.
          </Text>
        ) : null}
      </DataPanel>

      <ChartGrid columns={2} minColumnWidth={320}>
        <DataPanel
          title="Strike Leaders"
          subtitle={`Largest absolute ${getFlowModelLabel(flowModel).toLowerCase()} levels in the active ladder.`}
        >
          <StrikeTable
            rows={getTopRows(rows, 'flow_adjusted_gex_1pct', flowModel)}
            metric="flow_adjusted_gex_1pct"
            flowModel={flowModel}
          />
        </DataPanel>

        <DataPanel
          title="Flow Leaders"
          subtitle={`Largest absolute one-minute ${getFlowModelLabel(flowModel).toLowerCase()} by strike.`}
        >
          <StrikeTable
            rows={getTopRows(rows, 'minute_dealer_gex_1pct', flowModel)}
            metric="minute_dealer_gex_1pct"
            flowModel={flowModel}
          />
        </DataPanel>
      </ChartGrid>
    </Stack>
  );
}

function ChartSkeleton() {
  return (
    <Stack gap="sm">
      <Skeleton height={560} radius="sm" />
      <Skeleton height={14} width="40%" radius="xl" />
    </Stack>
  );
}

function SmallChartSkeleton() {
  return (
    <Stack gap="sm">
      <Skeleton height={360} radius="sm" />
      <Skeleton height={14} width="34%" radius="xl" />
    </Stack>
  );
}

function StrikeTable({
  rows,
  metric,
  flowModel,
}: {
  rows: OptionsFlowStrikeRow[];
  metric: OptionsFlowMetric;
  flowModel: OptionsFlowModel;
}) {
  if (!rows.length) {
    return (
      <Text size="sm" c="var(--as-text-secondary)">
        No strikes available.
      </Text>
    );
  }

  return (
    <div className={classes.tableWrap}>
      <table className={classes.strikeTable}>
        <thead>
          <tr>
            <th>Strike</th>
            <th>Value</th>
            <th>Calls</th>
            <th>Puts</th>
            <th>Volume</th>
            <th>Open Interest</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const value = getStrikeMetricValue(row, metric, 'total', flowModel);
            const callValue = getStrikeMetricValue(row, metric, 'call', flowModel);
            const putValue = getStrikeMetricValue(row, metric, 'put', flowModel);
            return (
              <tr key={`${row.strike_price}-${metric}-${flowModel}`}>
                <td>{formatStrike(row.strike_price)}</td>
                <td className={value >= 0 ? classes.positive : classes.negative}>
                  {formatCompact(value)}
                </td>
                <td className={callValue >= 0 ? classes.positive : classes.negative}>
                  {formatCompact(callValue)}
                </td>
                <td className={putValue >= 0 ? classes.positive : classes.negative}>
                  {formatCompact(putValue)}
                </td>
                <td>{formatCompact(Number(row.volume_contracts || 0))}</td>
                <td>{formatCompact(Number(row.open_interest || 0))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getTopRows(
  rows: OptionsFlowStrikeRow[],
  metric: OptionsFlowMetric,
  flowModel: OptionsFlowModel
) {
  return [...rows]
    .sort(
      (a, b) =>
        Math.abs(getStrikeMetricValue(b, metric, 'total', flowModel)) -
        Math.abs(getStrikeMetricValue(a, metric, 'total', flowModel))
    )
    .slice(0, 8);
}

function getMetricLabel(metric: OptionsFlowMetric) {
  return METRIC_OPTIONS.find((option) => option.value === metric)?.label || metric;
}

function getFlowModelLabel(flowModel: OptionsFlowModel) {
  return FLOW_MODEL_OPTIONS.find((option) => option.value === flowModel)?.label || flowModel;
}

function getMetaFlowAdjusted(
  meta: StrikeLadderResponse['meta'] | undefined,
  side: 'call' | 'put' | 'total',
  flowModel: OptionsFlowModel
) {
  if (!meta) {
    return 0;
  }

  if (flowModel === 'inferred') {
    return (
      Number(
        side === 'call'
          ? meta.total_call_inferred_flow_adjusted_gex_1pct
          : side === 'put'
            ? meta.total_put_inferred_flow_adjusted_gex_1pct
            : meta.total_inferred_flow_adjusted_gex_1pct
      ) || 0
    );
  }

  if (flowModel === 'blended') {
    return (
      Number(
        side === 'call'
          ? meta.total_call_blended_flow_adjusted_gex_1pct
          : side === 'put'
            ? meta.total_put_blended_flow_adjusted_gex_1pct
            : meta.total_blended_flow_adjusted_gex_1pct
      ) || 0
    );
  }

  return (
    Number(
      side === 'call'
        ? meta.total_call_flow_adjusted_gex_1pct
        : side === 'put'
          ? meta.total_put_flow_adjusted_gex_1pct
          : meta.total_flow_adjusted_gex_1pct
    ) || 0
  );
}

function getMetaMinuteFlow(
  meta: StrikeLadderResponse['meta'] | undefined,
  side: 'call' | 'put' | 'total',
  flowModel: OptionsFlowModel
) {
  if (!meta) {
    return 0;
  }

  if (flowModel === 'inferred') {
    return (
      Number(
        side === 'call'
          ? meta.total_call_inferred_minute_dealer_gex_1pct
          : side === 'put'
            ? meta.total_put_inferred_minute_dealer_gex_1pct
            : meta.total_inferred_minute_dealer_gex_1pct
      ) || 0
    );
  }

  if (flowModel === 'blended') {
    return (
      Number(
        side === 'call'
          ? meta.total_call_blended_minute_dealer_gex_1pct
          : side === 'put'
            ? meta.total_put_blended_minute_dealer_gex_1pct
            : meta.total_blended_minute_dealer_gex_1pct
      ) || 0
    );
  }

  return (
    Number(
      side === 'call'
        ? meta.total_call_minute_dealer_gex_1pct
        : side === 'put'
          ? meta.total_put_minute_dealer_gex_1pct
          : meta.total_minute_dealer_gex_1pct
    ) || 0
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatStrike(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(value));
}

function formatCurrency(value: number, digits = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
  }).format(value);
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
