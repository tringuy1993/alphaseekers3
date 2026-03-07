'use client';

import React from 'react';
import { Text } from '@mantine/core';
import classes from './MetricStrip.module.css';

type MetricTone = 'positive' | 'negative' | 'neutral' | 'live' | 'warn';

export type MetricStripItem = {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: MetricTone;
};

interface MetricStripProps {
  items: MetricStripItem[];
}

export function MetricStrip({ items }: MetricStripProps) {
  return (
    <div className={classes.grid}>
      {items.map((item) => (
        <section key={item.label} className={classes.card}>
          <Text size="xs" fw={700} className={classes.label}>
            {item.label}
          </Text>
          <Text className={classes.value} data-tone={item.tone || 'neutral'}>
            {item.value}
          </Text>
          {item.hint ? (
            <Text size="xs" className={classes.hint}>
              {item.hint}
            </Text>
          ) : null}
        </section>
      ))}
    </div>
  );
}
