import {
  findClosestIndex,
  formatNumbers,
  datasets,
  createXMarkLineData,
  commonOptions,
} from "./UtilECharts";

export const EChart_Opts_VolOI = (symbol, chartData) => {
  // Setting dimensions and get 'dataset' for Echarts
  const dimensions = [
    "strike_price",
    "c_openinterest",
    "p_openinterest",
    "c_totalvolume",
    "p_totalvolume",
  ];
  const dataset = datasets(chartData, [], dimensions, []);

  // Getting close and open price from chartData (GEX Data)
  const closestLastIndex2 = {
    price_name: chartData[0]["last_price"],
    index: findClosestIndex(chartData, chartData[0]["last_price"]),
  };
  const closestOpenIndex2 = {
    price_name: chartData[0]["open_price"],
    index: findClosestIndex(chartData, chartData[0]["open_price"]),
  };

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

  // Adding last_price and open_price to OpenInterest Data
  series[0]["markLine"] = {
    symbol: ["none", "none"],
    silent: false,
    data: [
      createXMarkLineData("x", closestLastIndex2, "green", "green", "start"),
      createXMarkLineData("x", closestOpenIndex2, "red", "red", "start"),
    ],
  };

  // Adding last_price and open_price to Volume Data
  series[2]["markLine"] = {
    symbol: ["none", "none"],
    silent: false,
    data: [
      createXMarkLineData("x", closestLastIndex2, "green", "green", "start"),
      createXMarkLineData("x", closestOpenIndex2, "red", "red", "start"),
    ],
  };

  // Remove Volume Data Label:
  series[2]["markLine"]["data"][0]["label"]["show"] = false;
  series[2]["markLine"]["data"][1]["label"]["show"] = false;

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
