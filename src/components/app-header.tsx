
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Info, User, CloudSun, Feather, Zap, Settings, Scale, BookHeart, LogOut } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from './auth-provider';
import { auth } from '@/lib/firebase/config';

export function AppHeader() {
  const { user } = useAuth();

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-background text-foreground fixed top-0 left-0 right-0 z-50 border-b">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-bold text-lg">SoulCircle</span>
        </Link>
      </div>
      <nav className="flex items-center gap-1">
        <Link
          href="/"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-accent/90 hover:text-accent-foreground'
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Landing
        </Link>
        <Link
          href="/learn-more"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-accent/90 hover:text-accent-foreground'
          )}
        >
          <Info className="mr-2 h-4 w-4" />
          Learn More
        </Link>
        <Link
          href="/learn-further"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-accent/90 hover:text-accent-foreground'
          )}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Learn Further
        </Link>
        <Link
          href="/about"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-accent/90 hover:text-accent-foreground'
          )}
        >
          <Info className="mr-2 h-4 w-4" />
          About
        </Link>
        <Link
          href="/legal"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-accent/90 hover:text-accent-foreground'
          )}
        >
          <Scale className="mr-2 h-4 w-4" />
          Legal
        </Link>
         <Link
          href="/resources"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-accent/90 hover:text-accent-foreground'
          )}
        >
          <BookHeart className="mr-2 h-4 w-4" />
          Resources
        </Link>

        {user && (
          <>
            <Link
              href="/profile"
              prefetch={false}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'hover:bg-accent/90 hover:text-accent-foreground'
              )}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/inner-weather"
              prefetch={false}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'hover:bg-accent/90 hover:text-accent-foreground'
              )}
            >
              <CloudSun className="mr-2 h-4 w-4" />
              Inner Weather
            </Link>
            <Link
              href="/mind-haven"
              prefetch={false}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'hover:bg-accent/90 hover:text-accent-foreground'
              )}
            >
              <Feather className="mr-2 h-4 w-4" />
              Mind Haven
            </Link>
            <Link
              href="/soothe-studio"
              prefetch={false}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'hover:bg-accent/90 hover:text-accent-foreground'
              )}
            >
              <Zap className="mr-2 h-4 w-4" />
              Soothe Studio
            </Link>
            <Link
              href="/settings"
              prefetch={false}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'hover:bg-accent/90 hover:text-accent-foreground'
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
             <Button
              variant="ghost"
              onClick={handleLogout}
              className='hover:bg-accent/90 hover:text-accent-foreground'
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
