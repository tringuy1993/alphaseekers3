'use client';

import { Tabs, Text } from '@mantine/core';
import { format } from 'date-fns';
import { IconGraph, IconTable } from '@tabler/icons-react';

import { useBTDatePickerStore, useBTTimePickerStore } from '@/store';
import CustomCard from '@/components/CustomCard/CustomCard';
import TimeSlider from './TimeSlider';
import BTOptionChain from './BTOptionChain/BTOptionChain';
import { BTOrderMonitor } from './BTOrder/BTOrderMonitor';
import { OrderEntry } from './BTOrder/OrderEntry';
import { BackTestCharts } from './BackTestCharts';
import BTDatePicker from './BTDatePicker';

export default function PageBTOrder() {
  const { BackTestDate } = useBTDatePickerStore();
  const { BackTestTime } = useBTTimePickerStore();
  const PARAMS = {
    trade_date: format(BackTestDate[0] as Date, 'yyyy-MM-dd'),
    expiration: format(BackTestDate[1] as Date, 'yyyy-MM-dd'),
    trade_time: BackTestTime,
    all_greeks: true,
  };
  return (
    <div className="flex flex-col justify-center mx-20 mt-4 space-y-2 align-center">
      <BTDatePicker />
      <TimeSlider />

      <CustomCard>
        <BTOrderMonitor />
      </CustomCard>

      <Tabs variant="pills" defaultValue="btGraphs">
        <Tabs.List>
          <Tabs.Tab value="btGraphs" leftSection={<IconGraph />}>
            Graphs
          </Tabs.Tab>
          <Tabs.Tab value="btOptionChain" leftSection={<IconTable />}>
            Option Chain
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="btGraphs">
          <BackTestCharts />
        </Tabs.Panel>

        <Tabs.Panel value="btOptionChain">
          <CustomCard>
            <Text size="xl" fw={500}>
              Order Entry
            </Text>

            <OrderEntry />
          </CustomCard>
          <BTOptionChain params={PARAMS} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
