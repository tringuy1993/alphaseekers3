'use client';

import {
  Card,
  Title,
  Text,
  Badge,
  Group,
  SimpleGrid,
  Stack,
  ThemeIcon,
  Button,
  Flex,
} from '@mantine/core';
import { IconDatabase, IconServer, IconChartBar } from '@tabler/icons-react';
import classes from './styles.about.module.css';

const techBadges = [
  'Next.js 14',
  'Django REST',
  'PostgreSQL',
  'TimescaleDB',
  'Redis',
  'Celery',
  'Firebase',
  'ECharts',
];

const pillars = [
  {
    icon: IconDatabase,
    color: 'teal',
    title: 'Data Pipeline',
    description:
      '7 symbols collected every 60 seconds during market hours. 958GB+ TimescaleDB compressed archive with computed Greek exposures via PostgreSQL stored functions.',
  },
  {
    icon: IconServer,
    color: 'grape',
    title: 'Backend API',
    description:
      'Django REST Framework serving pre-computed analytics. Celery async task queue with Redis broker. Multi-database architecture across 3 PostgreSQL databases.',
  },
  {
    icon: IconChartBar,
    color: 'blue',
    title: 'Frontend',
    description:
      'Real-time ECharts dashboards for gamma, delta, vanna exposures. SWR data fetching with IndexedDB caching via Dexie. Zustand state management.',
  },
];

export function ProjectShowcase() {
  return (
    <Card withBorder radius="md" padding="xl" className={classes.projectCard}>
      <Stack gap="lg">
        <div>
          <Title order={2} mb="xs">
            Alpha-Seekers
          </Title>
          <Flex gap={6} wrap="wrap" mb="md">
            {techBadges.map((badge) => (
              <Badge key={badge} variant="outline" size="sm">
                {badge}
              </Badge>
            ))}
          </Flex>
          <Text>
            A self-hosted financial options analytics platform that collects real-time market data
            from the Schwab API, computes Greek notional exposures (gamma, delta, vanna, charm, and
            more), and presents them through interactive dashboards — enabling traders to visualize
            options flow and market positioning in real time.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, md: 3 }}>
          {pillars.map((pillar) => (
            <Stack key={pillar.title} gap="xs">
              <Group gap="xs">
                <ThemeIcon color={pillar.color} size="md" variant="light" radius="md">
                  <pillar.icon size={16} />
                </ThemeIcon>
                <Text fw={600}>{pillar.title}</Text>
              </Group>
              <Text size="sm" c="dimmed">
                {pillar.description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>

        <Group>
          <Button component="a" href="https://alpha-seekers.com" target="_blank">
            View Live Site
          </Button>
          <Button
            variant="outline"
            component="a"
            href="https://github.com/tringuy1993"
            target="_blank"
          >
            View Source
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
