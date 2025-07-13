
'use client';

import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';


export function AppHeader() {

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white text-black fixed top-0 left-0 right-0 z-50 border-b border-gray-200 peer-data-[variant=inset]:ml-[16rem] peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-[3rem] peer-data-[variant=inset]:md:ml-2">
      <div className='flex items-center gap-4'>
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" prefetch={false}>
            SoulCircle
        </Link>
      </div>
    </header>
  );
}
