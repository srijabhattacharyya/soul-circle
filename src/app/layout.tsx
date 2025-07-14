
import type { Metadata } from 'next';
import './globals.css';
import { Toaster as ShadToaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';


export const metadata: Metadata = {
  title: 'SoulCircle',
  description: 'Because your story deserves a listening circle.',
};

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <AuthProvider>
          <SidebarProvider>
            <Sidebar>
              <AppSidebar />
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
            <HotToaster />
          </SidebarProvider>
          <ShadToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
