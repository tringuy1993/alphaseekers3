import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';

import { theme } from '../theme';
import MainAppShell from '@/components/MainShell/MainAppShell';
import { AuthProvider } from './authentication/client-auth-provider';

export const metadata = {
  title: 'Alpha Seekers',
  description: 'Seeking Alphas and Personal Projects :)',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AuthProvider>
            <MainAppShell>{children}</MainAppShell>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
