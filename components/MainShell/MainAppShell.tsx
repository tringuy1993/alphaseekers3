'use client';

import { usePathname } from 'next/navigation';
import { AppShell, Burger, Button, Divider, Group } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import Link from 'next/link';
import { authorizedLinksList, siteConfig, siteLinks } from '@/config/site';
import { SideBar } from './SideBar/SideBar';

import { ThemeToggle } from '../Theme/ThemeToggle';
import { UserMenu } from '../Users/UserMenu';
import { Icons } from '../icons';
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
  <Button variant="subtle" component={Link} href={links.href} key={links.href}>
    {links.title}
  </Button>
));

export default function MainAppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const currentPath = usePathname();
  const pathWithSideNavBar = authorizedLinksList.includes(currentPath);

  const pinned = useHeadroom({ fixedAt: 120 });
  const isMusicPage = currentPath === siteLinks.music.href;
  const musicStyle = isMusicPage
    ? { display: 'flex', flexDirection: 'column', justifyContent: 'center' } // Note the correction in the property name from 'flexDirect' to 'flexDirection'
    : {};

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned }}
      navbar={
        pathWithSideNavBar
          ? { width: '60px', breakpoint: 'sm', collapsed: { mobile: !opened } }
          : { width: '60px', breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }
      }
      padding="md"
    >
      {/* NOTE! I need this style for my header Background to be transparent! */}
      <AppShell.Header className={classes.header} style={{ backgroundColor: 'transparent' }}>
        <Group justify="space-between" style={{ background: 'transparent' }}>
          <Link href="/" className={classes.logoLink}>
            <Icons.logo className={classes.logoLinkIcon} />
            <span className={classes.logoLinkText}>{siteConfig.name}</span>
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            {commonLinks}
          </Group>

          <Group>
            <ThemeToggle />
            <UserMenu />
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbar} style={{ background: 'transparent' }}>
        <div className={classes.commonLinksSmallScreen}>
          {commonLinks}
          <Divider my="sm" />
        </div>

        {pathWithSideNavBar && <SideBar />}
      </AppShell.Navbar>

      <AppShell.Main style={musicStyle}>{children}</AppShell.Main>
    </AppShell>
  );
}
