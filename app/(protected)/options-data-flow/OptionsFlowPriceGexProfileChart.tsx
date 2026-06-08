'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColorType, CrosshairMode, LineSeries, createChart } from 'lightweight-charts';
import type {
  AutoscaleInfo,
  IChartApi,
  ISeriesApi,
  LineData,
  MouseEventParams,
  Time,
  UTCTimestamp,
} from 'lightweight-charts';
import { Text } from '@mantine/core';

import type { OptionsFlowIntradayRow } from './OptionsFlowIntradayChart';
import {
  getStrikeMetricValue,
  type OptionsFlowMetric,
  type OptionsFlowModel,
  type OptionsFlowStrikeRow,
} from './OptionsFlowStrikeChart';
import classes from './OptionsFlowPriceGexProfileChart.module.css';

type Props = {
  ticker: string;
  intradayRows: OptionsFlowIntradayRow[];
  strikeRows: OptionsFlowStrikeRow[];
  metric: OptionsFlowMetric;
  flowModel: OptionsFlowModel;
  showTotal: boolean;
  resetKey: string;
};

type PriceReadout = {
  label: string;
  price: number;
  change: number;
  changePct: number;
};

type ProfileRow = {
  strike: number;
  call: number;
  put: number;
  total: number;
};

type ProfilePoint = ProfileRow & {
  y: number;
};

type ProfileLayout = {
  points: ProfilePoint[];
  chartHeight: number;
  paneHeight: number;
  barHeight: number;
};

const colors = {
  price: '#f6c85f',
  call: '#2fdd92',
  put: '#ff5470',
  total: '#3d7dff',
  text: '#d8dee9',
  border: 'rgba(148, 163, 184, 0.22)',
};

const PROFILE_RANGE_LIMIT_MARGIN = 6;
const PROFILE_HALF_WIDTH_PCT = 46;

export function OptionsFlowPriceGexProfileChart({
  ticker,
  intradayRows,
  strikeRows,
  metric,
  flowModel,
  showTotal,
  resetKey,
}: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const profileRowsRef = useRef<ProfileRow[]>([]);
  const strikePricesRef = useRef<number[]>([]);
  const strikeStepRef = useRef<number | null>(null);
  const shouldFitContentRef = useRef(true);
  const syncFrameRef = useRef<number | null>(null);
  const [hoverReadout, setHoverReadout] = useState<PriceReadout | null>(null);
  const [profileLayout, setProfileLayout] = useState<ProfileLayout>({
    points: [],
    chartHeight: 0,
    paneHeight: 0,
    barHeight: 8,
  });

  const priceData = useMemo(() => {
    const readoutsByTime = new Map<number, PriceReadout>();
    const sortedRows = intradayRows
      .map((row) => ({
        snapshot_minute: row.snapshot_minute,
        spot_price: Number(row.spot_price),
        chartTime: toChartTime(row.snapshot_minute),
      }))
      .filter(
        (row) => row.chartTime !== null && Number.isFinite(row.spot_price) && row.spot_price > 0
      )
      .sort((a, b) => Number(a.chartTime) - Number(b.chartTime));

    const openingPrice = sortedRows[0]?.spot_price || 0;
    const line: LineData<UTCTimestamp>[] = sortedRows.map((row) => {
      const chartTime = Number(row.chartTime);
      const change = openingPrice ? row.spot_price - openingPrice : 0;
      const changePct = openingPrice ? (change / openingPrice) * 100 : 0;

      readoutsByTime.set(chartTime, {
        label: formatChartTime(chartTime),
        price: row.spot_price,
        change,
        changePct,
      });

      return {
        time: row.chartTime as UTCTimestamp,
        value: row.spot_price,
      };
    });

    const latestReadout = sortedRows.length
      ? readoutsByTime.get(Number(sortedRows[sortedRows.length - 1].chartTime)) || null
      : null;

    return { line, latestReadout, readoutsByTime };
  }, [intradayRows]);

  const profileRows = useMemo(() => {
    return strikeRows
      .map((row) => ({
        strike: Number(row.strike_price),
        call: getStrikeMetricValue(row, metric, 'call', flowModel),
        put: getStrikeMetricValue(row, metric, 'put', flowModel),
        total: getStrikeMetricValue(row, metric, 'total', flowModel),
      }))
      .filter((row) => Number.isFinite(row.strike))
      .sort((a, b) => a.strike - b.strike);
  }, [flowModel, metric, strikeRows]);

  const visibleProfileMax = useMemo(
    () => getProfileMaxMagnitude(profileLayout.points, showTotal),
    [profileLayout.points, showTotal]
  );
  const activeReadout = hoverReadout || priceData.latestReadout;
  const hasPriceRows = priceData.line.length > 0;

  const syncProfileLayout = useCallback(() => {
    const chart = chartApiRef.current;
    const chartElement = chartRef.current;
    const priceSeries = priceSeriesRef.current;

    if (!chart || !chartElement || !priceSeries) {
      setProfileLayout((current) => ({ ...current, points: [] }));
      return;
    }

    const chartHeight = chartElement.clientHeight;
    const timeScaleHeight = chart.timeScale().height() || 30;
    const paneHeight = Math.max(0, chartHeight - timeScaleHeight);
    const points = profileRowsRef.current
      .map((row) => {
        const coordinate = priceSeries.priceToCoordinate(row.strike);

        if (coordinate === null) {
          return null;
        }

        const y = Number(coordinate);

        if (y < -PROFILE_RANGE_LIMIT_MARGIN || y > paneHeight + PROFILE_RANGE_LIMIT_MARGIN) {
          return null;
        }

        return { ...row, y };
      })
      .filter((point): point is ProfilePoint => point !== null)
      .sort((a, b) => a.y - b.y);
    const yGaps = points
      .slice(1)
      .map((point, index) => Math.abs(point.y - points[index].y))
      .filter((gap) => gap > 0);
    const minGap = yGaps.length ? Math.min(...yGaps) : 14;
    const barHeight = clamp(minGap * 0.52, 3, 12);

    setProfileLayout({ points, chartHeight, paneHeight, barHeight });
  }, []);

  const scheduleProfileSync = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (syncFrameRef.current !== null) {
      window.cancelAnimationFrame(syncFrameRef.current);
    }

    syncFrameRef.current = window.requestAnimationFrame(() => {
      syncFrameRef.current = null;
      syncProfileLayout();
    });
  }, [syncProfileLayout]);

  useEffect(() => {
    profileRowsRef.current = profileRows;
    strikePricesRef.current = profileRows.map((row) => row.strike);
    strikeStepRef.current = getMedianStrikeStep(strikePricesRef.current);
    priceSeriesRef.current?.setData(priceData.line);
    scheduleProfileSync();
  }, [priceData.line, profileRows, scheduleProfileSync]);

  useEffect(() => {
    shouldFitContentRef.current = true;
    setHoverReadout(null);
  }, [resetKey]);

  useEffect(() => {
    if (!chartRef.current || !hasPriceRows) {
      return undefined;
    }

    const chartElement = chartRef.current;
    const chart = createChart(chartRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: colors.text,
        attributionLogo: false,
      },
      localization: {
        priceFormatter: formatPrice,
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
        visible: true,
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
    const priceSeries = chart.addSeries(LineSeries, {
      color: colors.price,
      lineWidth: 2,
      priceLineVisible: true,
      priceLineColor: 'rgba(246, 200, 95, 0.42)',
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      autoscaleInfoProvider: (baseImplementation: () => AutoscaleInfo | null) =>
        expandAutoscaleInfo(baseImplementation(), strikePricesRef.current, strikeStepRef.current),
    });
    const handleVisibleRangeChange = () => scheduleProfileSync();
    const syncTimeouts: number[] = [];
    let pointerIsDown = false;
    let resizeObserver: ResizeObserver | null = null;
    const scheduleInteractionSync = () => {
      scheduleProfileSync();
      syncTimeouts.push(window.setTimeout(scheduleProfileSync, 40));
      syncTimeouts.push(window.setTimeout(scheduleProfileSync, 120));
    };
    const handlePointerDown = () => {
      pointerIsDown = true;
      scheduleInteractionSync();
    };
    const handlePointerMove = () => {
      if (pointerIsDown) {
        scheduleInteractionSync();
      }
    };
    const handlePointerUp = () => {
      if (pointerIsDown) {
        pointerIsDown = false;
        scheduleInteractionSync();
      }
    };

    chartApiRef.current = chart;
    priceSeriesRef.current = priceSeries;
    chart.timeScale().subscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
    chart.timeScale().subscribeSizeChange(handleVisibleRangeChange);
    chartElement.addEventListener('pointerdown', handlePointerDown);
    chartElement.addEventListener('wheel', scheduleInteractionSync, { passive: true });
    chartElement.addEventListener('dblclick', scheduleInteractionSync);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleVisibleRangeChange);
      resizeObserver.observe(chartElement);
    }

    return () => {
      if (syncFrameRef.current !== null) {
        window.cancelAnimationFrame(syncFrameRef.current);
        syncFrameRef.current = null;
      }

      syncTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      resizeObserver?.disconnect();
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
      chart.timeScale().unsubscribeSizeChange(handleVisibleRangeChange);
      chartElement.removeEventListener('pointerdown', handlePointerDown);
      chartElement.removeEventListener('wheel', scheduleInteractionSync);
      chartElement.removeEventListener('dblclick', scheduleInteractionSync);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      chartApiRef.current = null;
      priceSeriesRef.current = null;
      chart.remove();
    };
  }, [hasPriceRows, scheduleProfileSync]);

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

      const readout = priceData.readoutsByTime.get(Number(param.time));
      setHoverReadout(readout || null);
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [priceData.readoutsByTime]);

  useEffect(() => {
    const chart = chartApiRef.current;

    if (!chart || !hasPriceRows) {
      return;
    }

    const visibleRange = chart.timeScale().getVisibleRange();

    priceSeriesRef.current?.setData(priceData.line);

    if (shouldFitContentRef.current) {
      chart.timeScale().fitContent();
      shouldFitContentRef.current = false;
      scheduleProfileSync();
      return;
    }

    if (visibleRange) {
      chart.timeScale().setVisibleRange(visibleRange);
    }

    scheduleProfileSync();
  }, [hasPriceRows, priceData.line, scheduleProfileSync]);

  if (!hasPriceRows) {
    return (
      <div className={classes.empty}>
        <Text size="sm">No intraday price path for the selected filters.</Text>
      </div>
    );
  }

  return (
    <div className={classes.surface}>
      <div className={classes.chartRegion}>
        {activeReadout ? (
          <div className={classes.readout}>
            <Text size="xs" className={classes.readoutTitle}>
              {hoverReadout ? activeReadout.label : `Latest ${activeReadout.label}`}
            </Text>
            <div className={classes.readoutRow}>
              <Text size="xs" className={classes.readoutLabel}>
                {ticker}
              </Text>
              <Text size="xs" className={classes.readoutValue}>
                {formatPrice(activeReadout.price)}
              </Text>
            </div>
            <div className={classes.readoutRow}>
              <Text size="xs" className={classes.readoutLabel}>
                Change
              </Text>
              <Text
                size="xs"
                className={activeReadout.change >= 0 ? classes.readoutUp : classes.readoutDown}
              >
                {formatSignedPrice(activeReadout.change)} (
                {formatSignedPercent(activeReadout.changePct)})
              </Text>
            </div>
          </div>
        ) : null}

        <div className={classes.legend}>
          <LegendItem color={colors.price} label={`${ticker} price`} />
          <LegendItem color={colors.call} label="Calls" />
          <LegendItem color={colors.put} label="Puts" />
          {showTotal ? <LegendItem color={colors.total} label="Total" /> : null}
        </div>

        <div ref={chartRef} className={classes.chart} />
      </div>

      <div
        className={classes.profileRegion}
        style={profileLayout.chartHeight ? { height: profileLayout.chartHeight } : undefined}
      >
        <div className={classes.profileHeader}>
          <Text size="xs" className={classes.profileTitle}>
            Selected profile
          </Text>
          <Text size="xs" className={classes.profileMeta}>
            {getMetricShortLabel(metric)}
          </Text>
        </div>

        <div className={classes.profilePane}>
          <div
            className={classes.zeroLine}
            style={profileLayout.paneHeight ? { height: profileLayout.paneHeight } : undefined}
          />
          {profileLayout.points.map((point) => (
            <ProfileBar
              key={`${point.strike}-${metric}-${flowModel}`}
              point={point}
              maxMagnitude={visibleProfileMax}
              barHeight={profileLayout.barHeight}
              showTotal={showTotal}
            />
          ))}
          {!profileRows.length ? (
            <div className={classes.profileEmpty}>
              <Text size="xs">No strike profile.</Text>
            </div>
          ) : null}
          {profileRows.length > 0 && !profileLayout.points.length ? (
            <div className={classes.profileEmpty}>
              <Text size="xs">No nearby strikes.</Text>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProfileBar({
  point,
  maxMagnitude,
  barHeight,
  showTotal,
}: {
  point: ProfilePoint;
  maxMagnitude: number;
  barHeight: number;
  showTotal: boolean;
}) {
  const callWidth = (Math.abs(point.call) / maxMagnitude) * PROFILE_HALF_WIDTH_PCT;
  const putWidth = (Math.abs(point.put) / maxMagnitude) * PROFILE_HALF_WIDTH_PCT;
  const totalOffset = clamp(
    (point.total / maxMagnitude) * PROFILE_HALF_WIDTH_PCT,
    -PROFILE_HALF_WIDTH_PCT,
    PROFILE_HALF_WIDTH_PCT
  );
  const title = [
    `Strike ${formatStrike(point.strike)}`,
    `Calls ${formatAxisValue(point.call)}`,
    `Puts ${formatAxisValue(point.put)}`,
    `Total ${formatAxisValue(point.total)}`,
  ].join(' | ');

  return (
    <div
      className={classes.profileRow}
      title={title}
      style={{ top: point.y, height: Math.max(barHeight, 3) }}
    >
      <span
        className={classes.putBar}
        style={{
          left: `${50 - putWidth}%`,
          width: `${putWidth}%`,
          height: barHeight,
        }}
      />
      <span
        className={classes.callBar}
        style={{
          left: '50%',
          width: `${callWidth}%`,
          height: barHeight,
        }}
      />
      {showTotal ? (
        <span
          className={classes.totalMarker}
          style={{
            left: `calc(50% + ${totalOffset}%)`,
            height: Math.max(barHeight + 5, 8),
          }}
        />
      ) : null}
    </div>
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

function expandAutoscaleInfo(
  autoscaleInfo: AutoscaleInfo | null,
  strikes: number[],
  strikeStep: number | null
) {
  if (!autoscaleInfo?.priceRange || strikes.length === 0) {
    return autoscaleInfo;
  }

  const baseMin = autoscaleInfo.priceRange.minValue;
  const baseMax = autoscaleInfo.priceRange.maxValue;
  const baseSpan = Math.max(baseMax - baseMin, 0.01);
  const step = strikeStep || baseSpan / 4;
  const extension = Math.max(baseSpan * 0.65, step * 2);
  const maxExtension = Math.max(baseSpan * 1.6, step * 3);
  const candidateMin = baseMin - extension;
  const candidateMax = baseMax + extension;
  const nearbyStrikes = strikes.filter(
    (strike) => strike >= candidateMin && strike <= candidateMax
  );
  const strikeMin = nearbyStrikes.length ? nearbyStrikes[0] : baseMin;
  const strikeMax = nearbyStrikes.length ? nearbyStrikes[nearbyStrikes.length - 1] : baseMax;
  const minValue = Math.max(Math.min(baseMin, strikeMin), baseMin - maxExtension);
  const maxValue = Math.min(Math.max(baseMax, strikeMax), baseMax + maxExtension);

  return {
    ...autoscaleInfo,
    priceRange: {
      minValue,
      maxValue,
    },
    margins: {
      above: Math.max(autoscaleInfo.margins?.above || 0, 18),
      below: Math.max(autoscaleInfo.margins?.below || 0, 34),
    },
  };
}

function getProfileMaxMagnitude(points: ProfilePoint[], includeTotal: boolean) {
  const maxMagnitude = points.reduce((currentMax, point) => {
    const values = includeTotal ? [point.call, point.put, point.total] : [point.call, point.put];
    const rowMax = Math.max(...values.map((value) => Math.abs(value)));
    return Math.max(currentMax, rowMax);
  }, 0);

  return maxMagnitude > 0 ? maxMagnitude : 1;
}

function getMedianStrikeStep(strikes: number[]) {
  const gaps = strikes
    .slice(1)
    .map((strike, index) => Math.abs(strike - strikes[index]))
    .filter((gap) => gap > 0)
    .sort((a, b) => a - b);

  if (!gaps.length) {
    return null;
  }

  return gaps[Math.floor(gaps.length / 2)];
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

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value >= 1000 ? 2 : 4,
    minimumFractionDigits: value >= 1000 ? 2 : 0,
  }).format(value);
}

function formatSignedPrice(value: number) {
  const formatted = formatPrice(Math.abs(value));
  return value > 0 ? `+${formatted}` : value < 0 ? `-${formatted}` : formatted;
}

function formatSignedPercent(value: number) {
  const formatted = `${Math.abs(value).toFixed(2)}%`;
  return value > 0 ? `+${formatted}` : value < 0 ? `-${formatted}` : formatted;
}

function formatStrike(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
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

function getMetricShortLabel(metric: OptionsFlowMetric) {
  if (metric === 'minute_dealer_gex_1pct') {
    return '1m flow';
  }

  if (metric === 'baseline_oi_gex_1pct') {
    return 'Baseline GEX';
  }

  return 'Flow-adjusted GEX';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
