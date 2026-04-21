import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eclipse | Exclusive Tel Aviv Cocktail Bar',
  description: 'Where the city fades. An exclusive encounter between light and shadow.',
  metadataBase: new URL('https://eclipse-bar.vercel.app'),
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
