import { type Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { type ReactNode } from 'react';

import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';

import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      lang='en'
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
