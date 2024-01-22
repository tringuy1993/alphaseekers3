import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MRT_Table, useMantineReactTable } from 'mantine-react-table';
import { format } from 'date-fns';
import { useBTDatePickerStore, useBTOrderStore, useBTTimePickerStore } from '@/store';

import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import { BACKTEST_TRACK_ORDER } from '@/lib/fetchdata/apiURLs';

type StateData = {
  quote_datetime: string;
  option_type: boolean;
  price: number;
  expiration: string;
  strike: number;
};

const processResultData = (data, order) =>
  data.map((item) => {
    const { option_type, strike, expiration, quote_datetime, gamma, delta } = item;

    const matchedItem = order.legs.find(
      (element) =>
        element.option_type === option_type &&
        element.strike === strike &&
        element.expiration === expiration
      // element.quote_datetime === quote_datetime,
    );

    const buy_type = matchedItem?.buy_type;
    return {
      option_type,
      strike,
      expiration,
      quote_datetime,
      price: buy_type === 'ask' ? item[buy_type] : -1 * item[buy_type],
      gamma,
      delta,
    };
  });

const calculatePNL = (result, order) => {
  const currentOrderPrice = result.reduce((acc, leg) => acc + leg.price, 0);
  return order.orderCost >= 0
    ? (currentOrderPrice - order.orderCost).toFixed(2)
    : (-1 * order.orderCost + currentOrderPrice).toFixed(2);
};

export const BTOrderMonitor = () => {
  const { order } = useBTOrderStore();
  const { BackTestDate } = useBTDatePickerStore();
  const { BackTestTime } = useBTTimePickerStore();
  const [result, setResult] = useState([]);
  const [pnl, setPNL] = useState('');

  const params = {
    trade_date: format(BackTestDate[0] as Date, 'yyyy-MM-dd'),
    expiration: format(BackTestDate[1] as Date, 'yyyy-MM-dd'),
    trade_time: BackTestTime,
    option_legs: JSON.stringify(order.legs),
  };

  const { data, isLoading } = useCustomSWR(BACKTEST_TRACK_ORDER, params);

  useEffect(() => {
    if (data && data?.data) {
      const newResult = processResultData(data.data, order);
      setResult(newResult);
      const newPNL = calculatePNL(newResult, order);
      setPNL(newPNL);
    }
  }, [data]);

  const color = Number(pnl) >= 0 ? 'green' : 'red';
  const columns = useMemo<MRT_ColumnDef<StateData>[]>(
    () => [
      {
        accessorKey: 'quote_datetime',
        header: 'Trade Time',
      },
      {
        accessorKey: 'expiration',
        header: 'Exp',
      },
      {
        accessorKey: 'strike', //normal accessorKey
        header: 'Strike',
      },
      {
        accessorFn: (row) => (row.option_type === true ? 'call' : 'put'),

        header: 'Option Type',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        Footer: () => (
          <div style={{ color: color }}>
            <div>Trade Price: {order.orderCost} </div>

            <div>PNL: {pnl}</div>
          </div>
        ),
      },
    ],
    [data, pnl]
  );

  const table = useMantineReactTable({
    columns,
    data: result, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enablePagination: false,
    enableStickyHeader: true,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    state: {
      isLoading,
    },
    initialState: {
      isLoading,
    },
    enableTopToolbar: false,
    mantineTableContainerProps: { style: { maxHeight: '400px' } },
    enableTableFooter: true,
  });

  return <MRT_Table table={table} />;
};
