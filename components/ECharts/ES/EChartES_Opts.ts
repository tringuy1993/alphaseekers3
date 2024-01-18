import { formatNumbers, datasets, commonOptions } from "../UtilECharts";

export function EChartES_Opts(symbol, chartData) {
  // Setting dimensions and get 'dataset' for Echarts
  const SGdimensions = [
    "strike",
    "c_notion_expo",
    "p_notion_expo",
    "total_notional_exposure",
  ];
  const dataset = datasets(chartData, [], SGdimensions, []);
  const legends = ["$Call", "$Put", "$Total"];
  const colors = ["#e01f54", "#0098d9", "#001852", "#e6b600"];
  // Creating Series that an array of length 4 (put, call, totalgamma, theogamma)
  let series = [
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      type: "bar",
      barGap: "-100%",
      itemStyle: { color: colors[0] },
      name: legends[0],
    },
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      type: "bar",
      barGap: "-100%",
      itemStyle: { color: colors[1] },
      name: legends[1],
    },
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      type: "bar",
      barGap: "-100%",
      itemStyle: { color: colors[2] },
      name: legends[2],
    },
  ];

  // Creating Option for the chart.
  const SumTotalGEX = formatNumbers(
    chartData.reduce((acc, option) => acc + option.total_notional_exposure, 0)
  );
  // const SumTotalGEX = "4000";

  const option = {
    title: [
      {
        text: `${symbol} Sum: ${SumTotalGEX}`,
        left: "center",
        textStyle: { fontSize: 30 },
      },
    ],
    ...commonOptions,
    grid: [{ left: 30, right: 30, bottom: 30 }],
    dataset: dataset,
    series: series,
    xAxis: [
      {
        xAxisIndex: 0,
        type: "category",
        axisLabel: {
          frontWeight: "bold",
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
          rotate: 90,
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

export const ECOpts_ES_VolOI = (symbol, chartData) => {
  // Setting dimensions and get 'dataset' for Echarts
  const dimensions = [
    "strike",
    "c_openinterest",
    "p_openinterest",
    "c_totalvolume",
    "p_totalvolume",
  ];
  const dataset = datasets(chartData, [], dimensions, []);

  const patterns = ["none", "none", "rect", "rect"];
  const legends = ["COI", "POI", "CVolume", "PVolume"];
  // const colors = ["#Ff0d00", "#0066ff", "#Ff3400", "#0052ff"];
  const colors = ["#e01f54", "#0098d9", "#e01f54", "#0098d9"];

  // Creating Series that an array of length 4 (put, call, totalgamma, theogamma)
  let series = [
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      type: "bar",
      barGap: "-100%",
      name: legends[0],
      itemStyle: { color: colors[0] },
    },
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      type: "bar",
      barGap: "-100%",
      color: "blue",
      name: legends[1],
      itemStyle: { color: colors[1] },
    },
    {
      datasetIndex: 0,
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: "bar",
      barGap: "-100%",
      // color: "red",
      name: legends[2],
      itemStyle: {
        color: colors[2],
        decal: { symbol: patterns[2] },
      },
    },
    {
      datasetIndex: 0,
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: "bar",
      barGap: "-100%",
      // color: "blue",
      name: legends[3],
      itemStyle: {
        color: colors[3],
        decal: { symbol: patterns[3] },
      },
    },
  ];

  // Creating Option for the chart.
  const option = {
    ...commonOptions,
    grid: [
      { left: 30, right: 20, bottom: "45%" },
      { left: 30, right: 20, top: "60%", bottom: "5%" },
    ],
    dataZoom: {
      id: "dataZoomX",
      type: "slider",
      xAxisIndex: [0, 1],
    },
    dataset: dataset,
    series: series,
    xAxis: [
      {
        // xAxisIndex: 0,
        type: "category",
        axisLabel: {
          frontWeight: "bold",
        },
      },
      {
        gridIndex: 1,
        // xAxisIndex: 1,
        type: "category",
        axisLabel: {
          frontWeight: "bold",
        },
        show: false,
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
          rotate: 90,
        },
        max: function (value) {
          return value.max;
        },
        min: function (value) {
          return value.min;
        },
      },
      {
        gridIndex: 1,
        // yAxisIndex: 1,
        type: "value",
        axisLabel: {
          formatter: function (value) {
            return formatNumbers(value);
          },
          fontWeight: "bold",
          rotate: 90,
        },
        max: function (value) {
          return value.max;
        },
        min: function (value) {
          return value.min;
        },
        splitLine: {
          lineStyle: { type: "dashed" },
        },
      },
    ],
  };

  return option;
};
