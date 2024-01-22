import { useMantineColorScheme } from '@mantine/core';

import ReactEcharts, { EChartsOption } from 'echarts-for-react';

type EChartThemedProps = {
  option: EChartsOption;
  style?: React.CSSProperties;
  notMerge?: EChartsOption;
  // Add other prop types as needed
};
export const EChartThemed: React.FC<EChartThemedProps> = ({ option, style, ...props }) => {
  const { colorScheme } = useMantineColorScheme();

  return <ReactEcharts option={option} style={style} theme={colorScheme} {...props} />;
};
