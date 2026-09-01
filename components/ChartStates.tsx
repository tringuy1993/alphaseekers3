'use client';

import { Button, Stack, Text } from '@mantine/core';

type ChartLoadErrorProps = {
  onRetry?: () => void;
  message?: string;
};

export function ChartLoadError({ onRetry, message }: ChartLoadErrorProps) {
  return (
    <Stack align="center" justify="center" gap="xs" style={{ minHeight: 200 }}>
      <Text size="sm" c="dimmed">
        {message ?? 'Failed to load data.'}
      </Text>
      {onRetry && (
        <Button size="xs" variant="light" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Stack>
  );
}

export function ChartEmptyState({ message }: { message?: string }) {
  return (
    <Stack align="center" justify="center" style={{ minHeight: 200 }}>
      <Text size="sm" c="dimmed">
        {message ?? 'No data for this session.'}
      </Text>
    </Stack>
  );
}
