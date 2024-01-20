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

interface NavbarLinkProps {
  icon: typeof IconHome2;
  href: string;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, href, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        component={Link}
        href={href}
        onClick={onClick}
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
  { icon: IconCalendarStats, label: 'Releases', href: '' },
];

export function SideBar() {
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}
