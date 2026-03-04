'use client';

import { SimpleGrid, Card, Group, ThemeIcon, Title, Badge, Flex } from '@mantine/core';
import { IconBrowser, IconServer, IconChartLine, IconCloud } from '@tabler/icons-react';
import classes from './styles.about.module.css';

const skills = [
  {
    icon: IconBrowser,
    color: 'blue',
    title: 'Frontend',
    items: ['Next.js 14', 'React', 'TypeScript', 'Mantine', 'ECharts', 'SWR', 'Zustand'],
  },
  {
    icon: IconServer,
    color: 'grape',
    title: 'Backend',
    items: ['Django', 'DRF', 'Celery', 'PostgreSQL', 'TimescaleDB', 'Redis'],
  },
  {
    icon: IconChartLine,
    color: 'teal',
    title: 'Data & APIs',
    items: ['Schwab API', 'Options Greeks', 'Real-time Pipelines', 'Cron Scheduling'],
  },
  {
    icon: IconCloud,
    color: 'orange',
    title: 'DevOps',
    items: ['Nginx', 'Gunicorn', 'PM2', 'Cloudflare Tunnels', 'Linux', 'Git', 'Firebase Auth'],
  },
];

export function SkillsSection() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {skills.map((skill) => (
        <Card
          key={skill.title}
          withBorder
          padding="lg"
          radius="md"
          className={classes.skillCard}
        >
          <Group mb="sm">
            <ThemeIcon color={skill.color} size="lg" radius="md" variant="light">
              <skill.icon size={20} />
            </ThemeIcon>
            <Title order={4}>{skill.title}</Title>
          </Group>
          <Flex gap={6} wrap="wrap">
            {skill.items.map((item) => (
              <Badge key={item} variant="light" color={skill.color} size="sm">
                {item}
              </Badge>
            ))}
          </Flex>
        </Card>
      ))}
    </SimpleGrid>
  );
}
