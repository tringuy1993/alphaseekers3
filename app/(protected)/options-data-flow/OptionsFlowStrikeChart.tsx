'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  createOptionsChart,
} from 'lightweight-charts';
import type { HistogramData, IChartApiBase, ISeriesApi, LineData } from 'lightweight-charts';
import { Text } from '@mantine/core';

import classes from './OptionsFlowStrikeChart.module.css';

export type OptionsFlowMetric =
  | 'flow_adjusted_gex_1pct'
  | 'minute_dealer_gex_1pct'
  | 'baseline_oi_gex_1pct';

export type OptionsFlowModel = 'strict' | 'inferred' | 'blended';

export type OptionsFlowStrikeRow = {
  strike_price: number;
  baseline_oi_gex_1pct: number;
  call_baseline_oi_gex_1pct: number;
  put_baseline_oi_gex_1pct: number;
  minute_dealer_gex_1pct: number;
  call_minute_dealer_gex_1pct: number;
  put_minute_dealer_gex_1pct: number;
  inferred_minute_dealer_gex_1pct: number;
  call_inferred_minute_dealer_gex_1pct: number;
  put_inferred_minute_dealer_gex_1pct: number;
  blended_minute_dealer_gex_1pct: number;
  call_blended_minute_dealer_gex_1pct: number;
  put_blended_minute_dealer_gex_1pct: number;
  cumulative_dealer_gex_1pct: number;
  call_cumulative_dealer_gex_1pct: number;
  put_cumulative_dealer_gex_1pct: number;
  inferred_cumulative_dealer_gex_1pct: number;
  call_inferred_cumulative_dealer_gex_1pct: number;
  put_inferred_cumulative_dealer_gex_1pct: number;
  blended_cumulative_dealer_gex_1pct: number;
  call_blended_cumulative_dealer_gex_1pct: number;
  put_blended_cumulative_dealer_gex_1pct: number;
  flow_adjusted_gex_1pct: number;
  call_flow_adjusted_gex_1pct: number;
  put_flow_adjusted_gex_1pct: number;
  inferred_flow_adjusted_gex_1pct: number;
  call_inferred_flow_adjusted_gex_1pct: number;
  put_inferred_flow_adjusted_gex_1pct: number;
  blended_flow_adjusted_gex_1pct: number;
  call_blended_flow_adjusted_gex_1pct: number;
  put_blended_flow_adjusted_gex_1pct: number;
  volume_contracts: number;
  call_volume_contracts: number;
  put_volume_contracts: number;
  inferred_contracts: number;
  call_inferred_contracts: number;
  put_inferred_contracts: number;
  uninferred_contracts: number;
  session_volume_contracts: number;
  call_session_volume_contracts: number;
  put_session_volume_contracts: number;
  session_inferred_contracts: number;
  call_session_inferred_contracts: number;
  put_session_inferred_contracts: number;
  session_uninferred_contracts: number;
  premium_flow: number;
  session_premium_flow: number;
  delta_flow: number;
  session_delta_flow: number;
  open_interest: number;
  call_open_interest: number;
  put_open_interest: number;
  spot_price: number | null;
};

type Props = {
  rows: OptionsFlowStrikeRow[];
  metric: OptionsFlowMetric;
  flowModel: OptionsFlowModel;
  showTotal: boolean;
  resetKey: string;
};

const colors = {
  call: '#2fdd92',
  put: '#ff5470',
  total: '#3d7dff',
  text: '#d8dee9',
  muted: '#8995a7',
  border: 'rgba(148, 163, 184, 0.22)',
};

export function OptionsFlowStrikeChart({ rows, metric, flowModel, showTotal, resetKey }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApiRef = useRef<IChartApiBase<number> | null>(null);
  const callSeriesRef = useRef<ISeriesApi<'Histogram', number> | null>(null);
  const putSeriesRef = useRef<ISeriesApi<'Histogram', number> | null>(null);
  const totalSeriesRef = useRef<ISeriesApi<'Line', number> | null>(null);
  const shouldFitContentRef = useRef(true);
  const hasRows = rows.length > 0;

  const seriesData = useMemo(() => {
    const sortedRows = rows
      .map((row) => ({
        ...row,
        strike_price: Number(row.strike_price),
      }))
      .filter((row) => Number.isFinite(row.strike_price))
      .sort((a, b) => a.strike_price - b.strike_price);

    const totalLine: LineData<number>[] = sortedRows.map((row) => ({
      time: row.strike_price,
      value: getStrikeMetricValue(row, metric, 'total', flowModel),
    }));

    const callHistogram: HistogramData<number>[] = sortedRows.map((row) => ({
      time: row.strike_price,
      value: getStrikeMetricValue(row, metric, 'call', flowModel),
      color: 'rgba(47, 221, 146, 0.72)',
    }));

    const putHistogram: HistogramData<number>[] = sortedRows.map((row) => ({
      time: row.strike_price,
      value: getStrikeMetricValue(row, metric, 'put', flowModel),
      color: 'rgba(255, 84, 112, 0.72)',
    }));

    return { totalLine, callHistogram, putHistogram };
  }, [flowModel, metric, rows]);

  useEffect(() => {
    shouldFitContentRef.current = true;
  }, [resetKey]);

  useEffect(() => {
    if (!chartRef.current || !hasRows) {
      return undefined;
    }

    const chart = createOptionsChart(chartRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: colors.text,
        attributionLogo: false,
      },
      localization: {
        precision: 0,
        priceFormatter: formatAxisValue,
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
        barSpacing: 10,
        minBarSpacing: 3,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
    });
    chartApiRef.current = chart;

    const callSeries = chart.addSeries(HistogramSeries, {
      color: colors.call,
      priceFormat: { type: 'volume' },
      priceLineVisible: false,
      lastValueVisible: false,
      base: 0,
    });

    const putSeries = chart.addSeries(HistogramSeries, {
      color: colors.put,
      priceFormat: { type: 'volume' },
      priceLineVisible: false,
      lastValueVisible: false,
      base: 0,
    });

    callSeriesRef.current = callSeries;
    putSeriesRef.current = putSeries;

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
      totalSeriesRef.current.setData(seriesData.totalLine);
    }

    if (!showTotal && totalSeriesRef.current) {
      chart.removeSeries(totalSeriesRef.current);
      totalSeriesRef.current = null;
    }

    if (visibleRange) {
      chart.timeScale().setVisibleRange(visibleRange);
    }
  }, [seriesData.totalLine, showTotal]);

  useEffect(() => {
    const chart = chartApiRef.current;

    if (!chart || !hasRows) {
      return;
    }

    const visibleRange = chart.timeScale().getVisibleRange();

    callSeriesRef.current?.setData(seriesData.callHistogram);
    putSeriesRef.current?.setData(seriesData.putHistogram);
    totalSeriesRef.current?.setData(seriesData.totalLine);

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
        <Text size="sm">No strike data for the selected filters.</Text>
      </div>
    );
  }

  return (
    <div className={classes.chartWrap}>
      <div className={classes.legend}>
        <LegendItem color={colors.call} label="Calls" />
        <LegendItem color={colors.put} label="Puts" />
        {showTotal ? <LegendItem color={colors.total} label="Total" /> : null}
      </div>
      <div ref={chartRef} className={classes.chart} />
    </div>
  );
}

export type MetricSide = 'call' | 'put' | 'total';

export function getStrikeMetricValue(
  row: OptionsFlowStrikeRow,
  metric: OptionsFlowMetric,
  side: MetricSide,
  flowModel: OptionsFlowModel
) {
  if (metric === 'flow_adjusted_gex_1pct') {
    return Number(getFlowAdjustedValue(row, side, flowModel)) || 0;
  }

  if (metric === 'baseline_oi_gex_1pct') {
    return (
      Number(
        side === 'call'
          ? row.call_baseline_oi_gex_1pct
          : side === 'put'
            ? row.put_baseline_oi_gex_1pct
            : row.baseline_oi_gex_1pct
      ) || 0
    );
  }

  return Number(getMinuteFlowValue(row, side, flowModel)) || 0;
}

function getFlowAdjustedValue(
  row: OptionsFlowStrikeRow,
  side: MetricSide,
  flowModel: OptionsFlowModel
) {
  if (flowModel === 'inferred') {
    return side === 'call'
      ? row.call_inferred_flow_adjusted_gex_1pct
      : side === 'put'
        ? row.put_inferred_flow_adjusted_gex_1pct
        : row.inferred_flow_adjusted_gex_1pct;
  }

  if (flowModel === 'blended') {
    return side === 'call'
      ? row.call_blended_flow_adjusted_gex_1pct
      : side === 'put'
        ? row.put_blended_flow_adjusted_gex_1pct
        : row.blended_flow_adjusted_gex_1pct;
  }

  return side === 'call'
    ? row.call_flow_adjusted_gex_1pct
    : side === 'put'
      ? row.put_flow_adjusted_gex_1pct
      : row.flow_adjusted_gex_1pct;
}

function getMinuteFlowValue(
  row: OptionsFlowStrikeRow,
  side: MetricSide,
  flowModel: OptionsFlowModel
) {
  if (flowModel === 'inferred') {
    return side === 'call'
      ? row.call_inferred_minute_dealer_gex_1pct
      : side === 'put'
        ? row.put_inferred_minute_dealer_gex_1pct
        : row.inferred_minute_dealer_gex_1pct;
  }

  if (flowModel === 'blended') {
    return side === 'call'
      ? row.call_blended_minute_dealer_gex_1pct
      : side === 'put'
        ? row.put_blended_minute_dealer_gex_1pct
        : row.blended_minute_dealer_gex_1pct;
  }

  return side === 'call'
    ? row.call_minute_dealer_gex_1pct
    : side === 'put'
      ? row.put_minute_dealer_gex_1pct
      : row.minute_dealer_gex_1pct;
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className={classes.legendItem}>
      <span className={classes.legendSwatch} style={{ backgroundColor: color }} />
      <Text size="xs">{label}</Text>
    </div>
  );
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
