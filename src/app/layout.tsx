import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Timez - Time Zone Converter',
  description:
    'Easily convert time between different timezones and compare overlapping time periods.',
  metadataBase: new URL('https://timez.eason.ch'),
  openGraph: {
    title: 'Timez - Time Zone Converter',
    description:
      'Easily convert time between different timezones and compare overlapping time periods.',
    url: 'https://timez.eason.ch',
    siteName: 'Timez',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://timez.eason.ch/og.png',
        width: 1041,
        height: 662,
        alt: 'Timez - Time Zone Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timez - Time Zone Converter',
    description:
      'Easily convert time between different timezones and compare overlapping time periods.',
    images: [
      {
        url: 'https://timez.eason.ch/og.png',
        width: 1041,
        height: 662,
        alt: 'Timez - Time Zone Converter',
      },
    ],
    creator: '@EasonChang_me',
    // site: '@easonchang',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>

        <Analytics />
        {process.env.NODE_ENV === 'production' && (
          <GoogleAnalytics gaId="G-N45V5H57XH" />
        )}
      </body>
    </html>
  );
}
