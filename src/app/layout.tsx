import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/app-header';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'SoulCircle',
  description: 'Because your story deserves a listening circle.',
};

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('font-body antialiased', fontInter.variable)}
      >
        <AppHeader />
        <main className="pt-16">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
