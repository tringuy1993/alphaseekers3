/* eslint-disable */
import { formatNumbers, datasets, commonOptions } from '../UtilECharts';

export function EChart0DTE_Opts(chartData) {
  // Setting dimensions and get 'dataset' for Echarts
  const SGdimensions = ['saved_datetime', 'uticker_last_price', 'otm_market_premium', 'atm_market_exp_move',];
  const dataset = datasets(chartData, [], SGdimensions, []);
  const legends = ['Last Price', 'OTM_Mark_Premium', 'Expected_Move'];
  const colors = ['#e01f54', '#0098d9', '#001852', '#e6b600'];
  // Creating Series that an array of length 4 (put, call, totalgamma, theogamma)
  const series = [
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      type: 'line',
      itemStyle: { color: colors[0] },
      name: legends[0],
    },
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 1,
      type: 'line',
      itemStyle: { color: colors[1] },
      name: legends[1],
    },
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 2,
      type: 'line',
      itemStyle: { color: colors[2] },
      name: legends[2],
    },
    
  ];

  const option = {
    title: [
      // {
      //   text: `${symbol} Sum: ${SumTotalGEX}`,
      //   left: "center",
      //   textStyle: { fontSize: 30 },
      // },
    ],
    ...commonOptions,
    tooltip: {
      ...commonOptions.tooltip,
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {},
    // grid: [{ left: 30, right: 30, bottom: 30 }],
    dataset,
    series,
    xAxis: [
      {
        xAxisIndex: 0,
        type: 'category',
        axisLabel: {
          frontWeight: 'bold',
          formatter: function (value) {
            const date = new Date(value);
            return `${date.getHours()}:${date.getMinutes()}`;
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        position: 'right',
        // name: 'OTM',
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0]
          }
        },
        axisLabel: {
          formatter: function (value) {
            return formatNumbers(value);
          },
          fontWeight: 'bold',
        },
        max: function (value) {
          return value.max;
        },
        min: function (value) {
          return value.min;
        },
      },
      {
        type: 'value',
        name: 'OTM',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: colors[1]
          }
        },
        axisLabel: {
          formatter: function (value) {
            return formatNumbers(value);
          },
          fontWeight: 'bold',
        },
        max: function (value) {
          return value.max;
        },
        min: function (value) {
          return value.min;
        },
      },
      {
        type: 'value',
        name: 'Exp',
        position: 'left',
        offset: 35,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2]
          }
        },
        axisLabel: {
          formatter: function (value) {
            return formatNumbers(value);
          },
          fontWeight: 'bold',
        },
        max: function (value) {
          return value.max;
        },
        min: function (value) {
          return value.min;
        },
      },
    ],
  };

  return option;
}
