'use client';

import ReactEcharts, { EChartsOption } from 'echarts-for-react';
import { useMantineColorScheme } from '@mantine/core';
import { registerAlphaSeekerThemes, getChartThemeName, CHART_COLORS } from '@/lib/chart-theme';

// Register both themes once at module level
registerAlphaSeekerThemes();

type EChartThemedProps = {
  option: EChartsOption;
  style?: React.CSSProperties;
  notMerge?: EChartsOption;
};

export const EChartThemed: React.FC<EChartThemedProps> = ({ option, style, ...props }) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <ReactEcharts
      option={option}
      style={{ minHeight: '400px', ...style }}
      theme={getChartThemeName(colorScheme)}
      {...props}
    />
  );
};

export { CHART_COLORS };
