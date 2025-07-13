
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Info, User, CloudSun, Zap, Settings, Scale, BookHeart, LogOut, Menu } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from './auth-provider';
import { auth } from '@/lib/firebase/config';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';


const DesktopNav = () => {
    const { user } = useAuth();
    const handleLogout = () => {
        if (auth) {
            auth.signOut();
        }
    };

    return (
        <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={buttonVariants({ variant: "ghost" })}><Home className="mr-2 h-4 w-4" />Home</Link>
            <Link href="/about" className={buttonVariants({ variant: "ghost" })}><Info className="mr-2 h-4 w-4" />About</Link>
            <Link href="/legal" className={buttonVariants({ variant: "ghost" })}><Scale className="mr-2 h-4 w-4" />Legal</Link>
            <Link href="/resources" className={buttonVariants({ variant: "ghost" })}><BookHeart className="mr-2 h-4 w-4" />Resources</Link>

            {user && (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <User className="mr-2 h-4 w-4" />
                                My Circle
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/inner-weather"><CloudSun className="mr-2 h-4 w-4" />Inner Weather</Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                                <Link href="/mind-haven"><BookHeart className="mr-2 h-4 w-4" />Mind Haven</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/soothe-studio"><Zap className="mr-2 h-4 w-4" />Soothe Studio</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
        </nav>
    );
};

const MobileNav = () => {
    const { user } = useAuth();
     const handleLogout = () => {
        if (auth) {
            auth.signOut();
        }
    };

    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="flex flex-col gap-4 mt-8">
                        <Link href="/" className={buttonVariants({ variant: "ghost", size: "lg" })}>Home</Link>
                        <Link href="/about" className={buttonVariants({ variant: "ghost", size: "lg" })}>About</Link>
                        <Link href="/legal" className={buttonVariants({ variant: "ghost", size: "lg" })}>Legal</Link>
                        <Link href="/resources" className={buttonVariants({ variant: "ghost", size: "lg" })}>Resources</Link>
                        {user && (
                            <>
                                <Link href="/profile" className={buttonVariants({ variant: "ghost", size: "lg" })}>Profile</Link>
                                <Link href="/inner-weather" className={buttonVariants({ variant: "ghost", size: "lg" })}>Inner Weather</Link>
                                <Link href="/mind-haven" className={buttonVariants({ variant: "ghost", size: "lg" })}>Mind Haven</Link>
                                <Link href="/soothe-studio" className={buttonVariants({ variant: "ghost", size: "lg" })}>Soothe Studio</Link>
                                <Link href="/settings" className={buttonVariants({ variant: "ghost", size: "lg" })}>Settings</Link>
                                <Button variant="ghost" size="lg" onClick={handleLogout}>Logout</Button>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
};


export function AppHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-background text-foreground fixed top-0 left-0 right-0 z-50 border-b">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-bold text-lg">SoulCircle</span>
      </Link>
      
      {isMobile === undefined ? null : isMobile ? <MobileNav /> : <DesktopNav />}

    </header>
  );
}
