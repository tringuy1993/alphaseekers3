import { formatNumbers, datasets, commonOptions } from "../UtilECharts";

export function EChart0DTE_Opts(chartData) {
  // Setting dimensions and get 'dataset' for Echarts
  const SGdimensions = [
    "saved_datetime",
    "otm_market_premium",
    "uticker_last_price",
    "uticker",
  ];
  const dataset = datasets(chartData, [], SGdimensions, []);
  const legends = ["OTM_Mark_Premium", "Last Price"];
  const colors = ["#e01f54", "#0098d9", "#001852", "#e6b600"];
  // Creating Series that an array of length 4 (put, call, totalgamma, theogamma)
  let series = [
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      type: "line",
      itemStyle: { color: colors[0] },
      name: legends[0],
    },
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 1,
      type: "line",
      itemStyle: { color: colors[1] },
      name: legends[1],
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
    legend: {},
    // grid: [{ left: 30, right: 30, bottom: 30 }],
    dataset: dataset,
    series: series,
    xAxis: [
      {
        xAxisIndex: 0,
        type: "category",
        axisLabel: {
          frontWeight: "bold",
          formatter: function (value) {
            const date = new Date(value);
            return `${date.getHours()}:${date.getMinutes()}`;
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: function (value) {
            return formatNumbers(value);
          },
          fontWeight: "bold",
        },
        max: function (value) {
          return value.max;
        },
        min: function (value) {
          return value.min;
        },
      },
      {
        type: "value",

        axisLabel: {
          formatter: function (value) {
            return formatNumbers(value);
          },
          fontWeight: "bold",
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
