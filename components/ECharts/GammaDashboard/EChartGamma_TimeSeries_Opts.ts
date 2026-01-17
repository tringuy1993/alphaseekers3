import { formatNumbers } from '../UtilECharts';

interface TimeSeriesDataPoint {
  saved_datetime: string;
  spot_price: number;
  call_gamma: number;
  put_gamma: number;
  total_gamma: number;
}

export function EChartGamma_TimeSeries_Opts(chartData: TimeSeriesDataPoint[]) {
  if (!chartData || chartData.length === 0) {
    return { title: { text: 'No data available', left: 'center' } };
  }

  const timestamps = chartData.map((d) => d.saved_datetime);
  const spotPrices = chartData.map((d) => d.spot_price);
  const totalGamma = chartData.map((d) => d.total_gamma);

  // Calculate spot price range for Y-axis zoom (+/- 5%)
  const minSpotPrice = spotPrices.length > 0 ? Math.min(...spotPrices) : 0;
  const maxSpotPrice = spotPrices.length > 0 ? Math.max(...spotPrices) : 100;
  const spotPriceMin = minSpotPrice * 0.995; // Tighter zoom for cleaner view
  const spotPriceMax = maxSpotPrice * 1.005;

  const colors = {
    total: '#ffd43b', // Yellow for total gamma (matches SpotGamma style)
    spot: '#74c0fc', // Light blue for spot price line
  };

  return {
    title: {
      text: 'Gamma Exposure & Spot Price',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any) => {
        const time = new Date(params[0].axisValue);
        const timeStr = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
        let result = `<strong>${timeStr}</strong><br/>`;
        params.forEach((param: any) => {
          const value =
            param.seriesName === 'Spot Price'
              ? param.value.toFixed(2)
              : formatNumbers(param.value);
          result += `${param.marker} ${param.seriesName}: ${value}<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ['Total Gamma', 'Spot Price'],
      top: 30,
    },
    grid: { left: 80, right: 80, bottom: 50, top: 70 },
    xAxis: {
      type: 'category',
      data: timestamps,
      axisLabel: {
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        },
        interval: Math.max(1, Math.floor(timestamps.length / 10)),
      },
      axisTick: { alignWithLabel: true },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Gamma',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => formatNumbers(value),
          color: colors.total,
        },
        axisLine: { lineStyle: { color: colors.total } },
        splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.3 } },
      },
      {
        type: 'value',
        name: 'Spot Price',
        position: 'right',
        min: spotPriceMin,
        max: spotPriceMax,
        axisLabel: {
          formatter: (value: number) => value.toFixed(0),
          color: colors.spot,
        },
        axisLine: { lineStyle: { color: colors.spot } },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Total Gamma',
        type: 'line',
        data: totalGamma,
        itemStyle: { color: colors.total },
        lineStyle: { width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 212, 59, 0.4)' },
              { offset: 1, color: 'rgba(255, 212, 59, 0.05)' },
            ],
          },
        },
        symbol: 'none',
        smooth: true,
      },
      {
        name: 'Spot Price',
        type: 'line',
        yAxisIndex: 1,
        data: spotPrices,
        itemStyle: { color: colors.spot },
        lineStyle: { width: 2 },
        symbol: 'none',
        smooth: true,
      },
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: 0 },
      { type: 'slider', xAxisIndex: 0, bottom: 5, height: 20 },
    ],
  };
}
