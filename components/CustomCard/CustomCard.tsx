import React from 'react';
import { Card, CardProps } from '@mantine/core';
import classes from './CustomCard.module.css';

type CustomCardProps = CardProps;

const CustomCard: React.FC<CustomCardProps> = ({ className, ...props }) => {
  const combinedClassName = `${classes.customCard} ${className || ''}`;
  return (
    <Card
      className={combinedClassName}
      padding="sm"
      radius="sm"
      withBorder
      {...props}
    />
  );
};

export default CustomCard;
