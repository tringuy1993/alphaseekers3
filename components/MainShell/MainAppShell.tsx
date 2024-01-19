'use client';

import { usePathname } from 'next/navigation';
import { AppShell, rem } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { HeaderMegaMenu } from './Header/Header';
import { siteLinks } from '@/config/site';
import { SideBar } from './SideBar/SideBar';

const authorizedLinks = [
  siteLinks.optionsdata.href,
  siteLinks.optionstime.href,
  siteLinks.backtest.href,
];

export default function MainAppShell({ children }: { children: React.ReactNode }) {
  const [opened] = useDisclosure();

  const currentPath = usePathname();
  const pathWithSideNavBar = authorizedLinks.includes(currentPath);

  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={
        pathWithSideNavBar
          ? { width: '80px', breakpoint: 'sm', collapsed: { mobile: !opened } }
          : undefined
      }
      padding="md"
    >
      <AppShell.Header style={{ transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)` }}>
        <HeaderMegaMenu />
      </AppShell.Header>
      {pathWithSideNavBar && (
        <AppShell.Navbar>
          {/* {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))} */}
          <SideBar />
        </AppShell.Navbar>
      )}

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
