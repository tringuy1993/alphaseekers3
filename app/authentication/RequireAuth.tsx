'use client';

import { useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { useAuth } from './context';
import { siteLinks } from '@/config/site';

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const { tenant, isAuthLoading } = useAuth();
  const pathName = usePathname();

  useEffect(() => {
    if (!isAuthLoading && !tenant) {
      redirect(`${siteLinks.signin.href}?redirect=${pathName}`);
    }
  }, [tenant, isAuthLoading]);
  return <>{tenant && !isAuthLoading && children}</>;
}
