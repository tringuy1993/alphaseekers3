import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { theme } from '../theme';
import MainAppShell from '@/components/MainShell/MainAppShell';
import { AuthProvider } from './authentication/client-auth-provider';

import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import '@mantine/core/styles.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: 'Alpha Seekers',
  description: 'Seeking Alphas and Personal Projects :)',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <AuthProvider>
            <MainAppShell>{children}</MainAppShell>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
