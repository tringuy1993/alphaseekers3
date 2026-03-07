'use client';

import React from 'react';
import classes from './FilterBar.module.css';

interface FilterBarProps {
  contextSlot?: React.ReactNode;
  viewSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  summarySlot?: React.ReactNode;
  topRow?: React.ReactNode;
  bottomRow?: React.ReactNode;
}

export function FilterBar({
  contextSlot,
  viewSlot,
  actionSlot,
  summarySlot,
  topRow,
  bottomRow,
}: FilterBarProps) {
  const hasSlotLayout = contextSlot || viewSlot || actionSlot || summarySlot;

  return (
    <div className={classes.filterBar}>
      {hasSlotLayout ? (
        <>
          <div className={classes.primaryRow}>
            {contextSlot && <div className={`${classes.region} ${classes.context}`}>{contextSlot}</div>}
            {viewSlot && <div className={`${classes.region} ${classes.view}`}>{viewSlot}</div>}
            {actionSlot && <div className={`${classes.region} ${classes.action}`}>{actionSlot}</div>}
          </div>
          {summarySlot && <div className={classes.summaryRow}>{summarySlot}</div>}
        </>
      ) : (
        <>
          {topRow && <div className={classes.legacyRow}>{topRow}</div>}
          {bottomRow && <div className={classes.legacyRow}>{bottomRow}</div>}
        </>
      )}
    </div>
  );
}
