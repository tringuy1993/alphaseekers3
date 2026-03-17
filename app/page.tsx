'use client';

import React from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Stack,
  Group,
  ThemeIcon,
  rem,
  Box,
  Button,
  Paper,
  Badge,
} from '@mantine/core';
import { 
  IconChartBar, 
  IconActivity, 
  IconDeviceAnalytics, 
  IconHistory, 
  IconClock, 
  IconMusic,
  IconArrowRight 
} from '@tabler/icons-react';
import Link from 'next/link';
import CustomCard from '@/components/CustomCard/CustomCard';
import { siteLinks } from '@/config/site';

export default function HomePage() {
  const features = [
    {
      title: siteLinks.optionsdata.title,
      description: 'Analyze Term Structure, ES Exposure, and Theoretical Greeks with high-density charts.',
      Icon: IconChartBar,
      color: 'blue',
      href: siteLinks.optionsdata.href,
    },
    {
      title: siteLinks.live0dte.title,
      description: 'Real-time 0DTE analytics including Gamma, Vanna, and Delta exposure per strike.',
      Icon: IconActivity,
      color: 'teal',
      href: siteLinks.live0dte.href,
    },
    {
      title: siteLinks.gammadashboard.title,
      description: 'Comprehensive Gamma levels, Heatmaps, and Time-Series data for major indices.',
      Icon: IconDeviceAnalytics,
      color: 'orange',
      href: siteLinks.gammadashboard.href,
    },
    {
      title: siteLinks.backtest.title,
      description: 'Simulate trading strategies with historical data and granular order monitoring.',
      Icon: IconHistory,
      color: 'indigo',
      href: siteLinks.backtest.href,
    },
    {
      title: siteLinks.optionstime.title,
      description: 'Track how option metrics evolve over time with detailed historical time-series.',
      Icon: IconClock,
      color: 'cyan',
      href: siteLinks.optionstime.href,
    },
    {
      title: siteLinks.music.title,
      description: 'Focus while you trade with our integrated lo-fi music player.',
      Icon: IconMusic,
      color: 'pink',
      href: siteLinks.music.href,
    },
  ];

  return (
    <Box py={rem(60)}>
      <Container size="lg">
        <Stack gap="xl">
          <Paper
            p="xl"
            mb="xl"
            radius="md"
            style={{
              borderColor: 'color-mix(in srgb, var(--as-border-strong) 34%, transparent)',
              background:
                'radial-gradient(circle at 15% -20%, rgba(61, 125, 255, 0.24), transparent 40%), linear-gradient(180deg, var(--as-surface-secondary) 0%, var(--as-surface-tertiary) 100%)',
            }}
          >
            <Group gap="xs" mb="md">
              <Badge variant="light" color="brand">
                Command Center
              </Badge>
              <Badge variant="light" color="positive">
                Balanced Dense
              </Badge>
            </Group>
            <Title order={1} size={rem(42)} fw={800} mb="md">
              Alpha<Text component="span" c="var(--as-blue)" inherit>Seekers</Text>
            </Title>
            <Text size="xl" c="var(--as-text-secondary)" maw={600}>
              High-performance options analytics and backtesting suite. 
              Designed for speed, data density, and financial clarity.
            </Text>
            <Group mt="xl">
              <Button 
                component={Link} 
                href={siteLinks.optionsdata.href} 
                size="md" 
                variant="filled" 
                color="blue"
                rightSection={<IconArrowRight size={16} />}
              >
                Launch Dashboard
              </Button>
              <Button 
                component={Link} 
                href={siteLinks.about.href} 
                size="md" 
                variant="outline"
              >
                Learn More
              </Button>
            </Group>
          </Paper>

          <Title order={2} size="h3" fw={600} c="var(--as-amber)" tt="uppercase" lts="1px">
            Platform Features
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} style={{ textDecoration: 'none' }}>
                <CustomCard>
                  <Stack gap="sm">
                    <ThemeIcon
                      size={rem(44)}
                      radius="md"
                      variant="light"
                      color={feature.color}
                    >
                      <feature.Icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={700} size="lg" mb={4}>
                        {feature.title}
                      </Text>
                      <Text size="sm" c="var(--as-text-secondary)" lh={1.6}>
                        {feature.description}
                      </Text>
                    </Box>
                  </Stack>
                </CustomCard>
              </Link>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
