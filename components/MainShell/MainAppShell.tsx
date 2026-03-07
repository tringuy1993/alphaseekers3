'use client';

import { usePathname } from 'next/navigation';
import { AppShell, Burger, Button, Divider, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { authorizedLinksList, siteConfig, siteLinks } from '@/config/site';
import { SideBar } from './SideBar/SideBar';

import { ThemeToggle } from '../Theme/ThemeToggle';
import { UserMenu } from '../Users/UserMenu';
import { Icons } from '../icons';
import { StatusBar } from '../Layout/StatusBar';
import classes from './MainAppShell.module.css';

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

const commonLinks = componentLinks.map((links) => (
  <Button
    variant="subtle"
    component={Link}
    href={links.href}
    key={links.href}
    size="xs"
    className={classes.topLink}
  >
    {links.title}
  </Button>
));

export default function MainAppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [expanded, { toggle: toggleExpanded }] = useDisclosure(false);
  const currentPath = usePathname();
  const pathWithSideNavBar = authorizedLinksList.includes(currentPath);

  const isMusicPage = currentPath === siteLinks.music.href;
  const musicStyle = isMusicPage
    ? ({ display: 'flex', flexDirection: 'column', justifyContent: 'center' } as const)
    : undefined;

  const navbarWidth = expanded ? 200 : 48;

  const desktopSidebarToggle = pathWithSideNavBar ? (
    <button
      type="button"
      className={classes.logoToggle}
      data-expanded={expanded || undefined}
      onClick={toggleExpanded}
      aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      <Icons.logo className={classes.logoLinkIcon} />
      {expanded && <span className={classes.logoLinkText}>{siteConfig.name}</span>}
    </button>
  ) : (
    <Link href="/" className={classes.logoLink}>
      <Icons.logo className={classes.logoLinkIcon} />
      <span className={classes.logoLinkText}>{siteConfig.name}</span>
    </Link>
  );

  return (
    <AppShell
      header={{ height: 44 }}
      navbar={
        pathWithSideNavBar
          ? { width: navbarWidth, breakpoint: 'sm', collapsed: { mobile: !opened } }
          : { width: navbarWidth, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }
      }
      footer={{ height: 24 }}
      padding={0}
    >
      <AppShell.Header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group gap="xs">
            <div className={classes.desktopBrand}>{desktopSidebarToggle}</div>
            <Link href="/" className={classes.logoLinkMobile}>
              <Icons.logo className={classes.logoLinkIcon} />
            </Link>
          </Group>

          <Group h="100%" gap={4} visibleFrom="sm" className={classes.topLinks}>
            {commonLinks}
          </Group>

          <Group gap="xs">
            <ThemeToggle />
            <UserMenu />
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        className={classes.navbar}
        data-expanded={expanded || undefined}
        data-with-side-nav={pathWithSideNavBar || undefined}
      >
        <div className={classes.commonLinksSmallScreen}>
          {commonLinks}
          <Divider my="sm" />
        </div>

        {pathWithSideNavBar && <SideBar expanded={expanded} />}
      </AppShell.Navbar>

      <AppShell.Main className={classes.main} style={musicStyle}>
        {children}
      </AppShell.Main>

      <AppShell.Footer>
        <StatusBar
          items={[
            { label: 'Status', value: 'Live', tone: 'live' },
            { label: 'Market', value: 'Open', tone: 'positive' },
            {
              label: 'Last Update',
              value: new Date().toLocaleTimeString(),
              tone: 'neutral',
              color: 'var(--as-text-secondary)',
            },
          ]}
        />
      </AppShell.Footer>
    </AppShell>
  );
}
