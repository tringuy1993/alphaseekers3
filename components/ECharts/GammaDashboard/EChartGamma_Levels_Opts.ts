import { formatNumbers } from '../UtilECharts';

interface LevelsDataPoint {
  strike_price: number;
  spot_price: number;
  call_gamma: number;
  put_gamma: number;
  total_gamma: number;
  call_oi: number;
  put_oi: number;
}

export function EChartGamma_Levels_Opts(chartData: LevelsDataPoint[]) {
  if (!chartData || chartData.length === 0) {
    return { title: { text: 'No data available', left: 'center' } };
  }

  const spotPrice = chartData[0]?.spot_price || 0;

  // Filter to +/- 5% of spot price
  const minStrike = spotPrice * 0.95;
  const maxStrike = spotPrice * 1.05;
  const filteredData = chartData.filter(
    (d) => d.strike_price >= minStrike && d.strike_price <= maxStrike
  );

  if (filteredData.length === 0) {
    return { title: { text: 'No strikes in range', left: 'center' } };
  }

  // Strikes on Y-axis (horizontal bar chart)
  const strikes = filteredData.map((d) => d.strike_price);
  const callGamma = filteredData.map((d) => d.call_gamma);
  const putGamma = filteredData.map((d) => -Math.abs(d.put_gamma)); // Negative for left-side bars

  // Find spot price index for markLine
  const spotIndex = strikes.findIndex((s) => s >= spotPrice);

  return {
    title: {
      text: 'Gamma Levels by Strike',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const strike = params[0].axisValue;
        let result = `<strong>Strike: ${strike}</strong><br/>`;
        params.forEach((param: any) => {
          const value = Math.abs(param.value);
          result += `${param.marker} ${param.seriesName}: ${formatNumbers(value)}<br/>`;
        });
        return result;
      },
    },
    legend: { data: ['Call Gamma', 'Put Gamma'], top: 30 },
    grid: { left: 100, right: 50, bottom: 40, top: 70 },
    xAxis: {
      type: 'value',
      name: 'Gamma Exposure',
      axisLabel: { formatter: (value: number) => formatNumbers(Math.abs(value)) },
      splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.3 } },
    },
    yAxis: {
      type: 'category',
      data: strikes.map((s) => s.toFixed(0)), // Pre-format strikes as strings
      inverse: true, // Higher strikes at top
    },
    series: [
      {
        name: 'Call Gamma',
        type: 'bar',
        stack: 'gamma',
        data: callGamma,
        itemStyle: { color: '#4dabf7' }, // Light blue for calls
        barWidth: '70%',
        label: { show: false },
      },
      {
        name: 'Put Gamma',
        type: 'bar',
        stack: 'gamma',
        data: putGamma,
        itemStyle: { color: '#ffa94d' }, // Orange for puts
        barWidth: '70%',
        label: { show: false },
        markLine:
          spotIndex >= 0
            ? {
                silent: true,
                symbol: 'none',
                lineStyle: { color: '#ffd43b', width: 2, type: 'solid' },
                data: [{ yAxis: spotIndex }],
                label: {
                  formatter: `${spotPrice.toFixed(2)}`,
                  position: 'insideEndTop',
                  color: '#ffd43b',
                  fontSize: 12,
                  fontWeight: 'bold',
                },
              }
            : undefined,
      },
    ],
    dataZoom: [
      { type: 'inside', yAxisIndex: 0 },
      { type: 'slider', yAxisIndex: 0, right: 10, width: 15 },
    ],
  };
}
