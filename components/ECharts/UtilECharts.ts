import { GetAllModifiedToSData, GetModifiedToSData } from "./DataEChart";

export function modify_data(data, greek) {
  const modified_data = data?.map((data) => GetModifiedToSData(data, greek));
  // Need index in data
  for (let i = 0; i < modified_data?.length; i++) {
    modified_data[i].index = i;
  }

  const nonzero_data = modified_data?.filter(function (obj) {
    return obj.c_notion_expo !== 0 && obj.p_notion_expo !== 0;
  });

  return { modified_data: modified_data, nonzero_data: nonzero_data };
}

export function modify_time_data(data, greek) {
  if (data[0].hasOwnProperty("c_notion_expo")) {
    // Need index in data

    return { modified_data: data, nonzero_data: data };
  }
  const modified_data = data?.map((data) => GetAllModifiedToSData(data, greek));
  // Need index in data
  for (let i = 0; i < modified_data.length; i++) {
    modified_data[i].index = i;
  }

  const nonzero_data = modified_data?.filter(function (obj) {
    return obj.c_notion_expo !== 0 && obj.p_notion_expo !== 0;
  });

  return { modified_data: modified_data, nonzero_data: nonzero_data };
}

export const datasets = (chartData, theoData, xMapped, xMapped2) => [
  {
    dimensions: [...xMapped],
    source: chartData,
  },
  {
    dimensions: [...xMapped2],
    source: theoData,
  },
];

export const create_series = (
  xAxisIndex,
  yAxisIndex,
  lineStyle,
  type,
  legend,
  color,
  showSymbol,
) => {
  return {
    xAxisIndex: xAxisIndex,
    yAxisIndex: yAxisIndex,
    lineStyle: { type: lineStyle },
    type: type,
    name: legend,
    itemStyle: { color: color },
    showSymbol: showSymbol,
    // smooth: true,
  };
};

export const createMarkLine = (
  silent,
  symbol,
  axis,
  data,
  colorLine,
  colorBackground,
  position,
) => {
  return {
    markLine: {
      silent: silent,
      symbol: symbol,
      data: [
        {
          [`${axis}Axis`]: data.index,
          name: `${data.price_name}`,
          lineStyle: {
            color: colorLine,
            width: 2,
          },
          label: {
            padding: 5,
            borderRadius: 5,
            color: "white",
            position: position,
            formatter: function (param) {
              return param.name;
            },
            backgroundColor: colorBackground,
          },
        },
      ],
    },
  };
};

export const createMarkLineGEX = (
  silent,
  symbol,
  axis,
  data,
  colorLine,
  colorBackground,
  position,
) => {
  return {
    markLine: {
      silent: silent,
      symbol: symbol,
      data: [
        {
          [`${axis}Axis`]: data.index,
          name: `${formatNumbers(data.price_name)}`,
          lineStyle: {
            color: colorLine,
            width: 2,
          },
          label: {
            padding: 5,
            borderRadius: 5,
            color: "white",
            position: position,
            formatter: function (param) {
              return param.name;
            },
            backgroundColor: colorBackground,
          },
        },
      ],
    },
  };
};

export const createXMarkLineData = (
  axis,
  data,
  colorLine,
  colorBackground,
  position,
) => {
  return {
    [`${axis}Axis`]: data?.index,
    name: `${data?.price_name?.toFixed(1)}`,
    lineStyle: {
      color: colorLine,
      width: 2,
    },
    label: {
      padding: 5,
      borderRadius: 5,
      color: "white",
      position: position,
      formatter: function (param) {
        return param.name;
      },
      backgroundColor: colorBackground,
    },
  };
};

export const markValue = (value, current_data) => {
  return {
    index: current_data[`${value}`],
    price_name: current_data[`${value}`],
  };
};

export const convertToKeyArray = (array) => {
  return array.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr[key]);
    });
    return acc;
  }, {});
};

export const commonOptions = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "transparent",
    hideDelay: 1500,
    confine: true,
    axisPointer: {
      type: "line",
      snap: true,
    },
    valueFormatter: function (value) {
      return formatNumbers(value);
    },
    position: function (pos, params, el, elRect, size) {
      var obj = { top: 10 };
      obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
      return obj;
    },
  },
  axisPointer: {
    link: { xAxisIndex: "all" },
    label: { backgroundColor: "#777" },
  },
  backgroundColor: "transparent",
  legend: { left: 50, bottom: 65 },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: false,
        xAxisIndex: [0, 1],
      },
      brush: {
        type: ["lineX", "clear"],
      },
    },
  },
  animationEasing: "elasticOut",
};

export function formatNumbers(value) {
  if (value >= 1000000000 || value <= -1000000000) {
    return parseFloat(value / 1e9).toFixed(1) + "B";
  } else if (value >= 1000000 || value <= -1000000) {
    return parseFloat(value / 1e6).toFixed(1) + "M";
  } else if (value >= 10000 || value <= -10000) {
    return parseFloat(value / 1e3).toFixed(1) + "K";
  } else if (value >= 1000 || value <= -1000) {
    return parseFloat(value).toFixed(1);
  }
  return value;
}

export function SecondToDate(msTime) {
  var date = new Date(msTime).toLocaleDateString();
  return date;
}

export function tradeHour() {
  const moment = require("moment-timezone");
  const nowtime = new Date();
  const now = nowtime.toISOString();
  const is_Weekday = nowtime.getDay() % 6 !== 0;
  if (is_Weekday) {
    const openTime = moment(now)
      .tz("America/New_York")
      .set({ hour: 9, minute: 0 });
    const closeTime = moment(now)
      .tz("America/New_York")
      .set({ hour: 16, minute: 10 });
    const currentTime = moment(now).tz("America/New_York");

    return currentTime.isBetween(openTime, closeTime);
  } else {
    return false;
  }
}

// Import the echarts core module, which provides the necessary interfaces for using echarts.
export function filterByProperty(data, propertyName, extractProperty, range) {
  const dataFilter = data?.filter(
    (obj) =>
      obj.hasOwnProperty(propertyName) &&
      obj[propertyName] >= range.min &&
      obj[propertyName] <= range.max,
  );

  const test = [
    dataFilter[0][`${extractProperty}`],
    dataFilter[dataFilter?.length - 1][`${extractProperty}`],
  ];
  return test;
}

export function getMinMax(data, propertyName) {
  return data.reduce(
    (acc, obj) => {
      if (obj.hasOwnProperty(propertyName)) {
        if (obj[propertyName] < acc.min) {
          acc.min = obj[propertyName];
        }
        if (obj[propertyName] > acc.max) {
          acc.max = obj[propertyName];
        }
      }
      return acc;
    },
    { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
  );
}

export function findObjectWithKey(data, key, value, iproperty) {
  return data?.find((obj) => obj[key] === value)[`${iproperty}`];
}

export function filterArray(chartData, key, value) {
  return chartData?.filter((element) => element[key] === value);
}

export function findClosestIndex(arr, value) {
  return arr.reduce((closestIndex, current, index) => {
    let currentDiff = Math.abs(current.strike_price - value);
    let closestDiff = Math.abs(arr[closestIndex].strike_price - value);
    return currentDiff < closestDiff ? index : closestIndex;
  }, 0);
}
