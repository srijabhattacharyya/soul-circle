'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, BookOpen } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-soft-teal text-teal-900 fixed top-0 left-0 right-0 z-50 border-b">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-bold text-lg">SoulCircle</span>
        </Link>
      </div>
      <nav className="flex items-center gap-4">
        <Link
          href="/"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-soft-teal/90 hover:text-teal-900'
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Landing Page
        </Link>
        <Link
          href="/learn-more"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-soft-teal/90 hover:text-teal-900'
          )}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Learn More
        </Link>
      </nav>
    </header>
  );
}
