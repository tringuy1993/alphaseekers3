'use client';

import { usePathname } from 'next/navigation';
import { AppShell, Skeleton, rem } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { HeaderMegaMenu } from './Header/Header';
import { siteLinks } from '@/config/site';

export default function MainAppShell({ children }: { children: React.ReactNode }) {
  const [opened] = useDisclosure();
  const pathWithSideNavBar = usePathname() === siteLinks.optionsdata.href;

  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={
        pathWithSideNavBar
          ? { width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }
          : undefined
      }
      padding="md"
    >
      <AppShell.Header style={{ transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)` }}>
        <HeaderMegaMenu />
      </AppShell.Header>
      {pathWithSideNavBar && (
        <AppShell.Navbar p="md">
          Navbar
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Navbar>
      )}

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
