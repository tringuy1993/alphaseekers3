import { Tooltip, UnstyledButton, Stack, rem, Text } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconChartAreaLine,
} from '@tabler/icons-react';
import { siteLinks } from '@/config/site';
import classes from './SideBar.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  href: string;
  label: string;
  active?: boolean;
  expanded?: boolean;
}

function NavbarLink({ icon: Icon, label, href, active, expanded }: NavbarLinkProps) {
  const content = (
    <UnstyledButton
      component={Link}
      href={href}
      className={classes.link}
      data-active={active || undefined}
      data-expanded={expanded || undefined}
    >
      <Icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      {expanded && <Text size="sm" ml="md" className={classes.linkLabel}>{label}</Text>}
    </UnstyledButton>
  );

  if (expanded) {
    return content;
  }

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      {content}
    </Tooltip>
  );
}

const analyticsLinks = [
  { icon: IconHome2, label: siteLinks.optionsdata.title, href: siteLinks.optionsdata.href },
  { icon: IconGauge, label: siteLinks.optionstime.title, href: siteLinks.optionstime.href },
  {
    icon: IconChartAreaLine,
    label: siteLinks.gammadashboard.title,
    href: siteLinks.gammadashboard.href,
  },
];

const tradingLinks = [
  {
    icon: IconDeviceDesktopAnalytics,
    label: siteLinks.backtest.title,
    href: siteLinks.backtest.href,
  },
];

export function SideBar({ expanded }: { expanded?: boolean }) {
  const currentPath = usePathname();

  return (
    <nav className={classes.navbar} data-expanded={expanded || undefined}>
      <div className={classes.section}>
        {expanded && (
          <Text size="xs" fw={700} c="var(--as-amber)" mb="xs" px="xs" tt="uppercase" lts="1px">
            Analytics
          </Text>
        )}
        <Stack justify="center" gap={2}>
          {analyticsLinks.map((link) => (
            <NavbarLink {...link} key={link.label} active={link.href === currentPath} expanded={expanded} />
          ))}
        </Stack>
      </div>

      <div className={classes.divider} />

      <div className={classes.section}>
        {expanded && (
          <Text size="xs" fw={700} c="var(--as-amber)" mb="xs" px="xs" tt="uppercase" lts="1px">
            Trading
          </Text>
        )}
        <Stack justify="center" gap={2}>
          {tradingLinks.map((link) => (
            <NavbarLink {...link} key={link.label} active={link.href === currentPath} expanded={expanded} />
          ))}
        </Stack>
      </div>
    </nav>
  );
}
