import { Box, type MantineColorScheme, Text, useMantineColorScheme } from '@mantine/core';
import { MRT_ColumnDef, MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useMemo } from 'react';

import { useBTSelectedLegsStore } from '@/store';
import { OrderState } from '@/store/BTOrders/types';

type PutCallData = {
  put: OrderState;
  call: OrderState;
};

const renderPutITM = ({ cell, row }, colorScheme) => {
  const otm_put = (row.original.put.delta as number) < -0.5;
  const boxStyle = {
    backgroundColor: otm_put ? (colorScheme === 'dark' ? 'darkblue' : 'lightblue') : 'transparent', // Change 'transparent' to any other color if needed
  };
  return <Text style={boxStyle}>{cell.getValue()}</Text>;
};

const renderCallITM = ({ cell, row }, colorScheme) => {
  const itm_call = (row.original.call.delta as number) > 0.5;
  const boxStyle = {
    backgroundColor: itm_call ? (colorScheme === 'dark' ? 'darkblue' : 'lightblue') : 'transparent', // Change 'transparent' to any other color if needed
  };
  return <Text style={boxStyle}>{cell.getValue()}</Text>;
};

const groupedCellRender = ({ cell, row }) => (
  <Box style={{ color: 'blue' }}>
    <strong>{cell.getValue()} </strong> [{row.subRows?.length}]
  </Box>
);

const createColumn = (accessor, header, renderFunc, colorScheme) => ({
  accessorKey: accessor,
  header: header,
  minSize: 50,
  maxSize: 100,
  enableSorting: false,
  enableGrouping: false,
  Cell: ({ cell, row }) => renderFunc({ cell, row }, colorScheme),
});

const useColumns = (colorScheme: MantineColorScheme) =>
  useMemo<MRT_ColumnDef<PutCallData>[]>(
    () => [
      {
        header: 'Expiration',
        accessorKey: 'call.expiration',
        GroupedCell: groupedCellRender,
        minSize: 100,
        maxSize: 140,
      },
      {
        header: 'CALL',
        columns: [
          createColumn('call.gamma', 'Gamma', renderCallITM, colorScheme),
          createColumn('call.delta', 'Delta', renderCallITM, colorScheme),
          createColumn('call.bid', 'Bid', renderCallITM, colorScheme),
          createColumn('call.ask', 'Ask', renderCallITM, colorScheme),
        ],
      },
      {
        accessorKey: 'call.strike', //access nested data with dot notation
        header: 'Strike Price',
        filterVariant: 'range-slider',
        minSize: 50,
        maxSize: 100,
        mantineFilterRangeSliderProps: {
          color: 'indigo',
          label: (value) =>
            value?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }),
        },
      },
      {
        header: 'PUT',
        columns: [
          createColumn('put.bid', 'Bid', renderPutITM, colorScheme),
          createColumn('put.ask', 'Ask', renderPutITM, colorScheme),
          createColumn('put.delta', 'Delta', renderPutITM, colorScheme),
          createColumn('put.gamma', 'Gamma', renderPutITM, colorScheme),
        ],
      },
      // ... other columns
    ],
    [colorScheme]
  );

export default function DataTable({ data }) {
  const { colorScheme } = useMantineColorScheme();
  const columns = useColumns(colorScheme);

  const { addLegs, removeAllLegs } = useBTSelectedLegsStore();

  //Handling update Legs:
  function handleUpdateLegs(event, cell, row) {
    const buy_type = cell.id.includes('bid') ? 'bid' : 'ask';
    const option_type = cell.id.includes('call') ? 'call' : 'put';

    if (event.ctrlKey) {
      if (cell.id.includes('bid') || cell.id.includes('ask')) {
        addLegs({
          buy_type: buy_type,
          option_type: option_type === 'call' ? true : false,
          price:
            buy_type === 'bid'
              ? -1 * row.original[option_type][buy_type]
              : row.original[option_type][buy_type],
          strike: row.original[option_type]['strike'],
          quote_datetime: row.original[option_type]['quote_datetime'],
          expiration: row.original[option_type]['expiration'],
        });
      }
    } else if (cell.id.includes('bid') || cell.id.includes('ask')) {
      removeAllLegs();
      addLegs({
        buy_type: buy_type,
        option_type: option_type === 'call' ? true : false,
        price:
          buy_type === 'bid'
            ? -1 * row.original[option_type][buy_type]
            : row.original[option_type][buy_type],
        strike: row.original[option_type]['strike'],
        quote_datetime: row.original[option_type]['quote_datetime'],
        expiration: row.original[option_type]['expiration'],
      });
    }
  }

  const table = useMantineReactTable({
    columns,
    data,
    enablePagination: false,
    enableStickyHeader: true,
    enableGrouping: true,
    //Sorting
    enableGlobalFilterModes: true,
    mantineTableHeadCellProps: { align: 'center' },
    mantineTableBodyCellProps: ({ cell, row }) => ({
      //implement row selection click events manually
      onClick: (event) => handleUpdateLegs(event, cell, row),
      style: {
        cursor: 'pointer',
        textAlign: 'center',
      },
    }),

    //Initial state of table
    initialState: {
      expanded: true,
      grouping: ['call.expiration'],
    },
    //Visual
    mantineTableContainerProps: { style: { maxHeight: '800px' } },
  });
  return (
    <Box>
      <MantineReactTable table={table} />
    </Box>
  );
}
