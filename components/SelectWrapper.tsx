import { Select } from '@mantine/core';

import React from 'react'; // Adjust the import path as necessary

const SelectWrapper = ({ label, data, value, onChange, ...props }) => {
  // const commonProps = { shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } };

  return (
    <Select
      label={label}
      data={data}
      value={value}
      onChange={onChange}
      comboboxProps={{ shadow: 'md', transitionProps: { transition: 'pop', duration: 200 } }}
      {...props}
    />
  );
};

export default SelectWrapper;
