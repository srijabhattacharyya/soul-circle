'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-background fixed top-0 left-0 right-0 z-50 border-b md:left-[var(--sidebar-width)] transition-[left] peer-data-[state=collapsed]:md:left-[var(--sidebar-width-icon)]">
      <div className='flex items-center gap-2'>
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image src="/images/logo.png" alt="SoulCircle Logo" width={32} height={32} />
          <span className="font-bold text-lg">SoulCircle</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="#">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="#">Sign Up</Link>
        </Button>
      </div>
    </header>
  );
}
