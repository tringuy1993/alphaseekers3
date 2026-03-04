'use client';

import { Timeline, Title, Text, Stack } from '@mantine/core';
import {
  IconRocket,
  IconDatabase,
  IconServer,
  IconChartBar,
  IconCode,
} from '@tabler/icons-react';

const events = [
  {
    icon: IconRocket,
    color: 'blue',
    title: 'Fullstack Architecture Migration',
    date: '2023 – Present',
    description:
      'Migrated to Next.js 14 App Router with TypeScript and Mantine 7. Built Django REST API with multi-database routing and Firebase authentication.',
  },
  {
    icon: IconDatabase,
    color: 'teal',
    title: 'Data Pipeline & TimescaleDB',
    date: '2023',
    description:
      'Implemented automated Schwab API data collection with cron scheduling. Deployed TimescaleDB hypertable for 958GB+ compressed options archive.',
  },
  {
    icon: IconServer,
    color: 'orange',
    title: 'Self-Hosted Infrastructure',
    date: '2022',
    description:
      'Set up production deployment on personal server with Nginx reverse proxy, Gunicorn WSGI, PM2 process manager, and Cloudflare Tunnels.',
  },
  {
    icon: IconChartBar,
    color: 'grape',
    title: 'Frontend Data Visualization',
    date: '2022',
    description:
      'Built interactive ECharts dashboards for Greek exposures. Implemented SWR data fetching with IndexedDB caching for offline support.',
  },
  {
    icon: IconCode,
    color: 'gray',
    title: 'Project Genesis',
    date: '2021',
    description:
      'Started with Python and Dash Plotly to prototype options data visualization. Quickly outgrew the framework, motivating the move to a proper fullstack architecture.',
  },
];

export function JourneyTimeline() {
  return (
    <Stack gap="md">
      <Title order={2}>Development Journey</Title>
      <Timeline active={0} bulletSize={28} lineWidth={2}>
        {events.map((event) => (
          <Timeline.Item
            key={event.title}
            bullet={<event.icon size={14} />}
            title={
              <Text fw={600} component="span">
                {event.title}
              </Text>
            }
          >
            <Text size="xs" c="dimmed" mt={2}>
              {event.date}
            </Text>
            <Text size="sm" mt={4}>
              {event.description}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Stack>
  );
}
