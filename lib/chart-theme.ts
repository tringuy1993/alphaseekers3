import * as echarts from 'echarts/core';
import { colors, lightColors, chartColors } from './design-tokens';

// Re-export chart colors for use in chart option files
export const CHART_COLORS = {
  // Series colors
  call: chartColors.call,
  put: chartColors.put,
  total: chartColors.total,
  theo: chartColors.theo,

  // Volume
  volumeCall: chartColors.volumeCall,
  volumePut: chartColors.volumePut,

  // Default series palette
  series: chartColors.series,

  // Heatmap
  heatmapDiverging: chartColors.heatmapDiverging,
  gammaHeatmap: chartColors.gammaHeatmap,
  volumePutHeatmap: chartColors.volumePutHeatmap,
  volumeCallHeatmap: chartColors.volumeCallHeatmap,

  // Mark lines
  spot: colors.mark.spot,
  open: colors.mark.open,
  close: colors.mark.close,

  // Financial
  positive: colors.positive,
  negative: colors.negative,

  // UI
  bg: colors.bg,
  text: colors.text,
  border: colors.border.default,
  amber: colors.amber,
  blue: colors.blue,
} as const;

let themesRegistered = false;

export function registerAlphaSeekerThemes() {
  if (themesRegistered) return;

  // Shared theme structure builder
  const buildTheme = (
    txt: { primary: string; secondary: string; muted: string },
    bg: { primary: string; secondary: string; tertiary: string },
    border: string
  ) => ({
    backgroundColor: 'transparent',

    color: CHART_COLORS.series,

    title: {
      textStyle: {
        color: txt.primary,
        fontWeight: 600,
        fontSize: 16,
      },
      subtextStyle: {
        color: txt.secondary,
      },
    },

    legend: {
      textStyle: {
        color: txt.primary,
        fontSize: 12,
      },
      inactiveColor: txt.muted,
    },

    tooltip: {
      backgroundColor: bg.secondary,
      borderColor: border,
      borderWidth: 1,
      textStyle: {
        color: txt.primary,
        fontSize: 12,
      },
      axisPointer: {
        lineStyle: {
          color: CHART_COLORS.blue,
          opacity: 0.5,
        },
        crossStyle: {
          color: CHART_COLORS.blue,
          opacity: 0.5,
        },
      },
    },

    categoryAxis: {
      axisLine: {
        lineStyle: { color: border },
      },
      axisTick: {
        lineStyle: { color: border },
      },
      axisLabel: {
        color: txt.secondary,
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: border,
          opacity: 0.5,
        },
      },
    },

    valueAxis: {
      axisLine: {
        lineStyle: { color: border },
      },
      axisTick: {
        lineStyle: { color: border },
      },
      axisLabel: {
        color: txt.secondary,
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: border,
          type: 'dashed',
          opacity: 0.4,
        },
      },
    },

    dataZoom: {
      backgroundColor: bg.primary,
      dataBackgroundColor: bg.tertiary,
      fillerColor: 'rgba(61, 125, 255, 0.1)',
      handleColor: CHART_COLORS.blue,
      handleSize: '100%',
      textStyle: {
        color: txt.secondary,
      },
      borderColor: border,
    },

    toolbox: {
      iconStyle: {
        borderColor: txt.secondary,
      },
      emphasis: {
        iconStyle: {
          borderColor: CHART_COLORS.blue,
        },
      },
    },

    visualMap: {
      textStyle: {
        color: txt.secondary,
      },
    },
  });

  echarts.registerTheme('alphaseeker-dark', buildTheme(colors.text, colors.bg, colors.border.default));
  echarts.registerTheme('alphaseeker-light', buildTheme(lightColors.text, lightColors.bg, lightColors.border.default));

  themesRegistered = true;
}

/** Returns the ECharts theme name for the current color scheme */
export function getChartThemeName(colorScheme: string): string {
  return colorScheme === 'light' ? 'alphaseeker-light' : 'alphaseeker-dark';
}
