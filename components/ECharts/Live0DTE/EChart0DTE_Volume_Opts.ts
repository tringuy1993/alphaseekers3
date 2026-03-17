/* eslint-disable */
import { formatNumbers, datasets, commonOptions, getMinMax } from '../UtilECharts';
import { CHART_COLORS } from '@/lib/chart-theme';

function findClosestIndex(array, target) {
  let closestIndex = 0; // Default to the first element if nothing else is closer
  let smallestDifference = Math.abs(array[0] - target); // Initialize with the difference of the first element

  array.forEach((value, index) => {
      const difference = Math.abs(value - target);
      if (difference < smallestDifference) {
          smallestDifference = difference;
          closestIndex = index;
      }
  });

  return closestIndex;
}
function roundToNearestMode(number, mode) {
  return Math.round(number / mode) * mode;
}
export function EChart0DTE_Volume_Opts(chartData) {
  // Setting dimensions and get 'dataset' for Echarts

  const quote_datetime = chartData.map(item => item.saved_datetime_ms)
  const last_price = chartData.map(item => item.uticker_last_price)


  const strikePrices = new Set();
  chartData.forEach(item => {
    item.data_details.forEach(detail =>{
      strikePrices.add(detail.strike_price)
    })
  })

  const uniqueStrikePrices = Array.from(strikePrices);

  // Doing some frequency count to get the correct rounding number for max and min value :)
  const differences_uniqueStrikePrices = uniqueStrikePrices.map((current, index, arr) => {
    return index === 0 ? undefined : current - arr[index - 1];
  });

  const frequency = {};
  differences_uniqueStrikePrices.forEach(difference => {
    if (frequency[difference]) {
      frequency[difference]++;
    } else {
      frequency[difference] = 1;
    }
  });

  let maxFrequency = 0;
  let mode = null;

  Object.entries(frequency).forEach(([value, count]) => {
    if (count > maxFrequency) {
      maxFrequency = count;
      mode = value;
    }
  });


  // Get the min and max value to plot
  const maxLastPrice = roundToNearestMode(Math.round(Math.max(...last_price)), mode)
  const minLastPrice = roundToNearestMode(Math.round(Math.min(...last_price) < maxLastPrice ? maxLastPrice - 5*Math.sqrt(maxLastPrice) : Math.min(...last_price)), mode)

  const closestIndexToMax = findClosestIndex(uniqueStrikePrices, maxLastPrice);
  const closestIndexToMin = findClosestIndex(uniqueStrikePrices, minLastPrice);


  // Extracting all 'data' arrays
  const putHeatMapData = chartData.reduce((acc, entry) => {
    const dataFromEntry = entry.data_details
      .filter(detail => detail.put_call === false)  // Filter for `put_call` being false
      .map(detail => detail.data);  // Extract the `data` array
  
    return acc.concat(dataFromEntry);  // Concatenate the resulting data arrays to the accumulator
  }, []);

  const callHeatMapData = chartData.reduce((acc, entry) => {
    const dataFromEntry = entry.data_details
      .filter(detail => detail.put_call === true)  // Filter for `put_call` being false
      .map(detail => detail.data);  // Extract the `data` array
  
    return acc.concat(dataFromEntry);  // Concatenate the resulting data arrays to the accumulator
  }, []);


  const putData = putHeatMapData.map(function(item){
    return [item[1], item[0], item[2] || '-']
  })

  const callData = callHeatMapData.map(function(item){
    return [item[1], item[0], item[2] || '-']
  })

  const option = {
    tooltip: {
      axisPointer: {
        type: 'cross'
      },
      position: 'top',
      formatter: function (params) {
        // `params` is an object containing all the data related to the hovered item

        return `Datetime: ${params.name}<br/>
                Data Point: ${params.value[2]} (${params.seriesName})`;
      }
    },
    dataZoom:{
      id: 'dataZoomX',
      type: 'slider',
      yAxisIndex: [0],
      startValue: closestIndexToMin,
      endValue: closestIndexToMax,
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: [
      {
        type: 'category',
        data: quote_datetime,
        splitArea: {
          show: true
        },
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
      yAxisIndex:0,
      type: 'category',
      position: 'left',
      data: uniqueStrikePrices,
      scale:true,
      splitArea: {
          show: true
        },
      },
      {
        type:'value',
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: CHART_COLORS.call
          }
        },
        axisLabel: {
          formatter: function (value) {
            return formatNumbers(value);
          },
          fontWeight: 'bold',
        },
        max: maxLastPrice+2*mode,
        min: minLastPrice
      }
    ],
    visualMap: [
      {
        name: 'Put',
        seriesIndex:0,
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: CHART_COLORS.volumePutHeatmap,
        },
        zlevel: 100,
        z: 100,
        
      },
      {
        name: 'Call',
        seriesIndex:1,
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        inRange: {
          color: CHART_COLORS.volumeCallHeatmap,
        },
        zlevel: 100,
        z: 100,
      }
    ],
    series: [
      {
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: 'Put Volume',
        type: 'heatmap',
        data: putData,

        emphasis: {
          itemStyle: {
            // shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth:1

          }
        },
        progressive: 1000,
        animation: true
      },
      {
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: 'Call Volume',
        type: 'heatmap',
        data: callData,

        emphasis: {
          itemStyle: {
            // shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth:1

          }
        },
        progressive: 1000,
        animation: true
      },
      
      {
        type: 'line',
        data: last_price,
        lineStyle: {
          color: CHART_COLORS.call
        },
        xAxisIndex:0,
        yAxisIndex:1,
      }
    ]
  };

  return option;
}
