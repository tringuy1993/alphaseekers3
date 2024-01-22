import { Card } from '@mantine/core';
import EChartToS_Theo_Comp from '@/components/ECharts/ToS/EChartToS_Theo';

export const ToS_Theo_Chart = ({ params }) => {
  const tickers = ['$SPX.X', '$VIX.X', '$NDX.X', 'SPY'];

  const TheoCharts = tickers.map((ticker) => {
    const newParams = { ...params, und_symbol: ticker };
    return (
      <Card key={ticker}>
        <EChartToS_Theo_Comp params={newParams} />
      </Card>
    );
  });

  return <>{TheoCharts}</>;
};
