import { Card } from '@mantine/core';
import classes from './CustomCard.module.css';

import React from 'react'; // Adjust the import path as necessary

// Define the props interface for CustomCard
interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  // Other specific props for CustomCard can also be defined here
}

const CustomCard: React.FC<CustomCardProps> = ({ className, ...props }) => {
  // Combine the customCard class from your CSS module with any additional class names passed as props
  const combinedClassName = `${classes.customCard} ${className || ''}`;
  return (
    <Card
      style={{ background: 'transparent' }}
      className={combinedClassName}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      {...props}
    />
  );
};

export default CustomCard;
