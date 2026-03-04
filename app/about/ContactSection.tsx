'use client';

import { Paper, Title, Text, Group, Button, ActionIcon, Stack, Center } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';

const GITHUB_URL = 'https://github.com/tringuy1993';
const LINKEDIN_URL = 'https://www.linkedin.com/in/tringuyen-healthphysicist/';
const EMAIL = 'tringuy1993@gmail.com';
const RESUME_URL = 'https://drive.google.com/drive/folders/1Uxq-nm1G5FJrUBA0h0RkCsEYPbqhLqna';

export function ContactSection() {
  return (
    <Center>
      <Paper withBorder radius="md" p="xl" maw={500} w="100%">
        <Stack align="center" gap="md">
          <Title order={2}>Let&apos;s Connect</Title>
          <Text ta="center" c="dimmed">
            I&apos;m actively seeking fullstack developer roles where I can build impactful,
            data-driven applications. Let&apos;s talk.
          </Text>
          <Group>
            <Button component="a" href={RESUME_URL} target="_blank">
              Download Resume
            </Button>
            <Button variant="outline" component="a" href={`mailto:${EMAIL}`}>
              Email Me
            </Button>
          </Group>
          <Group>
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
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
}
