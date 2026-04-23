import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Space_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Eclipse | Fine Cocktail Bar · Tel Aviv',
  description: 'An exclusive encounter between light and shadow. Fine cocktail bar at 42 HaNevi\'im St., Tel Aviv.',
  metadataBase: new URL('https://eclipse-bar.vercel.app'),
};

import LenisProvider from '@/components/ui/LenisProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
