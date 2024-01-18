import { SecondToDate, formatNumbers } from "../UtilECharts";

export const transformArray = (
  chartData,
  strikePrice,
  expDateStr,
  columnvalue,
) => {
  const result = [];

  for (const element of chartData) {
    const obj = { [strikePrice]: element[strikePrice] };
    obj[element[expDateStr]] = element[columnvalue];
    result.push(obj);
  }

  return result;
};

function filterArray(chartData, key, value) {
  return chartData.filter((element) => element[key] === value);
}
function makeGrid(unique, chartHeight) {
  // const percentHeight = 100 / unique.length;
  const testHeight = [];

  let top = 300 * unique.length;
  let bottom = 30;
  for (let i = 0; i < unique.length; i++) {
    testHeight.push({
      top: `${top - 270}`,
      bottom: `${bottom}`,
      left: 50,
      right: 10,
    });
    top -= 300;
    bottom += 300;
  }

  return testHeight;
}
export const EChartTime_Opts = (chartData) => {
  // get unique dates

  const uni = [...new Set(chartData.map((e) => e.exp_date_str))]
    .sort((a, b) => a - b)
    .reverse();
  // sort X-axis data so that it will plot in order.

  const sortedData = chartData.sort((a, b) => a.strike_price - b.strike_price);

  // Setting echarts options
  const chartHeight = `${uni.length * 300}px`;
  const gridLayout = makeGrid(uni, chartHeight);
  const xArrayMapped = [
    "strike_price",
    "c_notion_expo",
    "p_notion_expo",
    "total_notional_exposure",
  ];
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "transparent",
      hideDelay: 1500,
      confine: true,
      axisPointer: {
        type: "cross",
      },
    },
    legend: {},
    notMerge: true,
    dataset: [],
    series: [],
    xAxis: [],
    yAxis: [],
    grid: gridLayout,
  };

  const colors = ["#e01f54", "#0098d9", "#001852"];

  for (let i = 0; i < uni.length; i++) {
    option.dataset.push({
      dimensions: xArrayMapped,
      source: filterArray(sortedData, "exp_date_str", uni[i]),
    });
    for (let j = 0; j < 3; j++) {
      option.series.push({
        type: "bar",
        barGap: "-100%",
        datasetIndex: i,
        color: colors[j],
        barWidth: 5,
        xAxisIndex: i,
        yAxisIndex: i,
      });
    }
    option.xAxis.push({
      type: "category",
      gridIndex: i,
    });
    option.yAxis.push({
      type: "value",
      gridIndex: i,
      name: SecondToDate(uni[i]),
      nameTextStyle: { fontWeight: "bold" },
      axisLabel: {
        formatter: function (value) {
          return formatNumbers(value);
        },
      },
    });
  }
  // console.log("options", option)
  return { option: option, chartHeight: chartHeight };
};
