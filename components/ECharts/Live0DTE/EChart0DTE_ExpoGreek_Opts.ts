/* eslint-disable */
import { formatNumbers, datasets, commonOptions } from '../UtilECharts';

export function EChart0DTE_ExpoGreek_Opts(chartData, greek) {
  // Setting dimensions and get 'dataset' for Echarts
  const SGdimensions = ['saved_datetime', 'total_notional_exposure', 'c_notional_exposure', 'p_notional_exposure',];
  const dataset = datasets(chartData, [], SGdimensions, []);
  const legends = ['Total Notional', 'C_Notional', 'P_Notional'];
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
      yAxisIndex: 1,
      type: 'line',
      itemStyle: { color: colors[2] },
      name: legends[2],
    },
    
  ];

  const option = {
    title: [
      {
        text: `${greek}`,
        left: "center",
        textStyle: { fontSize: 30 },
      },
    ],
    ...commonOptions,
    legend: {align: 'right', right: '10%'},
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
        position: 'left',
        axisLine: {
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
        position: 'left',
        axisLine: {
          show: true,
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
