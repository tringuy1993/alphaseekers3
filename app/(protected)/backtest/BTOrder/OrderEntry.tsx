import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mantine/core';
import { MRT_ColumnDef, MRT_Table, useMantineReactTable } from 'mantine-react-table';
import { useBTSelectedLegsStore } from '@/store';

type StateData = {
  quote_datetime: string;
  option_type: boolean;
  price: number;
  expiration: string;
  strike: number;
};
export const OrderEntry = () => {
  const { legs, legsPriceSum, setOrder } = useBTSelectedLegsStore();
  const [data, setData] = useState(legs);

  useEffect(() => {
    setData(legs);
  }, [legs]);

  const color = legsPriceSum >= 0 ? 'green' : 'red';
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
            <div>Total: {legsPriceSum.toFixed(2)} </div>

            <div>
              <Button onClick={setOrder}>Submit Order</Button>
            </div>
          </div>
        ),
      },
    ],
    [legsPriceSum]
  );

  const table = useMantineReactTable({
    columns,
    data,
    enablePagination: false,
    enableStickyHeader: true,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enableTopToolbar: false,
    mantineTableContainerProps: { style: { maxHeight: '400px' } },
    enableTableFooter: true,
  });

  return <MRT_Table table={table} />;
};
