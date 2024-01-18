import { useEffect, useState } from "react";
import { createMarkLine, formatNumbers } from "../UtilECharts";
import { YF_URL } from "@/app/api/apiURLs";
import useAxiosPrivate from "@/app/api/useAxiosPrivate";
import { EChartThemed } from "../EChartThemed";
import { EChartsOption } from "echarts-for-react";

type EchartCandlesProps = {
  symbol: string;
};
const EchartCandles: React.FC<EchartCandlesProps> = ({ symbol }) => {
  const [chartOptions, setChartOptions] = useState([]);

  const params = {
    und_symbol: symbol,
  };

  const axiosPrivate = useAxiosPrivate();
  const fetchData = async () => {
    try {
      let response = await axiosPrivate.get(YF_URL, { params: params });
      let modifiedData = response?.data;
      const Close = modifiedData.data[modifiedData.data.length - 1][1];
      const markValue2 = { index: Close, price_name: Close };
      const markLine = createMarkLine(
        false,
        "none",
        "y",
        markValue2,
        "green",
        "green",
        "end"
      );
      const downColor = "#ec0000";
      const upColor = "#00da3c";
      if (symbol === "^GSPC") {
        symbol = "SPX";
      }
      const option: EChartsOption = {
        title: [
          {
            text: `${symbol}`,
            left: "center",
            textStyle: { fontSize: 30 },
          },
        ],
        grid: [{ left: 20 }],
        dataset: {
          source: modifiedData["data"],
        },
        series: {
          type: "candlestick",
          dimensions: ["Date", ...modifiedData["column_names"]],
          ...markLine,
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "transparent",
          hideDelay: 1500,
          confine: true,
          axisPointer: {
            type: "cross",
          },
          valueFormatter: function (value: string) {
            return formatNumbers(value);
          },
          position: function (pos, params, el, elRect, size) {
            var obj = { top: 50 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = -50;
            return obj;
          },
        },
        xAxis: [
          {
            type: "time",
            // data: test.categoryData,
            boundaryGap: false,
            axisLine: { onZero: false },
            // splitLine: { show: true },
            splitLine: { show: false },
            splitArea: { show: true },
            min: "dataMin",
            max: "dataMax",
            axisLabel: {
              frontWeight: "bold",
              formatter: function (value: string) {
                var date = new Date(value);
                return date.toISOString().substring(0, 10);
              },
            },
          },
        ],
        yAxis: [
          {
            scale: true,
            z: 0,
            axisLabel: {
              frontWeight: "bold",
              // color: "black",
            },
            position: "right",
          },
        ],
        dataZoom: [
          {
            show: true,
            type: "slider",
            // bottom: 60,
            start: 99,
            end: 100,
            minValueSpan: 10,
          },
        ],
        visualMap: {
          show: false,
          seriesIndex: 1,
          dimension: 6,
          pieces: [
            {
              value: 1,
              color: upColor,
            },
            {
              value: -1,
              color: downColor,
            },
          ],
        },
      };

      setChartOptions(option);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [symbol]);

  return (
    <>
      {" "}
      {Object.keys(chartOptions).length && (
        <EChartThemed
          option={chartOptions}
          style={{ width: "100%", height: "65vh" }}
        />
      )}
    </>
  );
};

export default EchartCandles;
