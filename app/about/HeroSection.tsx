'use client';

import {
  Grid,
  Title,
  Text,
  Badge,
  Group,
  ActionIcon,
  Button,
  Image,
  Stack,
  Center,
} from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import classes from './styles.about.module.css';

const GITHUB_URL = 'https://github.com/tringuy1993';
const LINKEDIN_URL = 'https://www.linkedin.com/in/tringuyen-healthphysicist/';
const EMAIL = 'tringuy1993@gmail.com';
const RESUME_URL = 'https://drive.google.com/drive/folders/1Uxq-nm1G5FJrUBA0h0RkCsEYPbqhLqna';

export function HeroSection() {
  return (
    <Grid gutter="xl" align="center">
      <Grid.Col span={{ base: 12, lg: 7 }}>
        <Stack gap="sm">
          <Title order={1}>Tri Nguyen</Title>
          <Text size="xl" fw={500} c="dimmed">
            Fullstack Developer
          </Text>
          <Text size="lg" maw={540}>
            I build real-time financial analytics platforms end-to-end — from data pipelines and
            REST APIs to interactive dashboards. Passionate about turning complex data into
            intuitive, performant web applications.
          </Text>
          <Badge variant="light" color="green" size="lg" mt="xs" w="fit-content">
            Open to Opportunities
          </Badge>
          <Group mt="md">
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              component="a"
              href={GITHUB_URL}
              target="_blank"
              aria-label="GitHub"
            >
              <IconBrandGithub size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              component="a"
              href={LINKEDIN_URL}
              target="_blank"
              aria-label="LinkedIn"
            >
              <IconBrandLinkedin size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              component="a"
              href={`mailto:${EMAIL}`}
              aria-label="Email"
            >
              <IconMail size={20} />
            </ActionIcon>
            <Button component="a" href={RESUME_URL} target="_blank" variant="filled">
              Resume
            </Button>
          </Group>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 5 }}>
        <Center>
          <Image
            src="/static/images/Me.jpg"
            alt="Tri Nguyen"
            className={classes.heroImage}
          />
        </Center>
      </Grid.Col>
    </Grid>
  );
}
