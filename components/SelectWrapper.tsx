import { Select, SelectProps } from '@mantine/core';
import React from 'react';

const SelectWrapper = ({ label, data, value, onChange, ...props }: SelectProps) => (
  <Select
    label={label}
    data={data}
    value={value}
    onChange={onChange}
    size="xs"
    styles={{
      input: {
        minHeight: 'var(--as-density-control-h)',
        fontSize: 'var(--as-density-font)',
      },
      label: {
        marginBottom: 2,
        fontSize: '11px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--as-text-secondary)',
      },
      dropdown: {
        borderColor: 'var(--as-border)',
      },
    }}
    comboboxProps={{
      shadow: 'md',
      transitionProps: { transition: 'pop', duration: 150 },
    }}
    {...props}
  />
);

export default SelectWrapper;
