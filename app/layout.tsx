import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

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
    <html lang="en" className={`${boska.variable} ${supreme.variable}`}>
      <body>{children}</body>
    </html>
  );
}
