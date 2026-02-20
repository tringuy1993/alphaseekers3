'use client';

import { Button, Container, Stack, Text, Title } from '@mantine/core';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="md">
        <Title order={2}>Something went wrong</Title>
        <Text c="dimmed" ta="center">
          An unexpected error occurred. You can try again or return to the home page.
        </Text>
        <Button onClick={reset}>Try again</Button>
        <Button variant="subtle" component="a" href="/">
          Go to home page
        </Button>
      </Stack>
    </Container>
  );
}
