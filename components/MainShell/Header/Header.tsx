'use client';

import Link from 'next/link';

import { useDisclosure } from '@mantine/hooks';
import { Group, Button, Divider, Box, Burger, Drawer, ScrollArea, rem } from '@mantine/core';

import { ThemeToggle } from '@/components/Theme/ThemeToggle';
import { siteLinks } from '@/config/site';
import { UserMenu } from '@/components/Users/UserMenu';

import classes from './HeaderMegaMenu.module.css';

const componentLinks: { title: string; href: string }[] = [
  {
    title: siteLinks.optionsdata.title,
    href: siteLinks.optionsdata.href,
  },
  { title: siteLinks.live0dte.title, href: siteLinks.live0dte.href },
  {
    title: siteLinks.music.title,
    href: siteLinks.music.href,
  },
  { title: siteLinks.about.title, href: siteLinks.about.href },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const commonLinks = componentLinks.map((links) => (
    <Button
      variant="subtle"
      component={Link}
      href={links.href}
      className={classes.link}
      key={links.href}
    >
      {links.title}
    </Button>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between">
          <div>Icon Here To Stay!</div>

          <Group h="100%" gap={0} visibleFrom="sm">
            {commonLinks}
          </Group>

          <Group visibleFrom="sm">
            <ThemeToggle />
            <UserMenu />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          {commonLinks}

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button component="a" href={siteLinks.signin.href} variant="default">
              Sign In
            </Button>
            <ThemeToggle />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
