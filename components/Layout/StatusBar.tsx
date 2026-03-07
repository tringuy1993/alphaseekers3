'use client';

import React from 'react';
import { Group, Text } from '@mantine/core';
import classes from './StatusBar.module.css';

interface StatusBarProps {
  items?: StatusBarItem[];
  children?: React.ReactNode;
}

type StatusBarItem = {
    label: string;
    value: string;
    color?: string;
    tone?: 'positive' | 'negative' | 'neutral' | 'live' | 'warn';
};

function toneClassName(tone?: StatusBarItem['tone']) {
  if (!tone) {
    return undefined;
  }
  return `tone-${tone}`;
}

export function StatusBar({ items, children }: StatusBarProps) {
  return (
    <div className={classes.bar}>
      <Group gap="md" justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap" className={classes.items}>
          {items?.map((item) => (
            <Group gap={6} key={item.label} wrap="nowrap" className={classes.item}>
              <Text size="xs" c="var(--as-text-secondary)" className={classes.label}>
                {item.label}:
              </Text>
              <Text
                size="xs"
                ff="monospace"
                c={item.color || 'var(--as-text-primary)'}
                className={`${classes.value} ${toneClassName(item.tone) || ''}`}
              >
                {item.value}
              </Text>
            </Group>
          ))}
        </Group>
        {children}
      </Group>
    </div>
  );
}
