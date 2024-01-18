import {
  filterByProperty,
  findClosestIndex,
  formatNumbers,
  getMinMax,
  datasets,
  createXMarkLineData,
  commonOptions,
} from "../UtilECharts";

export const EChartToS_Opts = (symbol, chartData, theoData) => {
  // Setting dimensions and get 'dataset' for Echarts
  const SGdimensions = [
    "strike_price",
    "c_notion_expo",
    "p_notion_expo",
    "total_notional_exposure",
  ];
  const Theodimensions = ["strike_price", "total_gamma"];
  const dataset = datasets(chartData, theoData, SGdimensions, Theodimensions);

  // Getting close and open price from chartData (GEX Data)
  const closestLastIndex2 = {
    price_name: chartData[0]?.last_price,
    index: findClosestIndex(chartData, chartData[0]?.last_price),
  };
  const closestOpenIndex2 = {
    price_name: chartData[0]?.open_price,
    index: findClosestIndex(chartData, chartData[0]?.open_price),
  };

  const legends = ["$Call", "$Put", "$Total", "$TheoGamma"];
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

  // Adding line to xAxisIndex for Call
  series[0]["markLine"] = {
    symbol: ["none", "none"],
    silent: false,
    data: [
      createXMarkLineData("x", closestLastIndex2, "green", "green", "start"),
      createXMarkLineData("x", closestOpenIndex2, "red", "red", "start"),
    ],
  };

  // Creating Option for the chart.
  const SumTotalGEX = formatNumbers(
    chartData.reduce((acc, option) => acc + option.total_notional_exposure, 0)
  );

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
      {
        //Theo Gamma Line
        xAxisIndex: 1,
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
        //Theo Gamma Line
        yAxisIndex: 1,
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

  if (theoData?.length !== 0 && chartData?.length !== 0) {
    series.push({
      datasetIndex: 1,
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: "line",
      showSymbol: false,
      color: colors[3],
      name: legends[3],
    });

    // Getting Data for Zoom on TheoData
    const minMax = getMinMax(chartData, "strike_price");
    const minMaxIndexTheo = filterByProperty(
      theoData,
      "strike_price",
      "index",
      minMax
    );

    option["dataZoom"] = {
      id: "dataZoomX",
      type: "slider",
      xAxisIndex: [1],
      startValue: minMaxIndexTheo[0],
      endValue: minMaxIndexTheo[1],
    };
  }

  return option;
};

export function EChartToS_Theo_Opts(symbol, chartData, greek) {
  // Setting dimensions and get 'dataset' for Echarts
  const SGdimensions = ["spot_price", `total_${greek}`];
  // const dataset = datasets(chartData, [], SGdimensions, []);
  const dataset = {
    dimensions: SGdimensions,
    source: chartData,
  };
  const legends = ["TheoVanna", "$Put"];
  const colors = ["#e01f54", "#0098d9"];
  // Creating Series that an array of length 4 (put, call, totalgamma, theogamma)

  let series = [
    {
      datasetIndex: 0,
      xAxisIndex: 0,
      type: "line",
      barGap: "-100%",
      itemStyle: { color: colors[0] },
      name: legends[0],
      // markPoint: {
      //   data: [
      //     {
      //       // xAxis: 300,
      //       // x: 430,
      //     },
      //     { coord: [5000, 50000000] },
      //   ],
      // },
    },
  ];

  // Creating Option for the chart.

  const option = {
    title: [
      {
        text: ` ${symbol} ${greek} `,
        left: "center",
        textStyle: { fontSize: 30 },
      },
    ],
    ...commonOptions,
    dataZoom: {
      yAxisIndex: false,
      xAxisIndex: [0, 0],
    },
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
