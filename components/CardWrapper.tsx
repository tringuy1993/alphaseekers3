import { Card } from '@mantine/core';

import React from 'react'; // Adjust the import path as necessary

const CardWrapper = ({ ...props }) => {
  return <Card style={{ background: 'transparent' }} {...props} />;
};

export default CardWrapper;
