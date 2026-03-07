'use client';

import React from 'react';
import classes from './ChartGrid.module.css';

interface ChartGridProps {
  columns?: number;
  minColumnWidth?: number;
  dense?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ChartGrid({
  columns = 2,
  minColumnWidth,
  dense = false,
  children,
  className,
}: ChartGridProps) {
  return (
    <div
      className={`${classes.grid} ${className || ''}`}
      data-dense={dense || undefined}
      style={
        {
          '--grid-columns': columns,
          '--grid-min-column': minColumnWidth ? `${minColumnWidth}px` : undefined,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
