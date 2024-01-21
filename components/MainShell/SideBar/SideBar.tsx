import { useState } from 'react';
import { Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import Link from 'next/link';

import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconCalendarStats,
} from '@tabler/icons-react';
import { siteLinks } from '@/config/site';
import classes from './SideBar.module.css';
import { usePathname } from 'next/navigation';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  href: string;
  label: string;
  active?: boolean;
}

function NavbarLink({ icon: Icon, label, href, active }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        component={Link}
        href={href}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: siteLinks.optionsdata.title, href: siteLinks.optionsdata.href },
  { icon: IconGauge, label: siteLinks.optionstime.title, href: siteLinks.optionstime.href },
  {
    icon: IconDeviceDesktopAnalytics,
    label: siteLinks.backtest.title,
    href: siteLinks.backtest.href,
  },
];

export function SideBar() {
  const currentPath = usePathname();

  const activeIndex = mockdata.findIndex((item) => item.href === currentPath);

  const links = mockdata.map((link, index) => (
    <NavbarLink {...link} key={link.label} active={index === activeIndex} />
  ));

  return (
    <nav className={classes.navbar}>
      <Stack justify="center" gap={0}>
        {links}
      </Stack>
    </nav>
  );
}
