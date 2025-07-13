
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Home, Info, User, CloudSun, Zap, Settings, Scale, BookHeart, LogOut, Menu } from 'lucide-react';
import { useAuth } from './auth-provider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';

const DesktopNav = () => {
    const { user } = useAuth();
    return (
        <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
                <Home className="mr-2 h-4 w-4" />Home
            </Link>
            <Link href="/about" className={buttonVariants({ variant: 'ghost' })}>
                <Info className="mr-2 h-4 w-4" />About
            </Link>
            <Link href="/legal" className={buttonVariants({ variant: 'ghost' })}>
                <Scale className="mr-2 h-4 w-4" />Legal
            </Link>
            <Link href="/resources" className={buttonVariants({ variant: 'ghost' })}>
                <BookHeart className="mr-2 h-4 w-4" />Resources
            </Link>
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
                                <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/inner-weather">
                                    <CloudSun className="mr-2 h-4 w-4" />Inner Weather
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/mind-haven">
                                    <BookHeart className="mr-2 h-4 w-4" />Mind Haven
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/soothe-studio">
                                    <Zap className="mr-2 h-4 w-4" />Soothe Studio
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings">
                                    <Settings className="mr-2 h-4 w-4" />Settings
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href="/logout" className={buttonVariants({ variant: 'ghost' })}>
                        <LogOut className="mr-2 h-4 w-4" />Logout
                    </Link>
                </>
            )}
        </nav>
    );
}

const MobileNav = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link href={href} onClick={() => setIsOpen(false)} className="flex items-center p-2 hover:bg-accent rounded-md">
            {children}
        </Link>
    );

    return (
        <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-2 mt-8 text-lg">
                        <NavLink href="/"><Home className="mr-2 h-5 w-5" />Home</NavLink>
                        <NavLink href="/about"><Info className="mr-2 h-5 w-5" />About</NavLink>
                        <NavLink href="/legal"><Scale className="mr-2 h-5 w-5" />Legal</NavLink>
                        <NavLink href="/resources"><BookHeart className="mr-2 h-5 w-5" />Resources</NavLink>
                        {user && (
                            <>
                                <hr className="my-2"/>
                                <NavLink href="/profile"><User className="mr-2 h-5 w-5" />Profile</NavLink>
                                <NavLink href="/inner-weather"><CloudSun className="mr-2 h-5 w-5" />Inner Weather</NavLink>
                                <NavLink href="/mind-haven"><BookHeart className="mr-2 h-5 w-5" />Mind Haven</NavLink>
                                <NavLink href="/soothe-studio"><Zap className="mr-2 h-5 w-5" />Soothe Studio</NavLink>
                                <NavLink href="/settings"><Settings className="mr-2 h-5 w-5" />Settings</NavLink>
                                <NavLink href="/logout">
                                  <LogOut className="mr-2 h-5 w-5" />Logout
                                </NavLink>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
};


export function AppHeader() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white text-black fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg" prefetch={false}>
          SoulCircle
      </Link>
      
      {isClient && (
        <>
          <DesktopNav />
          <MobileNav />
        </>
      )}
    </header>
  );
}
