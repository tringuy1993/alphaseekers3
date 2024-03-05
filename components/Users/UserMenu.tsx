'use client'

import cx from 'clsx';
import { useState } from 'react';
import { Avatar, Menu, rem, Button } from '@mantine/core';
import Link from 'next/link';
import { IconLogout, IconSettings } from '@tabler/icons-react';
import classes from './UserMenu.module.css';
import { useAuth } from '@/app/authentication/context';
import { siteLinks } from '@/config/site';

export function UserMenu() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { tenant, isAuthLoading, handleSignOut } = useAuth();
  return (
    <>
      {!isAuthLoading && !tenant ? (
        <Button component="a" href={siteLinks.signin.href} variant="default">
          Sign In
        </Button>
      ) : (
        <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <Avatar
              src={tenant?.photoURL}
              alt='user picture'
              radius="xl"
              size={50}
              className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
            />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item
              component={Link}
              href={siteLinks.profile.href}
              leftSection={
                <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
            >
              {siteLinks.profile.title}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              onClick={handleSignOut}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
}
