import { Grid } from '@mantine/core';
import { ECOpts_BT, ECOpts_Theo_BT } from './EChartBT_Opts';
import { EChartThemed } from '../EChartThemed';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import { BACKTEST_URL } from '@/lib/fetchdata/apiURLs';
import MainLoading from '@/app/loading';

const EChartBT_Theo = ({ params }) => {
  const { data, isLoading } = useCustomSWR(BACKTEST_URL, params);

  if (!data || isLoading) {
    return <MainLoading />;
  }

  const theoGamma = ECOpts_Theo_BT(data?.greek_theo, 'gamma');
  const gamma = ECOpts_BT(data?.greek_exposure, 'gamma');
  const vanna = ECOpts_BT(data?.greek_exposure, 'vanna');
  const delta = ECOpts_BT(data?.greek_exposure, 'delta');

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <EChartThemed option={theoGamma} style={{ height: '650px' }} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <EChartThemed option={gamma} style={{ height: '650px' }} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <EChartThemed option={vanna} style={{ height: '650px' }} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <EChartThemed option={delta} style={{ height: '650px' }} />
      </Grid.Col>
    </Grid>
  );
};

export default EChartBT_Theo;
