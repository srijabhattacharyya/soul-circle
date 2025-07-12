'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, BookOpen } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-50 border-b">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-bold text-lg">SoulCircle</span>
        </Link>
      </div>
      <nav className="flex items-center gap-4">
        <Button variant="ghost" className="hover:bg-primary/90 hover:text-primary-foreground" asChild>
          <Link href="/">
            <Home className="mr-2" />
            Landing Page
          </Link>
        </Button>
        <Button variant="ghost" className="hover:bg-primary/90 hover:text-primary-foreground" asChild>
          <Link href="/learn-more">
            <BookOpen className="mr-2" />
            Learn More
          </Link>
        </Button>
      </nav>
    </header>
  );
}
