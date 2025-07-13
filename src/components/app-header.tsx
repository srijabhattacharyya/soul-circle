'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, BookOpen } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-soft-teal text-teal-900 fixed top-0 left-0 right-0 z-50 border-b">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-bold text-lg">SoulCircle</span>
        </Link>
      </div>
      <nav className="flex items-center gap-4">
        <Button variant="ghost" className="hover:bg-soft-teal/90 hover:text-teal-900" asChild>
          <Link href="/" prefetch={false}>
            <Home className="mr-2 h-4 w-4" />
            Landing Page
          </Link>
        </Button>
        <Button variant="ghost" className="hover:bg-soft-teal/90 hover:text-teal-900" asChild>
          <Link href="/learn-more" prefetch={false}>
            <BookOpen className="mr-2 h-4 w-4" />
            Learn More
          </Link>
        </Button>
      </nav>
    </header>
  );
}
