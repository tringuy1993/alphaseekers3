import { formatNumbers } from '../UtilECharts';
import { CHART_COLORS } from '@/lib/chart-theme';

interface HeatmapDataPoint {
  saved_datetime: string;
  strike_price: number;
  spot_price: number;
  total_gamma: number;
}

export function EChartGamma_Heatmap_Opts(chartData: HeatmapDataPoint[]) {
  if (!chartData || chartData.length === 0) {
    return { title: { text: 'No data available', left: 'center' } };
  }

  // Get spot price range for filtering
  const spotPrices = chartData.map((d) => d.spot_price);
  const minSpotPrice = spotPrices.length > 0 ? Math.min(...spotPrices) : 0;
  const maxSpotPrice = spotPrices.length > 0 ? Math.max(...spotPrices) : 100;

  // Filter strikes to +/- 5% of spot price range
  const minStrike = minSpotPrice * 0.95;
  const maxStrike = maxSpotPrice * 1.05;

  // Filter data to only include strikes within range
  const filteredData = chartData.filter(
    (d) => d.strike_price >= minStrike && d.strike_price <= maxStrike
  );

  if (filteredData.length === 0) {
    return { title: { text: 'No strikes in range', left: 'center' } };
  }

  // Extract unique timestamps and strikes from filtered data
  const timestamps = Array.from(new Set(filteredData.map((d) => d.saved_datetime))).sort();
  const strikes = Array.from(new Set(filteredData.map((d) => d.strike_price))).sort(
    (a, b) => a - b
  );

  if (timestamps.length === 0 || strikes.length === 0) {
    return { title: { text: 'Insufficient data for heatmap', left: 'center' } };
  }

  const currentSpotPrice = spotPrices[spotPrices.length - 1] || 0;

  // Create data matrix for heatmap [timeIndex, strikeIndex, value]
  const heatmapData: [number, number, number][] = [];
  const gammaMap = new Map<string, number>();

  filteredData.forEach((d) => {
    const key = `${d.saved_datetime}-${d.strike_price}`;
    gammaMap.set(key, d.total_gamma);
  });

  timestamps.forEach((time, timeIdx) => {
    strikes.forEach((strike, strikeIdx) => {
      const key = `${time}-${strike}`;
      const gamma = gammaMap.get(key) || 0;
      heatmapData.push([timeIdx, strikeIdx, gamma]);
    });
  });

  // Calculate min/max for color scale
  const gammaValues = heatmapData.map((d) => d[2]).filter((v) => v !== 0);
  let maxAbs = 1;
  if (gammaValues.length > 0) {
    const minGamma = Math.min(...gammaValues);
    const maxGamma = Math.max(...gammaValues);
    maxAbs = Math.max(Math.abs(minGamma), Math.abs(maxGamma)) || 1;
  }

  // Find current spot price index for markLine
  const spotIndex = strikes.findIndex((s) => s >= currentSpotPrice);

  return {
    title: {
      text: 'Gamma Heatmap',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const time = new Date(timestamps[params.data[0]]);
        const timeStr = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
        return `Time: ${timeStr}<br/>Strike: ${strikes[params.data[1]]}<br/>Gamma: ${formatNumbers(params.data[2])}`;
      },
    },
    grid: { left: 70, right: 90, bottom: 60, top: 50 },
    xAxis: {
      type: 'category',
      data: timestamps,
      splitArea: { show: false },
      axisLabel: {
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        },
        interval: Math.max(1, Math.floor(timestamps.length / 8)),
        rotate: 0,
      },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: 'category',
      data: strikes.map((s) => s.toFixed(0)), // Pre-format strikes
      splitArea: { show: false },
      inverse: false, // Lower strikes at bottom
    },
    visualMap: {
      min: -maxAbs,
      max: maxAbs,
      calculable: true,
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemHeight: 200,
      inRange: {
        color: CHART_COLORS.gammaHeatmap,
      },
    },
    series: [
      {
        name: 'Gamma',
        type: 'heatmap',
        data: heatmapData,
        label: { show: false },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
        markLine:
          spotIndex >= 0
            ? {
                silent: true,
                symbol: 'none',
                lineStyle: { color: CHART_COLORS.spot, width: 2, type: 'solid' },
                data: [{ yAxis: spotIndex }],
                label: {
                  formatter: `Spot: ${currentSpotPrice.toFixed(0)}`,
                  position: 'end',
                  color: CHART_COLORS.spot,
                  fontWeight: 'bold',
                },
              }
            : undefined,
      },
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: 0 },
      { type: 'slider', xAxisIndex: 0, bottom: 10, height: 20 },
    ],
  };
}
