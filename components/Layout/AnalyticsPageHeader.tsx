'use client';

import React from 'react';
import { Text } from '@mantine/core';
import classes from './AnalyticsPageHeader.module.css';

type HeaderTone = 'positive' | 'negative' | 'neutral' | 'live' | 'warn' | 'muted';

type HeaderStatus = {
  label: string;
  tone?: 'live' | 'warn' | 'muted';
};

type HeaderMetaItem = {
  label: string;
  value: React.ReactNode;
  tone?: HeaderTone;
};

interface AnalyticsPageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  status?: HeaderStatus;
  meta?: HeaderMetaItem[];
  actions?: React.ReactNode;
}

export function AnalyticsPageHeader({
  eyebrow,
  title,
  subtitle,
  status,
  meta,
  actions,
}: AnalyticsPageHeaderProps) {
  return (
    <section className={classes.header}>
      <div className={classes.topRow}>
        <div className={classes.copy}>
          {eyebrow && (
            <Text size="xs" fw={700} className={classes.eyebrow}>
              {eyebrow}
            </Text>
          )}

          <div className={classes.titleRow}>
            <Text className={classes.title}>{title}</Text>
            {status && (
              <span className={classes.status} data-tone={status.tone || 'muted'}>
                {status.label}
              </span>
            )}
          </div>

          {subtitle && (
            <Text size="sm" className={classes.subtitle}>
              {subtitle}
            </Text>
          )}
        </div>

        {actions && <div className={classes.actions}>{actions}</div>}
      </div>

      {meta?.length ? (
        <div className={classes.metaGrid}>
          {meta.map((item) => (
            <div key={item.label} className={classes.metaCard}>
              <Text size="xs" fw={700} className={classes.metaLabel}>
                {item.label}
              </Text>
              <Text
                size="sm"
                fw={600}
                className={classes.metaValue}
                data-tone={item.tone || 'neutral'}
              >
                {item.value}
              </Text>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
