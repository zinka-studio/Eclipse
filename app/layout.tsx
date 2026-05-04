import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import LenisProvider from '@/components/ui/LenisProvider';

const mountella = localFont({
  src: [
    {
      path: '../fonts/mountella/WOFF/Mountella-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/mountella/WOFF/Mountella-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../fonts/mountella/WOFF/Mountella-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/mountella/WOFF/Mountella-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/mountella/WOFF/Mountella-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/mountella/WOFF/Mountella-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--display',
  display: 'swap',
});

const boska = localFont({
  src: [
    {
      path: './fonts/Boska-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Boska-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
  ],
  variable: '--serif',
  display: 'swap',
});

const supreme = localFont({
  src: [
    {
      path: './fonts/Supreme-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Supreme-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/Supreme-Medium.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Eclipse | Fine Cocktail Bar · Tel Aviv',
  description: 'An exclusive encounter between light and shadow. Fine cocktail bar at 42 HaNevi\'im St., Tel Aviv.',
  metadataBase: new URL('https://eclipse-bar.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mountella.variable} ${boska.variable} ${supreme.variable}`}>
      <body><LenisProvider>{children}</LenisProvider></body>
    </html>
  );
}
