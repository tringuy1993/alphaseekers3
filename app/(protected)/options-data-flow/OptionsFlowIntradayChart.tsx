'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ColorType, CrosshairMode, LineSeries, createChart } from 'lightweight-charts';
import type {
  IChartApi,
  ISeriesApi,
  LineData,
  MouseEventParams,
  Time,
  UTCTimestamp,
} from 'lightweight-charts';
import { Text } from '@mantine/core';

import type { MetricSide, OptionsFlowModel } from './OptionsFlowStrikeChart';
import classes from './OptionsFlowIntradayChart.module.css';

export type OptionsFlowIntradayRow = {
  snapshot_minute: string;
  spot_price: number | null;
  opening_call_baseline_oi_gex_1pct: number;
  opening_put_baseline_oi_gex_1pct: number;
  opening_baseline_oi_gex_1pct: number;
  call_minute_dealer_gex_1pct: number;
  put_minute_dealer_gex_1pct: number;
  minute_dealer_gex_1pct: number;
  call_inferred_minute_dealer_gex_1pct: number;
  put_inferred_minute_dealer_gex_1pct: number;
  inferred_minute_dealer_gex_1pct: number;
  call_blended_minute_dealer_gex_1pct: number;
  put_blended_minute_dealer_gex_1pct: number;
  blended_minute_dealer_gex_1pct: number;
  call_cumulative_dealer_gex_1pct: number;
  put_cumulative_dealer_gex_1pct: number;
  cumulative_dealer_gex_1pct: number;
  call_inferred_cumulative_dealer_gex_1pct: number;
  put_inferred_cumulative_dealer_gex_1pct: number;
  inferred_cumulative_dealer_gex_1pct: number;
  call_blended_cumulative_dealer_gex_1pct: number;
  put_blended_cumulative_dealer_gex_1pct: number;
  blended_cumulative_dealer_gex_1pct: number;
  call_flow_adjusted_gex_1pct: number;
  put_flow_adjusted_gex_1pct: number;
  flow_adjusted_gex_1pct: number;
  call_inferred_flow_adjusted_gex_1pct: number;
  put_inferred_flow_adjusted_gex_1pct: number;
  inferred_flow_adjusted_gex_1pct: number;
  call_blended_flow_adjusted_gex_1pct: number;
  put_blended_flow_adjusted_gex_1pct: number;
  blended_flow_adjusted_gex_1pct: number;
  volume_contracts: number;
};

type Props = {
  rows: OptionsFlowIntradayRow[];
  flowModel: OptionsFlowModel;
  showTotal: boolean;
  resetKey: string;
};

type ChartReadout = {
  label: string;
  call: number;
  put: number;
  total: number;
  callDelta: number;
  putDelta: number;
  totalDelta: number;
  volume: number;
};

const colors = {
  call: '#2fdd92',
  put: '#ff5470',
  total: '#3d7dff',
  text: '#d8dee9',
  border: 'rgba(148, 163, 184, 0.22)',
};

export function OptionsFlowIntradayChart({ rows, flowModel, showTotal, resetKey }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const callSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const putSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const totalSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const shouldFitContentRef = useRef(true);
  const [hoverReadout, setHoverReadout] = useState<ChartReadout | null>(null);
  const hasRows = rows.length > 0;

  const seriesData = useMemo(() => {
    const readoutsByTime = new Map<number, ChartReadout>();
    const sortedRows = rows
      .map((row) => ({
        ...row,
        chartTime: toChartTime(row.snapshot_minute),
      }))
      .filter((row) => row.chartTime !== null)
      .sort((a, b) => Number(a.chartTime) - Number(b.chartTime));

    const calls: LineData<UTCTimestamp>[] = sortedRows.map((row) => ({
      time: row.chartTime as UTCTimestamp,
      value: getAdjustedValue(row, 'call', flowModel),
    }));

    const puts: LineData<UTCTimestamp>[] = sortedRows.map((row) => ({
      time: row.chartTime as UTCTimestamp,
      value: getAdjustedValue(row, 'put', flowModel),
    }));

    const total: LineData<UTCTimestamp>[] = sortedRows.map((row) => ({
      time: row.chartTime as UTCTimestamp,
      value: getAdjustedValue(row, 'total', flowModel),
    }));

    sortedRows.forEach((row) => {
      const chartTime = Number(row.chartTime);
      readoutsByTime.set(chartTime, {
        label: formatChartTime(chartTime),
        call: getAdjustedValue(row, 'call', flowModel),
        put: getAdjustedValue(row, 'put', flowModel),
        total: getAdjustedValue(row, 'total', flowModel),
        callDelta: getCumulativeValue(row, 'call', flowModel),
        putDelta: getCumulativeValue(row, 'put', flowModel),
        totalDelta: getCumulativeValue(row, 'total', flowModel),
        volume: Number(row.volume_contracts || 0),
      });
    });

    const latestReadout = sortedRows.length
      ? readoutsByTime.get(Number(sortedRows[sortedRows.length - 1].chartTime)) || null
      : null;

    return { calls, puts, total, latestReadout, readoutsByTime };
  }, [flowModel, rows]);
  const activeReadout = hoverReadout || seriesData.latestReadout;

  useEffect(() => {
    shouldFitContentRef.current = true;
    setHoverReadout(null);
  }, [resetKey]);

  useEffect(() => {
    if (!chartRef.current || !hasRows) {
      return undefined;
    }

    const chart = createChart(chartRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: colors.text,
        attributionLogo: false,
      },
      localization: {
        priceFormatter: formatAxisValue,
        timeFormatter: (time: Time) => formatChartTime(Number(time)),
      },
      grid: {
        vertLines: { color: colors.border },
        horzLines: { color: colors.border },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: 'rgba(216, 222, 233, 0.24)', labelBackgroundColor: '#111827' },
        horzLine: { color: 'rgba(216, 222, 233, 0.24)', labelBackgroundColor: '#111827' },
      },
      rightPriceScale: {
        borderColor: colors.border,
        scaleMargins: { top: 0.12, bottom: 0.18 },
      },
      timeScale: {
        borderColor: colors.border,
        rightOffset: 4,
        barSpacing: 8,
        minBarSpacing: 2,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
    });
    chartApiRef.current = chart;

    callSeriesRef.current = chart.addSeries(LineSeries, {
      color: colors.call,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: true,
    });

    putSeriesRef.current = chart.addSeries(LineSeries, {
      color: colors.put,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: true,
    });

    return () => {
      chartApiRef.current = null;
      callSeriesRef.current = null;
      putSeriesRef.current = null;
      totalSeriesRef.current = null;
      chart.remove();
    };
  }, [hasRows]);

  useEffect(() => {
    const chart = chartApiRef.current;

    if (!chart) {
      return undefined;
    }

    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      if (!param.time) {
        setHoverReadout(null);
        return;
      }

      const readout = seriesData.readoutsByTime.get(Number(param.time));
      setHoverReadout(readout || null);
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [seriesData.readoutsByTime]);

  useEffect(() => {
    const chart = chartApiRef.current;

    if (!chart) {
      return;
    }

    const visibleRange = chart.timeScale().getVisibleRange();

    if (showTotal && !totalSeriesRef.current) {
      totalSeriesRef.current = chart.addSeries(LineSeries, {
        color: colors.total,
        lineWidth: 3,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: true,
      });
      totalSeriesRef.current.setData(seriesData.total);
    }

    if (!showTotal && totalSeriesRef.current) {
      chart.removeSeries(totalSeriesRef.current);
      totalSeriesRef.current = null;
    }

    if (visibleRange) {
      chart.timeScale().setVisibleRange(visibleRange);
    }
  }, [seriesData.total, showTotal]);

  useEffect(() => {
    const chart = chartApiRef.current;

    if (!chart || !hasRows) {
      return;
    }

    const visibleRange = chart.timeScale().getVisibleRange();

    callSeriesRef.current?.setData(seriesData.calls);
    putSeriesRef.current?.setData(seriesData.puts);
    totalSeriesRef.current?.setData(seriesData.total);

    if (shouldFitContentRef.current) {
      chart.timeScale().fitContent();
      shouldFitContentRef.current = false;
      return;
    }

    if (visibleRange) {
      chart.timeScale().setVisibleRange(visibleRange);
    }
  }, [hasRows, seriesData]);

  if (!hasRows) {
    return (
      <div className={classes.empty}>
        <Text size="sm">No intraday GEX path for the selected filters.</Text>
      </div>
    );
  }

  return (
    <div className={classes.chartWrap}>
      {activeReadout ? (
        <div className={classes.readout}>
          <Text size="xs" className={classes.readoutTitle}>
            {hoverReadout ? activeReadout.label : `Latest ${activeReadout.label}`}
          </Text>
          <ReadoutRow
            color={colors.call}
            label="Calls"
            value={activeReadout.call}
            delta={activeReadout.callDelta}
          />
          <ReadoutRow
            color={colors.put}
            label="Puts"
            value={activeReadout.put}
            delta={activeReadout.putDelta}
          />
          {showTotal ? (
            <ReadoutRow
              color={colors.total}
              label="Total"
              value={activeReadout.total}
              delta={activeReadout.totalDelta}
            />
          ) : null}
          <Text size="xs" className={classes.readoutMeta}>
            Vol {formatAxisValue(activeReadout.volume)}
          </Text>
        </div>
      ) : null}
      <div className={classes.legend}>
        <LegendItem color={colors.call} label="Calls adjusted" />
        <LegendItem color={colors.put} label="Puts adjusted" />
        {showTotal ? <LegendItem color={colors.total} label="Total adjusted" /> : null}
      </div>
      <div ref={chartRef} className={classes.chart} />
    </div>
  );
}

function ReadoutRow({
  color,
  label,
  value,
  delta,
}: {
  color: string;
  label: string;
  value: number;
  delta: number;
}) {
  return (
    <div className={classes.readoutRow}>
      <span className={classes.legendSwatch} style={{ backgroundColor: color }} />
      <Text size="xs" className={classes.readoutLabel}>
        {label}
      </Text>
      <Text size="xs" className={classes.readoutValue}>
        {formatAxisValue(value)}
      </Text>
      <Text size="xs" className={delta >= 0 ? classes.readoutDeltaUp : classes.readoutDeltaDown}>
        {formatSignedAxisValue(delta)}
      </Text>
    </div>
  );
}

function getAdjustedValue(
  row: OptionsFlowIntradayRow,
  side: MetricSide,
  flowModel: OptionsFlowModel
) {
  if (flowModel === 'inferred') {
    return (
      Number(
        side === 'call'
          ? row.call_inferred_flow_adjusted_gex_1pct
          : side === 'put'
            ? row.put_inferred_flow_adjusted_gex_1pct
            : row.inferred_flow_adjusted_gex_1pct
      ) || 0
    );
  }

  if (flowModel === 'blended') {
    return (
      Number(
        side === 'call'
          ? row.call_blended_flow_adjusted_gex_1pct
          : side === 'put'
            ? row.put_blended_flow_adjusted_gex_1pct
            : row.blended_flow_adjusted_gex_1pct
      ) || 0
    );
  }

  return (
    Number(
      side === 'call'
        ? row.call_flow_adjusted_gex_1pct
        : side === 'put'
          ? row.put_flow_adjusted_gex_1pct
          : row.flow_adjusted_gex_1pct
    ) || 0
  );
}

function getCumulativeValue(
  row: OptionsFlowIntradayRow,
  side: MetricSide,
  flowModel: OptionsFlowModel
) {
  if (flowModel === 'inferred') {
    return (
      Number(
        side === 'call'
          ? row.call_inferred_cumulative_dealer_gex_1pct
          : side === 'put'
            ? row.put_inferred_cumulative_dealer_gex_1pct
            : row.inferred_cumulative_dealer_gex_1pct
      ) || 0
    );
  }

  if (flowModel === 'blended') {
    return (
      Number(
        side === 'call'
          ? row.call_blended_cumulative_dealer_gex_1pct
          : side === 'put'
            ? row.put_blended_cumulative_dealer_gex_1pct
            : row.blended_cumulative_dealer_gex_1pct
      ) || 0
    );
  }

  return (
    Number(
      side === 'call'
        ? row.call_cumulative_dealer_gex_1pct
        : side === 'put'
          ? row.put_cumulative_dealer_gex_1pct
          : row.cumulative_dealer_gex_1pct
    ) || 0
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className={classes.legendItem}>
      <span className={classes.legendSwatch} style={{ backgroundColor: color }} />
      <Text size="xs">{label}</Text>
    </div>
  );
}

function toChartTime(value: string) {
  const time = new Date(value).getTime();

  if (!Number.isFinite(time)) {
    return null;
  }

  return Math.floor(time / 1000) as UTCTimestamp;
}

function formatChartTime(value: number) {
  return new Date(value * 1000).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatAxisValue(value: number) {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toFixed(0);
}

function formatSignedAxisValue(value: number) {
  const formatted = formatAxisValue(value);
  return value > 0 ? `+${formatted}` : formatted;
}
