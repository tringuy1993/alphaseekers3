'use client';

import React from 'react';
import { Text, Tabs } from '@mantine/core';
import classes from './DataPanel.module.css';

interface Tab {
  value: string;
  label: string;
}

interface DataPanelProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  status?: {
    label: string;
    tone?: 'live' | 'warn' | 'muted';
  };
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  controls?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  stickyHeader?: boolean;
  variant?: 'default' | 'elevated' | 'hero';
}

export function DataPanel({
  eyebrow,
  title,
  subtitle,
  status,
  tabs,
  activeTab,
  onTabChange,
  controls,
  actions,
  footer,
  children,
  className,
  contentClassName,
  stickyHeader = false,
  variant = 'default',
}: DataPanelProps) {
  const hasHeaderContent = eyebrow || title || subtitle || status || tabs || actions;

  return (
    <div className={`${classes.panel} ${className || ''}`} data-variant={variant}>
      {(hasHeaderContent || controls) && (
        <div className={classes.titleBar} data-sticky={stickyHeader || undefined}>
          {hasHeaderContent && (
            <div className={classes.headerRow}>
              <div className={classes.headerMain}>
                {eyebrow && (
                  <Text size="xs" fw={700} className={classes.eyebrow}>
                    {eyebrow}
                  </Text>
                )}
                {(title || subtitle) && (
                  <div className={classes.titleWrap}>
                    {title && (
                      <Text size="sm" fw={600} c="var(--as-text-primary)">
                        {title}
                      </Text>
                    )}
                    {subtitle && (
                      <Text size="xs" c="var(--as-text-secondary)">
                        {subtitle}
                      </Text>
                    )}
                  </div>
                )}
                {status && (
                  <span className={classes.status} data-tone={status.tone || 'muted'}>
                    {status.label}
                  </span>
                )}
              </div>

              {(tabs || actions) && (
                <div className={classes.headerActions}>
                  {tabs && (
                    <Tabs
                      value={activeTab}
                      onChange={(val) => onTabChange?.(val || '')}
                      variant="pills"
                      classNames={{ tab: classes.tab, list: classes.tabList }}
                    >
                      <Tabs.List>
                        {tabs.map((tab) => (
                          <Tabs.Tab key={tab.value} value={tab.value}>
                            {tab.label}
                          </Tabs.Tab>
                        ))}
                      </Tabs.List>
                    </Tabs>
                  )}
                  {actions}
                </div>
              )}
            </div>
          )}

          {controls && <div className={classes.controlsRow}>{controls}</div>}
        </div>
      )}

      <div className={`${classes.content} ${contentClassName || ''}`} data-variant={variant}>
        {children}
      </div>

      {footer && <div className={classes.footer}>{footer}</div>}
    </div>
  );
}
